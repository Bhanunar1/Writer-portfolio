# Fix Gmail Authentication Error

## The Problem
Gmail is rejecting your app password. This usually happens when:
1. The app password is incorrect or expired
2. The app password was copied with extra spaces/characters
3. 2-Step Verification is not enabled
4. The app password was generated incorrectly

## Solution: Generate a NEW App Password

### Step 1: Go to Google Account Settings
1. Visit: https://myaccount.google.com/
2. Click **Security** (left sidebar)
3. Under "How you sign in to Google", find **2-Step Verification**
4. Make sure it's **ON** (if not, enable it first)

### Step 2: Generate App Password
1. Still in Security settings, scroll to **2-Step Verification**
2. Click on **2-Step Verification** (not the toggle, the text link)
3. Scroll down to find **App passwords**
4. Click **App passwords**
5. You may need to sign in again
6. Select app: **Mail**
7. Select device: **Other (Custom name)**
8. Type: **Portfolio Website**
9. Click **Generate**
10. **Copy the 16-character password** (it will look like: `abcd efgh ijkl mnop`)
11. **IMPORTANT**: Copy it WITHOUT spaces, or remove spaces when pasting

### Step 3: Update .env File
1. Open `.env` file in the project folder
2. Replace the EMAIL_PASS line with:
   ```
   EMAIL_PASS=your-16-char-password-without-spaces
   ```
3. Save the file
4. Restart the server: `npm start`

## Alternative: Check Current Password

If you want to verify your current password:
1. The password should be exactly **16 characters** (no spaces)
2. It should look like: `nsxkscmwixauqjo` (all lowercase, no spaces)
3. If it has spaces, remove them: `nsxk kscm wixa uqjo` → `nsxkscmwixauqjo`

## Still Not Working?

1. **Delete old app password** and create a new one
2. **Check your Google account** - make sure it's not locked or restricted
3. **Try a different email service** (if Gmail continues to fail)
4. **Check server logs** - the password length should be 16 characters

## Test After Fix

After updating `.env`:
1. Stop the server (Ctrl+C)
2. Run `npm start` again
3. Try submitting the contact form
4. Check server logs for password length (should show 16)
