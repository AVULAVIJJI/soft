"""
Softmaster Technology Solutions Pvt Ltd
Email Service - Brevo (Free: 300 emails/day)
Handles all transactional emails for the platform
"""

import logging
from app.core.config import settings

logger = logging.getLogger(__name__)

COMPANY = "Softmaster Technology Solutions Pvt Ltd"
COMPANY_ADDRESS = "No:07, George E De Silva Mawatha, Kandy 20000, Sri Lanka"
COMPANY_PHONE = "+94 81 220 4130"
COMPANY_EMAIL = "info@softmastergroup.com"
ACADEMY_URL = "https://academy.softmastertech.com"
MAIN_URL = "https://softmastertech.com"
JOBS_URL = "https://jobs.softmastertech.com"
CLIENT_URL = "https://client.softmastertech.com"
WORKSPACE_URL = "https://workspace.softmastertech.com"

BREVO_AVAILABLE = False
api_instance = None

try:
    import sib_api_v3_sdk
    from sib_api_v3_sdk.rest import ApiException
    if settings.BREVO_API_KEY:
        configuration = sib_api_v3_sdk.Configuration()
        configuration.api_key["api-key"] = settings.BREVO_API_KEY
        api_instance = sib_api_v3_sdk.TransactionalEmailsApi(
            sib_api_v3_sdk.ApiClient(configuration)
        )
        BREVO_AVAILABLE = True
        logger.info("Brevo email service initialized")
except Exception as e:
    logger.warning(f"Brevo not available: {e}")


def _base_template(title: str, body: str, cta_text: str = None, cta_url: str = None) -> str:
    cta_html = ""
    if cta_text and cta_url:
        cta_html = f"""
        <div style="text-align:center;margin:28px 0;">
          <a href="{cta_url}" style="display:inline-block;background:linear-gradient(135deg,#0066FF,#00C2FF);color:#fff;
             padding:14px 32px;border-radius:10px;text-decoration:none;font-weight:700;font-size:15px;
             box-shadow:0 4px 20px rgba(0,102,255,0.35);">{cta_text}</a>
        </div>"""
    return f"""
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#F0F4F8;font-family:'Segoe UI',Arial,sans-serif;">
  <div style="max-width:600px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    <div style="background:linear-gradient(135deg,#0066FF 0%,#0044BB 100%);padding:32px 40px;text-align:center;">
      <div style="font-size:22px;font-weight:900;color:#fff;letter-spacing:2px;">SOFTMASTER</div>
      <div style="font-size:11px;color:rgba(255,255,255,0.7);letter-spacing:3px;margin-top:4px;">TECHNOLOGY SOLUTIONS</div>
    </div>
    <div style="padding:40px;">
      <h2 style="color:#0A1628;font-size:22px;font-weight:700;margin:0 0 16px;">{title}</h2>
      {body}
      {cta_html}
    </div>
    <div style="background:#F8FAFC;padding:24px 40px;border-top:1px solid #E2E8F0;text-align:center;">
      <p style="color:#94A3B8;font-size:12px;margin:0 0 6px;">{COMPANY}</p>
      <p style="color:#CBD5E1;font-size:11px;margin:0;">{COMPANY_ADDRESS}</p>
      <p style="color:#CBD5E1;font-size:11px;margin:4px 0 0;">{COMPANY_PHONE} | {COMPANY_EMAIL}</p>
    </div>
  </div>
</body>
</html>"""


def _send_email(to_email: str, to_name: str, subject: str, html_content: str) -> bool:
    if not BREVO_AVAILABLE or not api_instance:
        logger.info(f"[EMAIL MOCK] To: {to_email} | Subject: {subject}")
        return True
    try:
        from sib_api_v3_sdk import SendSmtpEmail
        email = SendSmtpEmail(
            sender={"name": "Softmaster Technology Solutions", "email": settings.EMAIL_FROM},
            to=[{"email": to_email, "name": to_name}],
            subject=subject,
            html_content=html_content,
        )
        api_instance.send_transac_email(email)
        logger.info(f"Email sent to {to_email}: {subject}")
        return True
    except Exception as e:
        logger.error(f"Email failed to {to_email}: {e}")
        return False


