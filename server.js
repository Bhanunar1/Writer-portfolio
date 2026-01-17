require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://writers_portfolio:<db_password>@cluster0.1pklu9d.mongodb.net/?appName=Cluster0';
const DB_NAME = 'kal_krish_portfolio';
const SUBSCRIBERS_COLLECTION = 'subscribers';
const CONTACTS_COLLECTION = 'contacts';

let db;
let client;

// Connect to MongoDB
async function connectToMongoDB() {
    try {
        client = new MongoClient(MONGODB_URI);
        await client.connect();
        db = client.db(DB_NAME);
        console.log('✅ Connected to MongoDB');

        // Create indexes
        await db.collection(SUBSCRIBERS_COLLECTION).createIndex({ email: 1 }, { unique: true });
        await db.collection(CONTACTS_COLLECTION).createIndex({ receivedAt: -1 });

        return true;
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        // Fallback: continue without database (for local development)
        console.warn('⚠️  Continuing without database. Some features may not work.');
        return false;
    }
}

// Initialize MongoDB connection
connectToMongoDB();

// Email transporter configuration
// Update these with your actual email credentials
const createTransporter = () => {
    // Remove spaces from password (Gmail app passwords are 16 chars without spaces)
    const emailUser = (process.env.EMAIL_USER || 'kalkrish153@gmail.com').trim();
    // Remove all whitespace (spaces, tabs, newlines) and trim
    let emailPass = (process.env.EMAIL_PASS || '').replace(/\s+/g, '').trim();
    // Remove any non-alphanumeric characters that might have been added
    emailPass = emailPass.replace(/[^a-zA-Z0-9]/g, '');

    if (!emailPass) {
        console.warn('⚠️  EMAIL_PASS not set in environment variables');
    }

    // Debug: Show password length (but not the actual password)
    console.log(`🔐 Email password length: ${emailPass.length} characters`);
    if (emailPass.length !== 16) {
        console.warn(`⚠️  Warning: Gmail app passwords should be 16 characters. Current length: ${emailPass.length}`);
    }

    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: emailUser,
            pass: emailPass
        },
        // Force IPv4 to avoid IPv6 connectivity issues which can cause timeouts
        family: 4,
        // timeouts (increased to 30s)
        connectionTimeout: 30000,
        greetingTimeout: 30000,
        socketTimeout: 30000
    });
};

// API Routes

