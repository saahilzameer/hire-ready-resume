<<<<<<< HEAD
# hire-ready-resume
ATS-friendly resume builder with keyword matching, scoring, and PDF deployment
=======
# ResuAI - Production AI Resume Builder

## Tech Stack
- **Frontend**: React, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express, MongoDB
- **AI**: OpenAI (GPT-3.5/4)
- **PDF**: Puppeteer

## Environment Variables
Create a `.env` file in the `backend` folder:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_key
EMAIL_USER=your_email
EMAIL_PASS=your_app_password
FRONTEND_URL=your_deployed_frontend_url
```

## Running Locally
1. **Backend**:
   ```bash
   cd backend
   npm install
   # Make sure MongoDB is running locally
   npm run dev
   ```
2. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## Deployment Instructions
### Backend (Render/Fly.io)
1. Push the `backend` folder to a GitHub repo.
2. Link the repo to Render/Fly.io.
3. Add environment variables.
4. Set build command: `npm install`.
5. Set start command: `node server.js`.

### Frontend (Vercel)
1. Push the `frontend` folder to a GitHub repo.
2. Link to Vercel.
3. Set root directory to `frontend`.
4. Build command: `npm run build`.
5. Output directory: `dist`.

## ATS Rules Implemented
- Single column layout
- No graphics/icons
- Standard headings
- Left-aligned text
- Sans-serif/Serif standard fonts
- Bullet points using "-"
>>>>>>> e1a75eb (Initial commit of AI Resume Builder)