# -------------------------------------------------------
# WELCOME & VERIFICATION
# -------------------------------------------------------
def send_welcome_email(email: str, name: str) -> bool:
    body = f"""
    <p style="color:#475569;font-size:15px;line-height:1.8;">Welcome to Softmaster, <strong>{name}</strong>!</p>
    <p style="color:#475569;font-size:15px;line-height:1.8;">Your account has been created. You can now access our academy courses, job portal, and client services.</p>
    <div style="background:#EFF6FF;border-left:4px solid #0066FF;border-radius:8px;padding:16px;margin:20px 0;">
      <p style="color:#1E40AF;font-size:14px;margin:0;font-weight:600;">What you can do next:</p>
      <ul style="color:#3B82F6;font-size:14px;margin:8px 0 0;padding-left:20px;">
        <li>Browse and enroll in professional courses</li>
        <li>Upload your resume for job opportunities</li>
        <li>Track your learning progress and earn certificates</li>
      </ul>
    </div>"""
    html = _base_template("Welcome to Softmaster!", body, "Explore Platform", MAIN_URL)
    return _send_email(email, name, "Welcome to Softmaster Technology Solutions!", html)


def send_verification_email(email: str, name: str, token: str) -> bool:
    verify_url = f"{ACADEMY_URL}/verify-email?token={token}"
    body = f"""
    <p style="color:#475569;font-size:15px;line-height:1.8;">Hi <strong>{name}</strong>, thank you for registering!</p>
    <p style="color:#475569;font-size:15px;line-height:1.8;">Please verify your email address to activate your account. This link expires in <strong>24 hours</strong>.</p>"""
    html = _base_template("Verify Your Email Address", body, "Verify Email Now", verify_url)
    return _send_email(email, name, "Verify your Softmaster account", html)


# -------------------------------------------------------
# PASSWORD RESET
# -------------------------------------------------------
def send_password_reset_email(email: str, name: str, token: str, portal: str = "academy") -> bool:
    portal_urls = {
        "academy": ACADEMY_URL,
        "jobs": JOBS_URL,
        "client": CLIENT_URL,
        "workspace": WORKSPACE_URL,
        "admin": "https://admin.softmastertech.com",
        "employee": "https://employee.softmastertech.com",
    }
    base = portal_urls.get(portal, MAIN_URL)
    reset_url = f"{base}/reset-password?token={token}"
    body = f"""
    <p style="color:#475569;font-size:15px;line-height:1.8;">Hi <strong>{name}</strong>,</p>
    <p style="color:#475569;font-size:15px;line-height:1.8;">We received a request to reset your password. Click the button below to set a new password.</p>
    <div style="background:#FEF2F2;border-left:4px solid #EF4444;border-radius:8px;padding:16px;margin:20px 0;">
      <p style="color:#DC2626;font-size:13px;margin:0;">This link expires in <strong>1 hour</strong>. If you did not request this, you can safely ignore this email. Your password will not change.</p>
    </div>"""
    html = _base_template("Reset Your Password", body, "Reset Password", reset_url)
    return _send_email(email, name, "Password Reset Request - Softmaster", html)


def send_password_changed_alert(email: str, name: str) -> bool:
    body = f"""
    <p style="color:#475569;font-size:15px;line-height:1.8;">Hi <strong>{name}</strong>,</p>
    <p style="color:#475569;font-size:15px;line-height:1.8;">Your Softmaster account password was successfully changed.</p>
    <div style="background:#F0FDF4;border-left:4px solid #22C55E;border-radius:8px;padding:16px;margin:20px 0;">
      <p style="color:#16A34A;font-size:13px;margin:0;">If you did not make this change, please contact us immediately at <strong>{COMPANY_EMAIL}</strong> or call <strong>{COMPANY_PHONE}</strong>.</p>
    </div>"""
    html = _base_template("Password Changed Successfully", body)
    return _send_email(email, name, "Your Softmaster password has been changed", html)


