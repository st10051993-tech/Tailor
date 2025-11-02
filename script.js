// Navigation and Mobile Menu
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const navLinks = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('.content-section');
    
    // Create mobile menu overlay
    let mobileOverlay = document.querySelector('.mobile-menu-overlay');
    if (!mobileOverlay) {
        mobileOverlay = document.createElement('div');
        mobileOverlay.className = 'mobile-menu-overlay';
        document.body.appendChild(mobileOverlay);
    }

    // Mobile menu toggle
    menuToggle?.addEventListener('click', function() {
        sidebar.classList.toggle('open');
        mobileOverlay.classList.toggle('active');
    });

    // Close sidebar when clicking overlay
    mobileOverlay.addEventListener('click', function() {
        sidebar.classList.remove('open');
        mobileOverlay.classList.remove('active');
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
            if (!sidebar.contains(e.target) && !menuToggle.contains(e.target) && !mobileOverlay.contains(e.target)) {
                sidebar.classList.remove('open');
                mobileOverlay.classList.remove('active');
            }
        }
    });

    // Navigation
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Hide all content sections
            contentSections.forEach(section => section.classList.remove('active'));
            
            // Show target section
            const targetSection = this.dataset.section;
            const targetElement = document.getElementById(targetSection + '-section');
            if (targetElement) {
                targetElement.classList.add('active');
            }
            
            // Close mobile menu and overlay
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('open');
                mobileOverlay.classList.remove('active');
            }
        });
    });

    // Initialize measurement form functionality
    initializeMeasurementForm();
    
    // Initialize tabs
    initializeTabs();
    
    // Initialize search
    initializeSearch();
    
    // Initialize view toggle
    initializeViewToggle();
});

// Measurement Form Functions
function initializeMeasurementForm() {
    const clientSelect = document.getElementById('measurementClientSelect');
    const tabsContainer = document.getElementById('measurementTabsContainer');
    const selectedClientName = document.getElementById('selectedClientName');

    if (clientSelect) {
        clientSelect.addEventListener('change', function() {
            const selectedValue = this.value;
            const selectedText = this.options[this.selectedIndex].text;
            
            if (selectedValue) {
                tabsContainer.style.display = 'block';
                selectedClientName.textContent = selectedText;
                
                // Load client measurements (in a real app, this would fetch from backend)
                loadClientMeasurements(selectedValue);
            } else {
                tabsContainer.style.display = 'none';
            }
        });
    }
}

function loadClientMeasurements(clientId) {
    // Mock data - in a real app, this would fetch from backend
    const mockMeasurements = {
        '1': {
            shirt: { chest: 42, waist: 36, shoulder: 18, sleeves: 25, collar: 16, length: 30 },
            pant: { waist: 34, hip: 40, thigh: 24, inseam: 32, outseam: 42, rise: 11, cuff: 16 }
        },
        '2': {
            shirt: { chest: 44, waist: 38, shoulder: 19, sleeves: 26, collar: 17, length: 31 },
            pant: {}
        },
        '3': {
            shirt: {},
            pant: {}
        }
    };

    const measurements = mockMeasurements[clientId];
    
    if (measurements) {
        // Populate shirt measurements
        const shirtTab = document.getElementById('shirt-tab');
        const shirtInputs = shirtTab.querySelectorAll('input');
        shirtInputs.forEach(input => {
            const field = input.parentElement.querySelector('label').textContent.toLowerCase().split(' ')[0];
            if (measurements.shirt[field]) {
                input.value = measurements.shirt[field];
            }
        });

        // Populate pant measurements
        const pantTab = document.getElementById('pant-tab');
        const pantInputs = pantTab.querySelectorAll('input');
        pantInputs.forEach(input => {
            const field = input.parentElement.querySelector('label').textContent.toLowerCase().split(' ')[0];
            if (measurements.pant[field]) {
                input.value = measurements.pant[field];
            }
        });
    }
}

// Tab Functions
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.dataset.tab;
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and target content
            this.classList.add('active');
            const targetContent = document.getElementById(targetTab + '-tab');
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

// Search Functions
function initializeSearch() {
    const searchInput = document.getElementById('clientSearch');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const clientCards = document.querySelectorAll('.client-card');
            let visibleCount = 0;
            
            clientCards.forEach(card => {
                const clientName = card.querySelector('h4').textContent.toLowerCase();
                const clientEmail = card.querySelector('.contact-item span').textContent.toLowerCase();
                
                if (clientName.includes(searchTerm) || clientEmail.includes(searchTerm)) {
                    card.style.display = '';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            });
            
            // Update client count
            const countBadge = document.querySelector('.client-count .badge');
            if (countBadge) {
                countBadge.textContent = `${visibleCount} clients`;
            }
        });
    }
}

