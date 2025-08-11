import { Hono } from 'hono';
import { Env } from '../index';

const staticRoutes = new Hono<{ Bindings: Env }>();

// Serve the main homepage
staticRoutes.get('/', async (c) => {
  const html = `<!DOCTYPE html>
<html lang="en-CA">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Light in Silence - Where Your Words Find Light</title>
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <style>
        :root {
            --deep-indigo: #2A3D66;
            --soft-yellow: #F4D06F;
            --warm-white: #FAFAFA;
            --gentle-lavender: #B39CD0;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: "Nunito", sans-serif;
            line-height: 1.6;
            color: var(--deep-indigo);
            background-color: var(--warm-white);
        }
        
        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 2rem;
        }
        
        /* Header */
        header {
            background: white;
            box-shadow: 0 2px 10px rgba(42, 61, 102, 0.1);
            position: sticky;
            top: 0;
            z-index: 1000;
        }
        
        nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem 2rem;
        }
        
        .logo {
            display: flex;
            align-items: center;
            text-decoration: none;
            color: var(--deep-indigo);
            font-weight: 700;
            font-size: 1.5rem;
        }
        
        .logo-img {
            margin-right: 10px;
            color: var(--gentle-lavender);
        }
        
        #nav-menu {
            display: flex;
            list-style: none;
            gap: 2rem;
        }
        
        #nav-menu li a {
            text-decoration: none;
            color: var(--deep-indigo);
            font-weight: 600;
            transition: color 0.3s ease;
        }
        
        #nav-menu li a:hover,
        #nav-menu li a.active {
            color: var(--gentle-lavender);
        }
        
        /* Hero Section */
        .hero {
            padding: 100px 0 120px;
            position: relative;
            overflow: hidden;
            background-color: var(--warm-white);
        }
        
        .hero .container {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        
        .hero-content {
            max-width: 550px;
            z-index: 2;
        }
        
        .hero-content h1 {
            color: var(--deep-indigo);
            font-size: 3.2rem;
            font-weight: 700;
            margin-bottom: 20px;
            line-height: 1.2;
        }
        
        .hero .quote {
            font-style: italic;
            font-size: 1.2rem;
            color: var(--deep-indigo);
            opacity: 0.9;
            margin-bottom: 20px;
            padding-left: 15px;
            border-left: 3px solid var(--soft-yellow);
        }
        
        .hero .mission {
            font-size: 1.3rem;
            margin-bottom: 35px;
            color: var(--deep-indigo);
            line-height: 1.6;
        }
        
        .hero-image {
            width: 45%;
            max-width: 500px;
            z-index: 1;
        }
        
        .hero-image img {
            width: 100%;
            height: auto;
            filter: drop-shadow(0 5px 15px rgba(42, 61, 102, 0.15));
            animation: float 6s ease-in-out infinite;
        }
        
        @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-15px); }
            100% { transform: translateY(0px); }
        }
        
        /* How It Works Section */
        .how-it-works {
            padding: 80px 0;
            background-color: var(--deep-indigo);
            color: var(--warm-white);
            text-align: center;
        }
        
        .how-it-works h2 {
            font-size: 2.5rem;
            margin-bottom: 60px;
            position: relative;
            display: inline-block;
        }
        
        .how-it-works h2:after {
            content: '';
            position: absolute;
            bottom: -15px;
            left: 50%;
            transform: translateX(-50%);
            width: 80px;
            height: 4px;
            background-color: var(--soft-yellow);
            border-radius: 2px;
        }
        
        .steps {
            display: flex;
            justify-content: center;
            gap: 30px;
            flex-wrap: wrap;
        }
        
        .step-card {
            background-color: rgba(250, 250, 250, 0.05);
            border-radius: 15px;
            padding: 40px 25px;
            width: 300px;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            border-top: 4px solid var(--soft-yellow);
        }
        
        .step-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
        }
        
        .step-icon {
            width: 80px;
            height: 80px;
            background-color: var(--soft-yellow);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 25px;
        }
        
        .step-icon i {
            font-size: 35px;
            color: var(--deep-indigo);
        }
        
        .step-card h3 {
            font-size: 1.5rem;
            margin-bottom: 15px;
        }
        
        .step-card p {
            font-size: 1.1rem;
            line-height: 1.6;
        }
        
        /* Dual Approach Section */
        .dual-approach {
            padding: 80px 0;
            background-color: var(--warm-white);
            text-align: center;
        }
        
        .dual-approach h2 {
            font-size: 2.5rem;
            margin-bottom: 60px;
            color: var(--deep-indigo);
            position: relative;
            display: inline-block;
        }
        
        .dual-approach h2:after {
            content: '';
            position: absolute;
            bottom: -15px;
            left: 50%;
            transform: translateX(-50%);
            width: 80px;
            height: 4px;
            background-color: var(--gentle-lavender);
            border-radius: 2px;
        }
        
        .approach-cards {
            display: flex;
            justify-content: center;
            gap: 40px;
            flex-wrap: wrap;
        }
        
        .card {
            background-color: white;
            border-radius: 15px;
            padding: 40px 30px;
            width: 350px;
            box-shadow: 0 10px 30px rgba(42, 61, 102, 0.1);
            transition: transform 0.3s ease;
            text-align: left;
            border-top: 5px solid var(--deep-indigo);
        }
        
        .card:hover {
            transform: translateY(-10px);
        }
        
        .card-icon {
            color: var(--soft-yellow);
            font-size: 40px;
            margin-bottom: 25px;
        }
        
        .card h3 {
            color: var(--deep-indigo);
            margin-bottom: 15px;
            font-size: 1.5rem;
        }
        
        .card p {
            color: var(--deep-indigo);
            line-height: 1.6;
            margin-bottom: 20px;
        }
        
        .btn-primary {
            background: var(--soft-yellow);
            color: var(--deep-indigo);
            padding: 15px 30px;
            border-radius: 25px;
            text-decoration: none;
            font-weight: 600;
            display: inline-block;
            transition: all 0.3s ease;
        }
        
        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(244, 208, 111, 0.3);
        }
        
        .btn-secondary {
            background: transparent;
            color: var(--deep-indigo);
            padding: 12px 24px;
            border: 2px solid var(--deep-indigo);
            border-radius: 25px;
            font-weight: 600;
            text-decoration: none;
            display: inline-block;
            transition: all 0.3s ease;
        }
        
        .btn-secondary:hover {
            background: var(--deep-indigo);
            color: white;
        }
        
        /* Social Proof Section */
        .social-proof {
            padding: 80px 0;
            background-color: var(--gentle-lavender);
            text-align: center;
        }
        
        .social-proof h2 {
            font-size: 2.5rem;
            margin-bottom: 20px;
            color: var(--deep-indigo);
        }
        
        .section-subtitle {
            font-size: 1.2rem;
            margin-bottom: 50px;
            color: var(--deep-indigo);
            opacity: 0.8;
        }
        
        .testimonials {
            display: flex;
            justify-content: center;
            gap: 30px;
            flex-wrap: wrap;
            margin-bottom: 50px;
        }
        
        .testimonial {
            background-color: white;
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(42, 61, 102, 0.1);
            width: 300px;
            text-align: left;
        }
        
        .testimonial p {
            color: var(--deep-indigo);
            line-height: 1.6;
            margin-bottom: 15px;
            font-style: italic;
        }
        
        .testimonial span {
            color: var(--gentle-lavender);
            font-weight: 600;
        }
        
        .cta-wrapper {
            text-align: center;
        }
        
        .cta-large {
            background: var(--soft-yellow);
            color: var(--deep-indigo);
            padding: 20px 40px;
            border-radius: 25px;
            text-decoration: none;
            font-weight: 600;
            display: inline-block;
            font-size: 1.2rem;
            transition: all 0.3s ease;
        }
        
        .cta-large:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(244, 208, 111, 0.3);
        }
        
        /* Responsive Design */
        @media (max-width: 768px) {
            .hero .container {
                flex-direction: column;
                text-align: center;
            }
            
            .hero-content {
                max-width: none;
                margin-bottom: 2rem;
            }
            
            .hero-content h1 {
                font-size: 2.5rem;
            }
            
            .hero .quote, .hero .mission {
                font-size: 1.1rem;
            }
            
            .hero-image {
                width: 80%;
                max-width: 400px;
            }
            
            .step-card, .card, .testimonial {
                width: 100%;
                max-width: 400px;
            }
        }
    </style>
</head>
<body>
    <header>
        <nav>
            <a href="/" class="logo">
                <div class="logo-img"><i class="fas fa-heart"></i></div>
                <span>Light in Silence</span>
            </a>
            <ul id="nav-menu">
                <li><a href="/" class="nav-primary active">Home</a></li>
                <li><a href="/submit" class="nav-primary">Share Your Story</a></li>
                <li><a href="/about" class="nav-primary">About</a></li>
            </ul>
        </nav>
    </header>
    
    <main>
        <section class="hero">
            <div class="container">
                <div class="hero-content">
                    <h1>Find Light in Silence</h1>
                    <p class="quote">"We are all broken. That's how the light gets in." — Ernest Hemingway</p>
                    <p class="mission">A safe, anonymous space to share your thoughts and find support, both online and offline.</p>
                    <a href="/submit" class="btn-primary">Share Your Story</a>
                </div>
                <div class="hero-image">
                    <div style="width: 100%; height: 300px; background: linear-gradient(135deg, #F4D06F, #B39CD0); border-radius: 20px; display: flex; align-items: center; justify-content: center; font-size: 4rem;">💜</div>
                </div>
            </div>
        </section>
        
        <section class="how-it-works">
            <div class="container">
                <h2>How It Works</h2>
                <div class="steps">
                    <div class="step-card">
                        <div class="step-icon">
                            <i class="fas fa-pencil-alt"></i>
                        </div>
                        <h3>Share Your Story</h3>
                        <p>Write anonymously online or find our physical mailboxes in your community</p>
                    </div>
                    <div class="step-card">
                        <div class="step-icon">
                            <i class="fas fa-reply"></i>
                        </div>
                        <h3>We Respond</h3>
                        <p>Receive a thoughtful reply from our volunteers or AI companion within 48 hours</p>
                    </div>
                    <div class="step-card">
                        <div class="step-icon">
                            <i class="fas fa-heart"></i>
                        </div>
                        <h3>Feel Better</h3>
                        <p>Release your stress and find peace through shared understanding</p>
                    </div>
                </div>
            </div>
        </section>
        
        <section class="dual-approach">
            <div class="container">
                <h2>Our Unique Approach</h2>
                <div class="approach-cards">
                    <div class="card">
                        <div class="card-icon">
                            <i class="fas fa-laptop"></i>
                        </div>
                        <h3>Online Community</h3>
                        <p>Submit your thoughts through our secure online platform and receive supportive responses.</p>
                        <a href="/submit" class="btn-secondary">Try Online</a>
                    </div>
                    <div class="card">
                        <div class="card-icon">
                            <i class="fas fa-envelope"></i>
                        </div>
                        <h3>Physical Mailboxes</h3>
                        <p>Find our "tree hole" mailboxes in community centres across Canada to share handwritten letters.</p>
                        <a href="/contact" class="btn-secondary">Find Locations</a>
                    </div>
                </div>
            </div>
        </section>
        
        <section class="social-proof">
            <div class="container">
                <h2>Join Our Growing Community</h2>
                <p class="section-subtitle">Over 200 people have already shared their stories and found support</p>
                <div class="testimonials">
                    <div class="testimonial">
                        <p>"This helped me feel less alone during a difficult time."</p>
                        <span>— Anonymous</span>
                    </div>
                    <div class="testimonial">
                        <p>"Writing down my feelings and receiving a thoughtful reply gave me tremendous relief."</p>
                        <span>— Anonymous</span>
                    </div>
                    <div class="testimonial">
                        <p>"I found comfort in knowing someone was listening, even if they didn't know who I was."</p>
                        <span>— Anonymous</span>
                    </div>
                </div>
                <div class="cta-wrapper">
                    <a href="/submit" class="btn-primary cta-large">Start Your Journey Today</a>
                </div>
            </div>
        </section>
    </main>
</body>
</html>`;
  
  return new Response(html, {
    headers: { 'Content-Type': 'text/html' }
  });
});

