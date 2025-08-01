// Light in Silence Frontend Application
class LightInSilenceApp {
    constructor() {
        this.apiBase = '/api';
        this.currentUser = null;
        this.token = localStorage.getItem('authToken');
        this.init();
    }

    async init() {
        // Check if user is authenticated
        if (this.token) {
            await this.verifyToken();
        }
        
        // Update navigation state based on authentication
        if (typeof updateNavigationState === 'function') {
            updateNavigationState(this.currentUser);
        }
        
        this.setupRouting();
        this.loadPage();
        this.setupEventListeners();
    }

    async verifyToken() {
        try {
            const response = await fetch(`${this.apiBase}/auth/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: this.token })
            });
            
            const data = await response.json();
            if (data.valid) {
                this.currentUser = data.user;
                // Update navigation after verifying user
                if (typeof updateNavigationState === 'function') {
                    updateNavigationState(this.currentUser);
                }
            } else {
                this.logout();
            }
        } catch (error) {
            console.error('Token verification failed:', error);
            this.logout();
        }
    }

    setupRouting() {
        window.addEventListener('popstate', () => this.loadPage());
        
        // Handle navigation links
        document.addEventListener('click', (e) => {
            if (e.target.matches('a[data-route]')) {
                e.preventDefault();
                const route = e.target.getAttribute('data-route');
                this.navigate(route);
            }
        });
    }

    navigate(path) {
        history.pushState(null, '', path);
        this.loadPage();
        
        // Update active navigation
        if (typeof updateActiveNavigation === 'function') {
            updateActiveNavigation(path);
        }
        
        // Close mobile menu if open
        const navMenu = document.getElementById('nav-menu');
        if (navMenu) {
            navMenu.classList.remove('active');
        }
    }

    loadPage() {
        const path = window.location.pathname;
        const app = document.getElementById('app');
        
        // Update active navigation
        if (typeof updateActiveNavigation === 'function') {
            updateActiveNavigation(path);
        }
        
        // Route handling
        if (path === '/' || path === '/index.html') {
            this.renderHomePage(app);
        } else if (path === '/submit') {
            this.renderSubmitPage(app);
        } else if (path === '/login') {
            this.renderLoginPage(app);
        } else if (path === '/register') {
            this.renderRegisterPage(app);
        } else if (path.startsWith('/response/')) {
            const letterId = path.split('/')[2];
            this.renderResponsePage(app, letterId);
        } else if (path === '/check-reply') {
            this.renderCheckReplyPage(app);
        } else if (path === '/volunteer') {
            this.renderVolunteerDashboard(app);
        } else if (path === '/admin') {
            this.renderAdminDashboard(app);
        } else if (path === '/about') {
            this.renderAboutPage(app);
        } else if (path === '/contact') {
            this.renderContactPage(app);
        } else if (path === '/blog') {
            this.renderBlogPage(app);
        } else if (path === '/events') {
            this.renderEventsPage(app);
        } else if (path === '/resources') {
            this.renderResourcesPage(app);
        } else if (path === '/volunteer-info') {
            this.renderVolunteerInfoPage(app);
        } else if (path === '/donate') {
            this.renderDonatePage(app);
        } else if (path === '/terms') {
            this.renderTermsPage(app);
        } else if (path === '/privacy') {
            this.renderPrivacyPage(app);
        } else {
            this.render404(app);
        }
    }

    renderHomePage(container) {
        container.innerHTML = `
            <div class="home-page">                
                <main class="hero">
                    <div class="hero-content">
                        <h1>You Are Not Alone</h1>
                        <p class="quote">In silence, we find strength. In sharing, we find healing.</p>
                        <p class="mission">A safe space for mental health support through anonymous letter exchange and AI-powered conversations.</p>
                        <div class="cta-buttons">
                            <a href="/submit" data-route="/submit" class="cta-button">Write a Letter</a>
                            <a href="/check-reply" data-route="/check-reply" class="cta-button secondary">Check for Reply</a>
                        </div>
                    </div>
                </main>

                <section class="how-it-works">
                    <h2>How It Works</h2>
                    <div class="steps">
                        <div class="step">
                            <div class="step-number">1</div>
                            <h3>Write Your Letter</h3>
                            <p>Share your thoughts, feelings, or struggles anonymously in a safe space.</p>
                        </div>
                        <div class="step">
                            <div class="step-number">2</div>
                            <h3>Get Support</h3>
                            <p>Receive a thoughtful response from our trained volunteers or AI companion.</p>
                        </div>
                        <div class="step">
                            <div class="step-number">3</div>
                            <h3>Find Healing</h3>
                            <p>Continue the conversation and access additional mental health resources.</p>
                        </div>
                    </div>
                </section>
            </div>
        `;
        
        // Initialize chat widget
        this.initializeChatWidget();
    }

    renderSubmitPage(container) {
        container.innerHTML = `
            <div class="submit-page">               
                <main class="form-container">
                    <div class="page-header">
                        <h1>Submit Your Letter</h1>
                        <p>Share your thoughts in a safe, anonymous space</p>
                    </div>
                    
                    <form id="letterForm" class="letter-form">
                        <div class="form-group">
                            <label for="topic">Topic (Optional)</label>
                            <select id="topic" name="topic">
                                <option value="">Choose a topic...</option>
                                <option value="academic">Academic Pressure</option>
                                <option value="work">Work Stress</option>
                                <option value="relationships">Relationships</option>
                                <option value="mental">Mental Health</option>
                                <option value="future">Future Anxiety</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="content">Your Letter *</label>
                            <textarea id="content" name="content" required minlength="10" maxlength="5000" 
                                placeholder="Share what's on your mind. You're in a safe space here..."></textarea>
                            <div class="char-count">
                                <span id="charCount">0</span> / 5000
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="replyMethod">How would you like to receive a reply?</label>
                            <select id="replyMethod" name="replyMethod">
                                <option value="website">Check on website (you'll receive a code)</option>
                                <option value="anonymous-email">Anonymous email</option>
                                <option value="ai">AI-generated immediate response</option>
                            </select>
                        </div>
                        
                        <div class="form-group" id="emailGroup" style="display: none;">
                            <label for="anonymousEmail">Anonymous Email</label>
                            <input type="email" id="anonymousEmail" name="anonymousEmail" 
                                placeholder="your.email@example.com">
                        </div>
                        
                        <div class="form-actions">
                            <button type="submit" class="submit-btn">Send Letter</button>
                            <button type="button" class="cancel-btn" onclick="app.navigate('/')">Cancel</button>
                        </div>
                    </form>
                </main>
            </div>
        `;
        
        this.setupSubmitForm();
    }

    renderLoginPage(container) {
        if (this.currentUser) {
            this.navigate('/');
            return;
        }

        container.innerHTML = `
            <div class="login-page">
                <main class="auth-container">
                    <div class="auth-form">
                        <h1>Welcome Back</h1>
                        <p>Sign in to access your volunteer dashboard</p>
                        
                        <form id="loginForm">
                            <div class="form-group">
                                <label for="username">Username or Email</label>
                                <input type="text" id="username" name="username" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="password">Password</label>
                                <input type="password" id="password" name="password" required>
                            </div>
                            
                            <div class="form-actions">
                                <button type="submit" class="submit-btn">Sign In</button>
                                <button type="button" class="cancel-btn" onclick="app.navigate('/')">Cancel</button>
                            </div>
                        </form>
                        
                        <div class="auth-links">
                            <p>Don't have an account? <a href="/register" data-route="/register">Register here</a></p>
                        </div>
                    </div>
                </main>
            </div>
        `;
        
        this.setupLoginForm();
    }

    renderRegisterPage(container) {
        if (this.currentUser) {
            this.navigate('/');
            return;
        }

        container.innerHTML = `
            <div class="register-page">
                <main class="auth-container">
                    <div class="auth-form">
                        <h1>Join Our Community</h1>
                        <p>Register to become a volunteer and help others</p>
                        
                        <form id="registerForm">
                            <div class="form-group">
                                <label for="reg-username">Username</label>
                                <input type="text" id="reg-username" name="username" required minlength="3">
                            </div>
                            
                            <div class="form-group">
                                <label for="reg-email">Email</label>
                                <input type="email" id="reg-email" name="email" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="reg-password">Password</label>
                                <input type="password" id="reg-password" name="password" required minlength="8">
                            </div>
                            
                            <div class="form-group">
                                <label for="reg-password2">Confirm Password</label>
                                <input type="password" id="reg-password2" name="password2" required>
                            </div>
                            
                            <div class="form-actions">
                                <button type="submit" class="submit-btn">Register</button>
                                <button type="button" class="cancel-btn" onclick="app.navigate('/')">Cancel</button>
                            </div>
                        </form>
                        
                        <div class="auth-links">
                            <p>Already have an account? <a href="/login" data-route="/login">Sign in here</a></p>
                        </div>
                    </div>
                </main>
            </div>
        `;
        
        this.setupRegisterForm();
    }

    renderResponsePage(container, letterId) {
        container.innerHTML = `
            <div class="response-page">
                <header class="simple-header">
                    <a href="/" data-route="/" class="back-link">← Back to Home</a>
                    <h1>Letter Response</h1>
                </header>
                
                <main class="response-container">
                    <div id="responseContent">
                        <div class="loading">Loading...</div>
                    </div>
                </main>
            </div>
        `;
        
        this.loadLetterResponse(letterId);
    }

    renderCheckReplyPage(container) {
        container.innerHTML = `
            <div class="check-reply-page">
                <header class="simple-header">
                    <a href="/" data-route="/" class="back-link">← Back to Home</a>
                    <h1>Check for Reply</h1>
                </header>
                
                <main class="check-reply-container">
                    <form id="checkReplyForm" class="check-reply-form">
                        <div class="form-group">
                            <label for="letterCode">Letter Code</label>
                            <input type="text" id="letterCode" name="letterCode" required 
                                placeholder="Enter your letter code">
                        </div>
                        
                        <button type="submit" class="check-btn">Check for Response</button>
                    </form>
                </main>
            </div>
        `;
        
        this.setupCheckReplyForm();
    }

    // Setup form handlers
    setupSubmitForm() {
        const form = document.getElementById('letterForm');
        const contentTextarea = document.getElementById('content');
        const charCount = document.getElementById('charCount');
        const replyMethodSelect = document.getElementById('replyMethod');
        const emailGroup = document.getElementById('emailGroup');

        // Character counter
        contentTextarea.addEventListener('input', () => {
            charCount.textContent = contentTextarea.value.length;
        });

        // Show/hide email field
        replyMethodSelect.addEventListener('change', () => {
            emailGroup.style.display = 
                replyMethodSelect.value === 'anonymous-email' ? 'block' : 'none';
        });

        // Form submission
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.submitLetter(form);
        });
    }

    setupLoginForm() {
        const form = document.getElementById('loginForm');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.login(form);
        });
    }

    setupRegisterForm() {
        const form = document.getElementById('registerForm');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.register(form);
        });
    }

    setupCheckReplyForm() {
        const form = document.getElementById('checkReplyForm');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const letterCode = formData.get('letterCode');
            this.navigate(`/response/${letterCode}`);
        });
    }

    // API methods
    async submitLetter(form) {
        try {
            const formData = new FormData(form);
            const data = {
                topic: formData.get('topic'),
                content: formData.get('content'),
                replyMethod: formData.get('replyMethod'),
                anonymousEmail: formData.get('anonymousEmail')
            };

            const response = await fetch(`${this.apiBase}/letters/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(this.token && { 'Authorization': `Bearer ${this.token}` })
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            
            if (result.success) {
                this.showMessage('success', result.message);
                if (result.letterId) {
                    setTimeout(() => {
                        this.navigate(`/response/${result.letterId}`);
                    }, 2000);
                }
            } else {
                this.showMessage('error', result.error || 'Failed to submit letter');
            }
        } catch (error) {
            console.error('Submit error:', error);
            this.showMessage('error', 'Failed to submit letter. Please try again.');
        }
    }

    async login(form) {
        try {
            const formData = new FormData(form);
            const data = {
                email: formData.get('email'),
                password: formData.get('password')
            };

            const response = await fetch(`${this.apiBase}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            
            if (result.success) {
                this.token = result.token;
                this.currentUser = result.user;
                localStorage.setItem('authToken', this.token);
                this.showMessage('success', 'Login successful!');
                setTimeout(() => this.navigate('/'), 1000);
            } else {
                this.showMessage('error', result.error || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showMessage('error', 'Login failed. Please try again.');
        }
    }

    async register(form) {
        try {
            const formData = new FormData(form);
            const data = {
                username: formData.get('username'),
                email: formData.get('email'),
                password: formData.get('password')
            };

            const response = await fetch(`${this.apiBase}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            
            if (result.success) {
                this.token = result.token;
                this.currentUser = result.user;
                localStorage.setItem('authToken', this.token);
                this.showMessage('success', 'Registration successful!');
                setTimeout(() => this.navigate('/'), 1000);
            } else {
                this.showMessage('error', result.error || 'Registration failed');
            }
        } catch (error) {
            console.error('Registration error:', error);
            this.showMessage('error', 'Registration failed. Please try again.');
        }
    }

    async loadLetterResponse(letterId) {
        try {
            const response = await fetch(`${this.apiBase}/letters/${letterId}`);
            const data = await response.json();
            
            if (data.letter) {
                const container = document.getElementById('responseContent');
                container.innerHTML = `
                    <div class="letter-display">
                        <h2>Your Letter</h2>
                        <div class="letter-content">
                            ${data.letter.topic ? `<div class="topic">Topic: ${data.letter.topic}</div>` : ''}
                            <div class="content">${data.letter.content}</div>
                            <div class="date">Submitted: ${new Date(data.letter.createdAt).toLocaleDateString()}</div>
                        </div>
                        
                        <h2>Responses</h2>
                        <div class="responses">
                            ${data.responses.length > 0 ? 
                                data.responses.map(response => `
                                    <div class="response ${response.type}">
                                        <div class="response-content">${response.content}</div>
                                        <div class="response-meta">
                                            <span class="type">${response.type}</span>
                                            <span class="date">${new Date(response.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                `).join('') :
                                '<p>No responses yet. Please check back later.</p>'
                            }
                        </div>
                    </div>
                `;
            } else {
                document.getElementById('responseContent').innerHTML = 
                    '<div class="error">Letter not found. Please check your letter code.</div>';
            }
        } catch (error) {
            console.error('Error loading letter:', error);
            document.getElementById('responseContent').innerHTML = 
                '<div class="error">Failed to load letter response.</div>';
        }
    }

    logout() {
        this.token = null;
        this.currentUser = null;
        localStorage.removeItem('authToken');
        
        // Update navigation state
        if (typeof updateNavigationState === 'function') {
            updateNavigationState(null);
        }
        
        this.navigate('/');
    }

    showMessage(type, message) {
        // Create or update message display
        let messageDiv = document.getElementById('messageDisplay');
        if (!messageDiv) {
            messageDiv = document.createElement('div');
            messageDiv.id = 'messageDisplay';
            document.body.appendChild(messageDiv);
        }
        
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;
        messageDiv.style.display = 'block';
        
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 5000);
    }

    initializeChatWidget() {
        // Initialize the chat widget (reusing existing chat functionality)
        if (typeof initializeChatWidget === 'function') {
            initializeChatWidget();
        }
    }

    setupEventListeners() {
        // Global event listeners can go here
    }

    render404(container) {
        container.innerHTML = `
            <div class="error-page">
                <h1>404 - Page Not Found</h1>
                <p>The page you're looking for doesn't exist.</p>
                <a href="/" data-route="/" class="back-link">← Back to Home</a>
            </div>
        `;
    }

    renderVolunteerDashboard(container) {
        if (!this.currentUser || !this.currentUser.isVolunteer) {
            this.navigate('/login');
            return;
        }
        
        container.innerHTML = `
            <div class="volunteer-dashboard">
                <h1>Volunteer Dashboard</h1>
                <div id="volunteerContent">Loading...</div>
            </div>
        `;
        
        // Load volunteer dashboard data
        this.loadVolunteerDashboard();
    }

    renderAdminDashboard(container) {
        if (!this.currentUser || !this.currentUser.isAdmin) {
            this.navigate('/login');
            return;
        }
        
        container.innerHTML = `
            <div class="admin-dashboard">
                <h1>Admin Dashboard</h1>
                <div id="adminContent">Loading...</div>
            </div>
        `;
        
        // Load admin dashboard data
        this.loadAdminDashboard();
    }

    async loadVolunteerDashboard() {
        // Implementation for volunteer dashboard
    }

    async loadAdminDashboard() {
        // Implementation for admin dashboard
    }

    renderAboutPage(container) {
        container.innerHTML = `
            <div class="about-page">
                <header class="simple-header">
                    <a href="/" data-route="/" class="back-link">← Back to Home</a>
                    <h1>About Light in Silence</h1>
                </header>
                <main class="content">
                    <p>Light in Silence is a mental health support platform...</p>
                </main>
            </div>
        `;
    }

    renderContactPage(container) {
        container.innerHTML = `
            <div class="contact-page">
                <header class="simple-header">
                    <a href="/" data-route="/" class="back-link">← Back to Home</a>
                    <h1>Contact Us</h1>
                </header>
                <main class="content">
                    <p>Get in touch with our team...</p>
                </main>
            </div>
        `;
    }

    renderBlogPage(container) {
        container.innerHTML = `
            <div class="blog-page">
                <main>
                    <h1>Blog</h1>
                    <p>Coming soon! Our blog will feature mental health insights, personal stories, and expert advice.</p>
                    <a href="/" data-route="/" class="cta-button">← Back to Home</a>
                </main>
            </div>
        `;
    }

    renderEventsPage(container) {
        container.innerHTML = `
            <div class="events-page">
                <main>
                    <h1>Events</h1>
                    <p>Stay tuned for upcoming mental health workshops, support groups, and community events.</p>
                    <a href="/" data-route="/" class="cta-button">← Back to Home</a>
                </main>
            </div>
        `;
    }

    renderResourcesPage(container) {
        container.innerHTML = `
            <div class="resources-page">
                <main>
                    <h1>Mental Health Resources</h1>
                    <div class="resources-grid">
                        <div class="resource-card">
                            <h3>Crisis Support</h3>
                            <p><strong>Canada Crisis Line:</strong> 1-833-456-4566</p>
                            <p><strong>Text Support:</strong> 45645</p>
                            <p><strong>Emergency:</strong> 911</p>
                        </div>
                        <div class="resource-card">
                            <h3>Online Support</h3>
                            <p>Access professional mental health resources and support groups.</p>
                        </div>
                    </div>
                    <a href="/" data-route="/" class="cta-button">← Back to Home</a>
                </main>
            </div>
        `;
    }

    renderVolunteerInfoPage(container) {
        container.innerHTML = `
            <div class="volunteer-info-page">
                <main>
                    <h1>Become a Volunteer</h1>
                    <p>Join our mission to bring light to those in silence.</p>
                    <div class="volunteer-benefits">
                        <h3>Why Volunteer With Us?</h3>
                        <p>At Light in Silence, volunteers are the heart of our mission. Your compassionate responses can provide hope, comfort, and connection to someone who needs it most.</p>
                        <ul>
                            <li><strong>Make a Real Impact:</strong> Your words can be the light someone needs in their darkest moment.</li>
                            <li><strong>Learn & Grow:</strong> Develop empathy and communication skills through comprehensive training.</li>
                            <li><strong>Join a Community:</strong> Connect with like-minded individuals passionate about mental health advocacy.</li>
                        </ul>
                    </div>
                    <a href="/register" data-route="/register" class="cta-button">Join as Volunteer</a>
                    <a href="/" data-route="/" class="cta-button secondary">← Back to Home</a>
                </main>
            </div>
        `;
    }

    renderDonatePage(container) {
        container.innerHTML = `
            <div class="donate-page">
                <main>
                    <h1>Support Our Mission</h1>
                    <p>Your donation helps us provide free mental health support to those who need it most.</p>
                    <div class="donation-info">
                        <h3>How Your Donation Helps</h3>
                        <ul>
                            <li>Maintain our platform and technology infrastructure</li>
                            <li>Train volunteer responders</li>
                            <li>Develop new mental health resources</li>
                            <li>Expand our reach to more communities</li>
                        </ul>
                    </div>
                    <a href="/" data-route="/" class="cta-button secondary">← Back to Home</a>
                </main>
            </div>
        `;
    }

    renderTermsPage(container) {
        container.innerHTML = `
            <div class="terms-page">
                <main>
                    <h1>Terms of Service</h1>
                    <p>Please read these terms carefully before using our platform.</p>
                    <div class="terms-content">
                        <h3>1. Acceptance of Terms</h3>
                        <p>By accessing and using Light in Silence, you accept and agree to be bound by the terms and provision of this agreement.</p>
                        
                        <h3>2. Privacy and Confidentiality</h3>
                        <p>We are committed to protecting your privacy. All letters and responses are handled with strict confidentiality.</p>
                        
                        <h3>3. Crisis Support</h3>
                        <p>If you are in crisis, please contact emergency services immediately. Our platform is not a substitute for professional mental health care.</p>
                    </div>
                    <a href="/" data-route="/" class="cta-button secondary">← Back to Home</a>
                </main>
            </div>
        `;
    }

    renderPrivacyPage(container) {
        container.innerHTML = `
            <div class="privacy-page">
                <main>
                    <h1>Privacy Policy</h1>
                    <p>How we protect your information and maintain your privacy.</p>
                    <div class="privacy-content">
                        <h3>Information We Collect</h3>
                        <p>We collect only the information necessary to provide our services, including anonymous letters and optional contact information.</p>
                        
                        <h3>How We Use Information</h3>
                        <p>Your information is used solely to provide mental health support and improve our services.</p>
                        
                        <h3>Data Protection</h3>
                        <p>We implement industry-standard security measures to protect your data and maintain your privacy.</p>
                    </div>
                    <a href="/" data-route="/" class="cta-button secondary">← Back to Home</a>
                </main>
            </div>
        `;
    }
}

// Initialize the application
const app = new LightInSilenceApp();

// Make app globally available for debugging and chat widget
window.app = app; 