# -------------------------------------------------------
# ACADEMY EMAILS
# -------------------------------------------------------
def send_enrollment_confirmation_email(email: str, name: str, course_name: str, course_id: int) -> bool:
    course_url = f"{ACADEMY_URL}/courses/{course_id}"
    body = f"""
    <p style="color:#475569;font-size:15px;line-height:1.8;">Hi <strong>{name}</strong>,</p>
    <p style="color:#475569;font-size:15px;line-height:1.8;">You have successfully enrolled in:</p>
    <div style="background:#EFF6FF;border:1px solid #BFDBFE;border-radius:12px;padding:20px;margin:20px 0;text-align:center;">
      <p style="color:#0066FF;font-size:18px;font-weight:700;margin:0;">{course_name}</p>
    </div>
    <p style="color:#475569;font-size:14px;">Your learning journey starts now. Complete all lessons, pass the final quiz, and earn your certificate.</p>"""
    html = _base_template("Enrollment Confirmed!", body, "Start Learning", course_url)
    return _send_email(email, name, f"Enrolled: {course_name} - Softmaster Academy", html)


def send_certificate_issued_email(email: str, name: str, course_name: str, certificate_number: str, cert_url: str) -> bool:
    body = f"""
    <p style="color:#475569;font-size:15px;line-height:1.8;">Congratulations <strong>{name}</strong>!</p>
    <p style="color:#475569;font-size:15px;line-height:1.8;">You have successfully completed <strong>{course_name}</strong> and earned your certificate.</p>
    <div style="background:#F0FDF4;border:1px solid #86EFAC;border-radius:12px;padding:20px;margin:20px 0;text-align:center;">
      <p style="color:#15803D;font-size:13px;margin:0 0 8px;">Certificate Number</p>
      <p style="color:#166534;font-size:20px;font-weight:800;margin:0;letter-spacing:2px;">{certificate_number}</p>
    </div>
    <p style="color:#475569;font-size:14px;">Share your achievement on LinkedIn and showcase your skills to employers.</p>"""
    html = _base_template("Certificate Issued!", body, "Download Certificate", cert_url)
    return _send_email(email, name, f"Certificate Ready: {course_name}", html)


def send_quiz_result_email(email: str, name: str, quiz_name: str, score: float, passed: bool) -> bool:
    status_color = "#22C55E" if passed else "#EF4444"
    status_text = "Passed" if passed else "Failed"
    status_bg = "#F0FDF4" if passed else "#FEF2F2"
    body = f"""
    <p style="color:#475569;font-size:15px;line-height:1.8;">Hi <strong>{name}</strong>,</p>
    <p style="color:#475569;font-size:15px;line-height:1.8;">Your quiz result for <strong>{quiz_name}</strong>:</p>
    <div style="background:{status_bg};border-left:4px solid {status_color};border-radius:8px;padding:20px;margin:20px 0;text-align:center;">
      <p style="color:{status_color};font-size:32px;font-weight:900;margin:0;">{score}%</p>
      <p style="color:{status_color};font-size:16px;font-weight:700;margin:8px 0 0;">{status_text}</p>
    </div>"""
    cta_text = "Continue Learning" if passed else "Retry Quiz"
    html = _base_template(f"Quiz Result: {status_text}", body, cta_text, f"{ACADEMY_URL}/dashboard")
    return _send_email(email, name, f"Quiz Result: {quiz_name} - {status_text}", html)


def send_assignment_graded_email(email: str, name: str, assignment_name: str, marks: int, max_marks: int, feedback: str) -> bool:
    percent = round((marks / max_marks) * 100)
    body = f"""
    <p style="color:#475569;font-size:15px;line-height:1.8;">Hi <strong>{name}</strong>,</p>
    <p style="color:#475569;font-size:15px;line-height:1.8;">Your assignment <strong>{assignment_name}</strong> has been graded:</p>
    <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:12px;padding:20px;margin:20px 0;">
      <p style="font-size:28px;font-weight:900;color:#0066FF;margin:0 0 4px;">{marks}/{max_marks} <span style="font-size:16px;color:#64748B;">({percent}%)</span></p>
      {f'<p style="color:#475569;font-size:14px;margin:12px 0 0;"><strong>Feedback:</strong> {feedback}</p>' if feedback else ""}
    </div>"""
    html = _base_template("Assignment Graded", body, "View Details", f"{ACADEMY_URL}/assignments")
    return _send_email(email, name, f"Assignment Graded: {assignment_name}", html)