// Serve all Flask pages with complete content
staticRoutes.get('/submit', async (c) => {
  const html = `<!DOCTYPE html>
<html lang="en-CA">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Share Your Story - Light in Silence</title>
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <style>
        :root {
            --deep-indigo: #2A3D66;
            --soft-yellow: #F4D06F;
            --warm-white: #FAFAFA;
            --gentle-lavender: #B39CD0;
        }
        
        body {
            font-family: "Nunito", sans-serif;
            margin: 0;
            padding: 0;
            background-color: var(--warm-white);
            color: var(--deep-indigo);
        }
        
        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 2rem;
        }
        
        header {
            background: white;
            box-shadow: 0 2px 10px rgba(42, 61, 102, 0.1);
            position: sticky;
            top: 0;
            z-index: 1000;
        }
        
        nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem 2rem;
        }
        
        .logo {
            display: flex;
            align-items: center;
            text-decoration: none;
            color: var(--deep-indigo);
            font-weight: 700;
            font-size: 1.5rem;
        }
        
        .logo-img {
            margin-right: 10px;
            color: var(--gentle-lavender);
        }
        
        #nav-menu {
            display: flex;
            list-style: none;
            gap: 2rem;
        }
        
        #nav-menu li a {
            text-decoration: none;
            color: var(--deep-indigo);
            font-weight: 600;
            transition: color 0.3s ease;
        }
        
        #nav-menu li a:hover,
        #nav-menu li a.active {
            color: var(--gentle-lavender);
        }
        
        main {
            padding: 2rem 1rem 4rem;
            background-color: var(--warm-white);
            min-height: calc(100vh - 140px);
            background-image: url('data:image/svg+xml;utf8,<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><rect width="4" height="4" x="8" y="8" rx="2" fill="%23B39CD0" opacity="0.15"/></svg>');
        }
        
        .form-container {
            max-width: 700px;
            margin: 1rem auto 3rem;
            padding: 2.5rem;
            background-color: white;
            border-radius: 20px;
            box-shadow: 0 8px 30px rgba(42, 61, 102, 0.1);
            position: relative;
            overflow: hidden;
        }
        
        .form-container::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 10px;
            background: linear-gradient(90deg, var(--gentle-lavender), var(--soft-yellow), var(--gentle-lavender));
            border-radius: 10px 10px 0 0;
        }
        
        .form-container h2 {
            text-align: center;
            margin-bottom: 1rem;
            color: var(--deep-indigo);
            font-size: 2rem;
            position: relative;
            padding-bottom: 10px;
        }
        
        .form-container h2::after {
            content: "";
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 60px;
            height: 3px;
            background-color: var(--soft-yellow);
            border-radius: 2px;
        }
        
        .form-quote {
            text-align: center;
            font-style: italic;
            margin-bottom: 2rem;
            color: var(--deep-indigo);
            opacity: 0.8;
            font-size: 1.1rem;
        }
        
        .form-intro {
            text-align: center;
            margin-bottom: 2rem;
            color: var(--deep-indigo);
            font-size: 1.1rem;
            line-height: 1.6;
        }
        
        .submission-options {
            display: flex;
            justify-content: center;
            margin-bottom: 2rem;
            background-color: var(--warm-white);
            border-radius: 10px;
            padding: 5px;
            border: 2px solid var(--gentle-lavender);
        }
        
        .submission-option {
            flex: 1;
            text-align: center;
            padding: 0.8rem 1rem;
            cursor: pointer;
            border-radius: 8px;
            transition: all 0.3s ease;
            font-weight: 600;
            color: var(--deep-indigo);
        }
        
        .submission-option.active {
            background-color: var(--soft-yellow);
            color: var(--deep-indigo);
        }
        
        .form-group {
            margin-bottom: 25px;
        }
        
        .form-label {
            display: block;
            margin-bottom: 8px;
            color: var(--deep-indigo);
            font-weight: 600;
        }
        
        .form-control {
            width: 100%;
            padding: 15px;
            border: 2px solid #e0e0e0;
            border-radius: 10px;
            font-family: inherit;
            font-size: 1rem;
            transition: border-color 0.3s ease;
        }
        
        .form-control:focus {
            outline: none;
            border-color: var(--gentle-lavender);
        }
        
        .submit-btn {
            background: var(--soft-yellow);
            color: var(--deep-indigo);
            padding: 15px 30px;
            border: none;
            border-radius: 25px;
            font-weight: 600;
            font-size: 1.1rem;
            cursor: pointer;
            width: 100%;
            transition: all 0.3s ease;
        }
        
        .submit-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(244, 208, 111, 0.3);
        }
        
        .ai-assistance {
            margin-top: 30px;
            padding: 20px;
            background-color: rgba(179, 156, 208, 0.1);
            border-radius: 15px;
            text-align: center;
        }
        
        .ai-icon {
            font-size: 2rem;
            display: block;
            margin-bottom: 10px;
        }
        
        .ai-link {
            color: var(--deep-indigo);
            cursor: pointer;
            font-weight: 600;
            text-decoration: underline;
        }
        
        .privacy-note {
            text-align: center;
            font-size: 0.9rem;
            color: var(--deep-indigo);
            opacity: 0.8;
            font-style: italic;
            margin-top: 20px;
            padding: 15px;
            background-color: rgba(244, 208, 111, 0.1);
            border-radius: 10px;
        }
    </style>
</head>
<body>
    <header>
        <nav>
            <a href="/" class="logo">
                <div class="logo-img"><i class="fas fa-heart"></i></div>
                <span>Light in Silence</span>
            </a>
            <ul id="nav-menu">
                <li><a href="/" class="nav-primary">Home</a></li>
                <li><a href="/submit" class="nav-primary active">Share Your Story</a></li>
                <li><a href="/about" class="nav-primary">About</a></li>
                <li><a href="/contact" class="nav-primary">Contact</a></li>
                <li><a href="/resources" class="nav-primary">Resources</a></li>
                <li><a href="/volunteer-info" class="nav-primary">Volunteer</a></li>
                <li><a href="/donate" class="nav-primary">Donate</a></li>
            </ul>
        </nav>
    </header>
    
    <main>
        <div class="form-container">
            <h2>Share Your Story</h2>
            <p class="form-quote">"We are all broken. That's how the light gets in." — Ernest Hemingway</p>
            <p class="form-intro">No names, no judgement — just a safe space to express yourself and find support. We'll respond within 48 hours.</p>
            
            <div class="submission-options">
                <div class="submission-option active" data-type="online">Online Submission</div>
                <div class="submission-option" data-type="physical">Physical Mailbox</div>
            </div>
            
            <form method="POST" action="/submit">
                <div class="form-group">
                    <label class="form-label">Topic (Optional)</label>
                    <select name="topic" class="form-control">
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
                    <label class="form-label">Your Letter</label>
                    <textarea name="content" class="form-control" rows="8" placeholder="Share your thoughts, feelings, or concerns here..." required></textarea>
                </div>
                
                <div class="form-group">
                    <label class="form-label">How would you like to receive a reply? (Optional)</label>
                    <select name="reply_method" class="form-control" id="reply-method">
                        <option value="">Choose reply method...</option>
                        <option value="website">Check on website (you'll receive a reply code)</option>
                        <option value="anonymous-email">Anonymous email</option>
                        <option value="ai">AI-generated immediate response (plus human follow-up)</option>
                    </select>
                </div>
                
                <div class="form-group" id="email-container" style="display: none;">
                    <label class="form-label">Anonymous Email</label>
                    <input type="email" name="anonymous_email" class="form-control" placeholder="Your email address (we don't collect any personal information)">
                </div>
                
                <button type="submit" class="submit-btn">Send Letter</button>
            </form>
            
            <div class="ai-assistance">
                <span class="ai-icon">💬</span>
                <p>Need immediate support? <span class="ai-link" id="open-chat">Chat with our AI companion</span> or <a href="/chat" style="color: var(--deep-indigo); font-weight: 600;">try our full AI chat page</a>.</p>
            </div>
            
            <p class="privacy-note">We respect your privacy. We never track your name, location, or IP address. Read our <a href="/privacy" style="color: var(--deep-indigo); font-weight: 600;">Privacy Policy</a> to learn more.</p>
        </div>
    </main>
</body>
</html>`;
  
  return new Response(html, {
    headers: { 'Content-Type': 'text/html' }
  });
});

staticRoutes.get('/about', async (c) => {
  const html = `<!DOCTYPE html>
<html lang="en-CA">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>About Us - Light in Silence</title>
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <style>
        :root {
            --deep-indigo: #2A3D66;
            --soft-yellow: #F4D06F;
            --warm-white: #FAFAFA;
            --gentle-lavender: #B39CD0;
        }
        
        body {
            font-family: "Nunito", sans-serif;
            margin: 0;
            padding: 0;
            background-color: var(--warm-white);
            color: var(--deep-indigo);
        }
        
        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 2rem;
        }
        
        header {
            background: white;
            box-shadow: 0 2px 10px rgba(42, 61, 102, 0.1);
            position: sticky;
            top: 0;
            z-index: 1000;
        }
        
        nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem 2rem;
        }
        
        .logo {
            display: flex;
            align-items: center;
            text-decoration: none;
            color: var(--deep-indigo);
            font-weight: 700;
            font-size: 1.5rem;
        }
        
        .logo-img {
            margin-right: 10px;
            color: var(--gentle-lavender);
        }
        
        #nav-menu {
            display: flex;
            list-style: none;
            gap: 2rem;
        }
        
        #nav-menu li a {
            text-decoration: none;
            color: var(--deep-indigo);
            font-weight: 600;
            transition: color 0.3s ease;
        }
        
        #nav-menu li a:hover,
        #nav-menu li a.active {
            color: var(--gentle-lavender);
        }
        
        .page-container {
            max-width: 1000px;
            margin: 50px auto;
            padding: 0 2rem;
        }
        
        .page-header {
            text-align: center;
            margin-bottom: 50px;
        }
        
        .page-header h1 {
            color: var(--deep-indigo);
            font-size: 3rem;
            margin-bottom: 10px;
        }
        
        .page-header p {
            color: var(--gentle-lavender);
            font-size: 1.3rem;
            font-style: italic;
        }
        
        .content-section {
            background: white;
            padding: 40px;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(42, 61, 102, 0.1);
            margin-bottom: 30px;
        }
        
        .content-section h2 {
            color: var(--deep-indigo);
            margin-bottom: 20px;
            font-size: 2rem;
        }
        
        .content-section p {
            color: var(--deep-indigo);
            line-height: 1.6;
            margin-bottom: 15px;
            font-size: 1.1rem;
        }
        
        .content-section ul {
            margin-top: 20px;
            padding-left: 30px;
        }
        
        .content-section li {
            margin-bottom: 10px;
            font-size: 1.1rem;
            color: var(--deep-indigo);
        }
        
        .btn-primary {
            background: var(--soft-yellow);
            color: var(--deep-indigo);
            padding: 15px 30px;
            border-radius: 25px;
            text-decoration: none;
            font-weight: 600;
            display: inline-block;
            transition: all 0.3s ease;
        }
        
        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(244, 208, 111, 0.3);
        }
        
        .btn-secondary {
            background-color: rgba(255,255,255,0.2);
            color: white;
            padding: 15px 30px;
            border-radius: 25px;
            text-decoration: none;
            font-weight: 600;
            border: 2px solid rgba(255,255,255,0.3);
            display: inline-block;
            transition: all 0.3s ease;
        }
        
        .btn-secondary:hover {
            background-color: rgba(255,255,255,0.3);
        }
    </style>
</head>
<body>
    <header>
        <nav>
            <a href="/" class="logo">
                <div class="logo-img"><i class="fas fa-heart"></i></div>
                <span>Light in Silence</span>
            </a>
            <ul id="nav-menu">
                <li><a href="/" class="nav-primary">Home</a></li>
                <li><a href="/submit" class="nav-primary">Share Your Story</a></li>
                <li><a href="/about" class="nav-primary active">About</a></li>
            </ul>
        </nav>
    </header>
    
    <div class="page-container">
        <div class="page-header">
            <h1>About Light in Silence</h1>
            <p>Where Your Words Find Light</p>
        </div>
        
        <div class="content-section">
            <h2><i class="fas fa-heart" style="color: var(--soft-yellow); margin-right: 10px;"></i>Our Mission</h2>
            <p>Light in Silence is a Canadian non-profit mental health platform dedicated to bridging the gap between online and offline support systems. We believe that every voice deserves to be heard, and every story has the power to heal.</p>
            <p>Our innovative approach combines traditional letter-writing with modern technology, creating a safe space where individuals can share their experiences, receive compassionate responses, and find the support they need.</p>
        </div>
        
        <div class="content-section">
            <h2><i class="fas fa-lightbulb" style="color: var(--gentle-lavender); margin-right: 10px;"></i>Our Vision</h2>
            <p>We envision a world where mental health support is accessible, compassionate, and free from judgment. Through our dual approach of online platforms and physical mailboxes, we're creating multiple pathways to connection and healing.</p>
        </div>
        
        <div class="content-section">
            <h2><i class="fas fa-users" style="color: var(--soft-yellow); margin-right: 10px;"></i>How We Help</h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; margin-top: 25px;">
                <div style="background: white; padding: 25px; border-radius: 15px; box-shadow: 0 5px 15px rgba(42, 61, 102, 0.1); border-top: 4px solid var(--soft-yellow);">
                    <h3><i class="fas fa-laptop" style="color: var(--deep-indigo); margin-right: 10px;"></i>Online Platform</h3>
                    <p>Share your story through our secure online platform. Choose from AI-powered responses for immediate support or connect with trained volunteers for personalized care.</p>
                </div>
                <div style="background: white; padding: 25px; border-radius: 15px; box-shadow: 0 5px 15px rgba(42, 61, 102, 0.1); border-top: 4px solid var(--gentle-lavender);">
                    <h3><i class="fas fa-mailbox" style="color: var(--deep-indigo); margin-right: 10px;"></i>Physical Mailboxes</h3>
                    <p>For those who prefer traditional communication, our physical mailboxes located throughout Canada provide an offline way to share your thoughts and receive support.</p>
                </div>
                <div style="background: white; padding: 25px; border-radius: 15px; box-shadow: 0 5px 15px rgba(42, 61, 102, 0.1); border-top: 4px solid var(--soft-yellow);">
                    <h3><i class="fas fa-comments" style="color: var(--deep-indigo); margin-right: 10px;"></i>Community Chat</h3>
                    <p>Connect with others in our moderated community space, where you can share experiences and support one another in a safe, anonymous environment.</p>
                </div>
            </div>
        </div>
        
        <div class="content-section">
            <h2><i class="fas fa-shield-alt" style="color: var(--gentle-lavender); margin-right: 10px;"></i>Your Privacy & Safety</h2>
            <p>We take your privacy seriously. All communications are confidential, and you have complete control over how you share your story. Our trained volunteers and AI systems are designed to provide support while maintaining the highest standards of privacy and security.</p>
            <ul>
                <li>✓ Anonymous communication options</li>
                <li>✓ Secure, encrypted data storage</li>
                <li>✓ Trained volunteer support team</li>
                <li>✓ Crisis intervention protocols</li>
            </ul>
        </div>
        
        <div style="text-align: center; margin-top: 40px; padding: 40px; background: linear-gradient(135deg, var(--gentle-lavender), var(--deep-indigo)); border-radius: 20px; color: white;">
            <h2 style="color: white; margin-bottom: 20px;">Ready to Share Your Story?</h2>
            <p style="font-size: 1.2rem; margin-bottom: 30px; opacity: 0.9;">Take the first step towards healing and connection. Your words matter, and we're here to listen.</p>
            <div style="display: flex; gap: 20px; justify-content: center; flex-wrap: wrap;">
                <a href="/submit" class="btn-primary">Share Your Story</a>
                <a href="/volunteer-info" class="btn-secondary">Become a Volunteer</a>
            </div>
        </div>
    </div>
</body>
</html>`;
  
  return new Response(html, {
    headers: { 'Content-Type': 'text/html' }
  });
});

