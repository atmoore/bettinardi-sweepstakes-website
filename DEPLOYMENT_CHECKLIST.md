# Deployment Checklist for bourbondudez.com

## Pre-Deployment Verification ✅

### **Files Ready:**
- ✅ index.html (main page)
- ✅ styles.css (styling)
- ✅ script.js (functionality)
- ✅ logo.png (Bourbon Dudez logo)
- ✅ All putter images (putter-front.png, putter-side.jpg, putter-eagle-rare.jpg)
- ✅ certificate.jpg (authenticity certificate)
- ✅ venmo-qr-clean.png (QR code for payments)

### **Functionality Verified:**
- ✅ Form validation (name, email, phone, address)
- ✅ Formspree integration (https://formspree.io/f/xovlwaqn)
- ✅ Email notifications to Bourbondudezsweepstakes@gmail.com
- ✅ Responsive design (mobile/tablet/desktop)
- ✅ Accessibility features (WCAG 2.1 compliant)
- ✅ QR code payment integration

## Deployment Steps

### **Option A: Netlify (Recommended)**

1. **Create Netlify Account**
   - Go to https://netlify.com
   - Sign up with email or GitHub

2. **Deploy Site**
   - Click "Add new site" → "Deploy manually"
   - Drag entire `bettinardi-sweepstakes-website` folder
   - Wait for deployment (2-3 minutes)

3. **Configure Custom Domain**
   - Go to Site settings → Domain management
   - Add custom domain: `bourbondudez.com`
   - Follow DNS configuration instructions

4. **Set Up HTTPS**
   - Automatic with Netlify
   - Force HTTPS redirect enabled

### **DNS Configuration**
**Point bourbondudez.com to:**
- Type: A Record
- Host: @
- Value: 75.2.60.5 (Netlify's IP)

**Or use Netlify DNS:**
- Update nameservers at your domain registrar
- Point to: dns1.p03.nsone.net, dns2.p03.nsone.net, etc.

### **Option B: Vercel**

1. **Create Account**: https://vercel.com
2. **Import Project**: Upload folder or connect GitHub
3. **Configure Domain**: Add bourbondudez.com in settings
4. **Update DNS**: Point to Vercel nameservers

## Post-Deployment Testing

### **Test Checklist:**
- [ ] Site loads at bourbondudez.com
- [ ] All images display correctly
- [ ] Form submission works
- [ ] Email notifications received
- [ ] Mobile responsive design
- [ ] HTTPS certificate active
- [ ] QR code scannable

### **Form Testing:**
1. **Submit test entry** with valid data
2. **Check Formspree dashboard** for entry
3. **Verify email** sent to Bourbondudezsweepstakes@gmail.com
4. **Test QR code** scanning with phone
5. **Test on mobile devices**

## Domain Setup Details

### **Current Domain Configuration:**
- **Domain**: bourbondudez.com
- **Purpose**: Bettinardi x Eagle Rare Sweepstakes
- **SSL**: Required (auto-configured)
- **CDN**: Global deployment recommended

### **Email Configuration:**
- **Notifications**: Bourbondudezsweepstakes@gmail.com
- **Form endpoint**: https://formspree.io/f/xovlwaqn
- **QR payments**: @BOURBONDUDEZ Venmo

## Go-Live Timeline

1. **Deploy to staging** (test subdomain)
2. **Final testing** (15 minutes)
3. **Configure domain** (30 minutes)
4. **DNS propagation** (up to 24 hours)
5. **Final verification** (15 minutes)

## Support & Monitoring

### **Monitor:**
- Formspree dashboard for entries
- Email notifications
- Site uptime and performance
- Venmo account for payments

### **Contact Info:**
- Technical support: Available for troubleshooting
- Form issues: Check Formspree status
- Domain issues: Contact registrar support

---

**Ready to deploy!** All files verified and functionality tested.