# -------------------------------------------------------
# JOBS / RECRUITMENT EMAILS
# -------------------------------------------------------
def send_application_received_email(email: str, name: str, job_title: str) -> bool:
    body = f"""
    <p style="color:#475569;font-size:15px;line-height:1.8;">Hi <strong>{name}</strong>,</p>
    <p style="color:#475569;font-size:15px;line-height:1.8;">We have received your application for the position of <strong>{job_title}</strong>.</p>
    <div style="background:#EFF6FF;border-left:4px solid #0066FF;border-radius:8px;padding:16px;margin:20px 0;">
      <p style="color:#1E40AF;font-size:14px;margin:0;">Our recruitment team will review your application and contact you within <strong>5-7 business days</strong> if you are shortlisted.</p>
    </div>"""
    html = _base_template("Application Received", body, "View Application", f"{JOBS_URL}/dashboard")
    return _send_email(email, name, f"Application Received: {job_title}", html)


def send_application_status_email(email: str, name: str, job_title: str, status: str, notes: str = "") -> bool:
    status_map = {
        "screening": ("Application Under Review", "#F59E0B", "Your application is being reviewed by our HR team."),
        "interview": ("Interview Invitation", "#0066FF", "Congratulations! You have been shortlisted for an interview."),
        "offered": ("Job Offer Extended", "#22C55E", "Congratulations! We would like to offer you this position."),
        "hired": ("Welcome to Softmaster!", "#22C55E", "You have been successfully hired. Welcome to the team!"),
        "rejected": ("Application Status Update", "#94A3B8", "After careful consideration, we will not be moving forward with your application at this time."),
    }
    title, color, message = status_map.get(status, ("Status Update", "#0066FF", f"Your application status has been updated to {status}."))
    body = f"""
    <p style="color:#475569;font-size:15px;line-height:1.8;">Hi <strong>{name}</strong>,</p>
    <p style="color:#475569;font-size:15px;line-height:1.8;">Update on your application for <strong>{job_title}</strong>:</p>
    <div style="background:#F8FAFC;border-left:4px solid {color};border-radius:8px;padding:16px;margin:20px 0;">
      <p style="color:{color};font-size:16px;font-weight:700;margin:0 0 8px;">{status.upper()}</p>
      <p style="color:#475569;font-size:14px;margin:0;">{message}</p>
      {f'<p style="color:#64748B;font-size:13px;margin:8px 0 0;"><em>Note: {notes}</em></p>' if notes else ""}
    </div>"""
    html = _base_template(title, body, "View Application", f"{JOBS_URL}/dashboard")
    return _send_email(email, name, f"Application Update: {job_title} - {status.title()}", html)


def send_interview_scheduled_email(email: str, name: str, job_title: str, scheduled_at: str, meeting_link: str, interview_type: str = "Video") -> bool:
    body = f"""
    <p style="color:#475569;font-size:15px;line-height:1.8;">Hi <strong>{name}</strong>,</p>
    <p style="color:#475569;font-size:15px;line-height:1.8;">Your interview for <strong>{job_title}</strong> has been scheduled.</p>
    <div style="background:#EFF6FF;border:1px solid #BFDBFE;border-radius:12px;padding:20px;margin:20px 0;">
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="color:#64748B;font-size:13px;padding:6px 0;">Date & Time:</td><td style="color:#0A1628;font-weight:700;font-size:14px;">{scheduled_at}</td></tr>
        <tr><td style="color:#64748B;font-size:13px;padding:6px 0;">Type:</td><td style="color:#0A1628;font-weight:600;font-size:14px;">{interview_type} Interview</td></tr>
        {f'<tr><td style="color:#64748B;font-size:13px;padding:6px 0;">Meeting Link:</td><td><a href="{meeting_link}" style="color:#0066FF;">{meeting_link}</a></td></tr>' if meeting_link else ""}
      </table>
    </div>
    <p style="color:#475569;font-size:14px;">Please be available 5 minutes before the scheduled time. Ensure your camera and microphone are working.</p>"""
    html = _base_template("Interview Scheduled", body, "Join Interview", meeting_link or JOBS_URL)
    return _send_email(email, name, f"Interview Scheduled: {job_title}", html)


