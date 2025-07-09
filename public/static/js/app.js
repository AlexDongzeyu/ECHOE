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
    }

    loadPage() {
        const path = window.location.pathname;
        const app = document.getElementById('app');
        
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
        } else {
            this.render404(app);
        }
    }

    renderHomePage(container) {
        container.innerHTML = `
            <div class="home-page">
                <header>
                    <nav class="navbar">
                        <div class="nav-brand">
                            <h1>Light in Silence</h1>
                        </div>
                        <div class="nav-links">
                            <a href="/submit" data-route="/submit">Submit Letter</a>
                            <a href="/check-reply" data-route="/check-reply">Check Reply</a>
                            <a href="/about" data-route="/about">About</a>
                            <a href="/contact" data-route="/contact">Contact</a>
                            ${this.currentUser ? `
                                <a href="/volunteer" data-route="/volunteer">Dashboard</a>
                                <button onclick="app.logout()">Logout</button>
                            ` : `
                                <a href="/login" data-route="/login">Login</a>
                                <a href="/register" data-route="/register">Register</a>
                            `}
                        </div>
                    </nav>
                </header>
                
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
                <header class="simple-header">
                    <a href="/" data-route="/" class="back-link">← Back to Home</a>
                    <h1>Submit Your Letter</h1>
                </header>
                
                <main class="form-container">
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
                        
                        <button type="submit" class="submit-btn">Send Letter</button>
                    </form>
                </main>
            </div>
        `;
        
        this.setupSubmitForm();
    }

    renderLoginPage(container) {
        container.innerHTML = `
            <div class="auth-page">
                <header class="simple-header">
                    <a href="/" data-route="/" class="back-link">← Back to Home</a>
                    <h1>Login</h1>
                </header>
                
                <main class="auth-container">
                    <form id="loginForm" class="auth-form">
                        <div class="form-group">
                            <label for="email">Email</label>
                            <input type="email" id="email" name="email" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="password">Password</label>
                            <input type="password" id="password" name="password" required>
                        </div>
                        
                        <button type="submit" class="auth-btn">Login</button>
                    </form>
                    
                    <p class="auth-switch">
                        Don't have an account? 
                        <a href="/register" data-route="/register">Register here</a>
                    </p>
                </main>
            </div>
        `;
        
        this.setupLoginForm();
    }

    renderRegisterPage(container) {
        container.innerHTML = `
            <div class="auth-page">
                <header class="simple-header">
                    <a href="/" data-route="/" class="back-link">← Back to Home</a>
                    <h1>Register</h1>
                </header>
                
                <main class="auth-container">
                    <form id="registerForm" class="auth-form">
                        <div class="form-group">
                            <label for="username">Username</label>
                            <input type="text" id="username" name="username" required minlength="3">
                        </div>
                        
                        <div class="form-group">
                            <label for="email">Email</label>
                            <input type="email" id="email" name="email" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="password">Password</label>
                            <input type="password" id="password" name="password" required minlength="8">
                        </div>
                        
                        <button type="submit" class="auth-btn">Register</button>
                    </form>
                    
                    <p class="auth-switch">
                        Already have an account? 
                        <a href="/login" data-route="/login">Login here</a>
                    </p>
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
}

// Initialize the application
const app = new LightInSilenceApp();

// Make app globally available for debugging and chat widget
window.app = app; 