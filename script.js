document.addEventListener('DOMContentLoaded', () => {
    // Initialize EmailJS
    emailjs.init("549w3Q_mmquktWtJd"); // EmailJS public key
    // Form validation patterns
    const validationPatterns = {
        // More comprehensive email validation
        email: /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
        // US phone number validation (various formats)
        phone: /^(?:\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/,
        name: /^[a-zA-Z\s\-'\.]{2,}$/
    };

    // Error messages
    const errorMessages = {
        required: 'This field is required.',
        email: 'Please enter a valid email address (e.g., name@example.com).',
        phone: 'Please enter a valid US phone number (e.g., (555) 123-4567 or 555-123-4567).',
        name: 'Please enter a valid name (letters only).',
        terms: 'You must agree to the terms and conditions.',
        address: 'Please enter a complete mailing address with street, city, state, and ZIP code.',
        addressFormat: 'Address must include street address, city, state, and ZIP code (e.g., "123 Main St, Chicago, IL 60601").'
    };

    // Address validation function
    function validateAddress(address) {
        const addressStr = address.trim();
        
        // Check minimum length
        if (addressStr.length < 15) {
            return false;
        }
        
        // Check for basic components: street number, street name, city, state, zip
        const patterns = {
            // Must have at least one number (street number)
            hasNumber: /\d+/,
            // Must have state abbreviation (2 letters) or full state name
            hasState: /\b(AL|AK|AZ|AR|CA|CO|CT|DE|FL|GA|HI|ID|IL|IN|IA|KS|KY|LA|ME|MD|MA|MI|MN|MS|MO|MT|NE|NV|NH|NJ|NM|NY|NC|ND|OH|OK|OR|PA|RI|SC|SD|TN|TX|UT|VT|VA|WA|WV|WI|WY|Alabama|Alaska|Arizona|Arkansas|California|Colorado|Connecticut|Delaware|Florida|Georgia|Hawaii|Idaho|Illinois|Indiana|Iowa|Kansas|Kentucky|Louisiana|Maine|Maryland|Massachusetts|Michigan|Minnesota|Mississippi|Missouri|Montana|Nebraska|Nevada|New Hampshire|New Jersey|New Mexico|New York|North Carolina|North Dakota|Ohio|Oklahoma|Oregon|Pennsylvania|Rhode Island|South Carolina|South Dakota|Tennessee|Texas|Utah|Vermont|Virginia|Washington|West Virginia|Wisconsin|Wyoming)\b/i,
            // Must have ZIP code (5 digits or 5+4 format)
            hasZip: /\b\d{5}(-\d{4})?\b/,
            // Should have common street indicators
            hasStreetIndicator: /\b(st|street|ave|avenue|rd|road|dr|drive|blvd|boulevard|ln|lane|ct|court|way|pl|place|pkwy|parkway|circle|cir)\b/i
        };
        
        // Check for required components
        if (!patterns.hasNumber.test(addressStr)) {
            return false; // No street number
        }
        
        if (!patterns.hasState.test(addressStr)) {
            return false; // No state
        }
        
        if (!patterns.hasZip.test(addressStr)) {
            return false; // No ZIP code
        }
        
        // Check for minimum word count (should have street, city, state, zip components)
        const words = addressStr.split(/\s+/).filter(word => word.length > 0);
        if (words.length < 4) {
            return false;
        }
        
        // Check for common separators (commas help indicate city/state separation)
        const hasCommas = (addressStr.match(/,/g) || []).length >= 1;
        
        // Additional validation: should have street indicator OR be long enough to likely include street name
        const hasStreetInfo = patterns.hasStreetIndicator.test(addressStr) || words.length >= 6;
        
        return hasCommas && hasStreetInfo;
    }

    // Enhanced phone number validation
    function validatePhoneNumber(phone) {
        const phoneStr = phone.trim();
        
        // Remove all non-digit characters for digit counting
        const digitsOnly = phoneStr.replace(/\D/g, '');
        
        // Must have exactly 10 digits (US) or 11 digits (with country code)
        if (digitsOnly.length !== 10 && digitsOnly.length !== 11) {
            return false;
        }
        
        // If 11 digits, must start with 1 (US country code)
        if (digitsOnly.length === 11 && !digitsOnly.startsWith('1')) {
            return false;
        }
        
        // Area code cannot start with 0 or 1
        const areaCode = digitsOnly.length === 11 ? digitsOnly.substring(1, 4) : digitsOnly.substring(0, 3);
        if (areaCode.startsWith('0') || areaCode.startsWith('1')) {
            return false;
        }
        
        // Exchange code (next 3 digits) cannot start with 0 or 1
        const exchangeCode = digitsOnly.length === 11 ? digitsOnly.substring(4, 7) : digitsOnly.substring(3, 6);
        if (exchangeCode.startsWith('0') || exchangeCode.startsWith('1')) {
            return false;
        }
        
        // Check for valid format patterns
        const validFormats = [
            /^(\+?1[-.\s]?)?\(?([2-9][0-9]{2})\)?[-.\s]?([2-9][0-9]{2})[-.\s]?([0-9]{4})$/,
            /^(\+?1[-.\s]?)?([2-9][0-9]{2})[-.\s]?([2-9][0-9]{2})[-.\s]?([0-9]{4})$/,
            /^(\+?1[-.\s]?)?([2-9][0-9]{2})([2-9][0-9]{2})([0-9]{4})$/
        ];
        
        return validFormats.some(pattern => pattern.test(phoneStr));
    }

    // Enhanced email validation
    function validateEmail(email) {
        const emailStr = email.trim().toLowerCase();
        
        // Basic format check
        if (!validationPatterns.email.test(emailStr)) {
            return false;
        }
        
        // Additional checks
        const [localPart, domain] = emailStr.split('@');
        
        // Local part checks
        if (localPart.length > 64) return false; // Max local part length
        if (localPart.startsWith('.') || localPart.endsWith('.')) return false;
        if (localPart.includes('..')) return false; // No consecutive dots
        
        // Domain checks
        if (domain.length > 253) return false; // Max domain length
        if (domain.startsWith('-') || domain.endsWith('-')) return false;
        if (domain.includes('..')) return false; // No consecutive dots
        
        // Must have valid TLD
        const parts = domain.split('.');
        const tld = parts[parts.length - 1];
        if (tld.length < 2 || tld.length > 6) return false;
        
        // Common domain validation
        const commonTlds = ['com', 'org', 'net', 'edu', 'gov', 'mil', 'int', 'info', 'biz', 'name', 'pro', 'aero', 'coop', 'museum'];
        const countryTlds = ['us', 'uk', 'ca', 'au', 'de', 'fr', 'jp', 'cn', 'br', 'mx', 'in', 'ru'];
        
        return /^[a-z]{2,6}$/.test(tld); // Only letters in TLD
    }

    // Get entry details based on selected type
    function getEntryDetails(entryType) {
        const entryTypes = {
            'paid-25': {
                totalEntries: '11 entries (10 + 1 bonus)',
                ticketNumbers: '11 unique 9-digit ticket numbers',
                paymentAmount: '$25',
                paymentStatus: 'Payment Required - Send $25 to @BOURBONDUDEZ',
                venmoNote: 'Venmo $25 to @BOURBONDUDEZ'
            },
            'paid-50': {
                totalEntries: '21 entries (20 + 1 bonus)',
                ticketNumbers: '21 unique 9-digit ticket numbers',
                paymentAmount: '$50',
                paymentStatus: 'Payment Required - Send $50 to @BOURBONDUDEZ',
                venmoNote: 'Venmo $50 to @BOURBONDUDEZ'
            },
            'paid-75': {
                totalEntries: '31 entries (30 + 1 bonus)',
                ticketNumbers: '31 unique 9-digit ticket numbers',
                paymentAmount: '$75',
                paymentStatus: 'Payment Required - Send $75 to @BOURBONDUDEZ',
                venmoNote: 'Venmo $75 to @BOURBONDUDEZ'
            },
            'paid-100': {
                totalEntries: '41 entries (40 + 1 bonus)',
                ticketNumbers: '41 unique 9-digit ticket numbers',
                paymentAmount: '$100',
                paymentStatus: 'Payment Required - Send $100 to @BOURBONDUDEZ',
                venmoNote: 'Venmo $100 to @BOURBONDUDEZ'
            },
            'free': {
                totalEntries: '1 bonus entry',
                ticketNumbers: '1 unique 9-digit ticket number',
                paymentAmount: 'Free',
                paymentStatus: 'No payment required - Entry confirmed',
                venmoNote: null
            }
        };
        
        return entryTypes[entryType] || entryTypes['free'];
    }

    // Update confirmation section based on entry type
    function updateConfirmationSection(entryType) {
        const details = getEntryDetails(entryType);
        const paymentInstructions = document.querySelector('.payment-instructions');
        
        if (entryType === 'free') {
            // Free entry - no payment needed
            paymentInstructions.innerHTML = `
                <p><strong>Entry Confirmed!</strong></p>
                <p>You have been entered with <strong>${details.totalEntries}</strong> in the drawing.</p>
                <p class="ticket-info">You will receive <strong>${details.ticketNumbers}</strong> via email within 24 hours.</p>
                <p class="payment-note"><em>No payment required. Your free bonus entry is confirmed and you're eligible for the September 30th drawing.</em></p>
            `;
        } else {
            // Paid entry - show payment instructions
            paymentInstructions.innerHTML = `
                <p>To complete your entry and receive <strong>${details.totalEntries}</strong>, please send <strong>${details.paymentAmount}</strong> via Venmo:</p>
                <div class="venmo-info">
                    <strong>@BOURBONDUDEZ</strong>
                    <div class="qr-code-container">
                        <img src="venmo-qr-clean.png" alt="Venmo QR Code for @BourbonDudez - Scan to pay ${details.paymentAmount} for sweepstakes entries" class="venmo-qr-code">
                        <p class="qr-instruction">Scan QR code with your phone's camera or Venmo app</p>
                    </div>
                    <a href="https://venmo.com/BOURBONDUDEZ" class="venmo-btn" target="_blank" rel="noopener noreferrer">
                        Pay ${details.paymentAmount} on Venmo
                    </a>
                </div>
                <p class="ticket-info">After payment, you will receive <strong>${details.ticketNumbers}</strong> via email within 24 hours.</p>
                <p class="payment-note"><em>Payment must be completed to receive your full ${details.totalEntries}. Your 1 bonus entry is already confirmed.</em></p>
            `;
        }
    }

    // Function to check for duplicate free entries
    function checkDuplicateFreeEntry(email) {
        if (!email) return false;
        const FREE_ENTRIES_KEY = 'sweepstakes-free-entries';
        const existingFreeEntries = JSON.parse(localStorage.getItem(FREE_ENTRIES_KEY) || '[]');
        return existingFreeEntries.includes(email.trim().toLowerCase());
    }

    // Function to check and display duplicate warning
    function checkAndDisplayDuplicateWarning(email, entryTypeField) {
        if (checkDuplicateFreeEntry(email)) {
            const errorElement = document.getElementById('entryType-error');
            errorElement.textContent = 'This email address has already been used for a free entry. Only one free entry per person is allowed.';
            entryTypeField.classList.add('error');
            return true;
        } else {
            const errorElement = document.getElementById('entryType-error');
            if (errorElement.textContent.includes('already been used for a free entry')) {
                errorElement.textContent = '';
                entryTypeField.classList.remove('error');
            }
            return false;
        }
    }

    // Main sweepstakes form
    const sweepstakesForm = document.getElementById('sweepstakes-form');
    const confirmationSection = document.getElementById('confirmation');

    if (sweepstakesForm) {
        // Form validation function
        function validateField(field) {
            const fieldName = field.name;
            const fieldValue = field.value.trim();
            const errorElement = document.getElementById(`${fieldName}-error`);
            let isValid = true;
            let errorMessage = '';

            // Clear previous error
            errorElement.textContent = '';
            field.classList.remove('error');

            // Required field validation
            if (field.required && !fieldValue) {
                isValid = false;
                errorMessage = errorMessages.required;
            }
            // Enhanced email validation
            else if (fieldName === 'email' && fieldValue) {
                if (!validateEmail(fieldValue)) {
                    isValid = false;
                    errorMessage = errorMessages.email;
                }
            }
            // Enhanced phone validation
            else if (fieldName === 'phone' && fieldValue) {
                if (!validatePhoneNumber(fieldValue)) {
                    isValid = false;
                    errorMessage = errorMessages.phone;
                }
            }
            // Name validation
            else if (fieldName === 'fullName' && fieldValue && !validationPatterns.name.test(fieldValue)) {
                isValid = false;
                errorMessage = errorMessages.name;
            }
            // Enhanced address validation
            else if (fieldName === 'address' && fieldValue) {
                if (!validateAddress(fieldValue)) {
                    isValid = false;
                    errorMessage = errorMessages.addressFormat;
                }
            }
            // Terms checkbox validation
            else if (fieldName === 'terms' && field.type === 'checkbox' && !field.checked) {
                isValid = false;
                errorMessage = errorMessages.terms;
            }

            if (!isValid) {
                errorElement.textContent = errorMessage;
                field.classList.add('error');
                // Announce error to screen readers
                errorElement.setAttribute('aria-live', 'polite');
            }

            return isValid;
        }

        // Validate all form fields
        function validateForm() {
            const formFields = sweepstakesForm.querySelectorAll('input[required], select[required], textarea[required]');
            let isFormValid = true;

            formFields.forEach(field => {
                if (!validateField(field)) {
                    isFormValid = false;
                }
            });

            // Additional validation for free entry duplicates
            const entryTypeField = sweepstakesForm.querySelector('select[name="entryType"]');
            const emailField = sweepstakesForm.querySelector('input[name="email"]');
            
            if (entryTypeField && emailField && entryTypeField.value === 'free') {
                if (checkAndDisplayDuplicateWarning(emailField.value, entryTypeField)) {
                    isFormValid = false;
                }
            }

            return isFormValid;
        }

        // Real-time validation on blur
        sweepstakesForm.addEventListener('blur', (e) => {
            if (e.target.matches('input, select, textarea')) {
                validateField(e.target);
                
                // Check for duplicate free entries when email field loses focus
                if (e.target.name === 'email') {
                    const entryTypeField = sweepstakesForm.querySelector('select[name="entryType"]');
                    if (entryTypeField && entryTypeField.value === 'free') {
                        checkAndDisplayDuplicateWarning(e.target.value, entryTypeField);
                    }
                }
            }
        }, true);

        // Real-time validation for checkboxes and entry type changes
        sweepstakesForm.addEventListener('change', (e) => {
            if (e.target.type === 'checkbox') {
                validateField(e.target);
            }
            
            // Check for duplicate free entries when entry type changes
            if (e.target.name === 'entryType' && e.target.value === 'free') {
                const emailField = sweepstakesForm.querySelector('input[name="email"]');
                if (emailField && emailField.value) {
                    checkAndDisplayDuplicateWarning(emailField.value, e.target);
                }
            }
        });

        // Form submission handler
        sweepstakesForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Validate entire form
            if (!validateForm()) {
                // Focus on first error field
                const firstError = sweepstakesForm.querySelector('.error');
                if (firstError) {
                    firstError.focus();
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                return;
            }

            // Collect form data
            const formData = new FormData(sweepstakesForm);
            const selectedEntryType = formData.get('entryType');
            const userEmail = formData.get('email').trim().toLowerCase();

            // Check for duplicate free entries
            if (selectedEntryType === 'free') {
                const FREE_ENTRIES_KEY = 'sweepstakes-free-entries';
                const existingFreeEntries = JSON.parse(localStorage.getItem(FREE_ENTRIES_KEY) || '[]');
                
                if (existingFreeEntries.includes(userEmail)) {
                    // Show error message and scroll to entry type field
                    const entryTypeField = sweepstakesForm.querySelector('select[name="entryType"]');
                    checkAndDisplayDuplicateWarning(userEmail, entryTypeField);
                    entryTypeField.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    entryTypeField.focus();
                    return;
                }
                
                // Add email to free entries list
                existingFreeEntries.push(userEmail);
                localStorage.setItem(FREE_ENTRIES_KEY, JSON.stringify(existingFreeEntries));
            }
            
            // Determine entry details based on selection
            const entryDetails = getEntryDetails(selectedEntryType);
            
            // Add additional data for Formspree
            formData.append('_subject', 'New Sweepstakes Entry - Bettinardi x Eagle Rare Putter');
            formData.append('_replyto', formData.get('email'));
            formData.append('_next', window.location.href + '#success');
            formData.append('submissionTime', new Date().toLocaleString());
            formData.append('totalEntries', entryDetails.totalEntries);
            formData.append('paymentAmount', entryDetails.paymentAmount);
            formData.append('paymentStatus', entryDetails.paymentStatus);

            try {
                // Submit to Formspree
                const response = await fetch(sweepstakesForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    // Send autoresponse email via EmailJS
                    const autoresponseSuccess = await sendAutoresponse(
                        formData.get('email'),
                        formData.get('fullName'),
                        selectedEntryType,
                        entryDetails
                    );

                    if (!autoresponseSuccess) {
                        console.warn('Autoresponse email failed to send, but form submission was successful');
                    }

                    // Update confirmation section based on entry type
                    updateConfirmationSection(selectedEntryType);
                    
                    // Hide form and show confirmation
                    sweepstakesForm.style.display = 'none';
                    confirmationSection.style.display = 'block';
                    confirmationSection.scrollIntoView({ behavior: 'smooth' });
                    
                    // Focus on confirmation heading for screen readers
                    const confirmationHeading = document.getElementById('confirmation-heading');
                    confirmationHeading.focus();

                    // Track analytics (placeholder)
                    trackFormSubmission({
                        fullName: formData.get('fullName'),
                        email: formData.get('email'),
                        hearAbout: formData.get('hearAbout'),
                        entryType: selectedEntryType,
                        totalEntries: entryDetails.totalEntries,
                        paymentAmount: entryDetails.paymentAmount,
                        timestamp: new Date().toISOString()
                    });
                    
                } else {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Submission failed');
                }
            } catch (error) {
                console.error('Form submission error:', error);
                alert('There was an error submitting your entry. Please try again.');
            }
        });
    }



    // EmailJS autoresponse function  
    async function sendAutoresponse(userEmail, userName, entryType, entryDetails) {
        console.log('EmailJS: Starting autoresponse function');
        console.log('EmailJS: User email:', userEmail);
        console.log('EmailJS: User name:', userName);
        console.log('EmailJS: Entry type:', entryType);
        
        // Match exactly with form field names and EmailJS template variables
        const emailParams = {
            // User info (matching form fields)
            email: userEmail,                    // Form field: name="email"
            fullName: userName,                  // Form field: name="fullName"  
            to_email: userEmail,                 // For EmailJS recipient
            name: userName,                      // For EmailJS template {{name}}
            
            // Entry details  
            entryType: entryType,               // Form field: name="entryType"
            entry_type: entryType === 'free' ? 'Free Entry' : `Paid Entry (${entryDetails.paymentAmount})`,
            total_entries: entryDetails.totalEntries,
            payment_amount: entryDetails.paymentAmount,
            payment_status: entryDetails.paymentStatus,
            
            // Static info
            drawing_date: 'September 30th, 2025',
            company_name: 'Bourbon Dudez LLC',
            company_email: 'bourborndudezsweepstakes@gmail.com',
            
            // Additional form fields for completeness
            sweepstakes: 'Bettinardi x Eagle Rare Limited Edition Putter #22 of 24',
            prize_value: '$1,250'
        };

        console.log('EmailJS: Email parameters:', emailParams);

        try {
            console.log('EmailJS: Attempting to send email...');
            const response = await emailjs.send(
                'service_ld8ahu9', // EmailJS service ID
                'template_5d64ia9', // EmailJS template ID
                emailParams
            );
            console.log('EmailJS: Autoresponse sent successfully:', response);
            return true;
        } catch (error) {
            console.error('EmailJS: Failed to send autoresponse:', error);
            console.error('EmailJS: Error details:', error);
            return false;
        }
    }

    // Analytics tracking (placeholder)
    function trackFormSubmission(data) {
        // In a real implementation, this would send data to your analytics service
        console.log('Tracking form submission:', {
            event: 'sweepstakes_entry',
            timestamp: data.timestamp,
            source: data.hearAbout || 'unknown'
        });
    }

    // Smooth scrolling for anchor links
    document.addEventListener('click', (e) => {
        if (e.target.matches('a[href^="#"]')) {
            e.preventDefault();
            const targetId = e.target.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update focus for screen readers
                targetElement.setAttribute('tabindex', '-1');
                targetElement.focus();
            }
        }
    });

    // Enhanced keyboard navigation
    document.addEventListener('keydown', (e) => {
        // Skip to main content with Alt+M (common screen reader shortcut)
        if (e.altKey && e.key.toLowerCase() === 'm') {
            e.preventDefault();
            const mainContent = document.querySelector('main') || document.querySelector('[role="main"]');
            if (mainContent) {
                mainContent.setAttribute('tabindex', '-1');
                mainContent.focus();
            }
        }
    });

    // Touch device enhancements
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        // Add touch-friendly spacing to interactive elements
        const interactiveElements = document.querySelectorAll('button, input, select, textarea, a');
        interactiveElements.forEach(element => {
            if (element.offsetHeight < 44) {
                element.style.minHeight = '44px';
            }
            if (element.offsetWidth < 44 && element.offsetWidth > 0) {
                element.style.minWidth = '44px';
            }
        });

        // Prevent double-tap zoom on buttons
        const buttons = document.querySelectorAll('button, input[type="submit"], input[type="button"]');
        buttons.forEach(button => {
            button.addEventListener('touchend', (e) => {
                e.preventDefault();
                button.click();
            });
        });
    }

    // Handle reduced motion preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
        // Remove animations and transitions for users who prefer reduced motion
        const style = document.createElement('style');
        style.textContent = `
            *, *::before, *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
                scroll-behavior: auto !important;
            }
        `;
        document.head.appendChild(style);
    }

    // Focus management for modals and dynamic content
    let previousFocusElement = null;

    function trapFocus(element) {
        const focusableElements = element.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstFocusableElement = focusableElements[0];
        const lastFocusableElement = focusableElements[focusableElements.length - 1];

        element.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusableElement) {
                        lastFocusableElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastFocusableElement) {
                        firstFocusableElement.focus();
                        e.preventDefault();
                    }
                }
            }
            if (e.key === 'Escape') {
                // Handle escape key if needed
                restoreFocus();
            }
        });
    }

    function restoreFocus() {
        if (previousFocusElement) {
            previousFocusElement.focus();
            previousFocusElement = null;
        }
    }

    // Initialize focus trapping for confirmation section when it becomes visible
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                const target = mutation.target;
                if (target.id === 'confirmation' && target.style.display !== 'none') {
                    trapFocus(target);
                }
            }
        });
    });

    if (confirmationSection) {
        observer.observe(confirmationSection, { attributes: true });
    }

    // Form field enhancements
    const formInputs = document.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
        // Add visual feedback for focus
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', () => {
            input.parentElement.classList.remove('focused');
        });

        // Announce changes to screen readers
        if (input.type === 'checkbox' || input.type === 'radio') {
            input.addEventListener('change', () => {
                const label = document.querySelector(`label[for="${input.id}"]`);
                if (label) {
                    const announcement = input.checked ? 'checked' : 'unchecked';
                    const sr = document.createElement('div');
                    sr.className = 'sr-only';
                    sr.setAttribute('aria-live', 'polite');
                    sr.textContent = `${label.textContent} ${announcement}`;
                    document.body.appendChild(sr);
                    setTimeout(() => sr.remove(), 1000);
                }
            });
        }
    });

    // Auto-save form data to localStorage (optional enhancement)
    if (sweepstakesForm) {
        const FORM_DATA_KEY = 'sweepstakes-form-data';
        
        // Load saved data on page load
        const savedData = localStorage.getItem(FORM_DATA_KEY);
        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                Object.keys(data).forEach(key => {
                    const field = sweepstakesForm.querySelector(`[name="${key}"]`);
                    if (field && field.type !== 'checkbox') {
                        field.value = data[key];
                    } else if (field && field.type === 'checkbox') {
                        field.checked = data[key];
                    }
                });
            } catch (e) {
                console.log('Error loading saved form data:', e);
            }
        }

        // Save data on input
        sweepstakesForm.addEventListener('input', () => {
            const formData = new FormData(sweepstakesForm);
            const data = {};
            for (let [key, value] of formData.entries()) {
                data[key] = value;
            }
            localStorage.setItem(FORM_DATA_KEY, JSON.stringify(data));
        });

        // Clear saved data on successful submission
        sweepstakesForm.addEventListener('submit', (e) => {
            if (!e.defaultPrevented) {
                localStorage.removeItem(FORM_DATA_KEY);
            }
        });
    }

    // Image gallery functionality
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.getElementById('main-putter-image');

    if (thumbnails.length > 0 && mainImage) {
        thumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('click', () => {
                // Remove active class from all thumbnails
                thumbnails.forEach(t => t.classList.remove('active'));
                
                // Add active class to clicked thumbnail
                thumbnail.classList.add('active');
                
                // Update main image
                const newImageSrc = thumbnail.dataset.image;
                const newImageAlt = thumbnail.dataset.alt;
                
                // Fade effect for image transition
                mainImage.style.opacity = '0.5';
                
                setTimeout(() => {
                    mainImage.src = newImageSrc;
                    mainImage.alt = newImageAlt;
                    mainImage.style.opacity = '1';
                }, 150);
                
                // Announce change to screen readers
                const announcement = document.createElement('div');
                announcement.className = 'sr-only';
                announcement.setAttribute('aria-live', 'polite');
                announcement.textContent = `Image changed to: ${newImageAlt}`;
                document.body.appendChild(announcement);
                setTimeout(() => announcement.remove(), 1000);
            });

            // Keyboard navigation for thumbnails
            thumbnail.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    thumbnail.click();
                }
            });
        });
    }

    // Terms & Conditions Modal functionality
    const termsModal = document.getElementById('terms-modal');
    const termsLink = document.getElementById('terms-link'); // Form terms link
    const infoTermsLink = document.getElementById('info-terms-link'); // Info terms link
    const termsCheckbox = document.getElementById('terms');
    const termsStatus = document.getElementById('terms-status');
    const acceptTermsBtn = document.getElementById('accept-terms');
    const modalCloseButtons = document.querySelectorAll('.modal-close');
    const modalFooter = document.getElementById('modal-footer');
    const modalFooterInfo = document.getElementById('modal-footer-info');
    
    let termsAccepted = false;
    let modalContext = 'form'; // 'form' or 'info'

    // Open modal when form Terms & Conditions link is clicked (requires acceptance)
    if (termsLink) {
        termsLink.addEventListener('click', (e) => {
            e.preventDefault();
            modalContext = 'form';
            openTermsModal();
        });
    }

    // Open modal when info Terms & Conditions link is clicked (info only)
    if (infoTermsLink) {
        infoTermsLink.addEventListener('click', (e) => {
            e.preventDefault();
            modalContext = 'info';
            openTermsModal();
        });
    }

    // Close modal functionality
    modalCloseButtons.forEach(button => {
        button.addEventListener('click', closeTermsModal);
    });

    // Close modal when clicking outside
    if (termsModal) {
        termsModal.addEventListener('click', (e) => {
            if (e.target === termsModal) {
                closeTermsModal();
            }
        });
    }

    // Accept terms functionality
    if (acceptTermsBtn) {
        acceptTermsBtn.addEventListener('click', () => {
            termsAccepted = true;
            termsCheckbox.disabled = false;
            termsCheckbox.checked = true;
            termsStatus.textContent = 'Terms & Conditions accepted - You may now enter the sweepstakes';
            termsStatus.classList.add('terms-accepted');
            closeTermsModal();
            
            // Trigger change event for validation
            termsCheckbox.dispatchEvent(new Event('change'));
        });
    }

    // Escape key to close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && termsModal.style.display === 'flex') {
            closeTermsModal();
        }
    });

    function openTermsModal() {
        termsModal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
        
        // Show appropriate footer based on context
        if (modalContext === 'form') {
            modalFooter.style.display = 'flex';
            modalFooterInfo.style.display = 'none';
        } else {
            modalFooter.style.display = 'none';
            modalFooterInfo.style.display = 'flex';
        }
        
        // Focus on the modal for screen readers
        const modalContent = termsModal.querySelector('.modal-content');
        modalContent.focus();
        
        // Trap focus within modal
        trapFocus(modalContent);
    }

    function closeTermsModal() {
        termsModal.style.display = 'none';
        document.body.style.overflow = ''; // Restore scrolling
        
        // Return focus to the appropriate link based on context
        if (modalContext === 'form' && termsLink) {
            termsLink.focus();
        } else if (modalContext === 'info' && infoTermsLink) {
            infoTermsLink.focus();
        }
    }

    // Enhanced form validation to check if terms are accepted
    const originalValidateField = window.validateField || validateField;
    
    // Update the validateField function to handle terms requirement
    function validateFieldWithTerms(field) {
        if (field.name === 'terms') {
            const errorElement = document.getElementById('terms-error');
            
            if (!termsAccepted || !field.checked) {
                errorElement.textContent = 'You must read and accept the Terms & Conditions before entering.';
                field.classList.add('error');
                return false;
            } else {
                errorElement.textContent = '';
                field.classList.remove('error');
                return true;
            }
        }
        
        // For other fields, use the original validation logic
        return originalValidateField ? originalValidateField(field) : validateField(field);
    }

    // Override the validateField function
    if (typeof validateField !== 'undefined') {
        const originalFunction = validateField;
        validateField = function(field) {
            if (field.name === 'terms') {
                return validateFieldWithTerms(field);
            }
            return originalFunction(field);
        };
    }

    // Prevent form submission if terms not accepted
    if (sweepstakesForm) {
        sweepstakesForm.addEventListener('submit', (e) => {
            if (!termsAccepted || !termsCheckbox.checked) {
                e.preventDefault();
                const termsError = document.getElementById('terms-error');
                termsError.textContent = 'You must read and accept the Terms & Conditions before entering.';
                termsCheckbox.classList.add('error');
                
                // Scroll to and focus on terms section
                termsCheckbox.scrollIntoView({ behavior: 'smooth', block: 'center' });
                termsLink.focus();
                
                return false;
            }
        });
    }

    // Add responsive modal behavior
    function handleModalResize() {
        if (termsModal && termsModal.style.display === 'flex') {
            const modalContent = termsModal.querySelector('.modal-content');
            const windowHeight = window.innerHeight;
            const modalHeight = modalContent.offsetHeight;
            
            if (modalHeight > windowHeight * 0.9) {
                modalContent.style.maxHeight = '90vh';
            }
        }
    }

    window.addEventListener('resize', handleModalResize);

    console.log('Sweepstakes page initialized successfully');
});