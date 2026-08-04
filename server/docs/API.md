// Auth ...

POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET /api/auth/me

// Project ...

GET /api/projects
POST /api/projects
GET /api/projects/:projectId
PATCH /api/projects/:projectId
DELETE /api/projects/:projectId

// Members ...

POST /api/projects/join
POST /api/projects/:projectId/leave
GET /api/projects/:projectId/members
DELETE /api/projects/:projectId/members/:memberId
PATCH /api/projects/:projectId/invite-code

// Tasks ...

POST /api/projects/:projectId/tasks // Create (assignedTo optional)
GET /api/projects/:projectId/tasks // Get all project tasks
GET /api/tasks/:taskId // Get single task
PATCH /api/tasks/:taskId // Update task details
PATCH /api/tasks/:taskId/assign // Assign or reassign task
PATCH /api/tasks/:taskId/status // Change task status
DELETE /api/tasks/:taskId // Delete task

// Comments ...

POST /api/tasks/:taskId/comments
GET /api/tasks/:taskId/comments
PATCH /api/comments/:commentId
DELETE /api/comments/:commentId
