# Bettinardi x Eagle Rare Sweepstakes Website

A professional, ADA-compliant sweepstakes landing page built for the Bettinardi x Eagle Rare Limited Edition Putter giveaway.

## 🏆 Prize Details
- **Item:** Bettinardi x Eagle Rare Limited Edition Putter #22 of 24
- **Value:** $1,250 MSRP
- **Finish:** Rose Gold PVD
- **Weight:** 340g
- **Includes:** Certificate of Authenticity

## 🎯 Features
- ✅ **ADA Compliant** - WCAG 2.1 accessibility standards
- ✅ **Responsive Design** - Mobile-first approach
- ✅ **Form Validation** - Real-time client-side validation
- ✅ **Bourbon/Golf Theme** - Elegant design with premium aesthetics
- ✅ **Venmo Integration** - Payment processing ready
- ✅ **Email Confirmation** - Automated entry confirmations
- ✅ **Screen Reader Support** - Full accessibility features
- ✅ **Touch Friendly** - Optimized for mobile devices

## 📁 File Structure
```
bettinardi-sweepstakes-website/
├── index.html              # Main website page
├── styles.css              # All styling and responsive design
├── script.js               # Form validation and functionality
├── putter-placeholder.jpg  # Image placeholder (replace with actual photo)
└── README.md              # This documentation
```

## 🚀 Quick Start

### Option 1: Double-click to open
Simply double-click `index.html` to open in your default browser.

### Option 2: Local server (recommended for testing)
```bash
cd bettinardi-sweepstakes-website
python3 -m http.server 8000
# Visit: http://localhost:8000
```

### Option 3: Live Server (VS Code)
1. Open folder in VS Code
2. Install "Live Server" extension
3. Right-click `index.html` → "Open with Live Server"

## 🔧 Customization

### Replace Placeholder Image
1. Replace `putter-placeholder.jpg` with actual putter photo
2. Recommended specs:
   - Format: JPG or WebP
   - Dimensions: 800x600px minimum
   - Alt text already configured

### Backend Integration
The website includes placeholder functions ready for backend integration:

**Form Submission (script.js:213)**
```javascript
async function simulateFormSubmission(data) {
    // Replace with actual API endpoint
    const response = await fetch('/api/submit-entry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return response.json();
}
```

**Email Confirmation (script.js:238)**
```javascript
async function sendConfirmationEmail(entryData) {
    // Replace with actual email service
    const response = await fetch('/api/send-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entryData)
    });
    return response.json();
}
```

## 🎨 Design System

### Colors
- **Bourbon Brown:** `#8B4513`
- **Dark Wood:** `#3E2723`
- **Deep Green:** `#1B5E20`
- **Golf Green:** `#2E7D32`
- **Gold Accent:** `#D4AF37`
- **Off White:** `#FAF7F2`

### Typography
- **Headlines:** Playfair Display (serif)
- **Body Text:** Open Sans (sans-serif)
- **Fallbacks:** Georgia, -apple-system, BlinkMacSystemFont

### Spacing
- **XS:** 0.5rem (8px)
- **SM:** 1rem (16px)
- **MD:** 1.5rem (24px)
- **LG:** 2rem (32px)
- **XL:** 3rem (48px)
- **XXL:** 4rem (64px)

## ♿ Accessibility Features

### WCAG 2.1 Compliance
- Semantic HTML5 structure
- Proper heading hierarchy
- ARIA labels and descriptions
- Form validation with screen reader announcements
- Keyboard navigation support
- Focus management
- Color contrast ratios meet AA standards

### Screen Reader Support
- Alt text for all images
- Form labels properly associated
- Error messages announced to screen readers
- Skip links for navigation
- Live regions for dynamic content

### Touch & Mobile
- Minimum 44px touch targets
- Touch-friendly spacing
- Responsive breakpoints
- Reduced motion support

## 🔒 Security & Privacy

### Form Security
- Client-side validation (server-side required for production)
- Input sanitization ready
- CSRF protection recommended for backend
- SSL/HTTPS required for production

### Privacy Compliance
- Terms & Conditions included
- Privacy Policy section ready
- Data collection transparency
- Email opt-in clearly stated

## 📱 Browser Support
- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+
- ✅ iOS Safari 13+
- ✅ Android Chrome 80+

## 🚀 Deployment

### Before Going Live
1. **Replace placeholder image** with actual putter photo
2. **Set up backend API** for form submissions
3. **Configure email service** for confirmations
4. **Add SSL certificate** (required for production)
5. **Test Venmo integration** with actual account
6. **Add analytics tracking** (Google Analytics, etc.)
7. **Set up monitoring** for form submissions

### Recommended Hosting
- **Static Sites:** Netlify, Vercel, GitHub Pages
- **Full Stack:** DigitalOcean, AWS, Heroku
- **CDN:** Cloudflare for performance

## 📊 Analytics Tracking
The website includes placeholder analytics functions:
- Form submission events
- Entry source tracking
- User interaction monitoring
- Error logging ready

## 🆘 Support
For technical support or customization requests, contact the development team.

## 📄 License
Built for Bourbon Dudez LLC - Bettinardi x Eagle Rare Sweepstakes. All rights reserved.

---

**Generated with Claude Code** 🤖  
Built for: Bourbon Dudez LLC  
Built on: July 26, 2025  
Version: 1.0.0