staticRoutes.get('/contact', async (c) => {
  const html = `<!DOCTYPE html>
<html lang="en-CA">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contact Us - Light in Silence</title>
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <style>
        :root {
            --deep-indigo: #2A3D66;
            --soft-yellow: #F4D06F;
            --warm-white: #FAFAFA;
            --gentle-lavender: #B39CD0;
        }
        
        body {
            font-family: "Nunito", sans-serif;
            margin: 0;
            padding: 0;
            background-color: var(--warm-white);
            color: var(--deep-indigo);
        }
        
        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 2rem;
        }
        
        header {
            background: white;
            box-shadow: 0 2px 10px rgba(42, 61, 102, 0.1);
            position: sticky;
            top: 0;
            z-index: 1000;
        }
        
        nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem 2rem;
        }
        
        .logo {
            display: flex;
            align-items: center;
            text-decoration: none;
            color: var(--deep-indigo);
            font-weight: 700;
            font-size: 1.5rem;
        }
        
        .logo-img {
            margin-right: 10px;
            color: var(--gentle-lavender);
        }
        
        #nav-menu {
            display: flex;
            list-style: none;
            gap: 2rem;
        }
        
        #nav-menu li a {
            text-decoration: none;
            color: var(--deep-indigo);
            font-weight: 600;
            transition: color 0.3s ease;
        }
        
        #nav-menu li a:hover,
        #nav-menu li a.active {
            color: var(--gentle-lavender);
        }
        
        .page-container {
            max-width: 1000px;
            margin: 50px auto;
            padding: 0 2rem;
        }
        
        .page-header {
            text-align: center;
            margin-bottom: 50px;
        }
        
        .page-header h1 {
            color: var(--deep-indigo);
            font-size: 3rem;
            margin-bottom: 10px;
        }
        
        .page-header p {
            color: var(--gentle-lavender);
            font-size: 1.3rem;
            font-style: italic;
        }
        
        .contact-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
            margin-bottom: 40px;
        }
        
        .contact-form {
            background: white;
            padding: 40px;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(42, 61, 102, 0.1);
        }
        
        .contact-info {
            background: white;
            padding: 40px;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(42, 61, 102, 0.1);
        }
        
        .form-group {
            margin-bottom: 25px;
        }
        
        .form-label {
            display: block;
            margin-bottom: 8px;
            color: var(--deep-indigo);
            font-weight: 600;
        }
        
        .form-control {
            width: 100%;
            padding: 15px;
            border: 2px solid #e0e0e0;
            border-radius: 10px;
            font-family: inherit;
            font-size: 1rem;
            transition: border-color 0.3s ease;
        }
        
        .form-control:focus {
            outline: none;
            border-color: var(--gentle-lavender);
        }
        
        .submit-btn {
            background: var(--soft-yellow);
            color: var(--deep-indigo);
            padding: 15px 30px;
            border: none;
            border-radius: 25px;
            font-weight: 600;
            font-size: 1.1rem;
            cursor: pointer;
            width: 100%;
            transition: all 0.3s ease;
        }
        
        .submit-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(244, 208, 111, 0.3);
        }
        
        .contact-item {
            display: flex;
            align-items: center;
            margin-bottom: 25px;
        }
        
        .contact-icon {
            width: 50px;
            height: 50px;
            background: var(--soft-yellow);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 20px;
            color: var(--deep-indigo);
            font-size: 1.2rem;
        }
        
        .contact-text h3 {
            margin: 0 0 5px 0;
            color: var(--deep-indigo);
        }
        
        .contact-text p {
            margin: 0;
            color: var(--deep-indigo);
            opacity: 0.8;
        }
        
        .mailbox-locations {
            background: white;
            padding: 40px;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(42, 61, 102, 0.1);
            margin-top: 40px;
        }
        
        .location-item {
            border-left: 4px solid var(--gentle-lavender);
            padding-left: 20px;
            margin-bottom: 20px;
        }
        
        .location-item h3 {
            color: var(--deep-indigo);
            margin-bottom: 5px;
        }
        
        .location-item p {
            color: var(--deep-indigo);
            opacity: 0.8;
            margin: 0;
        }
        
        @media (max-width: 768px) {
            .contact-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <header>
        <nav>
            <a href="/" class="logo">
                <div class="logo-img"><i class="fas fa-heart"></i></div>
                <span>Light in Silence</span>
            </a>
            <ul id="nav-menu">
                <li><a href="/" class="nav-primary">Home</a></li>
                <li><a href="/submit" class="nav-primary">Share Your Story</a></li>
                <li><a href="/about" class="nav-primary">About</a></li>
                <li><a href="/contact" class="nav-primary active">Contact</a></li>
                <li><a href="/resources" class="nav-primary">Resources</a></li>
                <li><a href="/volunteer-info" class="nav-primary">Volunteer</a></li>
                <li><a href="/donate" class="nav-primary">Donate</a></li>
            </ul>
        </nav>
    </header>
    
    <div class="page-container">
        <div class="page-header">
            <h1>Contact Us</h1>
            <p>Get in touch with our team</p>
        </div>
        
        <div class="contact-grid">
            <div class="contact-form">
                <h2>Send us a message</h2>
                <form method="POST" action="/contact">
                    <div class="form-group">
                        <label class="form-label">Name</label>
                        <input type="text" name="name" class="form-control" required>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Email</label>
                        <input type="email" name="email" class="form-control" required>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Subject</label>
                        <input type="text" name="subject" class="form-control" required>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Message</label>
                        <textarea name="message" class="form-control" rows="5" required></textarea>
                    </div>
                    
                    <button type="submit" class="submit-btn">Send Message</button>
                </form>
            </div>
            
            <div class="contact-info">
                <h2>Get in touch</h2>
                
                <div class="contact-item">
                    <div class="contact-icon">
                        <i class="fas fa-envelope"></i>
                    </div>
                    <div class="contact-text">
                        <h3>Email</h3>
                        <p>hello@lightinsilence.ca</p>
                    </div>
                </div>
                
                <div class="contact-item">
                    <div class="contact-icon">
                        <i class="fas fa-map-marker-alt"></i>
                    </div>
                    <div class="contact-text">
                        <h3>Address</h3>
                        <p>Toronto, Ontario, Canada</p>
                    </div>
                </div>
                
                <div class="contact-item">
                    <div class="contact-icon">
                        <i class="fas fa-clock"></i>
                    </div>
                    <div class="contact-text">
                        <h3>Response Time</h3>
                        <p>Within 48 hours</p>
                    </div>
                </div>
                
                <div class="contact-item">
                    <div class="contact-icon">
                        <i class="fas fa-shield-alt"></i>
                    </div>
                    <div class="contact-text">
                        <h3>Privacy</h3>
                        <p>All communications are confidential</p>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="mailbox-locations">
            <h2>Physical Mailbox Locations</h2>
            <p>Find our "tree hole" mailboxes in these community centres:</p>
            
            <div class="location-item">
                <h3>Toronto Community Centre</h3>
                <p>123 Main Street, Toronto, ON</p>
            </div>
            
            <div class="location-item">
                <h3>Vancouver Youth Centre</h3>
                <p>456 Oak Avenue, Vancouver, BC</p>
            </div>
            
            <div class="location-item">
                <h3>Montreal Community Hub</h3>
                <p>789 Pine Road, Montreal, QC</p>
            </div>
            
            <div class="location-item">
                <h3>Calgary Support Centre</h3>
                <p>321 Elm Street, Calgary, AB</p>
            </div>
        </div>
    </div>
</body>
</html>`;
  
  return new Response(html, {
    headers: { 'Content-Type': 'text/html' }
  });
});

staticRoutes.get('/resources', async (c) => {
  const html = `<!DOCTYPE html>
<html lang="en-CA">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Resources - Light in Silence</title>
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <style>
        :root {
            --deep-indigo: #2A3D66;
            --soft-yellow: #F4D06F;
            --warm-white: #FAFAFA;
            --gentle-lavender: #B39CD0;
        }
        
        body {
            font-family: "Nunito", sans-serif;
            margin: 0;
            padding: 0;
            background-color: var(--warm-white);
            color: var(--deep-indigo);
        }
        
        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 2rem;
        }
        
        header {
            background: white;
            box-shadow: 0 2px 10px rgba(42, 61, 102, 0.1);
            position: sticky;
            top: 0;
            z-index: 1000;
        }
        
        nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem 2rem;
        }
        
        .logo {
            display: flex;
            align-items: center;
            text-decoration: none;
            color: var(--deep-indigo);
            font-weight: 700;
            font-size: 1.5rem;
        }
        
        .logo-img {
            margin-right: 10px;
            color: var(--gentle-lavender);
        }
        
        #nav-menu {
            display: flex;
            list-style: none;
            gap: 2rem;
        }
        
        #nav-menu li a {
            text-decoration: none;
            color: var(--deep-indigo);
            font-weight: 600;
            transition: color 0.3s ease;
        }
        
        #nav-menu li a:hover,
        #nav-menu li a.active {
            color: var(--gentle-lavender);
        }
        
        .page-container {
            max-width: 1200px;
            margin: 50px auto;
            padding: 0 2rem;
        }
        
        .page-header {
            text-align: center;
            margin-bottom: 50px;
        }
        
        .page-header h1 {
            color: var(--deep-indigo);
            font-size: 3rem;
            margin-bottom: 10px;
        }
        
        .page-header p {
            color: var(--gentle-lavender);
            font-size: 1.3rem;
            font-style: italic;
        }
        
        .resources-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 30px;
            margin-bottom: 50px;
        }
        
        .resource-card {
            background: white;
            padding: 30px;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(42, 61, 102, 0.1);
            transition: transform 0.3s ease;
            border-top: 5px solid var(--gentle-lavender);
        }
        
        .resource-card:hover {
            transform: translateY(-5px);
        }
        
        .resource-icon {
            font-size: 2.5rem;
            color: var(--soft-yellow);
            margin-bottom: 20px;
        }
        
        .resource-card h3 {
            color: var(--deep-indigo);
            margin-bottom: 15px;
            font-size: 1.5rem;
        }
        
        .resource-card p {
            color: var(--deep-indigo);
            line-height: 1.6;
            margin-bottom: 20px;
        }
        
        .resource-link {
            color: var(--gentle-lavender);
            text-decoration: none;
            font-weight: 600;
            display: inline-flex;
            align-items: center;
            gap: 8px;
        }
        
        .resource-link:hover {
            text-decoration: underline;
        }
        
        .emergency-section {
            background: linear-gradient(135deg, var(--gentle-lavender), var(--deep-indigo));
            color: white;
            padding: 40px;
            border-radius: 20px;
            margin-bottom: 40px;
            text-align: center;
        }
        
        .emergency-section h2 {
            color: white;
            margin-bottom: 20px;
        }
        
        .emergency-section p {
            color: white;
            opacity: 0.9;
            margin-bottom: 30px;
        }
        
        .emergency-btn {
            background: var(--soft-yellow);
            color: var(--deep-indigo);
            padding: 15px 30px;
            border: none;
            border-radius: 25px;
            font-weight: 600;
            font-size: 1.1rem;
            cursor: pointer;
            margin: 0 10px;
            transition: all 0.3s ease;
        }
        
        .emergency-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(244, 208, 111, 0.3);
        }
        
        .crisis-hotline {
            background: rgba(255, 255, 255, 0.1);
            padding: 20px;
            border-radius: 15px;
            margin-top: 20px;
        }
        
        .crisis-hotline h3 {
            color: white;
            margin-bottom: 10px;
        }
        
        .crisis-hotline p {
            color: white;
            opacity: 0.9;
            margin: 5px 0;
        }
    </style>
</head>
<body>
    <header>
        <nav>
            <a href="/" class="logo">
                <div class="logo-img"><i class="fas fa-heart"></i></div>
                <span>Light in Silence</span>
            </a>
            <ul id="nav-menu">
                <li><a href="/" class="nav-primary">Home</a></li>
                <li><a href="/submit" class="nav-primary">Share Your Story</a></li>
                <li><a href="/about" class="nav-primary">About</a></li>
                <li><a href="/contact" class="nav-primary">Contact</a></li>
                <li><a href="/resources" class="nav-primary active">Resources</a></li>
                <li><a href="/volunteer-info" class="nav-primary">Volunteer</a></li>
                <li><a href="/donate" class="nav-primary">Donate</a></li>
            </ul>
        </nav>
    </header>
    
    <div class="page-container">
        <div class="page-header">
            <h1>Mental Health Resources</h1>
            <p>Find support and help when you need it most</p>
        </div>
        
        <div class="emergency-section">
            <h2>🆘 Crisis Support</h2>
            <p>If you're in immediate crisis or having thoughts of self-harm, please reach out for help right now.</p>
            <button class="emergency-btn" onclick="window.open('tel:911')">Call 911</button>
            <button class="emergency-btn" onclick="window.open('tel:1-833-456-4566')">Crisis Helpline</button>
            
            <div class="crisis-hotline">
                <h3>24/7 Crisis Support</h3>
                <p><strong>Canada Suicide Prevention Service:</strong> 1-833-456-4566</p>
                <p><strong>Crisis Text Line:</strong> Text HOME to 686868</p>
                <p><strong>Kids Help Phone:</strong> 1-800-668-6868</p>
            </div>
        </div>
        
        <div class="resources-grid">
            <div class="resource-card">
                <div class="resource-icon">
                    <i class="fas fa-phone"></i>
                </div>
                <h3>Helplines & Hotlines</h3>
                <p>24/7 support for mental health, crisis intervention, and emotional support.</p>
                <a href="#" class="resource-link">View All Helplines <i class="fas fa-arrow-right"></i></a>
            </div>
            
            <div class="resource-card">
                <div class="resource-icon">
                    <i class="fas fa-user-md"></i>
                </div>
                <h3>Professional Help</h3>
                <p>Find therapists, counselors, and mental health professionals in your area.</p>
                <a href="#" class="resource-link">Find Professionals <i class="fas fa-arrow-right"></i></a>
            </div>
            
            <div class="resource-card">
                <div class="resource-icon">
                    <i class="fas fa-users"></i>
                </div>
                <h3>Support Groups</h3>
                <p>Connect with others who understand what you're going through.</p>
                <a href="#" class="resource-link">Find Groups <i class="fas fa-arrow-right"></i></a>
            </div>
            
            <div class="resource-card">
                <div class="resource-icon">
                    <i class="fas fa-book"></i>
                </div>
                <h3>Educational Resources</h3>
                <p>Learn about mental health, coping strategies, and wellness practices.</p>
                <a href="#" class="resource-link">Read Articles <i class="fas fa-arrow-right"></i></a>
            </div>
            
            <div class="resource-card">
                <div class="resource-icon">
                    <i class="fas fa-mobile-alt"></i>
                </div>
                <h3>Mobile Apps</h3>
                <p>Apps for meditation, mood tracking, and mental health support.</p>
                <a href="#" class="resource-link">Discover Apps <i class="fas fa-arrow-right"></i></a>
            </div>
            
            <div class="resource-card">
                <div class="resource-icon">
                    <i class="fas fa-graduation-cap"></i>
                </div>
                <h3>Self-Help Tools</h3>
                <p>Worksheets, exercises, and techniques for managing mental health.</p>
                <a href="#" class="resource-link">Access Tools <i class="fas fa-arrow-right"></i></a>
            </div>
        </div>
        
        <div style="background: white; padding: 40px; border-radius: 20px; box-shadow: 0 10px 30px rgba(42, 61, 102, 0.1); text-align: center;">
            <h2 style="color: var(--deep-indigo); margin-bottom: 20px;">Need Immediate Support?</h2>
            <p style="color: var(--deep-indigo); margin-bottom: 30px; font-size: 1.1rem;">Our AI chat companion is available 24/7 for immediate support and conversation.</p>
            <a href="/chat" style="background: var(--soft-yellow); color: var(--deep-indigo); padding: 15px 30px; border-radius: 25px; text-decoration: none; font-weight: 600; display: inline-block; transition: all 0.3s ease;">Start Chat Now</a>
        </div>
    </div>
</body>
</html>`;
  
  return new Response(html, {
    headers: { 'Content-Type': 'text/html' }
  });
});

