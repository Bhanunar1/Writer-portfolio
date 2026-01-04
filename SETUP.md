# Quick Setup Guide

## Step 1: Install Dependencies

Open terminal in the project folder and run:
```bash
npm install
```

## Step 2: Create .env File

Create a file named `.env` in the root directory with:

```env
EMAIL_USER=kalkrish153@gmail.com
EMAIL_PASS=Storywriter@1234
PORT=3000
```

**Note:** The `.env` file is already in `.gitignore` so it won't be committed to git.

## Step 3: Start the Server

```bash
npm start
```

The server will run on `http://localhost:3000`

## Step 4: Test the Website

1. Open `http://localhost:3000` in your browser
2. Try the subscription form
3. Try the contact form
4. Check your email for notifications

## Troubleshooting

### Email Not Sending?

1. **For Gmail:**
   - Make sure you're using an "App Password" not your regular password
   - Go to Google Account → Security → 2-Step Verification → App Passwords
   - Generate a new app password if needed

2. **Check server logs:**
   - Look for error messages in the terminal
   - Common issues: wrong password, email service blocked

### Port Already in Use?

Change the PORT in `.env` file:
```env
PORT=3001
```

### Server Won't Start?

Make sure Node.js is installed:
```bash
node --version
```

Should show v14 or higher.

## Production Deployment

For production, you'll need to:
1. Set environment variables on your hosting platform
2. Use a process manager like PM2
3. Set up HTTPS
4. Consider using a database instead of JSON files

## Security Note

⚠️ **Important:** Since your password was shared, consider:
- Changing your Gmail app password after testing
- Never commit `.env` file to git (already in .gitignore)
- Use environment variables on your hosting platform
