# Backend Setup Guide

This backend handles subscription requests, contact form submissions, and email notifications.

## Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)
- Gmail account (or another email service)

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   
   Create a `.env` file in the root directory:
   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   PORT=3000
   ```

### 3. Setup Email
This project uses **Nodemailer** with standard SMTP to send emails. You can use Gmail or any other email provider.

#### option A: Using Gmail
1.  Go to your [Google Account Security](https://myaccount.google.com/security).
2.  Enable **2-Step Verification** if not already enabled.
3.  Go to **App Passwords** (search for it in the search bar if you can't find it).
4.  Create a new App Password (select "Mail" and "Other (Custom name)").
5.  Copy the 16-character password.
6.  Update your `.env` file:
    ```env
    EMAIL_USER=your-email@gmail.com
    EMAIL_PASS=your-16-char-app-password
    ```

#### Option B: Other Providers
Update your `.env` file with your provider's details. You might need to adjust the `transporter` config in `server.js` if not using Gmail.
```env
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-password
```

4. **Start the server:**
   ```bash
   npm start
   ```
   
   For development with auto-reload:
   ```bash
   npm run dev
   ```

## API Endpoints

### POST `/api/subscribe`
Subscribe to receive book updates and access.

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Subscription request received! We will contact you with payment instructions and access details."
}
```

### POST `/api/contact`
Send a contact form message.

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Hello, I'm interested in your books..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Message sent successfully! We will get back to you soon."
}
```

### GET `/api/subscribers`
Get list of all subscribers (admin endpoint).

### GET `/api/health`
Health check endpoint.

## Data Storage

Subscriber and contact data is stored in `data/subscribers.json`. This file is created automatically.

## Email Configuration

The backend uses Nodemailer. To use a different email service, update the `createTransporter()` function in `server.js`.

**Supported services:**
- Gmail
- Outlook
- Yahoo
- Custom SMTP

## Deployment

### Option 1: Heroku
1. Create a Heroku app
2. Set environment variables in Heroku dashboard
3. Deploy: `git push heroku main`

### Option 2: Vercel/Netlify Functions
Convert endpoints to serverless functions.

### Option 3: VPS (DigitalOcean, AWS, etc.)
1. Install Node.js on server
2. Use PM2 for process management: `pm2 start server.js`
3. Set up reverse proxy (nginx)

## Security Notes

- Add authentication to `/api/subscribers` endpoint in production
- Use environment variables for sensitive data
- Consider adding rate limiting
- Use HTTPS in production
- Consider migrating to a database (MongoDB, PostgreSQL) for production

## Troubleshooting

**Email not sending?**
- Check your email credentials
- For Gmail, ensure App Password is used (not regular password)
- Check spam folder

**Port already in use?**
- Change PORT in `.env` file
- Or kill the process using the port

**Data not saving?**
- Ensure `data/` directory has write permissions
- Check file paths are correct