staticRoutes.get('/volunteer-info', async (c) => {
  const html = `<!DOCTYPE html>
<html lang="en-CA">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Volunteer - Light in Silence</title>
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <style>
        :root {
            --deep-indigo: #2A3D66;
            --soft-yellow: #F4D06F;
            --warm-white: #FAFAFA;
            --gentle-lavender: #B39CD0;
        }
        
        body {
            font-family: "Nunito", sans-serif;
            margin: 0;
            padding: 0;
            background-color: var(--warm-white);
            color: var(--deep-indigo);
        }
        
        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 2rem;
        }
        
        header {
            background: white;
            box-shadow: 0 2px 10px rgba(42, 61, 102, 0.1);
            position: sticky;
            top: 0;
            z-index: 1000;
        }
        
        nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem 2rem;
        }
        
        .logo {
            display: flex;
            align-items: center;
            text-decoration: none;
            color: var(--deep-indigo);
            font-weight: 700;
            font-size: 1.5rem;
        }
        
        .logo-img {
            margin-right: 10px;
            color: var(--gentle-lavender);
        }
        
        #nav-menu {
            display: flex;
            list-style: none;
            gap: 2rem;
        }
        
        #nav-menu li a {
            text-decoration: none;
            color: var(--deep-indigo);
            font-weight: 600;
            transition: color 0.3s ease;
        }
        
        #nav-menu li a:hover,
        #nav-menu li a.active {
            color: var(--gentle-lavender);
        }
        
        .page-container {
            max-width: 1200px;
            margin: 50px auto;
            padding: 0 2rem;
        }
        
        .page-header {
            text-align: center;
            margin-bottom: 50px;
        }
        
        .page-header h1 {
            color: var(--deep-indigo);
            font-size: 3rem;
            margin-bottom: 10px;
        }
        
        .page-header p {
            color: var(--gentle-lavender);
            font-size: 1.3rem;
            font-style: italic;
        }
        
        .hero-section {
            background: linear-gradient(135deg, var(--gentle-lavender), var(--deep-indigo));
            color: white;
            padding: 60px 40px;
            border-radius: 20px;
            text-align: center;
            margin-bottom: 50px;
        }
        
        .hero-section h2 {
            color: white;
            font-size: 2.5rem;
            margin-bottom: 20px;
        }
        
        .hero-section p {
            color: white;
            opacity: 0.9;
            font-size: 1.2rem;
            margin-bottom: 30px;
        }
        
        .btn-primary {
            background: var(--soft-yellow);
            color: var(--deep-indigo);
            padding: 15px 30px;
            border-radius: 25px;
            text-decoration: none;
            font-weight: 600;
            display: inline-block;
            transition: all 0.3s ease;
        }
        
        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(244, 208, 111, 0.3);
        }
        
        .benefits-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
            margin-bottom: 50px;
        }
        
        .benefit-card {
            background: white;
            padding: 30px;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(42, 61, 102, 0.1);
            text-align: center;
            border-top: 5px solid var(--soft-yellow);
        }
        
        .benefit-icon {
            font-size: 3rem;
            color: var(--gentle-lavender);
            margin-bottom: 20px;
        }
        
        .benefit-card h3 {
            color: var(--deep-indigo);
            margin-bottom: 15px;
            font-size: 1.5rem;
        }
        
        .benefit-card p {
            color: var(--deep-indigo);
            line-height: 1.6;
        }
        
        .requirements-section {
            background: white;
            padding: 40px;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(42, 61, 102, 0.1);
            margin-bottom: 40px;
        }
        
        .requirements-section h2 {
            color: var(--deep-indigo);
            margin-bottom: 30px;
            text-align: center;
        }
        
        .requirements-list {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
        }
        
        .requirement-item {
            display: flex;
            align-items: center;
            padding: 15px;
            background: var(--warm-white);
            border-radius: 10px;
        }
        
        .requirement-icon {
            width: 40px;
            height: 40px;
            background: var(--soft-yellow);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 15px;
            color: var(--deep-indigo);
        }
        
        .requirement-text {
            color: var(--deep-indigo);
            font-weight: 600;
        }
        
        .application-section {
            background: linear-gradient(135deg, var(--soft-yellow), var(--gentle-lavender));
            padding: 40px;
            border-radius: 20px;
            text-align: center;
            color: var(--deep-indigo);
        }
        
        .application-section h2 {
            color: var(--deep-indigo);
            margin-bottom: 20px;
        }
        
        .application-section p {
            color: var(--deep-indigo);
            margin-bottom: 30px;
            font-size: 1.1rem;
        }
        
        .btn-secondary {
            background: var(--deep-indigo);
            color: white;
            padding: 15px 30px;
            border-radius: 25px;
            text-decoration: none;
            font-weight: 600;
            display: inline-block;
            transition: all 0.3s ease;
        }
        
        .btn-secondary:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(42, 61, 102, 0.3);
        }
    </style>
</head>
<body>
    <header>
        <nav>
            <a href="/" class="logo">
                <div class="logo-img"><i class="fas fa-heart"></i></div>
                <span>Light in Silence</span>
            </a>
            <ul id="nav-menu">
                <li><a href="/" class="nav-primary">Home</a></li>
                <li><a href="/submit" class="nav-primary">Share Your Story</a></li>
                <li><a href="/about" class="nav-primary">About</a></li>
                <li><a href="/contact" class="nav-primary">Contact</a></li>
                <li><a href="/resources" class="nav-primary active">Resources</a></li>
                <li><a href="/volunteer-info" class="nav-primary">Volunteer</a></li>
                <li><a href="/donate" class="nav-primary">Donate</a></li>
            </ul>
        </nav>
    </header>
    
    <div class="page-container">
        <div class="page-header">
            <h1>Become a Volunteer</h1>
            <p>Join our community of compassionate listeners</p>
        </div>
        
        <div class="hero-section">
            <h2>Make a Difference</h2>
            <p>Help others find light in their darkest moments. As a volunteer, you'll provide compassionate responses to letters from people who need support.</p>
            <a href="/register" class="btn-primary">Apply to Volunteer</a>
        </div>
        
        <div class="benefits-grid">
            <div class="benefit-card">
                <div class="benefit-icon">
                    <i class="fas fa-heart"></i>
                </div>
                <h3>Make an Impact</h3>
                <p>Your words can change someone's life. Every response you write has the power to bring hope and comfort to someone in need.</p>
            </div>
            
            <div class="benefit-card">
                <div class="benefit-icon">
                    <i class="fas fa-users"></i>
                </div>
                <h3>Join a Community</h3>
                <p>Connect with other compassionate volunteers who share your commitment to mental health support and helping others.</p>
            </div>
            
            <div class="benefit-card">
                <div class="benefit-icon">
                    <i class="fas fa-graduation-cap"></i>
                </div>
                <h3>Learn & Grow</h3>
                <p>Receive training in mental health support, crisis intervention, and compassionate communication skills.</p>
            </div>
            
            <div class="benefit-card">
                <div class="benefit-icon">
                    <i class="fas fa-clock"></i>
                </div>
                <h3>Flexible Commitment</h3>
                <p>Volunteer on your own schedule. Respond to letters when you have time, from anywhere in the world.</p>
            </div>
            
            <div class="benefit-card">
                <div class="benefit-icon">
                    <i class="fas fa-shield-alt"></i>
                </div>
                <h3>Safe & Anonymous</h3>
                <p>All communications are anonymous. You'll never know the identity of the people you're helping, and they won't know yours.</p>
            </div>
            
            <div class="benefit-card">
                <div class="benefit-icon">
                    <i class="fas fa-certificate"></i>
                </div>
                <h3>Get Certified</h3>
                <p>Receive certification in mental health support and crisis intervention after completing our training program.</p>
            </div>
        </div>
        
        <div class="requirements-section">
            <h2>Requirements & Qualifications</h2>
            <div class="requirements-list">
                <div class="requirement-item">
                    <div class="requirement-icon">
                        <i class="fas fa-heart"></i>
                    </div>
                    <div class="requirement-text">Compassionate and empathetic nature</div>
                </div>
                
                <div class="requirement-item">
                    <div class="requirement-icon">
                        <i class="fas fa-pen"></i>
                    </div>
                    <div class="requirement-text">Strong writing and communication skills</div>
                </div>
                
                <div class="requirement-item">
                    <div class="requirement-icon">
                        <i class="fas fa-clock"></i>
                    </div>
                    <div class="requirement-text">Commitment to respond within 48 hours</div>
                </div>
                
                <div class="requirement-item">
                    <div class="requirement-icon">
                        <i class="fas fa-user-graduate"></i>
                    </div>
                    <div class="requirement-text">Complete our training program</div>
                </div>
                
                <div class="requirement-item">
                    <div class="requirement-icon">
                        <i class="fas fa-shield-alt"></i>
                    </div>
                    <div class="requirement-text">Maintain confidentiality and privacy</div>
                </div>
                
                <div class="requirement-item">
                    <div class="requirement-icon">
                        <i class="fas fa-calendar"></i>
                    </div>
                    <div class="requirement-text">Minimum 6-month commitment</div>
                </div>
            </div>
        </div>
        
        <div class="application-section">
            <h2>Ready to Make a Difference?</h2>
            <p>Join our team of compassionate volunteers and help others find light in their darkest moments.</p>
            <a href="/register" class="btn-secondary">Apply Now</a>
        </div>
    </div>
</body>
</html>`;
  
  return new Response(html, {
    headers: { 'Content-Type': 'text/html' }
  });
});

staticRoutes.get('/donate', async (c) => {
  const html = `<!DOCTYPE html>
<html lang="en-CA">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Donate - Light in Silence</title>
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <style>
        :root {
            --deep-indigo: #2A3D66;
            --soft-yellow: #F4D06F;
            --warm-white: #FAFAFA;
            --gentle-lavender: #B39CD0;
        }
        
        body {
            font-family: "Nunito", sans-serif;
            margin: 0;
            padding: 0;
            background-color: var(--warm-white);
            color: var(--deep-indigo);
        }
        
        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 2rem;
        }
        
        header {
            background: white;
            box-shadow: 0 2px 10px rgba(42, 61, 102, 0.1);
            position: sticky;
            top: 0;
            z-index: 1000;
        }
        
        nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem 2rem;
        }
        
        .logo {
            display: flex;
            align-items: center;
            text-decoration: none;
            color: var(--deep-indigo);
            font-weight: 700;
            font-size: 1.5rem;
        }
        
        .logo-img {
            margin-right: 10px;
            color: var(--gentle-lavender);
        }
        
        #nav-menu {
            display: flex;
            list-style: none;
            gap: 2rem;
        }
        
        #nav-menu li a {
            text-decoration: none;
            color: var(--deep-indigo);
            font-weight: 600;
            transition: color 0.3s ease;
        }
        
        #nav-menu li a:hover,
        #nav-menu li a.active {
            color: var(--gentle-lavender);
        }
        
        .page-container {
            max-width: 1000px;
            margin: 50px auto;
            padding: 0 2rem;
        }
        
        .page-header {
            text-align: center;
            margin-bottom: 50px;
        }
        
        .page-header h1 {
            color: var(--deep-indigo);
            font-size: 3rem;
            margin-bottom: 10px;
        }
        
        .page-header p {
            color: var(--gentle-lavender);
            font-size: 1.3rem;
            font-style: italic;
        }
        
        .donation-hero {
            background: linear-gradient(135deg, var(--gentle-lavender), var(--deep-indigo));
            color: white;
            padding: 60px 40px;
            border-radius: 20px;
            text-align: center;
            margin-bottom: 50px;
        }
        
        .donation-hero h2 {
            color: white;
            font-size: 2.5rem;
            margin-bottom: 20px;
        }
        
        .donation-hero p {
            color: white;
            opacity: 0.9;
            font-size: 1.2rem;
            margin-bottom: 30px;
        }
        
        .btn-primary {
            background: var(--soft-yellow);
            color: var(--deep-indigo);
            padding: 15px 30px;
            border-radius: 25px;
            text-decoration: none;
            font-weight: 600;
            display: inline-block;
            transition: all 0.3s ease;
            font-size: 1.1rem;
        }
        
        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(244, 208, 111, 0.3);
        }
        
        .impact-section {
            background: white;
            padding: 40px;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(42, 61, 102, 0.1);
            margin-bottom: 40px;
            text-align: center;
        }
        
        .impact-section h2 {
            color: var(--deep-indigo);
            margin-bottom: 30px;
        }
        
        .impact-stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 30px;
            margin-bottom: 30px;
        }
        
        .stat-item {
            text-align: center;
        }
        
        .stat-number {
            font-size: 2.5rem;
            font-weight: 700;
            color: var(--gentle-lavender);
            margin-bottom: 10px;
        }
        
        .stat-label {
            color: var(--deep-indigo);
            font-weight: 600;
        }
        
        .donation-options {
            background: white;
            padding: 40px;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(42, 61, 102, 0.1);
            margin-bottom: 40px;
        }
        
        .donation-options h2 {
            color: var(--deep-indigo);
            margin-bottom: 30px;
            text-align: center;
        }
        
        .donation-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
        }
        
        .donation-option {
            background: var(--warm-white);
            padding: 25px;
            border-radius: 15px;
            text-align: center;
            border: 2px solid transparent;
            transition: all 0.3s ease;
        }
        
        .donation-option:hover {
            border-color: var(--gentle-lavender);
            transform: translateY(-2px);
        }
        
        .donation-amount {
            font-size: 2rem;
            font-weight: 700;
            color: var(--deep-indigo);
            margin-bottom: 10px;
        }
        
        .donation-description {
            color: var(--deep-indigo);
            opacity: 0.8;
            margin-bottom: 20px;
        }
        
        .btn-secondary {
            background: var(--deep-indigo);
            color: white;
            padding: 12px 25px;
            border-radius: 20px;
            text-decoration: none;
            font-weight: 600;
            display: inline-block;
            transition: all 0.3s ease;
        }
        
        .btn-secondary:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(42, 61, 102, 0.3);
        }
        
        .transparency-section {
            background: white;
            padding: 40px;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(42, 61, 102, 0.1);
            text-align: center;
        }
        
        .transparency-section h2 {
            color: var(--deep-indigo);
            margin-bottom: 20px;
        }
        
        .transparency-section p {
            color: var(--deep-indigo);
            line-height: 1.6;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <header>
        <nav>
            <a href="/" class="logo">
                <div class="logo-img"><i class="fas fa-heart"></i></div>
                <span>Light in Silence</span>
            </a>
            <ul id="nav-menu">
                <li><a href="/" class="nav-primary">Home</a></li>
                <li><a href="/submit" class="nav-primary">Share Your Story</a></li>
                <li><a href="/about" class="nav-primary">About</a></li>
                <li><a href="/contact" class="nav-primary">Contact</a></li>
                <li><a href="/resources" class="nav-primary">Resources</a></li>
                <li><a href="/volunteer-info" class="nav-primary">Volunteer</a></li>
                <li><a href="/donate" class="nav-primary active">Donate</a></li>
            </ul>
        </nav>
    </header>
    
    <div class="page-container">
        <div class="page-header">
            <h1>Support Our Mission</h1>
            <p>Help us provide mental health support to those who need it most</p>
        </div>
        
        <div class="donation-hero">
            <h2>Your Donation Makes a Difference</h2>
            <p>Every dollar you donate helps us provide free mental health support to people in need. Your generosity enables us to maintain our platform, train volunteers, and expand our reach.</p>
            <a href="#donate" class="btn-primary">Donate Now</a>
        </div>
        
        <div class="impact-section">
            <h2>Your Impact</h2>
            <div class="impact-stats">
                <div class="stat-item">
                    <div class="stat-number">200+</div>
                    <div class="stat-label">People Helped</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">50+</div>
                    <div class="stat-label">Volunteers Trained</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">24/7</div>
                    <div class="stat-label">Support Available</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">100%</div>
                    <div class="stat-label">Free Service</div>
                </div>
            </div>
            <p style="color: var(--deep-indigo); font-style: italic;">Your donations help us keep our services completely free for everyone who needs support.</p>
        </div>
        
        <div class="donation-options" id="donate">
            <h2>Choose Your Donation Amount</h2>
            <div class="donation-grid">
                <div class="donation-option">
                    <div class="donation-amount">$25</div>
                    <div class="donation-description">Provides mental health support for 1 person</div>
                    <a href="#" class="btn-secondary">Donate $25</a>
                </div>
                
                <div class="donation-option">
                    <div class="donation-amount">$50</div>
                    <div class="donation-description">Trains 1 volunteer to help others</div>
                    <a href="#" class="btn-secondary">Donate $50</a>
                </div>
                
                <div class="donation-option">
                    <div class="donation-amount">$100</div>
                    <div class="donation-description">Maintains our platform for 1 month</div>
                    <a href="#" class="btn-secondary">Donate $100</a>
                </div>
                
                <div class="donation-option">
                    <div class="donation-amount">$250</div>
                    <div class="donation-description">Expands our services to new communities</div>
                    <a href="#" class="btn-secondary">Donate $250</a>
                </div>
            </div>
        </div>
        
        <div class="transparency-section">
            <h2>Transparency & Trust</h2>
            <p>We believe in complete transparency. 100% of your donations go directly to providing mental health support services. We publish detailed financial reports quarterly so you can see exactly how your money is being used to help others.</p>
            <p>Your donation is tax-deductible, and you'll receive a receipt for your records.</p>
        </div>
    </div>
</body>
</html>`;
  
  return new Response(html, {
    headers: { 'Content-Type': 'text/html' }
  });
});

