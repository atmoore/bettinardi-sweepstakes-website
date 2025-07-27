# Deployment Guide
## Bettinardi x Eagle Rare Sweepstakes Website

This guide covers deploying your sweepstakes website to production.

## 🔄 Pre-Deployment Checklist

### Required Updates
- [ ] Replace `putter-placeholder.jpg` with actual putter photo
- [ ] Update Venmo username from `@BOURBONDUDEZ` to actual account
- [ ] Set up backend API endpoints for form submission
- [ ] Configure email service for confirmations
- [ ] Add SSL certificate
- [ ] Test all form validations
- [ ] Verify mobile responsiveness
- [ ] Run accessibility audit

### Backend Integration Points

#### 1. Form Submission API
**File:** `script.js` (lines 213-223)
```javascript
// Replace this function with actual API call
async function simulateFormSubmission(data) {
    const response = await fetch('/api/submit-entry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return response.json();
}
```

#### 2. Email Confirmation API
**File:** `script.js` (lines 238-267)
```javascript
// Replace this function with actual email service
async function sendConfirmationEmail(entryData) {
    const response = await fetch('/api/send-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entryData)
    });
    return response.json();
}
```

#### 3. Email Signup API
**File:** `script.js` (lines 226-235)
```javascript
// Replace this function with mailing list service
async function simulateEmailSignup(email) {
    const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
    });
    return response.json();
}
```

## 🌐 Deployment Options

### Option 1: Static Site Hosting (Recommended for Frontend)

#### Netlify
1. **Upload files to Netlify:**
   ```bash
   # Drag & drop the entire folder to netlify.com/drop
   # Or use Netlify CLI:
   npm install -g netlify-cli
   netlify init
   netlify deploy --prod
   ```

2. **Configure custom domain:**
   - Add your domain in Netlify dashboard
   - Update DNS records as instructed
   - SSL certificate automatically provided

#### Vercel
1. **Deploy with Vercel:**
   ```bash
   npm install -g vercel
   cd bettinardi-sweepstakes-website
   vercel --prod
   ```

#### GitHub Pages
1. **Create repository:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/sweepstakes
   git push -u origin main
   ```

2. **Enable GitHub Pages:**
   - Go to repository Settings
   - Enable Pages from main branch
   - Access at: `https://yourusername.github.io/sweepstakes`

### Option 2: Full-Stack Deployment

#### Node.js Backend Example
Create `server.js`:
```javascript
const express = require('express');
const nodemailer = require('nodemailer');
const app = express();

app.use(express.static('.'));
app.use(express.json());

// Form submission endpoint
app.post('/api/submit-entry', async (req, res) => {
    try {
        const entry = req.body;
        // Save to database
        // Send confirmation email
        res.json({ success: true, entryId: Date.now() });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Email confirmation endpoint
app.post('/api/send-confirmation', async (req, res) => {
    // Configure nodemailer and send email
    res.json({ success: true });
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
```

#### Deploy to DigitalOcean
1. **Create Droplet** with Node.js
2. **Upload files:**
   ```bash
   scp -r bettinardi-sweepstakes-website/ user@your-server:/var/www/
   ```
3. **Install dependencies and start:**
   ```bash
   npm install
   pm2 start server.js --name sweepstakes
   ```

## 🔒 Security Configuration

### SSL Certificate
```bash
# Using Let's Encrypt with Certbot
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

### Environment Variables
Create `.env` file:
```env
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Database
DATABASE_URL=postgresql://user:password@localhost/sweepstakes

# Security
SESSION_SECRET=your-random-secret-key
VENMO_API_KEY=your-venmo-api-key

# Analytics
GOOGLE_ANALYTICS_ID=GA-XXXXXXXXX
```

### Security Headers
Add to server configuration:
```javascript
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000');
    next();
});
```

## 📊 Database Schema

### Entries Table
```sql
CREATE TABLE entries (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    address TEXT NOT NULL,
    hear_about VARCHAR(100),
    terms_accepted BOOLEAN NOT NULL DEFAULT false,
    payment_status VARCHAR(50) DEFAULT 'free', -- 'free', 'pending', 'paid'
    entry_count INTEGER DEFAULT 1, -- 1 for free, 10 for paid
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE email_subscribers (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 📧 Email Configuration

### Using Nodemailer with Gmail
```javascript
const transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS // Use App Password
    }
});

const emailTemplate = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Sweepstakes Entry Confirmation</title>
</head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h1 style="color: #8B4513;">Entry Confirmed!</h1>
    <p>Dear {{fullName}},</p>
    <p>Thank you for entering the Bettinardi x Eagle Rare Limited Edition Putter Sweepstakes!</p>
    <div style="background: #F5F2E8; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Your Entry Details:</h3>
        <p><strong>Entry Type:</strong> {{entryType}}</p>
        <p><strong>Number of Entries:</strong> {{entryCount}}</p>
        <p><strong>Drawing Date:</strong> September 30th, 2025</p>
    </div>
    <p>Good luck!</p>
    <p>Best regards,<br>The Sweepstakes Team</p>
</body>
</html>
`;
```

## 📈 Analytics Setup

### Google Analytics 4
Add to `index.html` before closing `</head>`:
```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA-XXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA-XXXXXXXXX');
</script>
```

### Custom Event Tracking
Update `script.js`:
```javascript
function trackFormSubmission(data) {
    gtag('event', 'sweepstakes_entry', {
        'event_category': 'form',
        'event_label': data.hearAbout || 'unknown',
        'value': data.hearAbout === 'paid' ? 25 : 0
    });
}
```

## 🧪 Testing

### Pre-Launch Testing
```bash
# Test responsive design
npx lighthouse http://localhost:3000 --view

# Accessibility audit
npm install -g @axe-core/cli
axe http://localhost:3000

# Performance testing
npm install -g lighthouse
lighthouse http://localhost:3000 --output html --output-path ./report.html
```

### Form Testing Checklist
- [ ] Valid submissions work correctly
- [ ] Invalid inputs show proper errors
- [ ] Email confirmations send properly
- [ ] Venmo integration functions
- [ ] Mobile form submission works
- [ ] Screen reader accessibility
- [ ] Terms & conditions link works
- [ ] All validation messages display

## 🚀 Go-Live Steps

1. **Final Testing:** Complete all testing checklists
2. **DNS Configuration:** Point domain to hosting
3. **SSL Setup:** Ensure HTTPS is working
4. **Email Testing:** Send test confirmation emails
5. **Payment Testing:** Verify Venmo integration
6. **Analytics:** Confirm tracking is working
7. **Monitoring:** Set up uptime monitoring
8. **Backup:** Schedule regular backups

## 📞 Support

After deployment, monitor:
- Form submission success rates
- Email delivery rates
- Error logs
- User feedback
- Performance metrics

Keep this deployment guide updated as you make changes to the website.

---

**Client:** Bourbon Dudez LLC  
**Project:** Bettinardi x Eagle Rare Sweepstakes Website  
**Deployment completed:** _______________  
**Deployed by:** _______________  
**Environment:** Production / Staging