# -------------------------------------------------------
# CLIENT PORTAL EMAILS
# -------------------------------------------------------
def send_ticket_created_email(email: str, name: str, ticket_number: str, subject: str) -> bool:
    body = f"""
    <p style="color:#475569;font-size:15px;line-height:1.8;">Hi <strong>{name}</strong>,</p>
    <p style="color:#475569;font-size:15px;line-height:1.8;">Your support ticket has been created. Our team will respond within <strong>24 hours</strong>.</p>
    <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:12px;padding:20px;margin:20px 0;">
      <p style="color:#64748B;font-size:12px;margin:0 0 4px;text-transform:uppercase;letter-spacing:1px;">Ticket Number</p>
      <p style="color:#0066FF;font-size:22px;font-weight:800;margin:0;">{ticket_number}</p>
      <p style="color:#475569;font-size:14px;margin:8px 0 0;">Subject: {subject}</p>
    </div>"""
    html = _base_template("Support Ticket Created", body, "View Ticket", f"{CLIENT_URL}/support")
    return _send_email(email, name, f"Ticket {ticket_number}: {subject}", html)


def send_ticket_reply_email(email: str, name: str, ticket_number: str, subject: str, reply_preview: str) -> bool:
    body = f"""
    <p style="color:#475569;font-size:15px;line-height:1.8;">Hi <strong>{name}</strong>,</p>
    <p style="color:#475569;font-size:15px;line-height:1.8;">Our support team has replied to your ticket <strong>{ticket_number}</strong>.</p>
    <div style="background:#F8FAFC;border-left:4px solid #0066FF;border-radius:8px;padding:16px;margin:20px 0;">
      <p style="color:#475569;font-size:14px;font-style:italic;margin:0;">"{reply_preview[:200]}{'...' if len(reply_preview) > 200 else ''}"</p>
    </div>"""
    html = _base_template("Support Reply Received", body, "View Full Reply", f"{CLIENT_URL}/support")
    return _send_email(email, name, f"Reply to {ticket_number}: {subject}", html)


def send_ticket_resolved_email(email: str, name: str, ticket_number: str, subject: str) -> bool:
    body = f"""
    <p style="color:#475569;font-size:15px;line-height:1.8;">Hi <strong>{name}</strong>,</p>
    <p style="color:#475569;font-size:15px;line-height:1.8;">Your support ticket <strong>{ticket_number}</strong> has been resolved.</p>
    <div style="background:#F0FDF4;border-left:4px solid #22C55E;border-radius:8px;padding:16px;margin:20px 0;">
      <p style="color:#15803D;font-size:14px;margin:0;font-weight:600;">Resolved: {subject}</p>
    </div>
    <p style="color:#475569;font-size:14px;">If you are still experiencing issues, you can reopen the ticket from your portal.</p>"""
    html = _base_template("Ticket Resolved", body, "View Ticket", f"{CLIENT_URL}/support")
    return _send_email(email, name, f"Resolved: Ticket {ticket_number}", html)


def send_invoice_email(email: str, name: str, invoice_number: str, amount: float, due_date: str, invoice_url: str) -> bool:
    body = f"""
    <p style="color:#475569;font-size:15px;line-height:1.8;">Hi <strong>{name}</strong>,</p>
    <p style="color:#475569;font-size:15px;line-height:1.8;">A new invoice has been generated for your account.</p>
    <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:12px;padding:24px;margin:20px 0;">
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="color:#64748B;font-size:13px;padding:8px 0;border-bottom:1px solid #F1F5F9;">Invoice Number</td><td style="color:#0A1628;font-weight:700;font-size:14px;text-align:right;">{invoice_number}</td></tr>
        <tr><td style="color:#64748B;font-size:13px;padding:8px 0;border-bottom:1px solid #F1F5F9;">Amount Due</td><td style="color:#0066FF;font-weight:800;font-size:18px;text-align:right;">LKR {amount:,.2f}</td></tr>
        <tr><td style="color:#64748B;font-size:13px;padding:8px 0;">Due Date</td><td style="color:#DC2626;font-weight:700;font-size:14px;text-align:right;">{due_date}</td></tr>
      </table>
    </div>"""
    html = _base_template("New Invoice", body, "Pay Now", invoice_url or f"{CLIENT_URL}/invoices")
    return _send_email(email, name, f"Invoice {invoice_number} - LKR {amount:,.2f}", html)