// View Toggle Functions
function initializeViewToggle() {
    const viewButtons = document.querySelectorAll('.view-btn');
    const clientsGrid = document.getElementById('clientsGrid');
    
    if (viewButtons.length > 0 && clientsGrid) {
        // Load saved view preference
        const savedView = localStorage.getItem('clientsView') || 'grid';
        if (savedView === 'list') {
            clientsGrid.classList.add('list-view');
            viewButtons.forEach(btn => {
                btn.classList.toggle('active', btn.dataset.view === 'list');
            });
        }
        
        viewButtons.forEach(button => {
            button.addEventListener('click', function() {
                const view = this.dataset.view;
                
                // Remove active class from all buttons
                viewButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Toggle view
                if (view === 'list') {
                    clientsGrid.classList.add('list-view');
                } else {
                    clientsGrid.classList.remove('list-view');
                }
                
                // Save preference
                localStorage.setItem('clientsView', view);
            });
        });
    }
}

// Modal Functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focus first input in modal
        const firstInput = modal.querySelector('input, select, textarea');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Reset form
        const form = modal.querySelector('form');
        if (form) {
            form.reset();
        }
    }
}

// Close modal when clicking outside
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        const modalId = e.target.id;
        closeModal(modalId);
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const activeModal = document.querySelector('.modal.active');
        if (activeModal) {
            closeModal(activeModal.id);
        }
    }
});

// Form Validation and Submission
document.addEventListener('submit', function(e) {
    const form = e.target;
    
    if (form.classList.contains('client-form')) {
        e.preventDefault();
        handleClientFormSubmit(form);
    } else if (form.classList.contains('payment-form')) {
        e.preventDefault();
        handlePaymentFormSubmit(form);
    }
});

function handleClientFormSubmit(form) {
    const formData = new FormData(form);
    const clientData = Object.fromEntries(formData);
    
    // Validate required fields
    const requiredFields = ['clientName', 'clientEmail', 'clientPhone'];
    const missingFields = requiredFields.filter(field => !clientData[field]);
    
    if (missingFields.length > 0) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(clientData.clientEmail)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    // In a real app, this would send data to backend
    console.log('Client data:', clientData);
    showNotification('Client added successfully!', 'success');
    closeModal('clientModal');
    
    // Refresh client list (in a real app, this would update from backend)
    updateClientList(clientData);
}

function handlePaymentFormSubmit(form) {
    const formData = new FormData(form);
    const paymentData = Object.fromEntries(formData);
    
    // Validate required fields
    const requiredFields = ['paymentClient', 'paymentAmount', 'paymentStatus', 'paymentMethod'];
    const missingFields = requiredFields.filter(field => !paymentData[field]);
    
    if (missingFields.length > 0) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    // Validate amount
    const amount = parseFloat(paymentData.paymentAmount);
    if (isNaN(amount) || amount <= 0) {
        showNotification('Please enter a valid amount', 'error');
        return;
    }
    
    // In a real app, this would send data to backend
    console.log('Payment data:', paymentData);
    showNotification('Payment recorded successfully!', 'success');
    closeModal('paymentModal');
    
    // Refresh payment list (in a real app, this would update from backend)
    updatePaymentStats(paymentData);
}

function updateClientList(clientData) {
    // This would update the UI with new client data
    // For demo purposes, we'll just log it
    console.log('Updating client list with:', clientData);
}

