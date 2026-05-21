import sys
sys.path.insert(0, '.')
from app.core.database import SessionLocal
from app.models.academy import Course
import re, time

db = SessionLocal()

courses = [
    ("Full Stack Web Development", "Master HTML, CSS, JavaScript, React, Node.js, and MongoDB. Build real-world projects.", "web_development", "beginner", 80),
    ("Data Science with Python", "Learn Python, Pandas, NumPy, ML, and AI. Hands-on projects with real datasets.", "data_science", "intermediate", 60),
    ("Mobile App Development", "Build Android and iOS apps with React Native and Flutter.", "mobile_development", "intermediate", 50),
    ("DevOps & Cloud Computing", "Docker, Kubernetes, AWS, CI/CD pipelines, and infrastructure automation.", "devops", "advanced", 70),
    ("UI/UX Design Masterclass", "Figma, Adobe XD, design thinking, wireframing, and prototyping.", "design", "beginner", 40),
    ("Java Full Stack", "Core Java, Spring Boot, Hibernate, REST APIs, and Microservices.", "web_development", "beginner", 90),
    ("Cyber Security Essentials", "Network security, ethical hacking, penetration testing.", "security", "advanced", 45),
    ("Database Management", "SQL, PostgreSQL, MongoDB, Redis, and database design.", "database", "intermediate", 35),
]

for title, desc, category, level, hours in courses:
    slug = re.sub(r'[^a-z0-9\s-]', '', title.lower())
    slug = re.sub(r'\s+', '-', slug) + '-' + str(int(time.time()))
    existing = db.query(Course).filter(Course.title == title).first()
    if not existing:
        c = Course(title=title, slug=slug, description=desc, category=category,
                   level=level, duration_hours=hours, instructor_id=1,
                   status="published", is_featured=True, is_certificate_enabled=True,
                   price=0.0, rating=4.8)
        db.add(c)
        print(f"Added: {title}")
        time.sleep(1)
    else:
        print(f"Exists: {title}")

db.commit()
db.close()
print("Done! All courses added.")