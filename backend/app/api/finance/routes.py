# SOFTMASTER TECHNOLOGY SOLUTIONS PVT LTD
# Finance API Routes
# File: backend/app/api/finance/routes.py

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import Optional
from datetime import date
from app.core.database import get_db
from app.core.security import get_current_user, require_role

router = APIRouter()

# ─── Invoices ────────────────────────────────────────────────────────────────

@router.get("/invoices")
async def list_invoices(
    status: Optional[str] = None,
    client_id: Optional[str] = None,
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["super_admin", "admin", "hr"]))
):
    offset = (page - 1) * size
    query = "SELECT * FROM invoices WHERE 1=1"
    params = {}
    if status:
        query += " AND status = :status"
        params["status"] = status
    if client_id:
        query += " AND client_id = :client_id"
        params["client_id"] = client_id
    query += " ORDER BY invoice_date DESC LIMIT :limit OFFSET :offset"
    params["limit"] = size
    params["offset"] = offset
    result = db.execute(text(query), params).fetchall()
    count = db.execute(text("SELECT COUNT(*) FROM invoices"), {}).scalar()
    return {"items": [dict(r._mapping) for r in result], "total": count, "page": page, "size": size}

@router.get("/invoices/{invoice_id}")
async def get_invoice(invoice_id: str, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    inv = db.execute(text("SELECT * FROM invoices WHERE id = :id"), {"id": invoice_id}).fetchone()
    if not inv:
        raise HTTPException(status_code=404, detail="Invoice not found")
    items = db.execute(text("SELECT * FROM invoice_items WHERE invoice_id = :id"), {"id": invoice_id}).fetchall()
    result = dict(inv._mapping)
    result["items"] = [dict(i._mapping) for i in items]
    return result

@router.post("/invoices")
async def create_invoice(data: dict, db: Session = Depends(get_db), current_user=Depends(require_role(["super_admin","admin"]))):
    items = data.pop("items", [])
    result = db.execute(text("""
        INSERT INTO invoices (invoice_number, invoice_date, due_date, client_id, client_name,
            client_email, client_address, client_gstin, subtotal, discount_percentage,
            discount_amount, cgst_percentage, sgst_percentage, igst_percentage,
            tax_amount, total_amount, currency, notes, terms, created_by)
        VALUES (:invoice_number, :invoice_date, :due_date, :client_id, :client_name,
            :client_email, :client_address, :client_gstin, :subtotal, :discount_percentage,
            :discount_amount, :cgst_percentage, :sgst_percentage, :igst_percentage,
            :tax_amount, :total_amount, :currency, :notes, :terms, :created_by)
        RETURNING id
    """), {**data, "created_by": str(current_user["id"])})
    invoice_id = result.fetchone()[0]
    for item in items:
        db.execute(text("""
            INSERT INTO invoice_items (invoice_id, description, quantity, unit_price, hsn_sac_code)
            VALUES (:invoice_id, :description, :quantity, :unit_price, :hsn_sac_code)
        """), {**item, "invoice_id": str(invoice_id)})
    db.commit()
    return {"id": str(invoice_id), "message": "Invoice created successfully"}

@router.put("/invoices/{invoice_id}/status")
async def update_invoice_status(invoice_id: str, data: dict, db: Session = Depends(get_db), current_user=Depends(require_role(["super_admin","admin"]))):
    db.execute(text("""
        UPDATE invoices SET status = :status, paid_amount = COALESCE(:paid_amount, paid_amount),
        updated_at = NOW() WHERE id = :id
    """), {**data, "id": invoice_id})
    db.commit()
    return {"message": "Invoice status updated"}

# ─── Expenses ─────────────────────────────────────────────────────────────────

@router.get("/expenses")
async def list_expenses(
    status: Optional[str] = None,
    department_id: Optional[str] = None,
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    offset = (page - 1) * size
    query = "SELECT e.*, u.first_name, u.last_name FROM expenses e LEFT JOIN users u ON u.id = e.created_by WHERE 1=1"
    params = {}
    if status:
        query += " AND e.status = :status"
        params["status"] = status
    if department_id:
        query += " AND e.department_id = :dept_id"
        params["dept_id"] = department_id
    query += " ORDER BY e.expense_date DESC LIMIT :limit OFFSET :offset"
    params["limit"] = size
    params["offset"] = offset
    result = db.execute(text(query), params).fetchall()
    count = db.execute(text("SELECT COUNT(*) FROM expenses"), {}).scalar()
    return {"items": [dict(r._mapping) for r in result], "total": count, "page": page, "size": size}

@router.post("/expenses")
async def create_expense(data: dict, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    result = db.execute(text("""
        INSERT INTO expenses (expense_number, expense_date, category, sub_category, amount,
            vendor_name, description, payment_method, employee_id, department_id,
            project_id, is_reimbursable, created_by)
        VALUES (:expense_number, :expense_date, :category, :sub_category, :amount,
            :vendor_name, :description, :payment_method, :employee_id, :department_id,
            :project_id, :is_reimbursable, :created_by)
        RETURNING *
    """), {**data, "created_by": str(current_user["id"])})
    db.commit()
    return dict(result.fetchone()._mapping)

@router.put("/expenses/{expense_id}/approve")
async def approve_expense(expense_id: str, db: Session = Depends(get_db), current_user=Depends(require_role(["super_admin","admin","hr"]))):
    db.execute(text("""
        UPDATE expenses SET status = 'approved', approved_by = :approved_by, approved_at = NOW()
        WHERE id = :id
    """), {"id": expense_id, "approved_by": str(current_user["id"])})
    db.commit()
    return {"message": "Expense approved"}

# ─── Financial Summary ────────────────────────────────────────────────────────

@router.get("/summary")
async def financial_summary(
    period: str = Query("month", regex="^(week|month|quarter|year)$"),
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["super_admin", "admin"]))
):
    period_map = {"week": "7 days", "month": "30 days", "quarter": "90 days", "year": "365 days"}
    interval = period_map[period]
    revenue = db.execute(text(f"""
        SELECT COALESCE(SUM(amount),0) as total FROM financial_transactions
        WHERE transaction_type = 'income'
        AND transaction_date >= CURRENT_DATE - INTERVAL '{interval}'
    """), {}).scalar() or 0
    expenses = db.execute(text(f"""
        SELECT COALESCE(SUM(amount),0) as total FROM expenses
        WHERE status = 'approved'
        AND expense_date >= CURRENT_DATE - INTERVAL '{interval}'
    """), {}).scalar() or 0
    pending_invoices = db.execute(text("""
        SELECT COUNT(*), COALESCE(SUM(balance_due),0)
        FROM invoices WHERE status IN ('sent','overdue')
    """), {}).fetchone()
    return {
        "period": period,
        "total_revenue": float(revenue),
        "total_expenses": float(expenses),
        "net_profit": float(revenue) - float(expenses),
        "pending_invoice_count": pending_invoices[0],
        "pending_invoice_amount": float(pending_invoices[1])
    }

@router.get("/transactions")
async def list_transactions(
    transaction_type: Optional[str] = None,
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["super_admin","admin"]))
):
    offset = (page - 1) * size
    query = "SELECT * FROM financial_transactions WHERE 1=1"
    params = {}
    if transaction_type:
        query += " AND transaction_type = :type"
        params["type"] = transaction_type
    query += " ORDER BY transaction_date DESC LIMIT :limit OFFSET :offset"
    params["limit"] = size
    params["offset"] = offset
    result = db.execute(text(query), params).fetchall()
    return {"items": [dict(r._mapping) for r in result]}
