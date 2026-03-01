Jobs:
● GET /api/jobs – List all jobs
● GET /api/jobs/{id} – Get single job details
● POST /api/jobs – Create a job (Admin)
● DELETE /api/jobs/{id} – Delete a job (Admin)
Applications:
● POST /api/applications – Submit job application
3. Database
● Use MongoDB, MySQL, or PostgreSQL
● Persist job listings and applications
● Proper model relationships (e.g., Job → Applications)
Example Models:
● Job (id, title, company, location, category, description, created_at)