function updatePaymentStats(paymentData) {
    // This would update the payment statistics
    // For demo purposes, we'll just log it
    console.log('Updating payment stats with:', paymentData);
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 3000;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        gap: 12px;
        max-width: 400px;
        animation: slideIn 0.3s ease-out;
    `;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Add notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        width: 100%;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        opacity: 0.8;
        transition: opacity 0.2s;
    }
    
    .notification-close:hover {
        opacity: 1;
        background: rgba(255, 255, 255, 0.1);
    }
`;
document.head.appendChild(style);

// Resize handler for responsive behavior
window.addEventListener('resize', function() {
    const sidebar = document.getElementById('sidebar');
    
    // Close mobile menu when resizing to desktop
    if (window.innerWidth > 768) {
        sidebar.classList.remove('open');
    }
});

// Initialize tooltips for better UX
function initializeTooltips() {
    const elementsWithTooltips = document.querySelectorAll('[data-tooltip]');
    
    elementsWithTooltips.forEach(element => {
        element.addEventListener('mouseenter', function() {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = this.dataset.tooltip;
            tooltip.style.cssText = `
                position: absolute;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 8px 12px;
                border-radius: 4px;
                font-size: 12px;
                pointer-events: none;
                z-index: 1000;
                white-space: nowrap;
            `;
            
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + 'px';
            
            this._tooltip = tooltip;
        });
        
        element.addEventListener('mouseleave', function() {
            if (this._tooltip) {
                this._tooltip.remove();
                this._tooltip = null;
            }
        });
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeTooltips();
});

// Save measurement data
function saveMeasurements() {
    const selectedClient = document.getElementById('measurementClientSelect').value;
    
    if (!selectedClient) {
        showNotification('Please select a client first', 'error');
        return;
    }
    
    // Collect shirt measurements
    const shirtInputs = document.querySelectorAll('#shirt-tab input');
    const shirtData = {};
    shirtInputs.forEach(input => {
        const label = input.parentElement.querySelector('label').textContent;
        const field = label.toLowerCase().split(' ')[0];
        shirtData[field] = parseFloat(input.value) || 0;
    });
    
    // Collect pant measurements
    const pantInputs = document.querySelectorAll('#pant-tab input');
    const pantData = {};
    pantInputs.forEach(input => {
        const label = input.parentElement.querySelector('label').textContent;
        const field = label.toLowerCase().split(' ')[0];
        pantData[field] = parseFloat(input.value) || 0;
    });
    
    const measurementData = {
        clientId: selectedClient,
        shirt: shirtData,
        pant: pantData
    };
    
    // In a real app, this would save to backend
    console.log('Saving measurements:', measurementData);
    showNotification('Measurements saved successfully!', 'success');
}

// Export data functionality (for demonstration)
function exportData() {
    const data = {
        clients: [
            // Mock client data would be here
        ],
        payments: [
            // Mock payment data would be here
        ],
        measurements: [
            // Mock measurement data would be here
        ]
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'tailor-pro-data.json';
    link.click();
    
    URL.revokeObjectURL(url);
    showNotification('Data exported successfully!', 'success');
}

// Print functionality
function printReport(reportType) {
    const printWindow = window.open('', '_blank');
    const content = generatePrintContent(reportType);
    
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Tailor Pro - ${reportType} Report</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                h1 { color: #030213; border-bottom: 2px solid #030213; padding-bottom: 10px; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
                th { background-color: #f8fafc; font-weight: 600; }
                .header { text-align: center; margin-bottom: 30px; }
                .date { text-align: right; color: #64748b; margin-bottom: 20px; }
                @media print { body { margin: 0; } }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Tailor Pro - ${reportType} Report</h1>
            </div>
            <div class="date">Generated on: ${new Date().toLocaleDateString()}</div>
            ${content}
        </body>
        </html>
    `);
    
    printWindow.document.close();
    printWindow.print();
}

function generatePrintContent(reportType) {
    switch (reportType) {
        case 'clients':
            return `
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Address</th>
                            <th>Join Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>John Smith</td>
                            <td>john.smith@email.com</td>
                            <td>+1 (555) 123-4567</td>
                            <td>123 Main St, New York, NY 10001</td>
                            <td>Jan 15, 2024</td>
                        </tr>
                        <tr>
                            <td>Michael Johnson</td>
                            <td>michael.johnson@email.com</td>
                            <td>+1 (555) 987-6543</td>
                            <td>456 Oak Ave, Los Angeles, CA 90210</td>
                            <td>Feb 01, 2024</td>
                        </tr>
                        <tr>
                            <td>David Wilson</td>
                            <td>david.wilson@email.com</td>
                            <td>+1 (555) 456-7890</td>
                            <td>789 Pine St, Chicago, IL 60601</td>
                            <td>Feb 10, 2024</td>
                        </tr>
                    </tbody>
                </table>
            `;
        case 'payments':
            return `
                <table>
                    <thead>
                        <tr>
                            <th>Client</th>
                            <th>Amount</th>
                            <th>Method</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>John Smith</td>
                            <td>$850.00</td>
                            <td>Card</td>
                            <td>Completed</td>
                            <td>Feb 15, 2024</td>
                            <td>Custom suit - deposit</td>
                        </tr>
                        <tr>
                            <td>Michael Johnson</td>
                            <td>$450.00</td>
                            <td>Cash</td>
                            <td>Completed</td>
                            <td>Feb 20, 2024</td>
                            <td>Shirt alterations</td>
                        </tr>
                        <tr>
                            <td>John Smith</td>
                            <td>$1,200.00</td>
                            <td>Bank Transfer</td>
                            <td>Pending</td>
                            <td>Feb 25, 2024</td>
                            <td>Custom suit - final payment</td>
                        </tr>
                    </tbody>
                </table>
            `;
        default:
            return '<p>No data available for this report type.</p>';
    }
}