// Serve static files
staticRoutes.get('/static/*', async (c) => {
  const path = c.req.path.replace('/static/', '');
  
  if (path.endsWith('.css')) {
    const cssContent = `
:root {
  --deep-indigo: #2A3D66;
  --soft-yellow: #F4D06F;
  --warm-white: #FAFAFA;
  --gentle-lavender: #B39CD0;
}

body {
  font-family: "Nunito", sans-serif;
  margin: 0;
  padding: 0;
}

header {
  background: white;
  box-shadow: 0 2px 10px rgba(42, 61, 102, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

nav {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: var(--deep-indigo);
  font-weight: 700;
  font-size: 1.5rem;
}

.logo-img {
  margin-right: 10px;
  color: var(--gentle-lavender);
}

#nav-menu {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 2rem;
}

#nav-menu li a {
  text-decoration: none;
  color: var(--deep-indigo);
  font-weight: 600;
  transition: color 0.3s ease;
}

#nav-menu li a:hover,
#nav-menu li a.active {
  color: var(--gentle-lavender);
}
    `;
    
    return new Response(cssContent, { headers: { 'Content-Type': 'text/css' } });
  }
  
  if (path.endsWith('.js')) {
    const jsContent = `
// Simple navigation script
document.addEventListener('DOMContentLoaded', function() {
  // Handle form submission
  const form = document.querySelector('form');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      alert('Thank you for sharing your story. We will respond within 48 hours.');
    });
  }
  
  // Handle reply method selection
  const replyMethod = document.getElementById('reply-method');
  const emailContainer = document.getElementById('email-container');
  
  if (replyMethod && emailContainer) {
    replyMethod.addEventListener('change', function() {
      if (this.value === 'anonymous-email') {
        emailContainer.style.display = 'block';
      } else {
        emailContainer.style.display = 'none';
      }
    });
  }
});
    `;
    
    return new Response(jsContent, { headers: { 'Content-Type': 'application/javascript' } });
  }
  
  return new Response('Static file not found', { status: 404 });
});

// Handle all other routes
staticRoutes.get('*', async (c) => {
  const html = `<!DOCTYPE html>
<html lang="en-CA">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Page Not Found - Light in Silence</title>
    <style>
        body {
            font-family: "Nunito", sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background-color: #FAFAFA;
            color: #2A3D66;
        }
        .error-container {
            text-align: center;
        }
        h1 { font-size: 3rem; margin-bottom: 20px; }
        p { font-size: 1.2rem; margin-bottom: 30px; }
        a {
            background: #F4D06F;
            color: #2A3D66;
            padding: 15px 30px;
            border-radius: 25px;
            text-decoration: none;
            font-weight: 600;
            display: inline-block;
        }
    </style>
</head>
<body>
    <div class="error-container">
        <h1>404</h1>
        <p>Page not found</p>
        <a href="/">Go Home</a>
    </div>
</body>
</html>`;
  
  return new Response(html, {
    headers: { 'Content-Type': 'text/html' },
    status: 404
  });
});

// Add missing pages
staticRoutes.get('/login', async (c) => {
  const html = `<!DOCTYPE html>
<html lang="en-CA">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Light in Silence</title>
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <style>
        :root {
            --deep-indigo: #2A3D66;
            --soft-yellow: #F4D06F;
            --warm-white: #FAFAFA;
            --gentle-lavender: #B39CD0;
        }
        
        body {
            font-family: "Nunito", sans-serif;
            margin: 0;
            padding: 0;
            background-color: var(--warm-white);
            color: var(--deep-indigo);
        }
        
        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 2rem;
        }
        
        header {
            background: white;
            box-shadow: 0 2px 10px rgba(42, 61, 102, 0.1);
            position: sticky;
            top: 0;
            z-index: 1000;
        }
        
        nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem 2rem;
        }
        
        .logo {
            display: flex;
            align-items: center;
            text-decoration: none;
            color: var(--deep-indigo);
            font-weight: 700;
            font-size: 1.5rem;
        }
        
        .logo-img {
            margin-right: 10px;
            color: var(--gentle-lavender);
        }
        
        #nav-menu {
            display: flex;
            list-style: none;
            gap: 2rem;
        }
        
        #nav-menu li a {
            text-decoration: none;
            color: var(--deep-indigo);
            font-weight: 600;
            transition: color 0.3s ease;
        }
        
        #nav-menu li a:hover,
        #nav-menu li a.active {
            color: var(--gentle-lavender);
        }
        
        .login-container {
            max-width: 400px;
            margin: 100px auto;
            padding: 40px;
            background: white;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(42, 61, 102, 0.1);
        }
        
        .login-container h2 {
            text-align: center;
            color: var(--deep-indigo);
            margin-bottom: 30px;
        }
        
        .form-group {
            margin-bottom: 25px;
        }
        
        .form-label {
            display: block;
            margin-bottom: 8px;
            color: var(--deep-indigo);
            font-weight: 600;
        }
        
        .form-control {
            width: 100%;
            padding: 15px;
            border: 2px solid #e0e0e0;
            border-radius: 10px;
            font-family: inherit;
            font-size: 1rem;
            transition: border-color 0.3s ease;
        }
        
        .form-control:focus {
            outline: none;
            border-color: var(--gentle-lavender);
        }
        
        .submit-btn {
            background: var(--soft-yellow);
            color: var(--deep-indigo);
            padding: 15px 30px;
            border: none;
            border-radius: 25px;
            font-weight: 600;
            font-size: 1.1rem;
            cursor: pointer;
            width: 100%;
            transition: all 0.3s ease;
        }
        
        .submit-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(244, 208, 111, 0.3);
        }
        
        .register-link {
            text-align: center;
            margin-top: 20px;
        }
        
        .register-link a {
            color: var(--gentle-lavender);
            text-decoration: none;
            font-weight: 600;
        }
        
        .register-link a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <header>
        <nav>
            <a href="/" class="logo">
                <div class="logo-img"><i class="fas fa-heart"></i></div>
                <span>Light in Silence</span>
            </a>
            <ul id="nav-menu">
                <li><a href="/" class="nav-primary">Home</a></li>
                <li><a href="/submit" class="nav-primary">Share Your Story</a></li>
                <li><a href="/about" class="nav-primary">About</a></li>
                <li><a href="/contact" class="nav-primary">Contact</a></li>
                <li><a href="/resources" class="nav-primary">Resources</a></li>
                <li><a href="/volunteer-info" class="nav-primary">Volunteer</a></li>
                <li><a href="/donate" class="nav-primary">Donate</a></li>
            </ul>
        </nav>
    </header>
    
    <div class="login-container">
        <h2>Login</h2>
        <form method="POST" action="/login">
            <div class="form-group">
                <label class="form-label">Email</label>
                <input type="email" name="email" class="form-control" required>
            </div>
            
            <div class="form-group">
                <label class="form-label">Password</label>
                <input type="password" name="password" class="form-control" required>
            </div>
            
            <button type="submit" class="submit-btn">Login</button>
        </form>
        
        <div class="register-link">
            <p>Don't have an account? <a href="/register">Register here</a></p>
        </div>
    </div>
</body>
</html>`;
  
  return new Response(html, {
    headers: { 'Content-Type': 'text/html' }
  });
});

staticRoutes.get('/register', async (c) => {
  const html = `<!DOCTYPE html>
<html lang="en-CA">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Register - Light in Silence</title>
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <style>
        :root {
            --deep-indigo: #2A3D66;
            --soft-yellow: #F4D06F;
            --warm-white: #FAFAFA;
            --gentle-lavender: #B39CD0;
        }
        
        body {
            font-family: "Nunito", sans-serif;
            margin: 0;
            padding: 0;
            background-color: var(--warm-white);
            color: var(--deep-indigo);
        }
        
        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 2rem;
        }
        
        header {
            background: white;
            box-shadow: 0 2px 10px rgba(42, 61, 102, 0.1);
            position: sticky;
            top: 0;
            z-index: 1000;
        }
        
        nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem 2rem;
        }
        
        .logo {
            display: flex;
            align-items: center;
            text-decoration: none;
            color: var(--deep-indigo);
            font-weight: 700;
            font-size: 1.5rem;
        }
        
        .logo-img {
            margin-right: 10px;
            color: var(--gentle-lavender);
        }
        
        #nav-menu {
            display: flex;
            list-style: none;
            gap: 2rem;
        }
        
        #nav-menu li a {
            text-decoration: none;
            color: var(--deep-indigo);
            font-weight: 600;
            transition: color 0.3s ease;
        }
        
        #nav-menu li a:hover,
        #nav-menu li a.active {
            color: var(--gentle-lavender);
        }
        
        .register-container {
            max-width: 500px;
            margin: 100px auto;
            padding: 40px;
            background: white;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(42, 61, 102, 0.1);
        }
        
        .register-container h2 {
            text-align: center;
            color: var(--deep-indigo);
            margin-bottom: 30px;
        }
        
        .form-group {
            margin-bottom: 25px;
        }
        
        .form-label {
            display: block;
            margin-bottom: 8px;
            color: var(--deep-indigo);
            font-weight: 600;
        }
        
        .form-control {
            width: 100%;
            padding: 15px;
            border: 2px solid #e0e0e0;
            border-radius: 10px;
            font-family: inherit;
            font-size: 1rem;
            transition: border-color 0.3s ease;
        }
        
        .form-control:focus {
            outline: none;
            border-color: var(--gentle-lavender);
        }
        
        .submit-btn {
            background: var(--soft-yellow);
            color: var(--deep-indigo);
            padding: 15px 30px;
            border: none;
            border-radius: 25px;
            font-weight: 600;
            font-size: 1.1rem;
            cursor: pointer;
            width: 100%;
            transition: all 0.3s ease;
        }
        
        .submit-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(244, 208, 111, 0.3);
        }
        
        .login-link {
            text-align: center;
            margin-top: 20px;
        }
        
        .login-link a {
            color: var(--gentle-lavender);
            text-decoration: none;
            font-weight: 600;
        }
        
        .login-link a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <header>
        <nav>
            <a href="/" class="logo">
                <div class="logo-img"><i class="fas fa-heart"></i></div>
                <span>Light in Silence</span>
            </a>
            <ul id="nav-menu">
                <li><a href="/" class="nav-primary">Home</a></li>
                <li><a href="/submit" class="nav-primary">Share Your Story</a></li>
                <li><a href="/about" class="nav-primary">About</a></li>
                <li><a href="/contact" class="nav-primary">Contact</a></li>
                <li><a href="/resources" class="nav-primary">Resources</a></li>
                <li><a href="/volunteer-info" class="nav-primary">Volunteer</a></li>
                <li><a href="/donate" class="nav-primary">Donate</a></li>
            </ul>
        </nav>
    </header>
    
    <div class="register-container">
        <h2>Register</h2>
        <form method="POST" action="/register">
            <div class="form-group">
                <label class="form-label">Username</label>
                <input type="text" name="username" class="form-control" required>
            </div>
            
            <div class="form-group">
                <label class="form-label">Email</label>
                <input type="email" name="email" class="form-control" required>
            </div>
            
            <div class="form-group">
                <label class="form-label">Password</label>
                <input type="password" name="password" class="form-control" required>
            </div>
            
            <div class="form-group">
                <label class="form-label">Confirm Password</label>
                <input type="password" name="confirm_password" class="form-control" required>
            </div>
            
            <button type="submit" class="submit-btn">Register</button>
        </form>
        
        <div class="login-link">
            <p>Already have an account? <a href="/login">Login here</a></p>
        </div>
    </div>
</body>
</html>`;
  
  return new Response(html, {
    headers: { 'Content-Type': 'text/html' }
  });
});

