# TS YouTube API (TS_AUTHENTICATION)

A TypeScript-based Express API for user authentication and video management (upload, like, subscribe, comments) with Cloudinary media storage and JWT authentication.

## Key features

- User registration, login, refresh token flow, logout
- JWT access and refresh tokens
- Video upload (Cloudinary), edit, delete, search, like/dislike, subscribe/unsubscribe
- Commenting system with like/dislike
- Role-based access for admin endpoints
- TypeScript, Express, Mongoose (MongoDB), Cloudinary

## Tech stack

- Node.js + TypeScript
- Express 5
- MongoDB (Mongoose)
- Cloudinary (media/image hosting)
- JWT for authentication
- express-fileupload for file uploads

## Repository layout

(Primary TypeScript source is under `src/` and compiled output goes to `public/`)

```
/ (project root)
├─ public/                # compiled JS output (tsc -> outDir)
├─ src/                   # TypeScript source (server, controllers, models, routes)
│  ├─ config/
│  ├─ controllers/
│  ├─ middlewares/
│  ├─ models/
│  ├─ routes/
│  ├─ types/
│  └─ utils/
├─ package.json
├─ tsconfig.json
└─ README.md
```

## Environment variables

Create a `.env` file in the project root and set the variables below. These names are taken from the project's config files.

```
# MongoDB connection
DB_URL=mongodb://127.0.0.1:27017/TSAUTH

# Cloudinary
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret

# JWT secrets
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret

# Optional
PORT=4000
```

Notes:
- `DB_URL` default is `mongodb://127.0.0.1:27017/TSAUTH` if not provided.
- Keep your secrets safe (do not commit `.env`).

## Installation

Prerequisites: Node.js (v16+ recommended) and npm.

Install dependencies:

```powershell
# from project root (PowerShell)
npm install
```

## Development

Run the TypeScript source with hot reload (uses `ts-node` + `nodemon`):

```powershell
npm run dev
```

This runs the command configured in `package.json` (`nodemon --watch src --ext ts --exec ts-node src/server.ts`).

## Production / Build

Compile TypeScript to `public/` then start the compiled server:

```powershell
npm run build
npm start
```

`npm start` runs `nodemon public/server.js` (existing compiled entrypoint). You can also run `node public/server.js` for a plain Node start.

## API Overview

Base path: `/api/v1`

Users
- POST /users/register — register a new user
- POST /users/login — login and receive tokens
- POST /users/refreshToken — exchange refresh token for new access token
- POST /users/logout — logout (requires auth)
- GET /users/getAllData — admin-only: gets all users + admin info
- GET /users/getAllUsers — admin-only
- GET /users/getAllAdmins — admin-only
- GET /users/:id — get user by id (requires auth)
- PUT /users/:id — update user (requires auth)
- DELETE /users/:id — delete user (requires auth)

Videos
- POST /videos/upload-video — upload video (requires auth)
- GET /videos/ — list videos (requires auth)
- GET /videos/search — search videos (requires auth)
- GET /videos/:id — get video by id (requires auth)
- PUT /videos/:id — edit video (requires auth)
- POST /videos/like/:id — like a video (requires auth)
- POST /videos/dislike/:id — dislike a video (requires auth)
- DELETE /videos/:id — delete video (requires auth)
- POST /videos/subscribe/:id — subscribe to a creator (requires auth)
- POST /videos/unsubscribe/:id — unsubscribe (requires auth)

Comments
- POST /comments/comment/:videoId — add comment (requires auth)
- POST /comments/edit/:commentId — edit comment (requires auth)
- GET /comments/allComments/:videoId — get comments for video (requires auth)
- DELETE /comments/comment/:commentId — delete comment (requires auth)
- PUT /comments/like/:id — like comment (requires auth)
- PUT /comments/dislike/:id — dislike comment (requires auth)

(See `src/routes/*` for full route wiring.)

## Important implementation notes

- JWT access token TTL and refresh token TTL are set in `src/utils/tokenUtils.ts` (`ACCESS_TOKEN_TTL = "3m"`, `REFRESH_TOKEN_TTL = "7d"`). Adjust for your needs.
- `setRefreshCookie()` sets the refresh token cookie with `secure: true` and `sameSite: "strict"`. For local development over HTTP, you may need to adjust these if cookies are not set.
- File uploads use `express-fileupload` and temporary storage at `/tmp/` (check the `fileUpload` config in `src/server.ts`).

## Troubleshooting

- If Cloudinary uploads fail, confirm `CLOUD_NAME`, `API_KEY`, `API_SECRET` are correct and the account allows unsigned uploads (if using unsigned).
- If MongoDB fails to connect, ensure `DB_URL` is reachable and MongoDB is running.
- If cookies are not being set locally, try changing `secure` to `false` inside `src/utils/tokenUtils.ts` `setRefreshCookie` when not using HTTPS.

## Suggested next steps / improvements

- Add unit/integration tests (Jest or Vitest)
- Add request validation (Zod or express-validator)
- Add rate-limiting and more robust error handling
- Add CI (GitHub Actions) and Dockerfile for containerization

## Contributing

Contributions welcome. Open issues for bugs and features, then send PRs referencing the issue.

## License

This repository currently has `ISC` in package.json. Adjust and add a LICENSE file if needed.

---

If you'd like, I can also:
- add a `.env.example` file with the variables above,
- add a basic Dockerfile and docker-compose for local dev (Mongo + app),
- or create a short Postman collection / OpenAPI spec for the API.
