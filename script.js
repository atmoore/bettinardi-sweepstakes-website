document.addEventListener('DOMContentLoaded', () => {
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

            return isFormValid;
        }

        // Real-time validation on blur
        sweepstakesForm.addEventListener('blur', (e) => {
            if (e.target.matches('input, select, textarea')) {
                validateField(e.target);
            }
        }, true);

        // Real-time validation for checkboxes on change
        sweepstakesForm.addEventListener('change', (e) => {
            if (e.target.type === 'checkbox') {
                validateField(e.target);
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
            
            // Add additional data for Formspree
            formData.append('_subject', 'New Sweepstakes Entry - Bettinardi x Eagle Rare Putter');
            formData.append('_replyto', formData.get('email'));
            formData.append('_next', window.location.href + '#success');
            formData.append('submissionTime', new Date().toLocaleString());
            formData.append('entryType', 'Free Entry (1 chance)');
            formData.append('paymentStatus', 'Pending - Monitor @BOURBONDUDEZ Venmo for $25 payment');

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

    console.log('Sweepstakes page initialized successfully');
});