staticRoutes.get('/chat', async (c) => {
  const html = `<!DOCTYPE html>
<html lang="en-CA">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Chat - Light in Silence</title>
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <style>
        :root {
            --deep-indigo: #2A3D66;
            --soft-yellow: #F4D06F;
            --warm-white: #FAFAFA;
            --gentle-lavender: #B39CD0;
        }
        
        body {
            font-family: "Nunito", sans-serif;
            margin: 0;
            padding: 0;
            background-color: var(--warm-white);
            color: var(--deep-indigo);
        }
        
        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 2rem;
        }
        
        header {
            background: white;
            box-shadow: 0 2px 10px rgba(42, 61, 102, 0.1);
            position: sticky;
            top: 0;
            z-index: 1000;
        }
        
        nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem 2rem;
        }
        
        .logo {
            display: flex;
            align-items: center;
            text-decoration: none;
            color: var(--deep-indigo);
            font-weight: 700;
            font-size: 1.5rem;
        }
        
        .logo-img {
            margin-right: 10px;
            color: var(--gentle-lavender);
        }
        
        #nav-menu {
            display: flex;
            list-style: none;
            gap: 2rem;
        }
        
        #nav-menu li a {
            text-decoration: none;
            color: var(--deep-indigo);
            font-weight: 600;
            transition: color 0.3s ease;
        }
        
        #nav-menu li a:hover,
        #nav-menu li a.active {
            color: var(--gentle-lavender);
        }
        
        .chat-container {
            max-width: 800px;
            margin: 50px auto;
            background: white;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(42, 61, 102, 0.1);
            overflow: hidden;
        }
        
        .chat-header {
            background: linear-gradient(135deg, var(--gentle-lavender), var(--deep-indigo));
            color: white;
            padding: 20px;
            text-align: center;
        }
        
        .chat-header h2 {
            margin: 0;
            font-size: 1.5rem;
        }
        
        .chat-messages {
            height: 400px;
            overflow-y: auto;
            padding: 20px;
            background: var(--warm-white);
        }
        
        .message {
            margin-bottom: 15px;
            display: flex;
            align-items: flex-start;
        }
        
        .message.user {
            justify-content: flex-end;
        }
        
        .message-content {
            max-width: 70%;
            padding: 12px 16px;
            border-radius: 15px;
            word-wrap: break-word;
        }
        
        .message.user .message-content {
            background: var(--soft-yellow);
            color: var(--deep-indigo);
        }
        
        .message.ai .message-content {
            background: white;
            color: var(--deep-indigo);
            border: 1px solid #e0e0e0;
        }
        
        .chat-input {
            padding: 20px;
            border-top: 1px solid #e0e0e0;
            display: flex;
            gap: 10px;
        }
        
        .chat-input input {
            flex: 1;
            padding: 12px;
            border: 2px solid #e0e0e0;
            border-radius: 25px;
            font-family: inherit;
            font-size: 1rem;
        }
        
        .chat-input input:focus {
            outline: none;
            border-color: var(--gentle-lavender);
        }
        
        .send-btn {
            background: var(--gentle-lavender);
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 25px;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .send-btn:hover {
            background: var(--deep-indigo);
        }
    </style>
</head>
<body>
    <header>
        <nav>
            <a href="/" class="logo">
                <div class="logo-img"><i class="fas fa-heart"></i></div>
                <span>Light in Silence</span>
            </a>
            <ul id="nav-menu">
                <li><a href="/" class="nav-primary">Home</a></li>
                <li><a href="/submit" class="nav-primary">Share Your Story</a></li>
                <li><a href="/about" class="nav-primary">About</a></li>
                <li><a href="/contact" class="nav-primary">Contact</a></li>
                <li><a href="/resources" class="nav-primary">Resources</a></li>
                <li><a href="/volunteer-info" class="nav-primary">Volunteer</a></li>
                <li><a href="/donate" class="nav-primary">Donate</a></li>
            </ul>
        </nav>
    </header>
    
    <div class="chat-container">
        <div class="chat-header">
            <h2><i class="fas fa-robot"></i> AI Chat Companion</h2>
        </div>
        
        <div class="chat-messages" id="chat-messages">
            <div class="message ai">
                <div class="message-content">
                    Hello! I am here to listen and support you. How are you feeling today?
                </div>
            </div>
        </div>
        
        <div class="chat-input">
            <input type="text" id="message-input" placeholder="Type your message...">
            <button class="send-btn" onclick="sendMessage()">
                <i class="fas fa-paper-plane"></i>
            </button>
        </div>
    </div>
    
    <script>
        function sendMessage() {
            const input = document.getElementById("message-input");
            const message = input.value.trim();
            
            if (message) {
                addMessage(message, "user");
                input.value = "";
                
                // Simulate AI response
                setTimeout(() => {
                    addMessage("Thank you for sharing that with me. I am here to listen and support you.", "ai");
                }, 1000);
            }
        }
        
        function addMessage(text, sender) {
            const messagesContainer = document.getElementById("chat-messages");
            const messageDiv = document.createElement("div");
            messageDiv.className = "message " + sender;
            messageDiv.innerHTML = '<div class="message-content">' + text + '</div>';
            messagesContainer.appendChild(messageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
        
        // Enter key to send message
        document.getElementById("message-input").addEventListener("keypress", function(e) {
            if (e.key === "Enter") {
                sendMessage();
            }
        });
    </script>
</body>
</html>`;
  
  return new Response(html, {
    headers: { 'Content-Type': 'text/html' }
  });
});

// Add blog pages
staticRoutes.get('/blog', async (c) => {
  const html = `<!DOCTYPE html>
<html lang="en-CA">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Blog - Light in Silence</title>
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <style>
        :root {
            --deep-indigo: #2A3D66;
            --soft-yellow: #F4D06F;
            --warm-white: #FAFAFA;
            --gentle-lavender: #B39CD0;
        }
        
        body {
            font-family: "Nunito", sans-serif;
            margin: 0;
            padding: 0;
            background-color: var(--warm-white);
            color: var(--deep-indigo);
        }
        
        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 2rem;
        }
        
        header {
            background: white;
            box-shadow: 0 2px 10px rgba(42, 61, 102, 0.1);
            position: sticky;
            top: 0;
            z-index: 1000;
        }
        
        nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem 2rem;
        }
        
        .logo {
            display: flex;
            align-items: center;
            text-decoration: none;
            color: var(--deep-indigo);
            font-weight: 700;
            font-size: 1.5rem;
        }
        
        .logo-img {
            margin-right: 10px;
            color: var(--gentle-lavender);
        }
        
        #nav-menu {
            display: flex;
            list-style: none;
            gap: 2rem;
        }
        
        #nav-menu li a {
            text-decoration: none;
            color: var(--deep-indigo);
            font-weight: 600;
            transition: color 0.3s ease;
        }
        
        #nav-menu li a:hover,
        #nav-menu li a.active {
            color: var(--gentle-lavender);
        }
        
        .page-container {
            max-width: 1200px;
            margin: 50px auto;
            padding: 0 2rem;
        }
        
        .page-header {
            text-align: center;
            margin-bottom: 50px;
        }
        
        .page-header h1 {
            color: var(--deep-indigo);
            font-size: 3rem;
            margin-bottom: 10px;
        }
        
        .page-header p {
            color: var(--gentle-lavender);
            font-size: 1.3rem;
            font-style: italic;
        }
        
        .blog-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 30px;
        }
        
        .blog-card {
            background: white;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(42, 61, 102, 0.1);
            overflow: hidden;
            transition: transform 0.3s ease;
        }
        
        .blog-card:hover {
            transform: translateY(-5px);
        }
        
        .blog-image {
            height: 200px;
            background: linear-gradient(135deg, var(--gentle-lavender), var(--soft-yellow));
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 3rem;
        }
        
        .blog-content {
            padding: 25px;
        }
        
        .blog-date {
            color: var(--gentle-lavender);
            font-size: 0.9rem;
            margin-bottom: 10px;
        }
        
        .blog-title {
            color: var(--deep-indigo);
            font-size: 1.3rem;
            margin-bottom: 15px;
            font-weight: 600;
        }
        
        .blog-excerpt {
            color: var(--deep-indigo);
            opacity: 0.8;
            line-height: 1.6;
            margin-bottom: 20px;
        }
        
        .read-more {
            color: var(--gentle-lavender);
            text-decoration: none;
            font-weight: 600;
        }
        
        .read-more:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <header>
        <nav>
            <a href="/" class="logo">
                <div class="logo-img"><i class="fas fa-heart"></i></div>
                <span>Light in Silence</span>
            </a>
            <ul id="nav-menu">
                <li><a href="/" class="nav-primary">Home</a></li>
                <li><a href="/submit" class="nav-primary">Share Your Story</a></li>
                <li><a href="/about" class="nav-primary">About</a></li>
                <li><a href="/contact" class="nav-primary">Contact</a></li>
                <li><a href="/resources" class="nav-primary">Resources</a></li>
                <li><a href="/volunteer-info" class="nav-primary">Volunteer</a></li>
                <li><a href="/donate" class="nav-primary">Donate</a></li>
            </ul>
        </nav>
    </header>
    
    <div class="page-container">
        <div class="page-header">
            <h1>Blog</h1>
            <p>Mental health insights and stories</p>
        </div>
        
        <div class="blog-grid">
            <div class="blog-card">
                <div class="blog-image">
                    <i class="fas fa-heart"></i>
                </div>
                <div class="blog-content">
                    <div class="blog-date">December 15, 2024</div>
                    <h3 class="blog-title">Coping with Holiday Stress</h3>
                    <p class="blog-excerpt">The holiday season can be overwhelming. Learn practical strategies for managing stress and finding peace during this time of year.</p>
                    <a href="/blog/post/1" class="read-more">Read More →</a>
                </div>
            </div>
            
            <div class="blog-card">
                <div class="blog-image">
                    <i class="fas fa-users"></i>
                </div>
                <div class="blog-content">
                    <div class="blog-date">December 10, 2024</div>
                    <h3 class="blog-title">Building Supportive Communities</h3>
                    <p class="blog-excerpt">How to create and maintain healthy relationships that support your mental health and well-being.</p>
                    <a href="/blog/post/2" class="read-more">Read More →</a>
                </div>
            </div>
            
            <div class="blog-card">
                <div class="blog-image">
                    <i class="fas fa-lightbulb"></i>
                </div>
                <div class="blog-content">
                    <div class="blog-date">December 5, 2024</div>
                    <h3 class="blog-title">Mindfulness for Beginners</h3>
                    <p class="blog-excerpt">Simple mindfulness techniques you can start practicing today to improve your mental health and reduce anxiety.</p>
                    <a href="/blog/post/3" class="read-more">Read More →</a>
                </div>
            </div>
        </div>
    </div>
</body>
</html>`;
  
  return new Response(html, {
    headers: { 'Content-Type': 'text/html' }
  });
});

