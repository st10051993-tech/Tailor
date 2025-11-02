// Toast Notification System
function showToast(title, message, type = 'info') {
    // Remove existing toasts
    const existingToasts = document.querySelectorAll('.toast');
    existingToasts.forEach(toast => toast.remove());

    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const iconMap = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        info: 'fa-info-circle'
    };

    toast.innerHTML = `
        <div class="toast-icon">
            <i class="fas ${iconMap[type]}"></i>
        </div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;

    document.body.appendChild(toast);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (toast.parentElement) {
            toast.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => toast.remove(), 300);
        }
    }, 5000);
}

// Email validation
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Password strength checker
function checkPasswordStrength(password) {
    let strength = 0;
    
    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength <= 2) return 'weak';
    if (strength <= 4) return 'medium';
    return 'strong';
}

// Show/hide password toggle
function setupPasswordToggle(toggleId, inputId) {
    const toggle = document.getElementById(toggleId);
    const input = document.getElementById(inputId);
    
    if (toggle && input) {
        toggle.addEventListener('click', function() {
            const type = input.type === 'password' ? 'text' : 'password';
            input.type = type;
            
            const icon = this.querySelector('i');
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        });
    }
}

// Form field validation
function validateField(input, errorElement, validationFn, errorMessage) {
    const value = input.value.trim();
    const isValid = validationFn(value);
    
    if (!isValid) {
        input.classList.add('error');
        input.classList.remove('success');
        errorElement.textContent = errorMessage;
        errorElement.classList.add('show');
        return false;
    } else {
        input.classList.remove('error');
        input.classList.add('success');
        errorElement.classList.remove('show');
        return true;
    }
}

// Clear field validation
function clearFieldValidation(input, errorElement) {
    input.classList.remove('error', 'success');
    errorElement.classList.remove('show');
}

// LOGIN PAGE FUNCTIONALITY
if (document.getElementById('loginForm')) {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const loginBtn = document.getElementById('loginBtn');

    // Setup password toggle
    setupPasswordToggle('togglePassword', 'password');

    // Real-time validation
    emailInput.addEventListener('blur', function() {
        validateField(
            this, 
            emailError, 
            validateEmail, 
            'Please enter a valid email address'
        );
    });

    emailInput.addEventListener('input', function() {
        if (this.classList.contains('error')) {
            clearFieldValidation(this, emailError);
        }
    });

    passwordInput.addEventListener('blur', function() {
        validateField(
            this, 
            passwordError, 
            (val) => val.length >= 6, 
            'Password must be at least 6 characters'
        );
    });

    passwordInput.addEventListener('input', function() {
        if (this.classList.contains('error')) {
            clearFieldValidation(this, passwordError);
        }
    });

    // Form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        // Validate all fields
        const isEmailValid = validateField(
            emailInput, 
            emailError, 
            validateEmail, 
            'Please enter a valid email address'
        );

        const isPasswordValid = validateField(
            passwordInput, 
            passwordError, 
            (val) => val.length >= 6, 
            'Password must be at least 6 characters'
        );

        if (!isEmailValid || !isPasswordValid) {
            showToast('Validation Error', 'Please fix the errors in the form', 'error');
            return;
        }

        // Disable button during processing
        loginBtn.disabled = true;
        loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...';

        // Simulate API call
        setTimeout(() => {
            // Get stored users from localStorage
            const users = JSON.parse(localStorage.getItem('tailorProUsers') || '[]');
            const user = users.find(u => u.email === email && u.password === password);

            if (user) {
                // Login successful
                showToast('Success!', 'Login successful. Redirecting...', 'success');
                
                // Store logged in user
                localStorage.setItem('tailorProCurrentUser', JSON.stringify({
                    email: user.email,
                    fullName: user.fullName,
                    loginTime: new Date().toISOString()
                }));

                // Redirect to dashboard
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            } else {
                // Login failed
                showToast('Login Failed', 'Invalid email or password', 'error');
                loginBtn.disabled = false;
                loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Sign In';
            }
        }, 1000);
    });
}

// REGISTRATION PAGE FUNCTIONALITY
if (document.getElementById('registerForm')) {
    const registerForm = document.getElementById('registerForm');
    const fullNameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const termsCheckbox = document.getElementById('terms');
    
    const fullNameError = document.getElementById('fullNameError');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const confirmPasswordError = document.getElementById('confirmPasswordError');
    
    const passwordStrength = document.getElementById('passwordStrength');
    const strengthFill = document.getElementById('strengthFill');
    const strengthText = document.getElementById('strengthText');
    const registerBtn = document.getElementById('registerBtn');

    // Setup password toggles
    setupPasswordToggle('togglePassword', 'password');
    setupPasswordToggle('toggleConfirmPassword', 'confirmPassword');

    // Full name validation
    fullNameInput.addEventListener('blur', function() {
        validateField(
            this, 
            fullNameError, 
            (val) => val.length >= 3, 
            'Please enter your full name (at least 3 characters)'
        );
    });

    fullNameInput.addEventListener('input', function() {
        if (this.classList.contains('error')) {
            clearFieldValidation(this, fullNameError);
        }
    });

    // Email validation
    emailInput.addEventListener('blur', function() {
        validateField(
            this, 
            emailError, 
            validateEmail, 
            'Please enter a valid email address'
        );
    });

    emailInput.addEventListener('input', function() {
        if (this.classList.contains('error')) {
            clearFieldValidation(this, emailError);
        }
    });

    // Password validation with strength indicator
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        
        if (password.length > 0) {
            passwordStrength.classList.add('show');
            const strength = checkPasswordStrength(password);
            
            strengthFill.className = 'strength-fill ' + strength;
            
            const strengthMessages = {
                weak: 'Weak password',
                medium: 'Medium password',
                strong: 'Strong password'
            };
            
            strengthText.textContent = strengthMessages[strength];
        } else {
            passwordStrength.classList.remove('show');
        }

        if (this.classList.contains('error')) {
            clearFieldValidation(this, passwordError);
        }

        // Revalidate confirm password if it has a value
        if (confirmPasswordInput.value) {
            validateField(
                confirmPasswordInput,
                confirmPasswordError,
                (val) => val === passwordInput.value,
                'Passwords do not match'
            );
        }
    });

    passwordInput.addEventListener('blur', function() {
        validateField(
            this, 
            passwordError, 
            (val) => val.length >= 6, 
            'Password must be at least 6 characters'
        );
    });

    // Confirm password validation
    confirmPasswordInput.addEventListener('blur', function() {
        validateField(
            this, 
            confirmPasswordError, 
            (val) => val === passwordInput.value, 
            'Passwords do not match'
        );
    });

    confirmPasswordInput.addEventListener('input', function() {
        if (this.classList.contains('error')) {
            clearFieldValidation(this, confirmPasswordError);
        }
    });

    // Form submission
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const fullName = fullNameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();
        const termsAccepted = termsCheckbox.checked;

        // Validate all fields
        const isFullNameValid = validateField(
            fullNameInput, 
            fullNameError, 
            (val) => val.length >= 3, 
            'Please enter your full name (at least 3 characters)'
        );

        const isEmailValid = validateField(
            emailInput, 
            emailError, 
            validateEmail, 
            'Please enter a valid email address'
        );

        const isPasswordValid = validateField(
            passwordInput, 
            passwordError, 
            (val) => val.length >= 6, 
            'Password must be at least 6 characters'
        );

        const isConfirmPasswordValid = validateField(
            confirmPasswordInput, 
            confirmPasswordError, 
            (val) => val === password, 
            'Passwords do not match'
        );

        if (!termsAccepted) {
            showToast('Terms Required', 'Please accept the Terms of Service and Privacy Policy', 'error');
            return;
        }

        if (!isFullNameValid || !isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
            showToast('Validation Error', 'Please fix the errors in the form', 'error');
            return;
        }

        // Disable button during processing
        registerBtn.disabled = true;
        registerBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';

        // Simulate API call
        setTimeout(() => {
            // Get existing users
            const users = JSON.parse(localStorage.getItem('tailorProUsers') || '[]');
            
            // Check if email already exists
            if (users.some(u => u.email === email)) {
                showToast('Registration Failed', 'An account with this email already exists', 'error');
                registerBtn.disabled = false;
                registerBtn.innerHTML = '<i class="fas fa-user-plus"></i> Create Account';
                return;
            }

            // Add new user
            users.push({
                fullName: fullName,
                email: email,
                password: password, // In production, this should be hashed
                registeredAt: new Date().toISOString()
            });

            // Save to localStorage
            localStorage.setItem('tailorProUsers', JSON.stringify(users));

            // Registration successful
            showToast('Success!', 'Account created successfully. Redirecting to login...', 'success');

            // Redirect to login page
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
        }, 1000);
    });
}

// Check authentication on protected pages
function checkAuth() {
    const currentUser = localStorage.getItem('tailorProCurrentUser');
    const currentPage = window.location.pathname;
    
    // If on index.html and not logged in, redirect to login
    if (currentPage.includes('index.html') && !currentUser) {
        window.location.href = 'login.html';
    }
    
    // If on login/register and already logged in, redirect to dashboard
    if ((currentPage.includes('login.html') || currentPage.includes('register.html')) && currentUser) {
        window.location.href = 'index.html';
    }
    
    // Update user name in dashboard if logged in
    if (currentUser && currentPage.includes('index.html')) {
        const user = JSON.parse(currentUser);
        const userNameElement = document.getElementById('userName');
        if (userNameElement) {
            userNameElement.textContent = user.fullName;
        }
    }
}

// Logout function
function logout() {
    // Show custom logout modal
    const modal = document.getElementById('logoutModal');
    if (modal) {
        modal.classList.add('active');
    }
}

// Confirm logout
function confirmLogout() {
    // Clear current user
    localStorage.removeItem('tailorProCurrentUser');
    
    // Hide modal
    const modal = document.getElementById('logoutModal');
    if (modal) {
        modal.classList.remove('active');
    }
    
    // Show toast
    showToast('Logged Out', 'You have been successfully logged out', 'success');
    
    // Redirect to login
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1000);
}

// Cancel logout
function cancelLogout() {
    const modal = document.getElementById('logoutModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// Initialize default test account
function initializeDefaultAccount() {
    const users = JSON.parse(localStorage.getItem('tailorProUsers') || '[]');
    
    // Check if default account already exists
    const defaultExists = users.some(u => u.email === 'admin@tailorpro.com');
    
    if (!defaultExists) {
        // Add default test account
        users.push({
            fullName: 'Admin User',
            email: 'admin@tailorpro.com',
            password: 'admin123',
            registeredAt: new Date().toISOString()
        });
        localStorage.setItem('tailorProUsers', JSON.stringify(users));
        console.log('Default test account created!');
        console.log('Email: admin@tailorpro.com');
        console.log('Password: admin123');
    }
}

// Run auth check on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeDefaultAccount();
    checkAuth();
});
