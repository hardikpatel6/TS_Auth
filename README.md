# YouTube Clone API

## Project Overview
The YouTube Clone API is a backend service designed to replicate the core functionalities of YouTube. It provides endpoints for user authentication, video uploads, comments, and more. This project is built using modern web technologies and follows best practices for scalability and maintainability.

## Features
- **User Authentication**: Secure user registration, login, and token-based authentication.
- **Video Management**: Upload, retrieve, and manage videos.
- **Comment System**: Add, edit, and delete comments on videos.
- **Protected Routes**: Middleware to secure routes and ensure proper access control.
- **Cloudinary Integration**: For video and image storage.

## Technologies Used
### Backend
- **Node.js**: JavaScript runtime for building the server.
- **Express.js**: Web framework for creating RESTful APIs.
- **TypeScript**: Adds static typing to JavaScript for better development experience.
- **MongoDB**: NoSQL database for storing user, video, and comment data.
- **Mongoose**: ODM for MongoDB.
- **Cloudinary**: Media storage and management.
- **JWT**: JSON Web Tokens for authentication.

### Frontend
- **React.js**: JavaScript library for building user interfaces.
- **Vite**: Build tool for faster development.
- **Context API**: State management for React components.

## Folder Structure
### Backend
```
backend/
├── nodemon.json
├── package.json
├── tsconfig.json
├── public/
│   ├── server.js
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── types/
│   └── utils/
├── src/
│   ├── server.ts
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── types/
│   └── utils/
```

### Frontend
```
frontend/
├── eslint.config.js
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── App.css
│   ├── App.jsx
│   ├── main.jsx
│   ├── api/
│   ├── component/
│   ├── context/
│   └── pages/
```

## Installation
### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- Cloudinary Account

### Backend Setup
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and configure the following variables:
   ```env
   MONGO_URI=your_mongodb_connection_string
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   JWT_SECRET=your_jwt_secret
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints
### Authentication
- **POST** `/api/auth/register`: Register a new user.
- **POST** `/api/auth/login`: Login and receive a token.

### Videos
- **POST** `/api/videos`: Upload a new video.
- **GET** `/api/videos`: Retrieve all videos.
- **GET** `/api/videos/:id`: Retrieve a specific video.

### Comments
- **POST** `/api/comments`: Add a comment to a video.
- **GET** `/api/comments/:videoId`: Retrieve comments for a video.

## Contributing
1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add new feature"
   ```
4. Push to the branch:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request.

## License
This project is licensed under the MIT License. See the LICENSE file for details.

## Contact
For any inquiries or feedback, please contact [hardikpatel6](mailto:hardikpatel6@example.com).