require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const nodemailer = require('nodemailer');
// Email Sending Configuration (Standard SMTP)
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

const transporter = nodemailer.createTransport({
    service: 'gmail', // Built-in service for Gmail, or use host/port for others
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Helper function to send email
const sendEmail = async ({ to, subject, html }) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: to,
            subject: subject,
            html: html
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent to ${to}: ${info.messageId}`);
        return info;

    } catch (error) {
        console.error('❌ Failed to send email:', error.message);
        throw error;
    }
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
                await sendEmail({
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
                await sendEmail({
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
                const subject = type === 'feedback'
                    ? `New Story Feedback from ${name || 'Anonymous'}`
                    : `New Contact Form Message from ${name || 'Anonymous'}`;

                await sendEmail({
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
// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    const emailUser = process.env.EMAIL_USER || 'not set';
    const mongoUri = process.env.MONGODB_URI ? '***set***' : 'not set';
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn('⚠️  Email credentials (EMAIL_USER, EMAIL_PASS) missing in .env');
    } else {
        console.log('✅ Email service configured');
    }

    if (!process.env.MONGODB_URI) {
        console.warn('⚠️  MONGODB_URI not found. Using fallback connection string.');
    }
});