def send_project_update_email(email: str, name: str, project_name: str, status: str, progress: int, message: str = "") -> bool:
    status_colors = {"active": "#0066FF", "completed": "#22C55E", "on_hold": "#F59E0B", "planning": "#8B5CF6"}
    color = status_colors.get(status.lower(), "#0066FF")
    body = f"""
    <p style="color:#475569;font-size:15px;line-height:1.8;">Hi <strong>{name}</strong>,</p>
    <p style="color:#475569;font-size:15px;line-height:1.8;">There is an update on your project <strong>{project_name}</strong>.</p>
    <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:12px;padding:20px;margin:20px 0;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
        <span style="color:{color};font-weight:700;font-size:14px;text-transform:uppercase;">{status}</span>
        <span style="color:#0A1628;font-weight:700;font-size:18px;">{progress}%</span>
      </div>
      <div style="background:#E2E8F0;border-radius:6px;height:10px;overflow:hidden;">
        <div style="background:linear-gradient(90deg,{color},{color}88);height:100%;width:{progress}%;border-radius:6px;"></div>
      </div>
      {f'<p style="color:#475569;font-size:14px;margin:12px 0 0;">{message}</p>' if message else ""}
    </div>"""
    html = _base_template(f"Project Update: {project_name}", body, "View Project", f"{CLIENT_URL}/projects")
    return _send_email(email, name, f"Project Update: {project_name} ({progress}% complete)", html)


# -------------------------------------------------------
# ERP / INTERNAL EMAILS
# -------------------------------------------------------
def send_leave_request_submitted_email(email: str, name: str, leave_type: str, start_date: str, end_date: str, days: float) -> bool:
    body = f"""
    <p style="color:#475569;font-size:15px;line-height:1.8;">Hi <strong>{name}</strong>,</p>
    <p style="color:#475569;font-size:15px;line-height:1.8;">Your leave request has been submitted and is pending approval.</p>
    <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:12px;padding:20px;margin:20px 0;">
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="color:#64748B;font-size:13px;padding:6px 0;">Type:</td><td style="color:#0A1628;font-weight:600;">{leave_type.title()} Leave</td></tr>
        <tr><td style="color:#64748B;font-size:13px;padding:6px 0;">From:</td><td style="color:#0A1628;font-weight:600;">{start_date}</td></tr>
        <tr><td style="color:#64748B;font-size:13px;padding:6px 0;">To:</td><td style="color:#0A1628;font-weight:600;">{end_date}</td></tr>
        <tr><td style="color:#64748B;font-size:13px;padding:6px 0;">Days:</td><td style="color:#0A1628;font-weight:700;">{days} day(s)</td></tr>
      </table>
    </div>"""
    html = _base_template("Leave Request Submitted", body, "View Request", f"{WORKSPACE_URL}/leaves")
    return _send_email(email, name, f"Leave Request: {leave_type.title()} ({start_date} to {end_date})", html)


def send_leave_status_email(email: str, name: str, leave_type: str, start_date: str, status: str, reason: str = "") -> bool:
    approved = status == "approved"
    color = "#22C55E" if approved else "#EF4444"
    bg = "#F0FDF4" if approved else "#FEF2F2"
    icon = "Approved" if approved else "Rejected"
    body = f"""
    <p style="color:#475569;font-size:15px;line-height:1.8;">Hi <strong>{name}</strong>,</p>
    <p style="color:#475569;font-size:15px;line-height:1.8;">Your leave request has been <strong>{status}</strong>.</p>
    <div style="background:{bg};border-left:4px solid {color};border-radius:8px;padding:16px;margin:20px 0;">
      <p style="color:{color};font-size:16px;font-weight:700;margin:0 0 4px;">{icon}</p>
      <p style="color:#475569;font-size:14px;margin:0;">{leave_type.title()} Leave from {start_date}</p>
      {f'<p style="color:#64748B;font-size:13px;margin:8px 0 0;">Reason: {reason}</p>' if reason else ""}
    </div>"""
    html = _base_template(f"Leave {icon}", body, "View My Leaves", f"{WORKSPACE_URL}/leaves")
    return _send_email(email, name, f"Leave {icon}: {leave_type.title()} Leave", html)


