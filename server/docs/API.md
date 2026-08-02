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

POST /api/projects/:projectId/members
POST /api/projects/:projectId/leave
GET /api/projects/:projectId/members

// Tasks ...

GET /api/projects/:projectId/tasks
POST /api/projects/:projectId/tasks
GET /api/tasks/:taskId
PATCH /api/tasks/:taskId
DELETE /api/tasks/:taskId

// Comments ...

GET /api/tasks/:taskId/comments
POST /api/tasks/:taskId/comments
DELETE /api/tasks/:taskId/comments/:commentId
