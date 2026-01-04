# Installation Instructions

## Quick Fix for "Cannot find module" Error

The error occurs because dependencies haven't been installed yet. Follow these steps:

### Option 1: Using Command Line (Recommended)

1. **Open PowerShell or Command Prompt** in the project folder (`C:\Users\bhanu\Downloads\WPort`)

2. **Run this command:**
   ```bash
   npm install
   ```

3. **Wait for installation to complete** (it may take 1-2 minutes)

4. **Start the server:**
   ```bash
   npm start
   ```

### Option 2: Using the Batch File

1. **Double-click** `install-dependencies.bat` in the project folder
2. Wait for it to complete
3. Then run `npm start`

### Option 3: Manual Installation

If npm install doesn't work, install packages individually:

```bash
npm install express
npm install cors
npm install nodemailer
npm install dotenv
```

## Verify Installation

After running `npm install`, you should see:
- A `node_modules` folder created in your project directory
- A `package-lock.json` file created

## Troubleshooting

### If npm is not recognized:
- Install Node.js from https://nodejs.org/
- Make sure to restart your terminal after installing Node.js

### If installation is slow:
- This is normal, npm needs to download packages
- Wait for it to complete

### If you get permission errors:
- Run PowerShell/Command Prompt as Administrator
- Or use: `npm install --no-optional`

## After Installation

Once dependencies are installed, you can:
1. Start the server: `npm start`
2. Open browser: `http://localhost:3000`
3. Test the subscription and contact forms