def send_payslip_email(email: str, name: str, month_year: str, net_salary: float, payslip_url: str) -> bool:
    body = f"""
    <p style="color:#475569;font-size:15px;line-height:1.8;">Hi <strong>{name}</strong>,</p>
    <p style="color:#475569;font-size:15px;line-height:1.8;">Your payslip for <strong>{month_year}</strong> is ready.</p>
    <div style="background:#EFF6FF;border:1px solid #BFDBFE;border-radius:12px;padding:24px;margin:20px 0;text-align:center;">
      <p style="color:#64748B;font-size:13px;margin:0 0 4px;">Net Salary</p>
      <p style="color:#0066FF;font-size:32px;font-weight:900;margin:0;">LKR {net_salary:,.2f}</p>
      <p style="color:#94A3B8;font-size:12px;margin:8px 0 0;">{month_year}</p>
    </div>"""
    html = _base_template("Payslip Ready", body, "Download Payslip", payslip_url or f"{WORKSPACE_URL}/payroll")
    return _send_email(email, name, f"Payslip Ready: {month_year}", html)


def send_attendance_alert_email(email: str, name: str, date: str, check_in: str) -> bool:
    body = f"""
    <p style="color:#475569;font-size:15px;line-height:1.8;">Hi <strong>{name}</strong>,</p>
    <p style="color:#475569;font-size:15px;line-height:1.8;">Your attendance has been recorded for today.</p>
    <div style="background:#F0FDF4;border-left:4px solid #22C55E;border-radius:8px;padding:16px;margin:20px 0;">
      <p style="color:#15803D;font-size:14px;margin:0;">Date: <strong>{date}</strong> | Check-in: <strong>{check_in}</strong></p>
    </div>"""
    html = _base_template("Attendance Recorded", body, "View Attendance", f"{WORKSPACE_URL}/attendance")
    return _send_email(email, name, f"Attendance Recorded: {date}", html)


# -------------------------------------------------------
# PLACEMENT EMAILS
# -------------------------------------------------------
def send_placement_drive_email(email: str, name: str, company: str, date: str, role: str) -> bool:
    body = f"""
    <p style="color:#475569;font-size:15px;line-height:1.8;">Hi <strong>{name}</strong>,</p>
    <p style="color:#475569;font-size:15px;line-height:1.8;">A new placement drive has been announced. You are eligible to apply!</p>
    <div style="background:#EFF6FF;border:1px solid #BFDBFE;border-radius:12px;padding:20px;margin:20px 0;">
      <p style="color:#0066FF;font-size:20px;font-weight:800;margin:0 0 8px;">{company}</p>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="color:#64748B;font-size:13px;padding:4px 0;">Role:</td><td style="color:#0A1628;font-weight:600;">{role}</td></tr>
        <tr><td style="color:#64748B;font-size:13px;padding:4px 0;">Drive Date:</td><td style="color:#0A1628;font-weight:600;">{date}</td></tr>
      </table>
    </div>"""
    html = _base_template("Placement Drive Alert", body, "Register Now", "https://placement.softmastertech.com/drives")
    return _send_email(email, name, f"Placement Drive: {company} - {role}", html)


def send_placement_success_email(email: str, name: str, company: str, role: str, salary: str) -> bool:
    body = f"""
    <p style="color:#475569;font-size:15px;line-height:1.8;">Congratulations <strong>{name}</strong>!</p>
    <p style="color:#475569;font-size:15px;line-height:1.8;">You have been successfully placed. This is a tremendous achievement!</p>
    <div style="background:linear-gradient(135deg,#EFF6FF,#F0FDF4);border:1px solid #86EFAC;border-radius:12px;padding:24px;margin:20px 0;text-align:center;">
      <p style="color:#0A1628;font-size:22px;font-weight:900;margin:0 0 8px;">{company}</p>
      <p style="color:#0066FF;font-size:16px;font-weight:700;margin:0 0 4px;">{role}</p>
      {f'<p style="color:#15803D;font-size:18px;font-weight:800;margin:8px 0 0;">Package: {salary}</p>' if salary else ""}
    </div>
    <p style="color:#475569;font-size:14px;">The entire Softmaster team is proud of you. Best wishes for your career!</p>"""
    html = _base_template("Congratulations on Your Placement!", body)
    return _send_email(email, name, f"Placed at {company} - Congratulations!", html)
