# TrueSpace Educational Platform

A modern educational video platform with a beautiful, minimalist dark-white design. TrueSpace allows users to access video courses with promo codes, bookmark favorite content, and enjoy a seamless learning experience.

## Features

- 🔐 User authentication (register, login, password recovery)
- 🎟️ Promo code access system for video courses
- 👤 User profile management
- 🔖 Bookmarking and saving courses
- 🔍 Advanced search with filters and categories
- 👑 Admin panel for content management
- 📱 Responsive design for all devices
- ✨ Smooth animations and transitions

## Tech Stack

- **Frontend**: Next.js, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes
- **Database**: MongoDB
- **Authentication**: NextAuth.js
- **File Storage**: AWS S3
- **Deployment**: Render

## Setup Instructions

### Prerequisites

- Node.js (v18 or newer)
- NPM or Yarn
- MongoDB database (local or Atlas)
- AWS S3 bucket (for video storage)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/truespace.git
   cd truespace
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Then edit `.env.local` with your actual configuration values.

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Database Schema

### Users
- Email, name, password, image
- Role (user/admin)
- Favorite videos and saved courses

### Courses
- Title, description, thumbnail
- Category, instructor, tags
- Videos (references)

### Videos
- Title, description, thumbnail
- Video URL, duration, course reference
- Order within course

### Promo Codes
- Code, course reference
- Expiration date, usage limits
- Active status

### User Course Access
- User reference, course reference
- Promo code used, access granted date

## Deployment to Render

1. Create a new Web Service on Render.

2. Connect your Git repository.

3. Configure the service:
   - **Name**: truespace (or your preferred name)
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

4. Add all environment variables from your `.env.local` file to the Render environment.

5. Deploy the service!

## AWS S3 Configuration

1. Create an S3 bucket in your AWS account.

2. Configure CORS on the bucket to allow uploads from your domain:
   ```json
   [
     {
       "AllowedHeaders": ["*"],
       "AllowedMethods": ["GET", "PUT", "POST"],
       "AllowedOrigins": ["https://your-domain.com"],
       "ExposeHeaders": []
     }
   ]
   ```

3. Create an IAM user with appropriate S3 permissions and generate access keys.

4. Add the AWS credentials to your environment variables.

## Admin Setup

The first user will need to be manually upgraded to admin role in the database. After that, administrators can manage content through the admin dashboard.

To upgrade a user to admin:
1. Find the user in your MongoDB collection
2. Update their role field: `{ "role": "admin" }`

## License

This project is licensed under the MIT License - see the LICENSE file for details.
