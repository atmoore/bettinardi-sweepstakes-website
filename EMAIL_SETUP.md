# Email Notification Setup Guide

## Overview
The sweepstakes website is configured to send email notifications to `Bourbondudezsweepstakes@gmail.com` when users submit entries. Currently, the email functionality is implemented as placeholder code that logs email content to the console.

## Email Service Options

### Option 1: EmailJS (Recommended - Free)
**Best for:** Simple client-side email sending without backend

1. **Sign up** at [emailjs.com](https://www.emailjs.com)
2. **Create email service** (Gmail, Outlook, etc.)
3. **Create email template** for business notifications
4. **Get API keys** (User ID, Service ID, Template ID)
5. **Update JavaScript:**

```javascript
// Replace the sendBusinessNotification function with:
async function sendBusinessNotification(entryData) {
    try {
        const result = await emailjs.send(
            'YOUR_SERVICE_ID',
            'YOUR_TEMPLATE_ID',
            {
                to_email: 'Bourbondudezsweepstakes@gmail.com',
                from_name: entryData.fullName,
                from_email: entryData.email,
                phone: entryData.phone,
                address: entryData.address,
                hear_about: entryData.hearAbout || 'Not specified',
                timestamp: new Date(entryData.timestamp).toLocaleString()
            },
            'YOUR_USER_ID'
        );
        console.log('Email sent successfully:', result);
        return true;
    } catch (error) {
        console.error('Email sending failed:', error);
        return false;
    }
}
```

6. **Add EmailJS script** to HTML head:
```html
<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
<script>
    emailjs.init('YOUR_USER_ID');
</script>
```

### Option 2: Formspree (Paid but reliable)
**Best for:** Form handling with email notifications

1. **Sign up** at [formspree.io](https://formspree.io)
2. **Create form** and get endpoint URL
3. **Update form action** in HTML:
```html
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```

### Option 3: Netlify Forms (If hosting on Netlify)
**Best for:** Static site hosting with built-in form handling

1. **Add netlify attribute** to form:
```html
<form netlify name="sweepstakes-entry">
```

2. **Configure notifications** in Netlify dashboard

### Option 4: Custom Backend
**Best for:** Full control and advanced features

1. **Set up backend server** (Node.js, Python, PHP, etc.)
2. **Configure email service** (SendGrid, Mailgun, etc.)
3. **Update form submission** to POST to your backend

## Implementation Steps

1. **Choose email service** from options above
2. **Update JavaScript** in `script.js` (replace placeholder functions)
3. **Add required scripts/libraries** to HTML
4. **Test email functionality** with test entries
5. **Configure email templates** for professional appearance

## Email Template Content
The system will send emails containing:
- Participant name, email, phone
- Complete mailing address
- How they heard about the sweepstakes
- Submission timestamp
- Payment status reminders
- Next steps for processing entry

## Security Notes
- Never expose API keys in client-side code for production
- Use environment variables for sensitive data
- Consider rate limiting to prevent spam
- Validate all form data server-side

## Testing
1. **Console logging** - Currently implemented for testing
2. **Test email addresses** - Use your personal email first
3. **Form validation** - Ensure all validations work before email sending
4. **Error handling** - Test what happens when email service is down

## Support
For technical support with email integration:
- EmailJS: [docs.emailjs.com](https://www.emailjs.com/docs/)
- Formspree: [help.formspree.io](https://help.formspree.io/)
- Contact: Bourbondudezsweepstakes@gmail.com