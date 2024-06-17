# Video Management System

## Problem Statement

In today's fast-paced world, YouTubers often struggle to find time for video editing. As a result, they often hire video editors to handle this task. However, coordinating the editing process and reviewing the final videos can be time-consuming. Additionally, transferring large video files for review can be inconvenient and slow.

## Solution

To address these challenges, we've developed a Video Management System that streamlines the video editing and review process. Our platform allows YouTubers to upload raw video footage directly to our system. Video editors can then access these videos, edit them, and upload the edited versions back to the platform. YouTubers can review the edited videos within our system and approve them for publishing to YouTube.

### Key Features:

- **User Authentication**: Users can sign up and log in to the platform securely.
- **Organization Management**: YouTubers can create organizations or teams within the platform. Each organization can have multiple members, including both YouTubers and editors.
- **Video Upload**: YouTubers can upload raw video footage to their organization's workspace. Uploaded videos are securely stored on our servers.
- **Video Editing**: Video editors can access uploaded videos, edit them using their preferred editing software, and upload the edited versions back to the platform.
- **Review Process**: YouTubers can review edited videos within the platform. They can provide feedback, request revisions, or approve videos for publishing.
- **Background Processing**: Video uploads are processed in the background using job queues, ensuring efficient handling of large files and improving system performance.

## Usage

### Routes:

- **User Routes** (`/users`):
  - `POST /signup`: Sign up a new user.
  - `POST /login`: Log in an existing user.
  - `GET /me`: Get current user details.

- **Organization Routes** (`/organizations`):
  - `POST /`: Create a new organization.
  - `POST /:orgId/members`: Add a member to an organization.
  - `GET /:orgId`: Get organization details.

- **Video Routes** (`/videos`):
  - `POST /:orgId/upload`: Upload a video to an organization's workspace.
  - `POST /:videoId/approve`: Approve a video for publishing.

### Example Usage:

#### User Authentication:

```http
POST /users/signup
Content-Type: application/json

{
  "username": "user@example.com",
  "password": "password123"
}
```

```http
POST /users/login
Content-Type: application/json

{
  "username": "user@example.com",
  "password": "password123"
}
```

#### Organization Management:

```http
POST /organizations
Authorization: Bearer <JWT Token>
Content-Type: application/json

{
  "name": "My Organization"
}
```

```http
POST /organizations/<orgId>/members
Authorization: Bearer <JWT Token>
Content-Type: application/json

{
  "userId": "user_id",
  "role": "youtuber"
}
```

#### Video Management:

```http
POST /videos/<orgId>/upload
Authorization: Bearer <JWT Token>
Content-Type: multipart/form-data

# Upload video file and metadata
```

```http
POST /videos/<videoId>/approve
Authorization: Bearer <JWT Token>
```

## Dependencies

- Node.js
- Express.js
- MongoDB
- Redis
- Bull (Job queue library)
- Multer (File upload middleware)
- bcryptjs (Password hashing)
- jsonwebtoken (JWT authentication)

## Getting Started

1. Clone this repository.
2. Install dependencies using `npm install`.
3. Start MongoDB and Redis servers.
4. Start the worker using `node worker.js`.
5. Start the server using `node server.js`.

## Contributing

Contributions are welcome! Feel free to submit bug reports, feature requests, or pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

