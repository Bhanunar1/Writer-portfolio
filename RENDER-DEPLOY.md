# Deploying to Render

## Environment Variables Setup

In your Render dashboard, add these environment variables:

### Required Variables:

1. **MONGODB_URI**
   ```
   mongodb+srv://writers_portfolio:YOUR_PASSWORD@cluster0.1pklu9d.mongodb.net/?appName=Cluster0
   ```
   Replace `YOUR_PASSWORD` with your actual MongoDB password.

2. **EMAIL_USER**
   ```
   kalkrish153@gmail.com
   ```

3. **CLIENT_ID**
   ```
   your_client_id_from_google_cloud
   ```

4. **CLIENT_SECRET**
   ```
   your_client_secret_from_google_cloud
   ```

5. **REFRESH_TOKEN**
   ```
   your_refresh_token_from_setup_step
   ```

4. **PORT**
   ```
   3000
   ```
   (Render usually sets this automatically, but include it just in case)

## Steps to Deploy:

1. **Push your code to GitHub**
   - Make sure all files are committed
   - Push to your repository

2. **Create a new Web Service on Render**
   - Go to Render dashboard
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository

3. **Configure the service:**
   - **Name**: `kal-krish-portfolio` (or any name you prefer)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Root Directory**: (leave empty or set to root)

4. **Add Environment Variables:**
   - Click "Environment" tab
   - Add all 4 variables listed above
   - Make sure MONGODB_URI has your actual password

5. **Deploy:**
   - Click "Create Web Service"
   - Render will build and deploy your app
   - Wait for deployment to complete

## After Deployment:

- Your site will be available at: `https://your-app-name.onrender.com`
- MongoDB will automatically store all subscribers and contacts
- Email functionality will work using the Gmail API (OAuth2)

## Important Notes:

- **MongoDB Password**: Make sure to replace `<db_password>` in the connection string with your actual MongoDB password
- **Free Tier**: Render free tier spins down after inactivity. First request may be slow.
- **Database**: All data is now stored in MongoDB, not JSON files
- **Environment Variables**: Never commit `.env` file to git (already in .gitignore)

## Testing:

After deployment, test:
1. Contact form submission
2. Feedback form submission
3. Check your email for notifications
4. Verify data is saved in MongoDB