staticRoutes.get('/events', async (c) => {
  const html = `<!DOCTYPE html>
<html lang="en-CA">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Events - Light in Silence</title>
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <style>
        :root {
            --deep-indigo: #2A3D66;
            --soft-yellow: #F4D06F;
            --warm-white: #FAFAFA;
            --gentle-lavender: #B39CD0;
        }
        
        body {
            font-family: "Nunito", sans-serif;
            margin: 0;
            padding: 0;
            background-color: var(--warm-white);
            color: var(--deep-indigo);
        }
        
        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 2rem;
        }
        
        header {
            background: white;
            box-shadow: 0 2px 10px rgba(42, 61, 102, 0.1);
            position: sticky;
            top: 0;
            z-index: 1000;
        }
        
        nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem 2rem;
        }
        
        .logo {
            display: flex;
            align-items: center;
            text-decoration: none;
            color: var(--deep-indigo);
            font-weight: 700;
            font-size: 1.5rem;
        }
        
        .logo-img {
            margin-right: 10px;
            color: var(--gentle-lavender);
        }
        
        #nav-menu {
            display: flex;
            list-style: none;
            gap: 2rem;
        }
        
        #nav-menu li a {
            text-decoration: none;
            color: var(--deep-indigo);
            font-weight: 600;
            transition: color 0.3s ease;
        }
        
        #nav-menu li a:hover,
        #nav-menu li a.active {
            color: var(--gentle-lavender);
        }
        
        .page-container {
            max-width: 1200px;
            margin: 50px auto;
            padding: 0 2rem;
        }
        
        .page-header {
            text-align: center;
            margin-bottom: 50px;
        }
        
        .page-header h1 {
            color: var(--deep-indigo);
            font-size: 3rem;
            margin-bottom: 10px;
        }
        
        .page-header p {
            color: var(--gentle-lavender);
            font-size: 1.3rem;
            font-style: italic;
        }
        
        .events-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 30px;
        }
        
        .event-card {
            background: white;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(42, 61, 102, 0.1);
            overflow: hidden;
            transition: transform 0.3s ease;
        }
        
        .event-card:hover {
            transform: translateY(-5px);
        }
        
        .event-image {
            height: 200px;
            background: linear-gradient(135deg, var(--soft-yellow), var(--gentle-lavender));
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 3rem;
        }
        
        .event-content {
            padding: 25px;
        }
        
        .event-date {
            color: var(--gentle-lavender);
            font-size: 0.9rem;
            margin-bottom: 10px;
        }
        
        .event-title {
            color: var(--deep-indigo);
            font-size: 1.3rem;
            margin-bottom: 15px;
            font-weight: 600;
        }
        
        .event-description {
            color: var(--deep-indigo);
            opacity: 0.8;
            line-height: 1.6;
            margin-bottom: 20px;
        }
        
        .event-location {
            color: var(--deep-indigo);
            font-weight: 600;
            margin-bottom: 15px;
        }
        
        .register-btn {
            background: var(--gentle-lavender);
            color: white;
            padding: 10px 20px;
            border-radius: 20px;
            text-decoration: none;
            font-weight: 600;
            display: inline-block;
            transition: all 0.3s ease;
        }
        
        .register-btn:hover {
            background: var(--deep-indigo);
        }
    </style>
</head>
<body>
    <header>
        <nav>
            <a href="/" class="logo">
                <div class="logo-img"><i class="fas fa-heart"></i></div>
                <span>Light in Silence</span>
            </a>
            <ul id="nav-menu">
                <li><a href="/" class="nav-primary">Home</a></li>
                <li><a href="/submit" class="nav-primary">Share Your Story</a></li>
                <li><a href="/about" class="nav-primary">About</a></li>
                <li><a href="/contact" class="nav-primary">Contact</a></li>
                <li><a href="/resources" class="nav-primary">Resources</a></li>
                <li><a href="/volunteer-info" class="nav-primary">Volunteer</a></li>
                <li><a href="/donate" class="nav-primary">Donate</a></li>
            </ul>
        </nav>
    </header>
    
    <div class="page-container">
        <div class="page-header">
            <h1>Events</h1>
            <p>Join our community events and workshops</p>
        </div>
        
        <div class="events-grid">
            <div class="event-card">
                <div class="event-image">
                    <i class="fas fa-calendar"></i>
                </div>
                <div class="event-content">
                    <div class="event-date">December 20, 2024 • 2:00 PM</div>
                    <h3 class="event-title">Mental Health Support Workshop</h3>
                    <p class="event-description">Learn practical techniques for managing stress and anxiety in this interactive workshop.</p>
                    <div class="event-location">📍 Toronto Community Centre</div>
                    <a href="/events/1" class="register-btn">Register Now</a>
                </div>
            </div>
            
            <div class="event-card">
                <div class="event-image">
                    <i class="fas fa-users"></i>
                </div>
                <div class="event-content">
                    <div class="event-date">December 25, 2024 • 7:00 PM</div>
                    <h3 class="event-title">Holiday Support Group</h3>
                    <p class="event-description">A safe space to share feelings and find support during the holiday season.</p>
                    <div class="event-location">📍 Vancouver Youth Centre</div>
                    <a href="/events/2" class="register-btn">Register Now</a>
                </div>
            </div>
            
            <div class="event-card">
                <div class="event-image">
                    <i class="fas fa-graduation-cap"></i>
                </div>
                <div class="event-content">
                    <div class="event-date">January 5, 2025 • 1:00 PM</div>
                    <h3 class="event-title">Volunteer Training Session</h3>
                    <p class="event-description">Learn how to become a volunteer and provide compassionate support to others.</p>
                    <div class="event-location">📍 Montreal Community Hub</div>
                    <a href="/events/3" class="register-btn">Register Now</a>
                </div>
            </div>
        </div>
    </div>
</body>
</html>`;
  
  return new Response(html, {
    headers: { 'Content-Type': 'text/html' }
  });
});

staticRoutes.get('/privacy', async (c) => {
  const html = `<!DOCTYPE html>
<html lang="en-CA">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Privacy Policy - Light in Silence</title>
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <style>
        :root {
            --deep-indigo: #2A3D66;
            --soft-yellow: #F4D06F;
            --warm-white: #FAFAFA;
            --gentle-lavender: #B39CD0;
        }
        
        body {
            font-family: "Nunito", sans-serif;
            margin: 0;
            padding: 0;
            background-color: var(--warm-white);
            color: var(--deep-indigo);
        }
        
        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 2rem;
        }
        
        header {
            background: white;
            box-shadow: 0 2px 10px rgba(42, 61, 102, 0.1);
            position: sticky;
            top: 0;
            z-index: 1000;
        }
        
        nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem 2rem;
        }
        
        .logo {
            display: flex;
            align-items: center;
            text-decoration: none;
            color: var(--deep-indigo);
            font-weight: 700;
            font-size: 1.5rem;
        }
        
        .logo-img {
            margin-right: 10px;
            color: var(--gentle-lavender);
        }
        
        #nav-menu {
            display: flex;
            list-style: none;
            gap: 2rem;
        }
        
        #nav-menu li a {
            text-decoration: none;
            color: var(--deep-indigo);
            font-weight: 600;
            transition: color 0.3s ease;
        }
        
        #nav-menu li a:hover,
        #nav-menu li a.active {
            color: var(--gentle-lavender);
        }
        
        .page-container {
            max-width: 800px;
            margin: 50px auto;
            padding: 0 2rem;
        }
        
        .page-header {
            text-align: center;
            margin-bottom: 50px;
        }
        
        .page-header h1 {
            color: var(--deep-indigo);
            font-size: 3rem;
            margin-bottom: 10px;
        }
        
        .page-header p {
            color: var(--gentle-lavender);
            font-size: 1.3rem;
            font-style: italic;
        }
        
        .content-section {
            background: white;
            padding: 40px;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(42, 61, 102, 0.1);
            margin-bottom: 30px;
        }
        
        .content-section h2 {
            color: var(--deep-indigo);
            margin-bottom: 20px;
            font-size: 1.8rem;
        }
        
        .content-section p {
            color: var(--deep-indigo);
            line-height: 1.6;
            margin-bottom: 15px;
        }
        
        .content-section ul {
            margin-top: 20px;
            padding-left: 30px;
        }
        
        .content-section li {
            margin-bottom: 10px;
            color: var(--deep-indigo);
            line-height: 1.6;
        }
    </style>
</head>
<body>
    <header>
        <nav>
            <a href="/" class="logo">
                <div class="logo-img"><i class="fas fa-heart"></i></div>
                <span>Light in Silence</span>
            </a>
            <ul id="nav-menu">
                <li><a href="/" class="nav-primary">Home</a></li>
                <li><a href="/submit" class="nav-primary">Share Your Story</a></li>
                <li><a href="/about" class="nav-primary">About</a></li>
                <li><a href="/contact" class="nav-primary">Contact</a></li>
                <li><a href="/resources" class="nav-primary">Resources</a></li>
                <li><a href="/volunteer-info" class="nav-primary">Volunteer</a></li>
                <li><a href="/donate" class="nav-primary">Donate</a></li>
            </ul>
        </nav>
    </header>
    
    <div class="page-container">
        <div class="page-header">
            <h1>Privacy Policy</h1>
            <p>How we protect your information</p>
        </div>
        
        <div class="content-section">
            <h2>Your Privacy Matters</h2>
            <p>At Light in Silence, we are committed to protecting your privacy and ensuring the confidentiality of all communications. This policy explains how we collect, use, and protect your information.</p>
        </div>
        
        <div class="content-section">
            <h2>Information We Collect</h2>
            <p>We collect minimal information to provide our services:</p>
            <ul>
                <li><strong>Anonymous Letters:</strong> We do not collect any personal information from letter submissions</li>
                <li><strong>Volunteer Applications:</strong> Basic contact information for volunteer registration</li>
                <li><strong>Website Usage:</strong> Anonymous analytics to improve our services</li>
            </ul>
        </div>
        
        <div class="content-section">
            <h2>How We Use Your Information</h2>
            <p>Your information is used solely to:</p>
            <ul>
                <li>Provide mental health support services</li>
                <li>Train and manage volunteers</li>
                <li>Improve our platform and services</li>
                <li>Ensure the safety and security of our community</li>
            </ul>
        </div>
        
        <div class="content-section">
            <h2>Data Protection</h2>
            <p>We implement strict security measures to protect your information:</p>
            <ul>
                <li>All data is encrypted in transit and at rest</li>
                <li>We never share your information with third parties</li>
                <li>Access to personal data is strictly limited</li>
                <li>Regular security audits and updates</li>
            </ul>
        </div>
        
        <div class="content-section">
            <h2>Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
                <li>Access any personal information we hold about you</li>
                <li>Request correction of inaccurate information</li>
                <li>Request deletion of your personal data</li>
                <li>Withdraw consent for data processing</li>
            </ul>
        </div>
        
        <div class="content-section">
            <h2>Contact Us</h2>
            <p>If you have any questions about our privacy policy or how we handle your information, please contact us at privacy@lightinsilence.ca</p>
        </div>
    </div>
</body>
</html>`;
  
  return new Response(html, {
    headers: { 'Content-Type': 'text/html' }
  });
});

staticRoutes.get('/terms', async (c) => {
  const html = `<!DOCTYPE html>
<html lang="en-CA">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Terms of Service - Light in Silence</title>
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <style>
        :root {
            --deep-indigo: #2A3D66;
            --soft-yellow: #F4D06F;
            --warm-white: #FAFAFA;
            --gentle-lavender: #B39CD0;
        }
        
        body {
            font-family: "Nunito", sans-serif;
            margin: 0;
            padding: 0;
            background-color: var(--warm-white);
            color: var(--deep-indigo);
        }
        
        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 2rem;
        }
        
        header {
            background: white;
            box-shadow: 0 2px 10px rgba(42, 61, 102, 0.1);
            position: sticky;
            top: 0;
            z-index: 1000;
        }
        
        nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem 2rem;
        }
        
        .logo {
            display: flex;
            align-items: center;
            text-decoration: none;
            color: var(--deep-indigo);
            font-weight: 700;
            font-size: 1.5rem;
        }
        
        .logo-img {
            margin-right: 10px;
            color: var(--gentle-lavender);
        }
        
        #nav-menu {
            display: flex;
            list-style: none;
            gap: 2rem;
        }
        
        #nav-menu li a {
            text-decoration: none;
            color: var(--deep-indigo);
            font-weight: 600;
            transition: color 0.3s ease;
        }
        
        #nav-menu li a:hover,
        #nav-menu li a.active {
            color: var(--gentle-lavender);
        }
        
        .page-container {
            max-width: 800px;
            margin: 50px auto;
            padding: 0 2rem;
        }
        
        .page-header {
            text-align: center;
            margin-bottom: 50px;
        }
        
        .page-header h1 {
            color: var(--deep-indigo);
            font-size: 3rem;
            margin-bottom: 10px;
        }
        
        .page-header p {
            color: var(--gentle-lavender);
            font-size: 1.3rem;
            font-style: italic;
        }
        
        .content-section {
            background: white;
            padding: 40px;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(42, 61, 102, 0.1);
            margin-bottom: 30px;
        }
        
        .content-section h2 {
            color: var(--deep-indigo);
            margin-bottom: 20px;
            font-size: 1.8rem;
        }
        
        .content-section p {
            color: var(--deep-indigo);
            line-height: 1.6;
            margin-bottom: 15px;
        }
        
        .content-section ul {
            margin-top: 20px;
            padding-left: 30px;
        }
        
        .content-section li {
            margin-bottom: 10px;
            color: var(--deep-indigo);
            line-height: 1.6;
        }
    </style>
</head>
<body>
    <header>
        <nav>
            <a href="/" class="logo">
                <div class="logo-img"><i class="fas fa-heart"></i></div>
                <span>Light in Silence</span>
            </a>
            <ul id="nav-menu">
                <li><a href="/" class="nav-primary">Home</a></li>
                <li><a href="/submit" class="nav-primary">Share Your Story</a></li>
                <li><a href="/about" class="nav-primary">About</a></li>
                <li><a href="/contact" class="nav-primary">Contact</a></li>
                <li><a href="/resources" class="nav-primary">Resources</a></li>
                <li><a href="/volunteer-info" class="nav-primary">Volunteer</a></li>
                <li><a href="/donate" class="nav-primary">Donate</a></li>
            </ul>
        </nav>
    </header>
    
    <div class="page-container">
        <div class="page-header">
            <h1>Terms of Service</h1>
            <p>Our service agreement</p>
        </div>
        
        <div class="content-section">
            <h2>Acceptance of Terms</h2>
            <p>By using Light in Silence, you agree to these terms of service. If you do not agree with any part of these terms, please do not use our services.</p>
        </div>
        
        <div class="content-section">
            <h2>Service Description</h2>
            <p>Light in Silence provides mental health support services through:</p>
            <ul>
                <li>Anonymous letter submission and response</li>
                <li>AI-powered chat support</li>
                <li>Community events and workshops</li>
                <li>Educational resources and blog content</li>
            </ul>
        </div>
        
        <div class="content-section">
            <h2>User Responsibilities</h2>
            <p>When using our services, you agree to:</p>
            <ul>
                <li>Provide accurate and truthful information</li>
                <li>Respect the privacy and confidentiality of others</li>
                <li>Not use our services for harmful or illegal purposes</li>
                <li>Not attempt to identify other users</li>
                <li>Report any concerning content to our team</li>
            </ul>
        </div>
        
        <div class="content-section">
            <h2>Limitation of Liability</h2>
            <p>Light in Silence provides support services but is not a substitute for professional mental health care. We are not liable for:</p>
            <ul>
                <li>Decisions made based on our support</li>
                <li>Actions taken by users of our services</li>
                <li>Technical issues or service interruptions</li>
                <li>Content provided by third parties</li>
            </ul>
        </div>
        
        <div class="content-section">
            <h2>Emergency Situations</h2>
            <p>If you are in crisis or having thoughts of self-harm:</p>
            <ul>
                <li>Call 911 immediately</li>
                <li>Contact the Canada Suicide Prevention Service: 1-833-456-4566</li>
                <li>Text HOME to 686868 for Crisis Text Line</li>
                <li>Our services are not for emergency situations</li>
            </ul>
        </div>
        
        <div class="content-section">
            <h2>Changes to Terms</h2>
            <p>We may update these terms from time to time. We will notify users of significant changes through our website or email.</p>
        </div>
        
        <div class="content-section">
            <h2>Contact Information</h2>
            <p>For questions about these terms, contact us at legal@lightinsilence.ca</p>
        </div>
    </div>
</body>
</html>`;
  
  return new Response(html, {
    headers: { 'Content-Type': 'text/html' }
  });
});

