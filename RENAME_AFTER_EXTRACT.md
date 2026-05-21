# IMPORTANT - Run this after extracting on your computer

## Windows users: Rename these 4 folders before using in VS Code

After extracting the ZIP, rename these folders (Next.js needs square brackets for dynamic routes):

RENAME THIS                                              → TO THIS
frontend/apps/jobs/app/jobs/DYNAMIC_jobId               → [jobId]
frontend/apps/jobs/app/apply/DYNAMIC_jobId              → [jobId]
frontend/apps/academy/app/lessons/DYNAMIC_lessonId      → [lessonId]
frontend/apps/academy/app/courses/DYNAMIC_courseId      → [courseId]

## Mac / Linux users: Run this command in the SOFTMASTER folder

mv "frontend/apps/jobs/app/jobs/DYNAMIC_jobId" "frontend/apps/jobs/app/jobs/[jobId]"
mv "frontend/apps/jobs/app/apply/DYNAMIC_jobId" "frontend/apps/jobs/app/apply/[jobId]"
mv "frontend/apps/academy/app/lessons/DYNAMIC_lessonId" "frontend/apps/academy/app/lessons/[lessonId]"
mv "frontend/apps/academy/app/courses/DYNAMIC_courseId" "frontend/apps/academy/app/courses/[courseId]"

## Why?
Windows cannot extract files with [ ] in the folder name.
These are Next.js dynamic route folders - they need the brackets to work.