// Subscribe endpoint
app.post('/api/subscribe', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email || !email.includes('@')) {
            return res.status(400).json({ success: false, message: 'Valid email required' });
        }

        // Check if email already exists (MongoDB)
        if (db) {
            const existingSubscriber = await db.collection(SUBSCRIBERS_COLLECTION).findOne({ email });
            if (existingSubscriber) {
                return res.status(200).json({
                    success: true,
                    message: 'You are already subscribed!'
                });
            }

            // Add new subscriber to MongoDB
            const subscriber = {
                email,
                subscribedAt: new Date(),
                status: 'pending'
            };

            await db.collection(SUBSCRIBERS_COLLECTION).insertOne(subscriber);

            // Send confirmation email to subscriber
            try {
                const transporter = createTransporter();
                await transporter.sendMail({
                    from: process.env.EMAIL_USER || 'your-email@gmail.com',
                    to: email,
                    subject: 'Subscription Request Received - Kal Krish',
                    html: `
                        <h2>Thank you for your interest!</h2>
                        <p>Hello,</p>
                        <p>Thank you for subscribing to receive updates about Kal Krish's stories.</p>
                        <p>We have received your request. You will be contacted shortly with payment instructions and access details.</p>
                        <p>Best regards,<br>Kal Krish</p>
                    `
                });
            } catch (emailError) {
                console.error('Email sending failed:', emailError);
                // Don't fail the request if email fails
            }

            // Notify admin (you)
            try {
                const transporter = createTransporter();
                await transporter.sendMail({
                    from: process.env.EMAIL_USER || 'your-email@gmail.com',
                    to: process.env.EMAIL_USER || 'kalkrish153@gmail.com',
                    subject: 'New Subscription Request',
                    html: `
                        <h2>New Subscription Request</h2>
                        <p><strong>Email:</strong> ${email.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
                        <p><strong>Time:</strong> ${subscriber.subscribedAt.toISOString()}</p>
                        <p>Please contact them with payment instructions.</p>
                    `
                });
            } catch (emailError) {
                console.error('Admin notification failed:', emailError);
            }
        } else {
            // Fallback if MongoDB not available
            console.warn('⚠️  MongoDB not available, subscription not saved');
        }

        res.json({
            success: true,
            message: 'Subscription request received! We will contact you with payment instructions and access details.'
        });

    } catch (error) {
        console.error('Subscribe error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again later.'
        });
    }
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, message, type } = req.body;

        if (!email || !message) {
            return res.status(400).json({
                success: false,
                message: 'Email and message are required'
            });
        }

        // Add contact/feedback message to MongoDB
        if (db) {
            const contact = {
                name: name || 'Anonymous',
                email,
                message,
                type: type || 'contact',
                receivedAt: new Date()
            };

            await db.collection(CONTACTS_COLLECTION).insertOne(contact);

            // Send email notification to admin
            try {
                const transporter = createTransporter();
                const subject = type === 'feedback'
                    ? `New Story Feedback from ${name || 'Anonymous'}`
                    : `New Contact Form Message from ${name || 'Anonymous'}`;

                await transporter.sendMail({
                    from: process.env.EMAIL_USER || 'your-email@gmail.com',
                    to: process.env.EMAIL_USER || 'kalkrish153@gmail.com',
                    subject: subject,
                    html: `
                        <h2>${type === 'feedback' ? 'New Story Feedback' : 'New Contact Form Message'}</h2>
                        <p><strong>Name:</strong> ${(name || 'Anonymous').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
                        <p><strong>Email:</strong> ${email.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
                        <p><strong>Message:</strong></p>
                        <p>${message.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>')}</p>
                        <p><strong>Received:</strong> ${contact.receivedAt.toISOString()}</p>
                    `
                });
            } catch (emailError) {
                console.error('Email sending failed:', emailError);
            }
        } else {
            console.warn('⚠️  MongoDB not available, contact not saved');
        }

        res.json({
            success: true,
            message: 'Message sent successfully! We will get back to you soon.'
        });

    } catch (error) {
        console.error('Contact error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again later.'
        });
    }
});

// Get subscribers (admin endpoint - add authentication in production)
app.get('/api/subscribers', async (req, res) => {
    try {
        if (db) {
            const subscribers = await db.collection(SUBSCRIBERS_COLLECTION)
                .find({})
                .sort({ subscribedAt: -1 })
                .toArray();

            res.json({
                success: true,
                subscribers: subscribers
            });
        } else {
            res.json({
                success: true,
                subscribers: [],
                message: 'MongoDB not connected'
            });
        }
    } catch (error) {
        console.error('Error reading subscribers:', error);
        res.status(500).json({ success: false, message: 'Error reading data' });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

// Graceful shutdown
process.on('SIGINT', async () => {
    if (client) {
        await client.close();
        console.log('MongoDB connection closed');
    }
    process.exit(0);
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    const emailUser = process.env.EMAIL_USER || 'not set';
    const emailPass = process.env.EMAIL_PASS ? '***set***' : 'not set';
    const mongoUri = process.env.MONGODB_URI ? '***set***' : 'not set';
    console.log(`📧 Email config: USER=${emailUser}, PASS=${emailPass}`);
    console.log(`🗄️  MongoDB: ${mongoUri}`);
    if (!process.env.EMAIL_PASS) {
        console.warn('⚠️  EMAIL_PASS not found in .env file. Email functionality will not work.');
    }
    if (!process.env.MONGODB_URI) {
        console.warn('⚠️  MONGODB_URI not found. Using fallback connection string.');
        console.warn('   Set MONGODB_URI in environment variables with your actual password.');
    }

    // Verify email configuration on startup
    if (process.env.EMAIL_PASS) {
        try {
            const transporter = createTransporter();
            transporter.verify((error, success) => {
                if (error) {
                    console.error('❌ Email configuration verification failed:', error.message);
                    console.error('   Hint: Check if your firewall blocks outgoing connections to Gmail or if your IP is restricted.');
                } else {
                    console.log('✅ Email service is ready and verified');
                }
            });
        } catch (err) {
            console.error('⚠️  Could not initiate email verification:', err.message);
        }
    }
});