staticRoutes.get('/check-reply', async (c) => {
  const html = '<!DOCTYPE html><html lang="en-CA"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Check Reply - Light in Silence</title><link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap" rel="stylesheet"><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"><style>:root{--deep-indigo:#2A3D66;--soft-yellow:#F4D06F;--warm-white:#FAFAFA;--gentle-lavender:#B39CD0}body{font-family:"Nunito",sans-serif;margin:0;padding:0;background-color:var(--warm-white);color:var(--deep-indigo)}.container{max-width:1400px;margin:0 auto;padding:0 2rem}header{background:white;box-shadow:0 2px 10px rgba(42,61,102,0.1);position:sticky;top:0;z-index:1000}nav{display:flex;justify-content:space-between;align-items:center;padding:1rem 2rem}.logo{display:flex;align-items:center;text-decoration:none;color:var(--deep-indigo);font-weight:700;font-size:1.5rem}.logo-img{margin-right:10px;color:var(--gentle-lavender)}#nav-menu{display:flex;list-style:none;gap:2rem}#nav-menu li a{text-decoration:none;color:var(--deep-indigo);font-weight:600;transition:color 0.3s ease}#nav-menu li a:hover,#nav-menu li a.active{color:var(--gentle-lavender)}.check-container{max-width:600px;margin:100px auto;padding:40px;background:white;border-radius:20px;box-shadow:0 10px 30px rgba(42,61,102,0.1)}.check-container h2{text-align:center;color:var(--deep-indigo);margin-bottom:30px}.form-group{margin-bottom:25px}.form-label{display:block;margin-bottom:8px;color:var(--deep-indigo);font-weight:600}.form-control{width:100%;padding:15px;border:2px solid #e0e0e0;border-radius:10px;font-family:inherit;font-size:1rem;transition:border-color 0.3s ease}.form-control:focus{outline:none;border-color:var(--gentle-lavender)}.submit-btn{background:var(--soft-yellow);color:var(--deep-indigo);padding:15px 30px;border:none;border-radius:25px;font-weight:600;font-size:1.1rem;cursor:pointer;width:100%;transition:all 0.3s ease}.submit-btn:hover{transform:translateY(-2px);box-shadow:0 5px 15px rgba(244,208,111,0.3)}</style></head><body><header><nav><a href="/" class="logo"><div class="logo-img"><i class="fas fa-heart"></i></div><span>Light in Silence</span></a><ul id="nav-menu"><li><a href="/" class="nav-primary">Home</a></li><li><a href="/submit" class="nav-primary">Share Your Story</a></li><li><a href="/about" class="nav-primary">About</a></li><li><a href="/contact" class="nav-primary">Contact</a></li><li><a href="/resources" class="nav-primary">Resources</a></li><li><a href="/volunteer-info" class="nav-primary">Volunteer</a></li><li><a href="/donate" class="nav-primary">Donate</a></li></ul></nav></header><div class="check-container"><h2>Check Your Reply</h2><form method="POST" action="/check-reply"><div class="form-group"><label class="form-label">Reply Code</label><input type="text" name="reply_code" class="form-control" placeholder="Enter your reply code" required></div><button type="submit" class="submit-btn">Check Reply</button></form></div></body></html>';
  
  return new Response(html, {
    headers: { 'Content-Type': 'text/html' }
  });
});

staticRoutes.get('/confirmation', async (c) => {
  const html = '<!DOCTYPE html><html lang="en-CA"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Confirmation - Light in Silence</title><link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap" rel="stylesheet"><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"><style>:root{--deep-indigo:#2A3D66;--soft-yellow:#F4D06F;--warm-white:#FAFAFA;--gentle-lavender:#B39CD0}body{font-family:"Nunito",sans-serif;margin:0;padding:0;background-color:var(--warm-white);color:var(--deep-indigo)}.container{max-width:1400px;margin:0 auto;padding:0 2rem}header{background:white;box-shadow:0 2px 10px rgba(42,61,102,0.1);position:sticky;top:0;z-index:1000}nav{display:flex;justify-content:space-between;align-items:center;padding:1rem 2rem}.logo{display:flex;align-items:center;text-decoration:none;color:var(--deep-indigo);font-weight:700;font-size:1.5rem}.logo-img{margin-right:10px;color:var(--gentle-lavender)}#nav-menu{display:flex;list-style:none;gap:2rem}#nav-menu li a{text-decoration:none;color:var(--deep-indigo);font-weight:600;transition:color 0.3s ease}#nav-menu li a:hover,#nav-menu li a.active{color:var(--gentle-lavender)}.confirmation-container{max-width:600px;margin:100px auto;padding:40px;background:white;border-radius:20px;box-shadow:0 10px 30px rgba(42,61,102,0.1);text-align:center}.confirmation-container h2{color:var(--deep-indigo);margin-bottom:20px}.confirmation-container p{color:var(--deep-indigo);line-height:1.6;margin-bottom:30px}.btn-primary{background:var(--soft-yellow);color:var(--deep-indigo);padding:15px 30px;border-radius:25px;text-decoration:none;font-weight:600;display:inline-block;transition:all 0.3s ease}.btn-primary:hover{transform:translateY(-2px);box-shadow:0 5px 15px rgba(244,208,111,0.3)}</style></head><body><header><nav><a href="/" class="logo"><div class="logo-img"><i class="fas fa-heart"></i></div><span>Light in Silence</span></a><ul id="nav-menu"><li><a href="/" class="nav-primary">Home</a></li><li><a href="/submit" class="nav-primary">Share Your Story</a></li><li><a href="/about" class="nav-primary">About</a></li><li><a href="/contact" class="nav-primary">Contact</a></li><li><a href="/resources" class="nav-primary">Resources</a></li><li><a href="/volunteer-info" class="nav-primary">Volunteer</a></li><li><a href="/donate" class="nav-primary">Donate</a></li></ul></nav></header><div class="confirmation-container"><h2>Thank You</h2><p>Your letter has been submitted successfully. We will respond within 48 hours. You can check for your reply using the code provided.</p><a href="/" class="btn-primary">Return Home</a></div></body></html>';
  
  return new Response(html, {
    headers: { 'Content-Type': 'text/html' }
  });
});

staticRoutes.get('/response', async (c) => {
  const html = '<!DOCTYPE html><html lang="en-CA"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Response - Light in Silence</title><link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap" rel="stylesheet"><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"><style>:root{--deep-indigo:#2A3D66;--soft-yellow:#F4D06F;--warm-white:#FAFAFA;--gentle-lavender:#B39CD0}body{font-family:"Nunito",sans-serif;margin:0;padding:0;background-color:var(--warm-white);color:var(--deep-indigo)}.container{max-width:1400px;margin:0 auto;padding:0 2rem}header{background:white;box-shadow:0 2px 10px rgba(42,61,102,0.1);position:sticky;top:0;z-index:1000}nav{display:flex;justify-content:space-between;align-items:center;padding:1rem 2rem}.logo{display:flex;align-items:center;text-decoration:none;color:var(--deep-indigo);font-weight:700;font-size:1.5rem}.logo-img{margin-right:10px;color:var(--gentle-lavender)}#nav-menu{display:flex;list-style:none;gap:2rem}#nav-menu li a{text-decoration:none;color:var(--deep-indigo);font-weight:600;transition:color 0.3s ease}#nav-menu li a:hover,#nav-menu li a.active{color:var(--gentle-lavender)}.response-container{max-width:800px;margin:50px auto;background:white;border-radius:20px;box-shadow:0 10px 30px rgba(42,61,102,0.1);overflow:hidden}.response-header{background:linear-gradient(135deg,var(--gentle-lavender),var(--deep-indigo));color:white;padding:30px;text-align:center}.response-header h2{margin:0;font-size:2rem}.response-content{padding:40px}.response-content h3{color:var(--deep-indigo);margin-bottom:20px}.response-content p{color:var(--deep-indigo);line-height:1.6;margin-bottom:20px}.btn-primary{background:var(--soft-yellow);color:var(--deep-indigo);padding:15px 30px;border-radius:25px;text-decoration:none;font-weight:600;display:inline-block;transition:all 0.3s ease}.btn-primary:hover{transform:translateY(-2px);box-shadow:0 5px 15px rgba(244,208,111,0.3)}</style></head><body><header><nav><a href="/" class="logo"><div class="logo-img"><i class="fas fa-heart"></i></div><span>Light in Silence</span></a><ul id="nav-menu"><li><a href="/" class="nav-primary">Home</a></li><li><a href="/submit" class="nav-primary">Share Your Story</a></li><li><a href="/about" class="nav-primary">About</a></li><li><a href="/contact" class="nav-primary">Contact</a></li><li><a href="/resources" class="nav-primary">Resources</a></li><li><a href="/volunteer-info" class="nav-primary">Volunteer</a></li><li><a href="/donate" class="nav-primary">Donate</a></li></ul></nav></header><div class="response-container"><div class="response-header"><h2>Your Response</h2></div><div class="response-content"><h3>Dear Friend,</h3><p>Thank you for sharing your thoughts with us. We hear you, and we want you to know that you are not alone in what you are experiencing.</p><p>It takes courage to reach out and share your feelings, and we appreciate your trust in us. Remember that it is okay to not be okay, and seeking support is a sign of strength, not weakness.</p><p>We hope this response brings you some comfort and reminds you that there are people who care about you and want to support you on your journey.</p><p>Take care of yourself, and know that we are here whenever you need to talk.</p><p>With care and support,<br>The Light in Silence Team</p><a href="/" class="btn-primary">Return Home</a></div></div></body></html>';
  
  return new Response(html, {
    headers: { 'Content-Type': 'text/html' }
  });
});

staticRoutes.get('/admin', async (c) => {
  const html = '<!DOCTYPE html><html lang="en-CA"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Admin Dashboard - Light in Silence</title><link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap" rel="stylesheet"><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"><style>:root{--deep-indigo:#2A3D66;--soft-yellow:#F4D06F;--warm-white:#FAFAFA;--gentle-lavender:#B39CD0}body{font-family:"Nunito",sans-serif;margin:0;padding:0;background-color:var(--warm-white);color:var(--deep-indigo)}.container{max-width:1400px;margin:0 auto;padding:0 2rem}header{background:white;box-shadow:0 2px 10px rgba(42,61,102,0.1);position:sticky;top:0;z-index:1000}nav{display:flex;justify-content:space-between;align-items:center;padding:1rem 2rem}.logo{display:flex;align-items:center;text-decoration:none;color:var(--deep-indigo);font-weight:700;font-size:1.5rem}.logo-img{margin-right:10px;color:var(--gentle-lavender)}#nav-menu{display:flex;list-style:none;gap:2rem}#nav-menu li a{text-decoration:none;color:var(--deep-indigo);font-weight:600;transition:color 0.3s ease}#nav-menu li a:hover,#nav-menu li a.active{color:var(--gentle-lavender)}.admin-container{max-width:1200px;margin:50px auto;padding:0 2rem}.admin-header{text-align:center;margin-bottom:50px}.admin-header h1{color:var(--deep-indigo);font-size:3rem;margin-bottom:10px}.admin-header p{color:var(--gentle-lavender);font-size:1.3rem;font-style:italic}.stats-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:30px;margin-bottom:50px}.stat-card{background:white;padding:30px;border-radius:20px;box-shadow:0 10px 30px rgba(42,61,102,0.1);text-align:center;border-top:5px solid var(--gentle-lavender)}.stat-number{font-size:2.5rem;font-weight:700;color:var(--gentle-lavender);margin-bottom:10px}.stat-label{color:var(--deep-indigo);font-weight:600}.admin-actions{background:white;padding:40px;border-radius:20px;box-shadow:0 10px 30px rgba(42,61,102,0.1);margin-bottom:40px}.admin-actions h2{color:var(--deep-indigo);margin-bottom:30px;text-align:center}.action-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:20px}.action-card{background:var(--warm-white);padding:25px;border-radius:15px;text-align:center;transition:transform 0.3s ease}.action-card:hover{transform:translateY(-5px)}.action-icon{font-size:2.5rem;color:var(--gentle-lavender);margin-bottom:15px}.action-card h3{color:var(--deep-indigo);margin-bottom:15px}.action-card p{color:var(--deep-indigo);opacity:0.8;margin-bottom:20px}.btn-primary{background:var(--soft-yellow);color:var(--deep-indigo);padding:12px 25px;border-radius:20px;text-decoration:none;font-weight:600;display:inline-block;transition:all 0.3s ease}.btn-primary:hover{transform:translateY(-2px);box-shadow:0 5px 15px rgba(244,208,111,0.3)}</style></head><body><header><nav><a href="/" class="logo"><div class="logo-img"><i class="fas fa-heart"></i></div><span>Light in Silence</span></a><ul id="nav-menu"><li><a href="/" class="nav-primary">Home</a></li><li><a href="/submit" class="nav-primary">Share Your Story</a></li><li><a href="/about" class="nav-primary">About</a></li><li><a href="/contact" class="nav-primary">Contact</a></li><li><a href="/resources" class="nav-primary">Resources</a></li><li><a href="/volunteer-info" class="nav-primary">Volunteer</a></li><li><a href="/donate" class="nav-primary">Donate</a></li></ul></nav></header><div class="admin-container"><div class="admin-header"><h1>Admin Dashboard</h1><p>Manage your platform</p></div><div class="stats-grid"><div class="stat-card"><div class="stat-number">200+</div><div class="stat-label">Letters Received</div></div><div class="stat-card"><div class="stat-number">50+</div><div class="stat-label">Volunteers</div></div><div class="stat-card"><div class="stat-number">95%</div><div class="stat-label">Response Rate</div></div><div class="stat-card"><div class="stat-number">24/7</div><div class="stat-label">Support Available</div></div></div><div class="admin-actions"><h2>Quick Actions</h2><div class="action-grid"><div class="action-card"><div class="action-icon"><i class="fas fa-users"></i></div><h3>Manage Users</h3><p>View and manage user accounts, permissions, and roles.</p><a href="/admin/users" class="btn-primary">Manage Users</a></div><div class="action-card"><div class="action-icon"><i class="fas fa-envelope"></i></div><h3>Review Letters</h3><p>Review and respond to incoming letters from users.</p><a href="/admin/content" class="btn-primary">Review Letters</a></div><div class="action-card"><div class="action-icon"><i class="fas fa-chart-bar"></i></div><h3>Analytics</h3><p>View platform statistics and user engagement metrics.</p><a href="/admin/analytics" class="btn-primary">View Analytics</a></div><div class="action-card"><div class="action-icon"><i class="fas fa-cog"></i></div><h3>Settings</h3><p>Configure platform settings and system preferences.</p><a href="/admin/settings" class="btn-primary">Settings</a></div></div></div></div></body></html>';
  
  return new Response(html, {
    headers: { 'Content-Type': 'text/html' }
  });
});

export { staticRoutes }; 