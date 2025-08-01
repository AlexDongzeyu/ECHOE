import { Hono } from 'hono';
import { Env } from '../index';

const staticRoutes = new Hono<{ Bindings: Env }>();

// Serve the main application HTML
staticRoutes.get('/', async (c) => {
  const html = `<!DOCTYPE html>
<html lang="en-CA">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Language" content="en-CA">
    <title>Light in Silence - Where Your Words Find Light</title>
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <style>
        :root {
            --deep-indigo: #2A3D66;
            --soft-yellow: #F4D06F;
            --warm-white: #FAFAFA;
            --gentle-lavender: #B39CD0;
            --dark-indigo: #1e2e4f;
            --light-yellow: #f8e2a0;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Nunito', sans-serif;
            line-height: 1.6;
            color: var(--deep-indigo);
            background-color: var(--warm-white);
            background-image: url('data:image/svg+xml;utf8,<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><rect width="4" height="4" x="8" y="8" rx="2" fill="%23B39CD0" opacity="0.15"/></svg>');
        }
        
        /* Header and Navigation */
        header {
            background-color: var(--deep-indigo);
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            position: sticky;
            top: 0;
            z-index: 100;
            padding: 0.3rem 0;
        }
        
        nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.3rem 2rem;
            max-width: 1400px;
            margin: 0 auto;
        }
        
        .logo {
            font-size: 1.3rem;
            font-weight: bold;
            color: var(--warm-white);
            text-decoration: none;
            display: flex;
            align-items: center;
            transition: transform 0.3s ease;
            padding: 0.4rem 0.8rem;
            border-radius: 50px;
            background-color: rgba(255, 255, 255, 0.1);
        }
        
        .logo:hover {
            transform: scale(1.05);
            background-color: rgba(255, 255, 255, 0.15);
        }
        
        .logo-img {
            height: 32px;
            width: 32px;
            margin-right: 10px;
            background-color: var(--soft-yellow);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--deep-indigo);
            font-size: 1rem;
        }
        
        nav ul {
            display: flex;
            list-style: none;
            align-items: center;
            gap: 0.6rem;
        }
        
        nav ul li {
            margin: 0 0.2rem;
            position: relative;
        }
        
        nav ul li a {
            color: var(--warm-white);
            text-decoration: none;
            transition: all 0.3s ease;
            font-weight: 600;
            padding: 0.4rem 0.8rem;
            border-radius: 50px;
            font-size: 0.9rem;
            cursor: pointer;
        }
        
        nav ul li a:hover {
            color: var(--soft-yellow);
            background-color: rgba(255, 255, 255, 0.1);
        }
        
        nav ul li a.active, .nav-primary {
            color: var(--soft-yellow);
            background-color: rgba(244, 208, 111, 0.15);
            font-weight: 700;
        }
        
        /* Dropdown styles */
        .dropdown {
            position: relative;
        }
        
        .dropdown-content {
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
            background-color: white;
            min-width: 200px;
            box-shadow: 0 8px 16px rgba(0,0,0,0.2);
            border-radius: 10px;
            z-index: 1000;
            padding: 10px 0;
        }
        
        .dropdown:hover .dropdown-content {
            display: block;
        }
        
        .dropdown-content a {
            color: var(--deep-indigo) !important;
            padding: 12px 20px;
            text-decoration: none;
            display: block;
            font-weight: 600;
            font-size: 0.9rem;
            transition: all 0.3s ease;
            border-radius: 0;
            background-color: transparent;
        }
        
        .dropdown-content a:hover {
            background-color: var(--soft-yellow) !important;
            color: var(--deep-indigo) !important;
        }
        
        .dropdown > a::after {
            content: ' ▼';
            font-size: 0.7rem;
            margin-left: 5px;
            transition: transform 0.3s ease;
        }
        
        .dropdown:hover > a::after {
            transform: rotate(180deg);
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
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 2rem;
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
        
        .btn-primary {
            background: linear-gradient(135deg, var(--soft-yellow), #f4d06f);
            color: var(--deep-indigo);
            padding: 15px 30px;
            border: none;
            border-radius: 50px;
            font-size: 1.1rem;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s ease;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 10px;
            box-shadow: 0 8px 20px rgba(244, 208, 111, 0.3);
        }
        
        .btn-primary:hover {
            transform: translateY(-3px);
            box-shadow: 0 12px 30px rgba(244, 208, 111, 0.4);
            color: var(--deep-indigo);
        }
        
        .btn-secondary {
            background: transparent;
            color: var(--deep-indigo);
            border: 2px solid var(--deep-indigo);
            box-shadow: none;
            padding: 15px 30px;
            border-radius: 50px;
            font-size: 1.1rem;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s ease;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 10px;
        }
        
        .btn-secondary:hover {
            background: var(--deep-indigo);
            color: white;
        }

        /* Original Flask Healing Transition with ALL elements */
        .healing-transition {
            position: relative;
            height: 200px;
            width: 100%;
            overflow: hidden;
            background: linear-gradient(
                180deg,
                rgba(232, 241, 255, 0.8) 0%,
                rgba(240, 233, 255, 0.8) 100%
            );
        }
        
        .light-rays {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(
                circle at 50% 0%,
                rgba(244, 208, 111, 0.2) 0%,
                transparent 70%
            );
        }
        
        .grass-layer {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 70px;
            background: linear-gradient(
                180deg,
                rgba(168, 216, 157, 0.9) 0%,
                rgba(127, 176, 114, 0.9) 100%
            );
            border-radius: 50% 50% 0 0;
            transform: scaleX(1.2);
        }
        
        .garden-elements {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            background: radial-gradient(
                circle at 50% 100%,
                rgba(255, 255, 255, 0.3) 0%,
                transparent 70%
            );
        }
        
        .flowers-back {
            position: absolute;
            bottom: 25px;
            width: 100%;
            display: flex;
            justify-content: space-around;
            z-index: 1;
        }
        
        .flowers-middle {
            position: absolute;
            bottom: 15px;
            width: 100%;
            display: flex;
            justify-content: space-evenly;
            z-index: 2;
        }
        
        .flowers-front {
            position: absolute;
            bottom: 5px;
            width: 100%;
            display: flex;
            justify-content: space-around;
            z-index: 3;
        }
        
        .flower {
            font-size: 28px;
            opacity: 0.95;
            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
        }
        
        .flower-small { font-size: 22px; }
        .flower-medium { font-size: 28px; }
        .flower-large { font-size: 34px; }
        
        .garden-details {
            position: absolute;
            bottom: 10px;
            width: 100%;
            display: flex;
            justify-content: space-between;
            padding: 0 5%;
            z-index: 2;
        }
        
        .garden-detail {
            font-size: 18px;
            opacity: 0.8;
        }
        
        .cats-container {
            position: absolute;
            bottom: 35px;
            width: 100%;
            display: flex;
            justify-content: space-around;
            padding: 0 15%;
            z-index: 4;
        }
        
        .cat {
            position: relative;
            font-size: 40px;
            opacity: 0.95;
            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
        }
        
        .cat-1 {
            animation: catNap 8s ease-in-out infinite;
        }
        
        .cat-2 {
            animation: catStretch 10s ease-in-out infinite;
        }
        
        .cat-3 {
            animation: catPlay 12s ease-in-out infinite;
        }
        
        .cat-4 {
            animation: catNap 8s ease-in-out infinite;
        }
        
        @keyframes catNap {
            0%, 90%, 100% { transform: translateY(0) rotate(0deg); }
            45% { transform: translateY(-3px) rotate(-2deg); }
        }
        
        @keyframes catStretch {
            0%, 85%, 100% { transform: scale(1) rotate(0deg); }
            42% { transform: scale(1.05) rotate(1deg); }
        }
        
        @keyframes catPlay {
            0%, 80%, 100% { transform: translateX(0) rotate(0deg); }
            40% { transform: translateX(5px) rotate(-3deg); }
        }
        
        .butterflies {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 5;
        }
        
        .butterfly {
            position: absolute;
            font-size: 20px;
            opacity: 0.8;
        }
        
        @keyframes butterflyPath1 {
            0% { transform: translateX(0) translateY(0) rotate(0deg); }
            25% { transform: translateX(100px) translateY(-20px) rotate(10deg); }
            50% { transform: translateX(200px) translateY(10px) rotate(-5deg); }
            75% { transform: translateX(300px) translateY(-15px) rotate(8deg); }
            100% { transform: translateX(400px) translateY(5px) rotate(0deg); }
        }
        
        @keyframes butterflyPath2 {
            0% { transform: translateX(0) translateY(0) rotate(0deg); }
            25% { transform: translateX(-80px) translateY(15px) rotate(-8deg); }
            50% { transform: translateX(-160px) translateY(-10px) rotate(12deg); }
            75% { transform: translateX(-240px) translateY(20px) rotate(-6deg); }
            100% { transform: translateX(-320px) translateY(0px) rotate(0deg); }
        }

        /* How It Works Section */
        .how-it-works {
            padding: 80px 0;
            background-color: white;
        }
        
        .how-it-works .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 2rem;
        }
        
        .how-it-works h2 {
            text-align: center;
            font-size: 2.5rem;
            color: var(--deep-indigo);
            margin-bottom: 60px;
            position: relative;
        }
        
        .how-it-works h2::after {
            content: '';
            position: absolute;
            bottom: -10px;
            left: 50%;
            transform: translateX(-50%);
            width: 60px;
            height: 4px;
            background: var(--soft-yellow);
            border-radius: 2px;
        }
        
        .steps {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 40px;
        }
        
        .step-card {
            background: white;
            padding: 40px 30px;
            border-radius: 20px;
            text-align: center;
            box-shadow: 0 10px 30px rgba(42, 61, 102, 0.1);
            transition: transform 0.3s ease;
            position: relative;
        }
        
        .step-card:hover {
            transform: translateY(-5px);
        }
        
        .step-icon {
            background: var(--soft-yellow);
            color: var(--deep-indigo);
            font-size: 1.5rem;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px auto;
            transition: all 0.3s ease;
        }
        
        .step-card:hover .step-icon {
            transform: scale(1.1);
            box-shadow: 0 5px 15px rgba(244, 208, 111, 0.3);
        }
        
        .step-card h3 {
            color: var(--deep-indigo);
            margin-bottom: 15px;
            font-size: 1.3rem;
        }
        
        .step-card p {
            color: var(--gentle-lavender);
            line-height: 1.6;
        }

        /* Dual Approach Section */
        .dual-approach {
            padding: 80px 0;
            background-color: var(--warm-white);
        }
        
        .dual-approach .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 2rem;
        }
        
        .dual-approach h2 {
            text-align: center;
            font-size: 2.5rem;
            color: var(--deep-indigo);
            margin-bottom: 60px;
            position: relative;
        }
        
        .dual-approach h2::after {
            content: '';
            position: absolute;
            bottom: -10px;
            left: 50%;
            transform: translateX(-50%);
            width: 60px;
            height: 4px;
            background: var(--soft-yellow);
            border-radius: 2px;
        }
        
        .approach-cards {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
            gap: 40px;
        }
        
        .card {
            background: white;
            padding: 40px 30px;
            border-radius: 20px;
            text-align: center;
            box-shadow: 0 10px 30px rgba(42, 61, 102, 0.1);
            transition: transform 0.3s ease;
        }
        
        .card:hover {
            transform: translateY(-5px);
        }
        
        .card-icon {
            background: var(--gentle-lavender);
            color: white;
            font-size: 2rem;
            width: 80px;
            height: 80px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px auto;
        }
        
        .card h3 {
            font-size: 1.5rem;
            margin-bottom: 15px;
            color: var(--deep-indigo);
        }
        
        .card p {
            font-size: 1.1rem;
            margin-bottom: 25px;
            line-height: 1.6;
            color: var(--gentle-lavender);
        }

        /* Social Proof Section */
        .social-proof {
            padding: 80px 0;
            background-color: var(--gentle-lavender);
            color: var(--warm-white);
            text-align: center;
        }
        
        .social-proof h2 {
            font-size: 2.5rem;
            margin-bottom: 20px;
            color: var(--warm-white);
        }
        
        .section-subtitle {
            font-size: 1.2rem;
            margin-bottom: 50px;
            opacity: 0.9;
        }
        
        .testimonials {
            display: flex;
            justify-content: center;
            gap: 30px;
            flex-wrap: wrap;
            margin-bottom: 50px;
        }
        
        .testimonial {
            background-color: rgba(255, 255, 255, 0.1);
            border-radius: 15px;
            padding: 30px 25px;
            width: 300px;
            text-align: center;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .testimonial:after {
            content: '★★★★★';
            display: block;
            color: var(--soft-yellow);
            font-size: 1.2rem;
            margin-top: 15px;
        }
        
        .testimonial p {
            font-style: italic;
            font-size: 1.1rem;
            margin-bottom: 15px;
            line-height: 1.6;
        }
        
        .testimonial span {
            font-weight: 600;
            color: var(--soft-yellow);
        }
        
        .cta-wrapper {
            text-align: center;
        }
        
        .cta-large {
            font-size: 1.3rem;
            padding: 1.2rem 2.5rem;
        }

        /* Mobile responsiveness */
        @media (max-width: 768px) {
            nav {
                flex-direction: column;
                gap: 15px;
                padding: 1rem;
            }
            
            nav ul {
                flex-wrap: wrap;
                justify-content: center;
            }
            
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
    <!-- Header with Navigation -->
    <header>
        <nav>
            <a href="/" class="logo">
                <div class="logo-img">
                    <i class="fas fa-heart"></i>
                </div>
                <span>Light in Silence</span>
            </a>
            
            <ul id="nav-menu">
                <!-- Primary Actions -->
                <li><a href="/" class="nav-primary active">Home</a></li>
                <li><a href="/submit" class="nav-primary">Share Your Story</a></li>
                <li><a href="/check-reply" class="nav-primary">Check Reply</a></li>
                
                <!-- Discover Dropdown -->
                <li class="dropdown">
                    <a href="#">Discover</a>
                    <div class="dropdown-content">
                        <a href="/blog">
                            <i class="fas fa-blog" style="margin-right: 8px;"></i>Blog
                        </a>
                        <a href="/events">
                            <i class="fas fa-calendar" style="margin-right: 8px;"></i>Events
                        </a>
                        <a href="/resources">
                            <i class="fas fa-book" style="margin-right: 8px;"></i>Resources
                        </a>
                    </div>
                </li>
                
                <!-- About Dropdown -->
                <li class="dropdown">
                    <a href="#">About</a>
                    <div class="dropdown-content">
                        <a href="/about">
                            <i class="fas fa-info-circle" style="margin-right: 8px;"></i>Our Mission
                        </a>
                        <a href="/contact">
                            <i class="fas fa-envelope" style="margin-right: 8px;"></i>Contact Us
                        </a>
                        <a href="/volunteer-info">
                            <i class="fas fa-hands-helping" style="margin-right: 8px;"></i>Volunteer
                        </a>
                        <a href="/donate">
                            <i class="fas fa-heart" style="margin-right: 8px;"></i>Donate
                        </a>
                    </div>
                </li>

                <!-- User Area -->
                <li><a href="/login" class="login-btn">
                    <i class="fas fa-sign-in-alt" style="margin-right: 5px;"></i>Login
                </a></li>
            </ul>
        </nav>
    </header>

    <!-- Main Content -->
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
                    <img src="images/hero-illustration.svg" alt="Light in Silence Illustration" style="width: 100%; height: 400px; background: linear-gradient(135deg, var(--gentle-lavender), var(--soft-yellow)); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 100px; color: white;">
                </div>
            </div>
        </section>
        
        <div class="healing-transition">
            <div class="light-rays"></div>
            <div class="grass-layer"></div>
            <div class="garden-elements">
                <!-- 背景花朵层 (Background flowers) -->
                <div class="flowers-back">
                    <span class="flower flower-small">🌸</span>
                    <span class="flower flower-medium">🌺</span>
                    <span class="flower flower-small">🌷</span>
                    <span class="flower flower-medium">🌼</span>
                    <span class="flower flower-small">🌸</span>
                    <span class="flower flower-medium">🌷</span>
                    <span class="flower flower-small">🌺</span>
                    <span class="flower flower-medium">🌸</span>
                </div>
                
                <!-- 中间花朵层 (Middle flowers) -->
                <div class="flowers-middle">
                    <span class="flower flower-medium">🌻</span>
                    <span class="flower flower-large">🌺</span>
                    <span class="flower flower-medium">🌷</span>
                    <span class="flower flower-large">🌸</span>
                    <span class="flower flower-medium">🌼</span>
                    <span class="flower flower-large">🌷</span>
                    <span class="flower flower-medium">🌺</span>
                    <span class="flower flower-large">🌸</span>
                    <span class="flower flower-medium">🌻</span>
                </div>
                
                <!-- 前景花朵层 (Front flowers) -->
                <div class="flowers-front">
                    <span class="flower flower-large">🌸</span>
                    <span class="flower flower-medium">🌷</span>
                    <span class="flower flower-large">🌺</span>
                    <span class="flower flower-medium">🌻</span>
                    <span class="flower flower-large">🌼</span>
                    <span class="flower flower-medium">🌸</span>
                    <span class="flower flower-large">🌷</span>
                    <span class="flower flower-medium">🌺</span>
                    <span class="flower flower-large">🌸</span>
                    <span class="flower flower-medium">🌼</span>
                </div>
                
                <!-- 花园装饰元素 (Garden details) -->
                <div class="garden-details">
                    <span class="garden-detail">🍄</span>
                    <span class="garden-detail">🌿</span>
                    <span class="garden-detail">🍀</span>
                    <span class="garden-detail">🌱</span>
                    <span class="garden-detail">🍄</span>
                    <span class="garden-detail">🌿</span>
                    <span class="garden-detail">🍀</span>
                    <span class="garden-detail">🌱</span>
                    <span class="garden-detail">🍄</span>
                </div>
            </div>
            
            <!-- 猫咪 (Cats with correct emojis from Flask) -->
            <div class="cats-container">
                <span class="cat cat-1">🐱</span>
                <span class="cat cat-2">😺</span>
                <span class="cat cat-3">😸</span>
                <span class="cat cat-4">🐈</span>
            </div>
            
            <!-- 蝴蝶 (Butterflies) -->
            <div class="butterflies">
                <span class="butterfly" style="top: 30%; left: 10%; animation: butterflyPath1 20s linear infinite;">🦋</span>
                <span class="butterfly" style="top: 40%; right: 10%; animation: butterflyPath2 18s linear infinite;">🦋</span>
                <span class="butterfly" style="top: 25%; left: 30%; animation: butterflyPath1 22s linear infinite -5s;">🦋</span>
                <span class="butterfly" style="top: 45%; right: 30%; animation: butterflyPath2 19s linear infinite -8s;">🦋</span>
                <span class="butterfly" style="top: 35%; left: 50%; animation: butterflyPath1 21s linear infinite -10s;">🦋</span>
            </div>
        </div>
        
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
                        <a href="/locations" class="btn-secondary">Find Locations</a>
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

    <script>
        // Authentication State Management
        document.addEventListener('DOMContentLoaded', function() {
            checkAuthState();
        });

        function checkAuthState() {
            const token = localStorage.getItem('authToken');
            const userData = localStorage.getItem('userData');
            
            if (token && userData) {
                try {
                    const user = JSON.parse(userData);
                    updateNavigationForUser(user);
                } catch (error) {
                    console.error('Error parsing user data:', error);
                    // Clear invalid data
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('userData');
                }
            }
        }

        function updateNavigationForUser(user) {
            const navMenu = document.getElementById('nav-menu');
            if (!navMenu) return;

            // Find and remove the login button
            const loginBtn = navMenu.querySelector('.login-btn');
            if (loginBtn && loginBtn.parentElement) {
                loginBtn.parentElement.remove();
            }

            // Add admin panel for admins
            if (user.isAdmin) {
                const adminLi = document.createElement('li');
                adminLi.innerHTML = '<a href="/admin" class="nav-primary" style="background: #f44336; color: white;">' +
                                  '<i class="fas fa-shield-alt" style="margin-right: 5px;"></i>Admin Panel</a>';
                navMenu.appendChild(adminLi);
            }
            
            // Add volunteer dashboard for volunteers and admins
            if (user.isVolunteer || user.isAdmin) {
                const volunteerLi = document.createElement('li');
                volunteerLi.innerHTML = '<a href="/volunteer" class="nav-primary" style="background: #4caf50; color: white;">' +
                                      '<i class="fas fa-tachometer-alt" style="margin-right: 5px;"></i>Volunteer Dashboard</a>';
                navMenu.appendChild(volunteerLi);
            }
            
            // Add logout button
            const logoutLi = document.createElement('li');
            logoutLi.innerHTML = '<a href="#" onclick="logout()" class="logout-btn" style="background: var(--soft-yellow); color: var(--deep-indigo);">' +
                               '<i class="fas fa-sign-out-alt" style="margin-right: 5px;"></i>Logout (' + user.username + ')</a>';
            navMenu.appendChild(logoutLi);
        }

        function logout() {
            if (confirm('Are you sure you want to logout?')) {
                localStorage.removeItem('authToken');
                localStorage.removeItem('userData');
                window.location.href = '/';
            }
        }

        // Fix dropdown navigation to prevent disappearing
        document.addEventListener('DOMContentLoaded', function() {
            const dropdowns = document.querySelectorAll('.dropdown');
            dropdowns.forEach(dropdown => {
                // Prevent the main dropdown link from being clickable
                const mainLink = dropdown.querySelector('a[href="#"]');
                if (mainLink) {
                    mainLink.style.pointerEvents = 'none';
                    mainLink.addEventListener('click', function(e) {
                        e.preventDefault();
                    });
                }
                
                // Ensure dropdown content links are clickable
                const dropdownLinks = dropdown.querySelectorAll('.dropdown-content a');
                dropdownLinks.forEach(link => {
                    link.style.pointerEvents = 'all';
                });
                
                // Show dropdown on hover
                dropdown.addEventListener('mouseenter', function() {
                    const content = this.querySelector('.dropdown-content');
                    if (content) content.style.display = 'block';
                });
                
                dropdown.addEventListener('mouseleave', function() {
                    const content = this.querySelector('.dropdown-content');
                    if (content) content.style.display = 'none';
                });
            });
        });
    </script>
</body>
</html>`;

  return c.html(html);
});

// API routes for frontend navigation (SPA support)
const frontendRoutes = [
  '/volunteer',
  '/response/*'
];

// Serve the main HTML for all frontend routes (SPA)
const mainHandler = async (c: any) => {
  const html = `<!DOCTYPE html>
<html lang="en-CA">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Language" content="en-CA">
    <title>Light in Silence - Where Your Words Find Light</title>
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <style>
        :root {
            --deep-indigo: #2A3D66;
            --soft-yellow: #F4D06F;
            --warm-white: #FAFAFA;
            --gentle-lavender: #B39CD0;
            --dark-indigo: #1e2e4f;
            --light-yellow: #f8e2a0;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Nunito', sans-serif;
            line-height: 1.6;
            color: var(--deep-indigo);
            background-color: var(--warm-white);
            background-image: url('data:image/svg+xml;utf8,<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><rect width="4" height="4" x="8" y="8" rx="2" fill="%23B39CD0" opacity="0.15"/></svg>');
        }
        
        /* Header and Navigation */
        header {
            background-color: var(--deep-indigo);
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            position: sticky;
            top: 0;
            z-index: 100;
            padding: 0.3rem 0;
        }
        
        nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.3rem 2rem;
            max-width: 1400px;
            margin: 0 auto;
        }
        
        .logo {
            font-size: 1.3rem;
            font-weight: bold;
            color: var(--warm-white);
            text-decoration: none;
            display: flex;
            align-items: center;
            transition: transform 0.3s ease;
            padding: 0.4rem 0.8rem;
            border-radius: 50px;
            background-color: rgba(255, 255, 255, 0.1);
        }
        
        .logo:hover {
            transform: scale(1.05);
            background-color: rgba(255, 255, 255, 0.15);
        }
        
        .logo-img {
            height: 32px;
            width: 32px;
            margin-right: 10px;
            background-color: var(--soft-yellow);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--deep-indigo);
            font-size: 1rem;
        }
        
        nav ul {
            display: flex;
            list-style: none;
            align-items: center;
            gap: 0.6rem;
        }
        
        nav ul li {
            margin: 0 0.2rem;
            position: relative;
        }
        
        nav ul li a {
            color: var(--warm-white);
            text-decoration: none;
            transition: all 0.3s ease;
            font-weight: 600;
            padding: 0.4rem 0.8rem;
            border-radius: 50px;
            font-size: 0.9rem;
            cursor: pointer;
        }
        
        nav ul li a:hover {
            color: var(--soft-yellow);
            background-color: rgba(255, 255, 255, 0.1);
        }
        
        nav ul li a.active, .nav-primary {
            color: var(--soft-yellow);
            background-color: rgba(244, 208, 111, 0.15);
            font-weight: 700;
        }
        
        /* Dropdown styles */
        .dropdown {
            position: relative;
        }
        
        .dropdown-content {
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
            background-color: white;
            min-width: 200px;
            box-shadow: 0 8px 16px rgba(0,0,0,0.2);
            border-radius: 10px;
            z-index: 1000;
            padding: 10px 0;
        }
        
        .dropdown:hover .dropdown-content {
            display: block;
        }
        
        .dropdown-content a {
            color: var(--deep-indigo) !important;
            padding: 12px 20px;
            text-decoration: none;
            display: block;
            font-weight: 600;
            font-size: 0.9rem;
            transition: all 0.3s ease;
            border-radius: 0;
            background-color: transparent;
        }
        
        .dropdown-content a:hover {
            background-color: var(--soft-yellow) !important;
            color: var(--deep-indigo) !important;
        }
        
        .dropdown > a::after {
            content: ' ▼';
            font-size: 0.7rem;
            margin-left: 5px;
            transition: transform 0.3s ease;
        }
        
        .dropdown:hover > a::after {
            transform: rotate(180deg);
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
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 2rem;
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
        
        .btn-primary {
            background: linear-gradient(135deg, var(--soft-yellow), #f4d06f);
            color: var(--deep-indigo);
            padding: 15px 30px;
            border: none;
            border-radius: 50px;
            font-size: 1.1rem;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s ease;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 10px;
            box-shadow: 0 8px 20px rgba(244, 208, 111, 0.3);
        }
        
        .btn-primary:hover {
            transform: translateY(-3px);
            box-shadow: 0 12px 30px rgba(244, 208, 111, 0.4);
            color: var(--deep-indigo);
        }
        
        .btn-secondary {
            background: transparent;
            color: var(--deep-indigo);
            border: 2px solid var(--deep-indigo);
            box-shadow: none;
            padding: 15px 30px;
            border-radius: 50px;
            font-size: 1.1rem;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s ease;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 10px;
        }
        
        .btn-secondary:hover {
            background: var(--deep-indigo);
            color: white;
        }

        /* Original Flask Healing Transition with ALL elements */
        .healing-transition {
            position: relative;
            height: 200px;
            width: 100%;
            overflow: hidden;
            background: linear-gradient(
                180deg,
                rgba(232, 241, 255, 0.8) 0%,
                rgba(240, 233, 255, 0.8) 100%
            );
        }
        
        .light-rays {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(
                circle at 50% 0%,
                rgba(244, 208, 111, 0.2) 0%,
                transparent 70%
            );
        }
        
        .grass-layer {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 70px;
            background: linear-gradient(
                180deg,
                rgba(168, 216, 157, 0.9) 0%,
                rgba(127, 176, 114, 0.9) 100%
            );
            border-radius: 50% 50% 0 0;
            transform: scaleX(1.2);
        }
        
        .garden-elements {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            background: radial-gradient(
                circle at 50% 100%,
                rgba(255, 255, 255, 0.3) 0%,
                transparent 70%
            );
        }
        
        .flowers-back {
            position: absolute;
            bottom: 25px;
            width: 100%;
            display: flex;
            justify-content: space-around;
            z-index: 1;
        }
        
        .flowers-middle {
            position: absolute;
            bottom: 15px;
            width: 100%;
            display: flex;
            justify-content: space-evenly;
            z-index: 2;
        }
        
        .flowers-front {
            position: absolute;
            bottom: 5px;
            width: 100%;
            display: flex;
            justify-content: space-around;
            z-index: 3;
        }
        
        .flower {
            font-size: 28px;
            opacity: 0.95;
            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
        }
        
        .flower-small { font-size: 22px; }
        .flower-medium { font-size: 28px; }
        .flower-large { font-size: 34px; }
        
        .garden-details {
            position: absolute;
            bottom: 10px;
            width: 100%;
            display: flex;
            justify-content: space-between;
            padding: 0 5%;
            z-index: 2;
        }
        
        .garden-detail {
            font-size: 18px;
            opacity: 0.8;
        }
        
        .cats-container {
            position: absolute;
            bottom: 35px;
            width: 100%;
            display: flex;
            justify-content: space-around;
            padding: 0 15%;
            z-index: 4;
        }
        
        .cat {
            position: relative;
            font-size: 40px;
            opacity: 0.95;
            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
        }
        
        .cat-1 {
            animation: catNap 8s ease-in-out infinite;
        }
        
        .cat-2 {
            animation: catStretch 10s ease-in-out infinite;
        }
        
        .cat-3 {
            animation: catPlay 12s ease-in-out infinite;
        }
        
        .cat-4 {
            animation: catNap 8s ease-in-out infinite;
        }
        
        @keyframes catNap {
            0%, 90%, 100% { transform: translateY(0) rotate(0deg); }
            45% { transform: translateY(-3px) rotate(-2deg); }
        }
        
        @keyframes catStretch {
            0%, 85%, 100% { transform: scale(1) rotate(0deg); }
            42% { transform: scale(1.05) rotate(1deg); }
        }
        
        @keyframes catPlay {
            0%, 80%, 100% { transform: translateX(0) rotate(0deg); }
            40% { transform: translateX(5px) rotate(-3deg); }
        }
        
        .butterflies {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 5;
        }
        
        .butterfly {
            position: absolute;
            font-size: 20px;
            opacity: 0.8;
        }
        
        @keyframes butterflyPath1 {
            0% { transform: translateX(0) translateY(0) rotate(0deg); }
            25% { transform: translateX(100px) translateY(-20px) rotate(10deg); }
            50% { transform: translateX(200px) translateY(10px) rotate(-5deg); }
            75% { transform: translateX(300px) translateY(-15px) rotate(8deg); }
            100% { transform: translateX(400px) translateY(5px) rotate(0deg); }
        }
        
        @keyframes butterflyPath2 {
            0% { transform: translateX(0) translateY(0) rotate(0deg); }
            25% { transform: translateX(-80px) translateY(15px) rotate(-8deg); }
            50% { transform: translateX(-160px) translateY(-10px) rotate(12deg); }
            75% { transform: translateX(-240px) translateY(20px) rotate(-6deg); }
            100% { transform: translateX(-320px) translateY(0px) rotate(0deg); }
        }

        /* How It Works Section */
        .how-it-works {
            padding: 80px 0;
            background-color: white;
        }
        
        .how-it-works .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 2rem;
        }
        
        .how-it-works h2 {
            text-align: center;
            font-size: 2.5rem;
            color: var(--deep-indigo);
            margin-bottom: 60px;
            position: relative;
        }
        
        .how-it-works h2::after {
            content: '';
            position: absolute;
            bottom: -10px;
            left: 50%;
            transform: translateX(-50%);
            width: 60px;
            height: 4px;
            background: var(--soft-yellow);
            border-radius: 2px;
        }
        
        .steps {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 40px;
        }
        
        .step-card {
            background: white;
            padding: 40px 30px;
            border-radius: 20px;
            text-align: center;
            box-shadow: 0 10px 30px rgba(42, 61, 102, 0.1);
            transition: transform 0.3s ease;
            position: relative;
        }
        
        .step-card:hover {
            transform: translateY(-5px);
        }
        
        .step-icon {
            background: var(--soft-yellow);
            color: var(--deep-indigo);
            font-size: 1.5rem;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px auto;
            transition: all 0.3s ease;
        }
        
        .step-card:hover .step-icon {
            transform: scale(1.1);
            box-shadow: 0 5px 15px rgba(244, 208, 111, 0.3);
        }
        
        .step-card h3 {
            color: var(--deep-indigo);
            margin-bottom: 15px;
            font-size: 1.3rem;
        }
        
        .step-card p {
            color: var(--gentle-lavender);
            line-height: 1.6;
        }

        /* Dual Approach Section */
        .dual-approach {
            padding: 80px 0;
            background-color: var(--warm-white);
        }
        
        .dual-approach .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 2rem;
        }
        
        .dual-approach h2 {
            text-align: center;
            font-size: 2.5rem;
            color: var(--deep-indigo);
            margin-bottom: 60px;
            position: relative;
        }
        
        .dual-approach h2::after {
            content: '';
            position: absolute;
            bottom: -10px;
            left: 50%;
            transform: translateX(-50%);
            width: 60px;
            height: 4px;
            background: var(--soft-yellow);
            border-radius: 2px;
        }
        
        .approach-cards {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
            gap: 40px;
        }
        
        .card {
            background: white;
            padding: 40px 30px;
            border-radius: 20px;
            text-align: center;
            box-shadow: 0 10px 30px rgba(42, 61, 102, 0.1);
            transition: transform 0.3s ease;
        }
        
        .card:hover {
            transform: translateY(-5px);
        }
        
        .card-icon {
            background: var(--gentle-lavender);
            color: white;
            font-size: 2rem;
            width: 80px;
            height: 80px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px auto;
        }
        
        .card h3 {
            font-size: 1.5rem;
            margin-bottom: 15px;
            color: var(--deep-indigo);
        }
        
        .card p {
            font-size: 1.1rem;
            margin-bottom: 25px;
            line-height: 1.6;
            color: var(--gentle-lavender);
        }

        /* Social Proof Section */
        .social-proof {
            padding: 80px 0;
            background-color: var(--gentle-lavender);
            color: var(--warm-white);
            text-align: center;
        }
        
        .social-proof h2 {
            font-size: 2.5rem;
            margin-bottom: 20px;
            color: var(--warm-white);
        }
        
        .section-subtitle {
            font-size: 1.2rem;
            margin-bottom: 50px;
            opacity: 0.9;
        }
        
        .testimonials {
            display: flex;
            justify-content: center;
            gap: 30px;
            flex-wrap: wrap;
            margin-bottom: 50px;
        }
        
        .testimonial {
            background-color: rgba(255, 255, 255, 0.1);
            border-radius: 15px;
            padding: 30px 25px;
            width: 300px;
            text-align: center;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .testimonial:after {
            content: '★★★★★';
            display: block;
            color: var(--soft-yellow);
            font-size: 1.2rem;
            margin-top: 15px;
        }
        
        .testimonial p {
            font-style: italic;
            font-size: 1.1rem;
            margin-bottom: 15px;
            line-height: 1.6;
        }
        
        .testimonial span {
            font-weight: 600;
            color: var(--soft-yellow);
        }
        
        .cta-wrapper {
            text-align: center;
        }
        
        .cta-large {
            font-size: 1.3rem;
            padding: 1.2rem 2.5rem;
        }

        /* Mobile responsiveness */
        @media (max-width: 768px) {
            nav {
                flex-direction: column;
                gap: 15px;
                padding: 1rem;
            }
            
            nav ul {
                flex-wrap: wrap;
                justify-content: center;
            }
            
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
    <!-- Header with Navigation -->
    <header>
        <nav>
            <a href="/" class="logo">
                <div class="logo-img">
                    <i class="fas fa-heart"></i>
                </div>
                <span>Light in Silence</span>
            </a>
            
            <ul id="nav-menu">
                <!-- Primary Actions -->
                <li><a href="/" class="nav-primary active">Home</a></li>
                <li><a href="/submit" class="nav-primary">Share Your Story</a></li>
                <li><a href="/check-reply" class="nav-primary">Check Reply</a></li>
                
                <!-- Discover Dropdown -->
                <li class="dropdown">
                    <a href="#">Discover</a>
                    <div class="dropdown-content">
                        <a href="/blog">
                            <i class="fas fa-blog" style="margin-right: 8px;"></i>Blog
                        </a>
                        <a href="/events">
                            <i class="fas fa-calendar" style="margin-right: 8px;"></i>Events
                        </a>
                        <a href="/resources">
                            <i class="fas fa-book" style="margin-right: 8px;"></i>Resources
                        </a>
                    </div>
                </li>
                
                <!-- About Dropdown -->
                <li class="dropdown">
                    <a href="#">About</a>
                    <div class="dropdown-content">
                        <a href="/about">
                            <i class="fas fa-info-circle" style="margin-right: 8px;"></i>Our Mission
                        </a>
                        <a href="/contact">
                            <i class="fas fa-envelope" style="margin-right: 8px;"></i>Contact Us
                        </a>
                        <a href="/volunteer-info">
                            <i class="fas fa-hands-helping" style="margin-right: 8px;"></i>Volunteer
                        </a>
                        <a href="/donate">
                            <i class="fas fa-heart" style="margin-right: 8px;"></i>Donate
                        </a>
                    </div>
                </li>

                <!-- User Area -->
                <li><a href="/login" class="login-btn">
                    <i class="fas fa-sign-in-alt" style="margin-right: 5px;"></i>Login
                </a></li>
            </ul>
        </nav>
    </header>

    <!-- Main Content -->
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
                    <img src="images/hero-illustration.svg" alt="Light in Silence Illustration" style="width: 100%; height: 400px; background: linear-gradient(135deg, var(--gentle-lavender), var(--soft-yellow)); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 100px; color: white;">
                </div>
            </div>
        </section>
        
        <div class="healing-transition">
            <div class="light-rays"></div>
            <div class="grass-layer"></div>
            <div class="garden-elements">
                <!-- 背景花朵层 (Background flowers) -->
                <div class="flowers-back">
                    <span class="flower flower-small">🌸</span>
                    <span class="flower flower-medium">🌺</span>
                    <span class="flower flower-small">🌷</span>
                    <span class="flower flower-medium">🌼</span>
                    <span class="flower flower-small">🌸</span>
                    <span class="flower flower-medium">🌷</span>
                    <span class="flower flower-small">🌺</span>
                    <span class="flower flower-medium">🌸</span>
                </div>
                
                <!-- 中间花朵层 (Middle flowers) -->
                <div class="flowers-middle">
                    <span class="flower flower-medium">🌻</span>
                    <span class="flower flower-large">🌺</span>
                    <span class="flower flower-medium">🌷</span>
                    <span class="flower flower-large">🌸</span>
                    <span class="flower flower-medium">🌼</span>
                    <span class="flower flower-large">🌷</span>
                    <span class="flower flower-medium">🌺</span>
                    <span class="flower flower-large">🌸</span>
                    <span class="flower flower-medium">🌻</span>
                </div>
                
                <!-- 前景花朵层 (Front flowers) -->
                <div class="flowers-front">
                    <span class="flower flower-large">🌸</span>
                    <span class="flower flower-medium">🌷</span>
                    <span class="flower flower-large">🌺</span>
                    <span class="flower flower-medium">🌻</span>
                    <span class="flower flower-large">🌼</span>
                    <span class="flower flower-medium">🌸</span>
                    <span class="flower flower-large">🌷</span>
                    <span class="flower flower-medium">🌺</span>
                    <span class="flower flower-large">🌸</span>
                    <span class="flower flower-medium">🌼</span>
                </div>
                
                <!-- 花园装饰元素 (Garden details) -->
                <div class="garden-details">
                    <span class="garden-detail">🍄</span>
                    <span class="garden-detail">🌿</span>
                    <span class="garden-detail">🍀</span>
                    <span class="garden-detail">🌱</span>
                    <span class="garden-detail">🍄</span>
                    <span class="garden-detail">🌿</span>
                    <span class="garden-detail">🍀</span>
                    <span class="garden-detail">🌱</span>
                    <span class="garden-detail">🍄</span>
                </div>
            </div>
            
            <!-- 猫咪 (Cats with correct emojis from Flask) -->
            <div class="cats-container">
                <span class="cat cat-1">🐱</span>
                <span class="cat cat-2">😺</span>
                <span class="cat cat-3">😸</span>
                <span class="cat cat-4">🐈</span>
            </div>
            
            <!-- 蝴蝶 (Butterflies) -->
            <div class="butterflies">
                <span class="butterfly" style="top: 30%; left: 10%; animation: butterflyPath1 20s linear infinite;">🦋</span>
                <span class="butterfly" style="top: 40%; right: 10%; animation: butterflyPath2 18s linear infinite;">🦋</span>
                <span class="butterfly" style="top: 25%; left: 30%; animation: butterflyPath1 22s linear infinite -5s;">🦋</span>
                <span class="butterfly" style="top: 45%; right: 30%; animation: butterflyPath2 19s linear infinite -8s;">🦋</span>
                <span class="butterfly" style="top: 35%; left: 50%; animation: butterflyPath1 21s linear infinite -10s;">🦋</span>
            </div>
        </div>
        
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
                        <a href="/locations" class="btn-secondary">Find Locations</a>
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

  return c.html(html);
};

frontendRoutes.forEach(route => {
  staticRoutes.get(route, mainHandler);
});

// Handle response routes with parameters
staticRoutes.get('/response/:id', mainHandler);

// Serve static files (CSS, JS, images)
staticRoutes.get('/static/*', async (c) => {
  const path = c.req.path;
  
  // Serve the actual SPA JavaScript
  if (path === '/static/js/app.js') {
    const appJs = `// Light in Silence Frontend Application
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

    navigate(path) {
        window.history.pushState({}, '', path);
        this.loadPage();
    }

    loadPage() {
        const path = window.location.pathname;
        const container = document.getElementById('app');
        
        if (!container) return;

        // Clear existing content
        container.innerHTML = '';

        switch (path) {
            case '/':
                this.renderHomePage(container);
                break;
            case '/submit':
                this.renderSubmitPage(container);
                break;
            case '/about':
                this.renderAboutPage(container);
                break;
            case '/login':
                this.renderLoginPage(container);
                break;
            case '/register':
                this.renderRegisterPage(container);
                break;
            default:
                this.renderHomePage(container);
        }
    }

    renderHomePage(container) {
        container.innerHTML = \`
            <!-- Hero Section -->
            <section class="hero">
                <div class="container">
                    <div class="hero-content">
                        <h1>Find Light in Silence</h1>
                        <div class="quote">
                            "We are all broken. That's how the light gets in." — Ernest Hemingway
                        </div>
                        <p class="mission">
                            A Canadian mental health platform providing anonymous support through both digital and physical channels. Your words matter, your story has power, and you are not alone.
                        </p>
                        
                        <div class="hero-actions">
                            <a href="/submit" onclick="app.navigate('/submit'); return false;" class="cta-button">
                                <i class="fas fa-pen"></i>
                                Share Your Story
                            </a>
                            <a href="/check-reply" onclick="app.navigate('/check-reply'); return false;" class="cta-button secondary">
                                <i class="fas fa-search"></i>
                                Check Reply
                            </a>
                        </div>
                    </div>

                    <div class="hero-image">
                        <div style="width: 100%; height: 400px; background: linear-gradient(135deg, var(--gentle-lavender), var(--soft-yellow)); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 100px; color: white;">
                            <i class="fas fa-lightbulb"></i>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Healing Transition with Cats and Garden -->
            <section class="healing-transition">
                <div class="grass-layer"></div>
                <div class="garden-elements">
                    <div class="flowers-back">
                        <span class="flower flower-medium">🌸</span>
                        <span class="flower flower-large">🌺</span>
                        <span class="flower flower-small">🌼</span>
                        <span class="flower flower-medium">🌻</span>
                        <span class="flower flower-large">🌷</span>
                    </div>
                    
                    <div class="flowers-middle">
                        <span class="flower flower-small">🌹</span>
                        <span class="flower flower-medium">🌸</span>
                        <span class="flower flower-large">🌺</span>
                        <span class="flower flower-small">🌼</span>
                        <span class="flower flower-medium">🌻</span>
                        <span class="flower flower-large">🌷</span>
                    </div>
                    
                    <div class="flowers-front">
                        <span class="flower flower-large">🌺</span>
                        <span class="flower flower-small">🌸</span>
                        <span class="flower flower-medium">🌼</span>
                        <span class="flower flower-large">🌻</span>
                    </div>
                    
                    <div class="garden-details">
                        <span class="garden-detail">🦋</span>
                        <span class="garden-detail">🐝</span>
                        <span class="garden-detail">🦋</span>
                    </div>
                    
                    <div class="cats-container">
                        <span class="cat cat-1">🐱</span>
                        <span class="cat cat-2">🐈</span>
                        <span class="cat cat-3">🐱</span>
                        <span class="cat cat-4">🐈‍⬛</span>
                    </div>
                </div>
            </section>

            <!-- How It Works Section -->
            <section class="how-it-works">
                <div class="container">
                    <h2>How It Works</h2>
                    <div class="steps">
                        <div class="step">
                            <div class="step-number">1</div>
                            <h3>Share Your Story</h3>
                            <p>Write an anonymous letter about what you're going through. No registration required - just share what's on your heart.</p>
                        </div>
                        
                        <div class="step">
                            <div class="step-number">2</div>
                            <h3>Choose Your Support</h3>
                            <p>Select how you'd like to receive support - through our website, anonymous email, or immediate AI response.</p>
                        </div>
                        
                        <div class="step">
                            <div class="step-number">3</div>
                            <h3>Get Caring Responses</h3>
                            <p>Receive thoughtful, personalized responses from trained volunteers or AI companions who truly care.</p>
                        </div>
                        
                        <div class="step">
                            <div class="step-number">4</div>
                            <h3>Find Your Light</h3>
                            <p>Continue the conversation, access resources, and discover that you're not alone in your journey.</p>
                        </div>
                    </div>
                </div>
            </section>
        \`;
        
        // Add the missing garden/cat styles
        if (!document.getElementById('gardenStyles')) {
            const style = document.createElement('style');
            style.id = 'gardenStyles';
            style.textContent = \`
                .healing-transition {
                    position: relative;
                    height: 200px;
                    width: 100%;
                    overflow: hidden;
                    background: linear-gradient(180deg, rgba(232, 241, 255, 0.8) 0%, rgba(240, 233, 255, 0.8) 100%);
                }
                
                .grass-layer {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    height: 70px;
                    background: linear-gradient(180deg, rgba(168, 216, 157, 0.9) 0%, rgba(127, 176, 114, 0.9) 100%);
                    border-radius: 50% 50% 0 0;
                    transform: scaleX(1.2);
                }
                
                .garden-elements {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    background: radial-gradient(circle at 50% 100%, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
                }
                
                .flowers-front, .flowers-middle, .flowers-back {
                    position: absolute;
                    width: 100%;
                    display: flex;
                    justify-content: space-around;
                }
                
                .flowers-front { bottom: 5px; z-index: 3; }
                .flowers-middle { bottom: 15px; z-index: 2; }
                .flowers-back { bottom: 25px; z-index: 1; }
                
                .flower {
                    font-size: 28px;
                    opacity: 0.95;
                    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
                }
                
                .flower-small { font-size: 22px; }
                .flower-medium { font-size: 28px; }
                .flower-large { font-size: 34px; }
                
                .garden-details {
                    position: absolute;
                    bottom: 10px;
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    padding: 0 5%;
                    z-index: 2;
                }
                
                .garden-detail {
                    font-size: 22px;
                    opacity: 0.9;
                }
                
                .cats-container {
                    position: absolute;
                    bottom: 35px;
                    width: 100%;
                    display: flex;
                    justify-content: space-around;
                    padding: 0 15%;
                    z-index: 4;
                }
                
                .cat {
                    position: relative;
                    font-size: 40px;
                    opacity: 0.95;
                    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
                }
                
                .cat-1 { animation: catNap 8s ease-in-out infinite; }
                .cat-2 { animation: catStretch 10s ease-in-out infinite; }
                .cat-3 { animation: catPlay 12s ease-in-out infinite; }
                .cat-4 { animation: catNap 8s ease-in-out infinite; }
                
                @keyframes catNap {
                    0%, 90%, 100% { transform: translateY(0) rotate(0deg); }
                    45% { transform: translateY(-3px) rotate(-2deg); }
                }
                
                @keyframes catStretch {
                    0%, 85%, 100% { transform: scale(1) rotate(0deg); }
                    42% { transform: scale(1.05) rotate(1deg); }
                }
                
                @keyframes catPlay {
                    0%, 80%, 100% { transform: translateX(0) rotate(0deg); }
                    40% { transform: translateX(5px) rotate(-3deg); }
                }
                
                .how-it-works {
                    padding: 80px 0;
                    background-color: white;
                }
                
                .how-it-works .container {
                    max-width: 1400px;
                    margin: 0 auto;
                    padding: 0 2rem;
                }
                
                .how-it-works h2 {
                    text-align: center;
                    font-size: 2.5rem;
                    color: var(--deep-indigo);
                    margin-bottom: 60px;
                    position: relative;
                }
                
                .how-it-works h2::after {
                    content: '';
                    position: absolute;
                    bottom: -10px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 60px;
                    height: 4px;
                    background: var(--soft-yellow);
                    border-radius: 2px;
                }
                
                .steps {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 40px;
                }
                
                .step {
                    background: white;
                    padding: 40px 30px;
                    border-radius: 20px;
                    text-align: center;
                    box-shadow: 0 10px 30px rgba(42, 61, 102, 0.1);
                    transition: transform 0.3s ease;
                    position: relative;
                }
                
                .step:hover {
                    transform: translateY(-5px);
                }
                
                .step-number {
                    background: var(--soft-yellow);
                    color: var(--deep-indigo);
                    font-size: 1.5rem;
                    font-weight: 700;
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 20px auto;
                    transition: all 0.3s ease;
                }
                
                .step:hover .step-number {
                    transform: scale(1.1);
                    box-shadow: 0 5px 15px rgba(244, 208, 111, 0.3);
                }
                
                .step h3 {
                    color: var(--deep-indigo);
                    margin-bottom: 15px;
                    font-size: 1.3rem;
                }
                
                .step p {
                    color: var(--gentle-lavender);
                    line-height: 1.6;
                }
            \`;
            document.head.appendChild(style);
        }
    }

    renderSubmitPage(container) {
        container.innerHTML = \`
            <div style="max-width: 800px; margin: 50px auto; padding: 40px; background: white; border-radius: 20px; box-shadow: 0 10px 30px rgba(42, 61, 102, 0.1);">
                <h1 style="color: var(--deep-indigo); text-align: center; margin-bottom: 30px;">Share Your Story</h1>
                <p style="text-align: center; color: var(--gentle-lavender); margin-bottom: 40px;">
                    Write an anonymous letter about what you're going through. Your words matter and you are not alone.
                </p>
                
                <form id="letterForm">
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; color: var(--deep-indigo); font-weight: 600;">Topic (Optional)</label>
                        <select name="topic" style="width: 100%; padding: 12px; border: 2px solid var(--gentle-lavender); border-radius: 10px; font-size: 1rem;">
                            <option value="">Choose a topic...</option>
                            <option value="academic">Academic Pressure</option>
                            <option value="work">Work Stress</option>
                            <option value="relationships">Relationships</option>
                            <option value="mental">Mental Health</option>
                            <option value="future">Future Anxiety</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; color: var(--deep-indigo); font-weight: 600;">Your Letter</label>
                        <textarea name="content" rows="10" placeholder="Share what's on your mind..." style="width: 100%; padding: 15px; border: 2px solid var(--gentle-lavender); border-radius: 10px; font-size: 1rem; resize: vertical;" required></textarea>
                    </div>
                    
                    <div style="margin-bottom: 30px;">
                        <label style="display: block; margin-bottom: 8px; color: var(--deep-indigo); font-weight: 600;">How would you like to receive a reply?</label>
                        <select name="reply_method" style="width: 100%; padding: 12px; border: 2px solid var(--gentle-lavender); border-radius: 10px; font-size: 1rem;">
                            <option value="website">Check on website (you'll receive a reply code)</option>
                            <option value="anonymous-email">Anonymous email</option>
                            <option value="ai">AI-generated immediate response (plus human follow-up)</option>
                        </select>
                    </div>
                    
                    <button type="submit" style="width: 100%; padding: 15px; background: var(--soft-yellow); color: var(--deep-indigo); border: none; border-radius: 25px; font-size: 1.1rem; font-weight: 700; cursor: pointer; transition: all 0.3s ease;">
                        <i class="fas fa-paper-plane"></i> Send Letter
                    </button>
                </form>
            </div>
        \`;
        
        this.setupSubmitForm();
    }

    renderAboutPage(container) {
        container.innerHTML = \`
            <div style="max-width: 1000px; margin: 50px auto; padding: 40px;">
                <h1 style="color: var(--deep-indigo); text-align: center; margin-bottom: 30px;">About Light in Silence</h1>
                <div style="background: white; padding: 40px; border-radius: 20px; box-shadow: 0 10px 30px rgba(42, 61, 102, 0.1);">
                    <p style="font-size: 1.2rem; color: var(--deep-indigo); line-height: 1.8; margin-bottom: 30px;">
                        Light in Silence is a Canadian mental health platform dedicated to providing anonymous support 
                        to those who need it most. We believe that everyone deserves to be heard, understood, and supported 
                        through their darkest moments.
                    </p>
                    
                    <h2 style="color: var(--deep-indigo); margin: 30px 0 15px;">Our Mission</h2>
                    <p style="color: var(--gentle-lavender); line-height: 1.6; margin-bottom: 20px;">
                        To create a safe, anonymous space where people can share their struggles and receive compassionate 
                        support from trained volunteers and AI companions. We combine human empathy with technology to 
                        ensure no one has to face their challenges alone.
                    </p>
                    
                    <h2 style="color: var(--deep-indigo); margin: 30px 0 15px;">How We Help</h2>
                    <ul style="color: var(--gentle-lavender); line-height: 1.6;">
                        <li>Anonymous letter submission and response system</li>
                        <li>AI-powered immediate support and guidance</li>
                        <li>Trained volunteer network for human connection</li>
                        <li>Crisis resource integration and support</li>
                        <li>Both digital and physical support channels</li>
                    </ul>
                </div>
            </div>
        \`;
    }

    renderLoginPage(container) {
        container.innerHTML = \`
            <div style="max-width: 400px; margin: 100px auto; padding: 40px; background: white; border-radius: 20px; box-shadow: 0 10px 30px rgba(42, 61, 102, 0.1);">
                <h1 style="color: var(--deep-indigo); text-align: center; margin-bottom: 30px;">Login</h1>
                
                <form id="loginForm">
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; color: var(--deep-indigo); font-weight: 600;">Email</label>
                        <input type="email" name="email" style="width: 100%; padding: 12px; border: 2px solid var(--gentle-lavender); border-radius: 10px; font-size: 1rem;" required>
                    </div>
                    
                    <div style="margin-bottom: 30px;">
                        <label style="display: block; margin-bottom: 8px; color: var(--deep-indigo); font-weight: 600;">Password</label>
                        <input type="password" name="password" style="width: 100%; padding: 12px; border: 2px solid var(--gentle-lavender); border-radius: 10px; font-size: 1rem;" required>
                    </div>
                    
                    <button type="submit" style="width: 100%; padding: 15px; background: var(--soft-yellow); color: var(--deep-indigo); border: none; border-radius: 25px; font-size: 1.1rem; font-weight: 700; cursor: pointer; transition: all 0.3s ease;">
                        <i class="fas fa-sign-in-alt"></i> Login
                    </button>
                </form>
                
                <p style="text-align: center; margin-top: 20px; color: var(--gentle-lavender);">
                    Don't have an account? <a href="/register" onclick="app.navigate('/register'); return false;" style="color: var(--deep-indigo); font-weight: 600;">Register here</a>
                </p>
            </div>
        \`;
        
        this.setupLoginForm();
    }

    renderRegisterPage(container) {
        container.innerHTML = \`
            <div style="max-width: 400px; margin: 100px auto; padding: 40px; background: white; border-radius: 20px; box-shadow: 0 10px 30px rgba(42, 61, 102, 0.1);">
                <h1 style="color: var(--deep-indigo); text-align: center; margin-bottom: 30px;">Register</h1>
                
                <form id="registerForm">
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; color: var(--deep-indigo); font-weight: 600;">Username</label>
                        <input type="text" name="username" style="width: 100%; padding: 12px; border: 2px solid var(--gentle-lavender); border-radius: 10px; font-size: 1rem;" required>
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; color: var(--deep-indigo); font-weight: 600;">Email</label>
                        <input type="email" name="email" style="width: 100%; padding: 12px; border: 2px solid var(--gentle-lavender); border-radius: 10px; font-size: 1rem;" required>
                    </div>
                    
                    <div style="margin-bottom: 30px;">
                        <label style="display: block; margin-bottom: 8px; color: var(--deep-indigo); font-weight: 600;">Password</label>
                        <input type="password" name="password" style="width: 100%; padding: 12px; border: 2px solid var(--gentle-lavender); border-radius: 10px; font-size: 1rem;" required>
                    </div>
                    
                    <button type="submit" style="width: 100%; padding: 15px; background: var(--soft-yellow); color: var(--deep-indigo); border: none; border-radius: 25px; font-size: 1.1rem; font-weight: 700; cursor: pointer; transition: all 0.3s ease;">
                        <i class="fas fa-user-plus"></i> Register
                    </button>
                </form>
                
                <p style="text-align: center; margin-top: 20px; color: var(--gentle-lavender);">
                    Already have an account? <a href="/login" onclick="app.navigate('/login'); return false;" style="color: var(--deep-indigo); font-weight: 600;">Login here</a>
                </p>
            </div>
        \`;
        
        this.setupRegisterForm();
    }

    setupSubmitForm() {
        const form = document.getElementById('letterForm');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData(form);
                
                try {
                    const response = await fetch(this.apiBase + '/letters', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            topic: formData.get('topic'),
                            content: formData.get('content'),
                            reply_method: formData.get('reply_method')
                        })
                    });
                    
                    if (response.ok) {
                        const result = await response.json();
                        alert('Letter submitted successfully! Your letter ID is: ' + result.letter_id);
                        form.reset();
                    } else {
                        alert('Error submitting letter. Please try again.');
                    }
                } catch (error) {
                    console.error('Submit error:', error);
                    alert('Error submitting letter. Please try again.');
                }
            });
        }
    }

    setupLoginForm() {
        const form = document.getElementById('loginForm');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData(form);
                
                try {
                    const response = await fetch(this.apiBase + '/auth/login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            email: formData.get('email'),
                            password: formData.get('password')
                        })
                    });
                    
                    if (response.ok) {
                        const result = await response.json();
                        localStorage.setItem('authToken', result.token);
                        this.token = result.token;
                        this.currentUser = result.user;
                        this.navigate('/');
                    } else {
                        alert('Invalid credentials');
                    }
                } catch (error) {
                    console.error('Login error:', error);
                    alert('Login failed. Please try again.');
                }
            });
        }
    }

    setupRegisterForm() {
        const form = document.getElementById('registerForm');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData(form);
                
                try {
                    const response = await fetch(this.apiBase + '/auth/register', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            username: formData.get('username'),
                            email: formData.get('email'),
                            password: formData.get('password')
                        })
                    });
                    
                    if (response.ok) {
                        const result = await response.json();
                        localStorage.setItem('authToken', result.token);
                        this.token = result.token;
                        this.currentUser = result.user;
                        this.navigate('/');
                    } else {
                        const error = await response.json();
                        alert(error.error || 'Registration failed');
                    }
                } catch (error) {
                    console.error('Register error:', error);
                    alert('Registration failed. Please try again.');
                }
            });
        }
    }

    async verifyToken() {
        try {
            const response = await fetch(this.apiBase + '/auth/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: this.token })
            });
            
            if (response.ok) {
                const result = await response.json();
                this.currentUser = result.user;
            } else {
                localStorage.removeItem('authToken');
                this.token = null;
                this.currentUser = null;
            }
        } catch (error) {
            console.error('Token verification failed:', error);
            localStorage.removeItem('authToken');
            this.token = null;
            this.currentUser = null;
        }
    }

    setupRouting() {
        window.addEventListener('popstate', () => {
            this.loadPage();
        });
    }

    setupEventListeners() {
        // Add any global event listeners here
    }
}`;

    return c.text(appJs, 200, {
      'Content-Type': 'application/javascript'
    });
  }
  
  if (path.endsWith('.css')) {
    return c.text('/* CSS files would be served from R2 or CDN */', 200, {
      'Content-Type': 'text/css'
    });
  }
  
  if (path.match(/\.(png|jpg|jpeg|gif|svg)$/)) {
    return c.text('Image would be served from R2 or CDN', 200, {
      'Content-Type': 'image/png'
    });
  }
  
  return c.text('File not found', 404);
});

// Health check for static assets
staticRoutes.get('/static/health', async (c) => {
  return c.json({
    status: 'ok',
    message: 'Static file serving is working',
    timestamp: new Date().toISOString()
  });
});

// Individual Page Handlers for Navigation
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
            --dark-indigo: #1e2e4f;
            --light-yellow: #f8e2a0;
        }
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: 'Nunito', sans-serif;
            line-height: 1.6;
            color: var(--deep-indigo);
            background-color: var(--warm-white);
            background-image: url('data:image/svg+xml;utf8,<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><rect width="4" height="4" x="8" y="8" rx="2" fill="%23B39CD0" opacity="0.15"/></svg>');
        }
        
        /* Header styles (copied from main) */
        header {
            background-color: var(--deep-indigo);
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            position: sticky;
            top: 0;
            z-index: 100;
            padding: 0.3rem 0;
        }
        
        nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.3rem 2rem;
            max-width: 1400px;
            margin: 0 auto;
        }
        
        .logo {
            font-size: 1.3rem;
            font-weight: bold;
            color: var(--warm-white);
            text-decoration: none;
            display: flex;
            align-items: center;
            transition: transform 0.3s ease;
            padding: 0.4rem 0.8rem;
            border-radius: 50px;
            background-color: rgba(255, 255, 255, 0.1);
        }
        
        .logo:hover {
            transform: scale(1.05);
            background-color: rgba(255, 255, 255, 0.15);
        }
        
        .logo-img {
            height: 32px;
            width: 32px;
            margin-right: 10px;
            background-color: var(--soft-yellow);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--deep-indigo);
            font-size: 1rem;
        }
        
        nav ul {
            display: flex;
            list-style: none;
            align-items: center;
            gap: 0.6rem;
        }
        
        nav ul li {
            margin: 0 0.2rem;
            position: relative;
        }
        
        nav ul li a {
            color: var(--warm-white);
            text-decoration: none;
            transition: all 0.3s ease;
            font-weight: 600;
            padding: 0.4rem 0.8rem;
            border-radius: 50px;
            font-size: 0.9rem;
            cursor: pointer;
        }
        
        nav ul li a:hover {
            color: var(--soft-yellow);
            background-color: rgba(255, 255, 255, 0.1);
        }
        
        nav ul li a.active, .nav-primary {
            color: var(--soft-yellow);
            background-color: rgba(244, 208, 111, 0.15);
            font-weight: 700;
        }
        
        /* Dropdown styles */
        .dropdown {
            position: relative;
        }
        
        .dropdown-content {
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
            background-color: white;
            min-width: 200px;
            box-shadow: 0 8px 16px rgba(0,0,0,0.2);
            border-radius: 10px;
            z-index: 1000;
            padding: 10px 0;
        }
        
        .dropdown:hover .dropdown-content {
            display: block;
        }
        
        .dropdown-content a {
            color: var(--deep-indigo) !important;
            padding: 12px 20px;
            text-decoration: none;
            display: block;
            font-weight: 600;
            font-size: 0.9rem;
            transition: all 0.3s ease;
            border-radius: 0;
            background-color: transparent;
        }
        
        .dropdown-content a:hover {
            background-color: var(--soft-yellow) !important;
            color: var(--deep-indigo) !important;
        }
        
        .dropdown > a::after {
            content: ' ▼';
            font-size: 0.7rem;
            margin-left: 5px;
            transition: transform 0.3s ease;
        }
        
        .dropdown:hover > a::after {
            transform: rotate(180deg);
        }
        
        /* Form Container */
        main {
            padding: 2rem 1rem 4rem;
            background-color: var(--warm-white);
            min-height: calc(100vh - 140px);
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
        
        .form-group {
            margin-bottom: 1.5rem;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            color: var(--deep-indigo);
            font-weight: 600;
        }
        
        .form-group select, .form-group textarea, .form-group input {
            width: 100%;
            padding: 1rem;
            border: 2px solid var(--gentle-lavender);
            border-radius: 10px;
            font-size: 1rem;
            font-family: inherit;
            transition: all 0.3s ease;
            background-color: white;
        }
        
        .form-group select:focus, .form-group textarea:focus, .form-group input:focus {
            outline: none;
            border-color: var(--soft-yellow);
            box-shadow: 0 0 10px rgba(244, 208, 111, 0.3);
        }
        
        .form-group textarea {
            min-height: 150px;
            resize: vertical;
        }
        
        .submit-btn {
            background: linear-gradient(135deg, var(--soft-yellow), #f4d06f);
            color: var(--deep-indigo);
            padding: 15px 40px;
            border: none;
            border-radius: 50px;
            font-size: 1.1rem;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s ease;
            display: block;
            margin: 2rem auto 0;
            box-shadow: 0 8px 20px rgba(244, 208, 111, 0.3);
        }
        
        .submit-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 12px 30px rgba(244, 208, 111, 0.4);
        }
        
        .privacy-note {
            background: var(--warm-white);
            padding: 1.5rem;
            border-radius: 10px;
            margin-top: 2rem;
            text-align: center;
            color: var(--deep-indigo);
            font-size: 0.95rem;
            line-height: 1.5;
            border-left: 4px solid var(--soft-yellow);
        }
        
        /* Mobile responsiveness */
        @media (max-width: 768px) {
            nav {
                flex-direction: column;
                gap: 15px;
                padding: 1rem;
            }
            
            nav ul {
                flex-wrap: wrap;
                justify-content: center;
            }
            
            .form-container {
                margin: 1rem;
                padding: 2rem 1.5rem;
            }
        }
    </style>
</head>
<body>
    <!-- Header with Navigation -->
    <header>
        <nav>
            <a href="/" class="logo">
                <div class="logo-img">
                    <i class="fas fa-heart"></i>
                </div>
                <span>Light in Silence</span>
            </a>
            
            <ul id="nav-menu">
                <li><a href="/" class="active">Home</a></li>
                <li><a href="/submit" class="nav-primary">Share Your Story</a></li>
                <li><a href="/check-reply" class="nav-primary">Check Reply</a></li>
                
                <li class="dropdown">
                    <a href="#">Discover</a>
                    <div class="dropdown-content">
                        <a href="/blog"><i class="fas fa-blog" style="margin-right: 8px;"></i>Blog</a>
                        <a href="/events"><i class="fas fa-calendar" style="margin-right: 8px;"></i>Events</a>
                        <a href="/resources"><i class="fas fa-book" style="margin-right: 8px;"></i>Resources</a>
                    </div>
                </li>
                
                <li class="dropdown">
                    <a href="#">About</a>
                    <div class="dropdown-content">
                        <a href="/about"><i class="fas fa-info-circle" style="margin-right: 8px;"></i>Our Mission</a>
                        <a href="/contact"><i class="fas fa-envelope" style="margin-right: 8px;"></i>Contact Us</a>
                        <a href="/volunteer-info"><i class="fas fa-hands-helping" style="margin-right: 8px;"></i>Volunteer</a>
                        <a href="/donate"><i class="fas fa-heart" style="margin-right: 8px;"></i>Donate</a>
                    </div>
                </li>

                <li><a href="/login" class="login-btn">
                    <i class="fas fa-sign-in-alt" style="margin-right: 5px;"></i>Login
                </a></li>
            </ul>
        </nav>
    </header>

    <!-- Main Content -->
    <main>
        <div class="form-container">
            <h2>Share Your Story</h2>
            <p class="form-quote">"Your voice matters. Your story has power. You are not alone."</p>
            <p class="form-intro">
                This is a safe, anonymous space to share what's on your heart. Whether you're feeling stressed, 
                overwhelmed, or just need someone to listen, we're here for you.
            </p>
            
            <form id="letterForm">
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
                    <textarea id="content" name="content" required 
                        placeholder="Share what's on your mind. There's no judgment here - just understanding and support."></textarea>
                </div>
                
                <div class="form-group">
                    <label for="replyMethod">How would you like to receive a reply? (Optional)</label>
                    <select id="replyMethod" name="replyMethod">
                        <option value="website">Check on website (you'll receive a reply code)</option>
                        <option value="anonymous-email">Anonymous email</option>
                        <option value="ai">AI-generated immediate response (plus human follow-up)</option>
                    </select>
                </div>
                
                <div class="form-group" id="emailGroup" style="display: none;">
                    <label for="anonymousEmail">Anonymous Email</label>
                    <input type="email" id="anonymousEmail" name="anonymousEmail" 
                        placeholder="your.email@example.com">
                </div>
                
                <button type="submit" class="submit-btn">
                    <i class="fas fa-paper-plane"></i> Send Letter
                </button>
            </form>
            
            <div class="privacy-note">
                <i class="fas fa-shield-alt" style="color: var(--soft-yellow); margin-right: 8px;"></i>
                <strong>Your privacy is protected:</strong> All letters are anonymous and encrypted. 
                We never store personal information unless you choose to provide an email for replies.
            </div>
        </div>
    </main>

    <script>
        // Show/hide email field based on reply method
        document.getElementById('replyMethod').addEventListener('change', function() {
            const emailGroup = document.getElementById('emailGroup');
            if (this.value === 'anonymous-email') {
                emailGroup.style.display = 'block';
                document.getElementById('anonymousEmail').required = true;
            } else {
                emailGroup.style.display = 'none';
                document.getElementById('anonymousEmail').required = false;
            }
        });
        
        // Handle form submission
        document.getElementById('letterForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = {
                topic: formData.get('topic'),
                content: formData.get('content'),
                replyMethod: formData.get('replyMethod'),
                anonymousEmail: formData.get('anonymousEmail')
            };
            
            try {
                const response = await fetch('/api/letters/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });
                
                const result = await response.json();
                
                if (response.ok) {
                    alert('Your letter has been submitted successfully! Letter ID: ' + result.letter.unique_id);
                    this.reset();
                    window.location.href = '/confirmation?id=' + result.letter.unique_id;
                } else {
                    alert('Error: ' + (result.error || 'Failed to submit letter'));
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred while submitting your letter. Please try again.');
            }
        });
    </script>
</body>
</html>`;
  
  return c.html(html);
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
            --dark-indigo: #1e2e4f;
            --light-yellow: #f8e2a0;
        }
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: 'Nunito', sans-serif;
            line-height: 1.6;
            color: var(--deep-indigo);
            background-color: var(--warm-white);
        }
        
        /* Navigation (same as other pages) */
        header {
            background-color: var(--deep-indigo);
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            position: sticky;
            top: 0;
            z-index: 100;
            padding: 0.3rem 0;
        }
        
        nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.3rem 2rem;
            max-width: 1400px;
            margin: 0 auto;
        }
        
        .logo {
            font-size: 1.3rem;
            font-weight: bold;
            color: var(--warm-white);
            text-decoration: none;
            display: flex;
            align-items: center;
            transition: transform 0.3s ease;
            padding: 0.4rem 0.8rem;
            border-radius: 50px;
            background-color: rgba(255, 255, 255, 0.1);
        }
        
        .logo:hover {
            transform: scale(1.05);
            background-color: rgba(255, 255, 255, 0.15);
        }
        
        .logo-img {
            height: 32px;
            width: 32px;
            margin-right: 10px;
            background-color: var(--soft-yellow);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--deep-indigo);
            font-size: 1rem;
        }
        
        nav ul {
            display: flex;
            list-style: none;
            align-items: center;
            gap: 0.6rem;
        }
        
        nav ul li {
            margin: 0 0.2rem;
            position: relative;
        }
        
        nav ul li a {
            color: var(--warm-white);
            text-decoration: none;
            transition: all 0.3s ease;
            font-weight: 600;
            padding: 0.4rem 0.8rem;
            border-radius: 50px;
            font-size: 0.9rem;
            cursor: pointer;
        }
        
        nav ul li a:hover {
            color: var(--soft-yellow);
            background-color: rgba(255, 255, 255, 0.1);
        }
        
        nav ul li a.active, .nav-primary {
            color: var(--soft-yellow);
            background-color: rgba(244, 208, 111, 0.15);
            font-weight: 700;
        }
        
        /* Page Content */
        main {
            padding: 80px 20px;
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .page-header {
            text-align: center;
            margin-bottom: 60px;
        }
        
        .page-header h1 {
            font-size: 3rem;
            color: var(--deep-indigo);
            margin-bottom: 20px;
        }
        
        .page-header p {
            font-size: 1.3rem;
            color: var(--gentle-lavender);
            max-width: 600px;
            margin: 0 auto;
        }
        
        .content-section {
            background: white;
            padding: 40px;
            border-radius: 20px;
            margin-bottom: 40px;
            box-shadow: 0 10px 30px rgba(42, 61, 102, 0.1);
        }
        
        .content-section h2 {
            color: var(--deep-indigo);
            margin-bottom: 20px;
            font-size: 2rem;
        }
        
        .content-section p {
            color: var(--gentle-lavender);
            font-size: 1.1rem;
            line-height: 1.8;
            margin-bottom: 20px;
        }
        
        .team-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
            margin-top: 40px;
        }
        
        .team-member {
            text-align: center;
            padding: 30px;
            background: var(--warm-white);
            border-radius: 15px;
        }
        
        .member-icon {
            font-size: 3rem;
            color: var(--soft-yellow);
            margin-bottom: 20px;
        }
        
        @media (max-width: 768px) {
            nav {
                flex-direction: column;
                gap: 15px;
                padding: 1rem;
            }
            
            nav ul {
                flex-wrap: wrap;
                justify-content: center;
            }
            
            .content-section {
                padding: 30px 20px;
                margin: 20px;
            }
        }
    </style>
</head>
<body>
    <header>
        <nav>
            <a href="/" class="logo">
                <div class="logo-img">
                    <i class="fas fa-heart"></i>
                </div>
                <span>Light in Silence</span>
            </a>
            
            <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/submit" class="nav-primary">Share Your Story</a></li>
                <li><a href="/check-reply" class="nav-primary">Check Reply</a></li>
                <li><a href="/blog">Blog</a></li>
                <li><a href="/events">Events</a></li>
                <li><a href="/resources">Resources</a></li>
                <li><a href="/contact">Contact</a></li>
                <li><a href="/about" class="active">About</a></li>
                <li><a href="/login">Login</a></li>
            </ul>
        </nav>
    </header>

    <main>
        <div class="page-header">
            <h1>About Light in Silence</h1>
            <p>Where your words find light and your voice finds strength</p>
        </div>

        <div class="content-section">
            <h2><i class="fas fa-heart" style="color: var(--soft-yellow); margin-right: 15px;"></i>Our Mission</h2>
            <p>
                Light in Silence is a mental health platform dedicated to providing anonymous support for anyone 
                who needs someone to listen. We believe that sharing your story, no matter how difficult, 
                is the first step toward healing and finding light in the darkness.
            </p>
            <p>
                Our platform combines the reach of digital technology with the warmth of human connection, 
                offering both online and offline ways to share your thoughts and receive caring responses 
                from trained volunteers and AI companions.
            </p>
        </div>

        <div class="content-section">
            <h2><i class="fas fa-users" style="color: var(--soft-yellow); margin-right: 15px;"></i>Our Approach</h2>
            <p>
                We understand that everyone processes emotions differently. That's why we offer multiple ways to connect:
            </p>
            <ul style="margin: 20px 0; padding-left: 20px; color: var(--gentle-lavender);">
                <li style="margin-bottom: 10px;"><strong>Online Platform:</strong> Submit your thoughts securely through our website</li>
                <li style="margin-bottom: 10px;"><strong>Physical Mailboxes:</strong> Write handwritten letters at community locations</li>
                <li style="margin-bottom: 10px;"><strong>AI Support:</strong> Get immediate responses from our caring AI companion</li>
                <li style="margin-bottom: 10px;"><strong>Human Connection:</strong> Receive personalized responses from trained volunteers</li>
            </ul>
        </div>

        <div class="content-section">
            <h2><i class="fas fa-shield-alt" style="color: var(--soft-yellow); margin-right: 15px;"></i>Your Privacy & Safety</h2>
            <p>
                Your anonymity is our priority. All communications are encrypted and anonymous by default. 
                We never store personal information unless you explicitly choose to provide an email for replies. 
                Our trained moderators ensure a safe space while our crisis detection system connects those 
                in immediate need with professional resources.
            </p>
        </div>

        <div class="content-section">
            <h2><i class="fas fa-lightbulb" style="color: var(--soft-yellow); margin-right: 15px;"></i>Why "Light in Silence"?</h2>
            <p>
                Sometimes the deepest thoughts emerge in moments of silence. We believe that even in your 
                quietest, most difficult moments, there is light to be found. Our name reflects our commitment 
                to helping you discover that light - whether it's through sharing your story, receiving support, 
                or simply knowing that someone cares.
            </p>
        </div>

        <div class="content-section">
            <h2><i class="fas fa-hands-helping" style="color: var(--soft-yellow); margin-right: 15px;"></i>Join Our Mission</h2>
            <p>
                Whether you're here to share your story, support others, or simply learn more about mental health, 
                you're part of our community. Together, we're creating a world where no one has to face their 
                struggles alone.
            </p>
            <div style="text-align: center; margin-top: 30px;">
                <a href="/submit" style="background: var(--soft-yellow); color: var(--deep-indigo); padding: 15px 30px; border-radius: 25px; text-decoration: none; font-weight: 600; display: inline-block; margin-right: 20px;">Share Your Story</a>
                <a href="/volunteer-info" style="background: transparent; color: var(--deep-indigo); padding: 15px 30px; border: 2px solid var(--gentle-lavender); border-radius: 25px; text-decoration: none; font-weight: 600; display: inline-block;">Become a Volunteer</a>
            </div>
        </div>
    </main>
</body>
</html>`;
  
  return c.html(html);
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
            --dark-indigo: #1e2e4f;
            --light-yellow: #f8e2a0;
        }
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: 'Nunito', sans-serif;
            line-height: 1.6;
            color: var(--deep-indigo);
            background-color: var(--warm-white);
        }
        
        /* Navigation (same as other pages) */
        header {
            background-color: var(--deep-indigo);
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            position: sticky;
            top: 0;
            z-index: 100;
            padding: 0.3rem 0;
        }
        
        nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.3rem 2rem;
            max-width: 1400px;
            margin: 0 auto;
        }
        
        .logo {
            font-size: 1.3rem;
            font-weight: bold;
            color: var(--warm-white);
            text-decoration: none;
            display: flex;
            align-items: center;
            transition: transform 0.3s ease;
            padding: 0.4rem 0.8rem;
            border-radius: 50px;
            background-color: rgba(255, 255, 255, 0.1);
        }
        
        .logo:hover {
            transform: scale(1.05);
            background-color: rgba(255, 255, 255, 0.15);
        }
        
        .logo-img {
            height: 32px;
            width: 32px;
            margin-right: 10px;
            background-color: var(--soft-yellow);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--deep-indigo);
            font-size: 1rem;
        }
        
        nav ul {
            display: flex;
            list-style: none;
            align-items: center;
            gap: 0.6rem;
        }
        
        nav ul li {
            margin: 0 0.2rem;
            position: relative;
        }
        
        nav ul li a {
            color: var(--warm-white);
            text-decoration: none;
            transition: all 0.3s ease;
            font-weight: 600;
            padding: 0.4rem 0.8rem;
            border-radius: 50px;
            font-size: 0.9rem;
            cursor: pointer;
        }
        
        nav ul li a:hover {
            color: var(--soft-yellow);
            background-color: rgba(255, 255, 255, 0.1);
        }
        
        nav ul li a.active, .nav-primary {
            color: var(--soft-yellow);
            background-color: rgba(244, 208, 111, 0.15);
            font-weight: 700;
        }
        
        /* Emergency Section */
        .emergency-section {
            background: linear-gradient(135deg, #f44336, #e53935);
            color: white;
            padding: 40px;
            border-radius: 20px;
            text-align: center;
            margin: 40px 20px;
        }
        
        .emergency-section h2 {
            margin-bottom: 20px;
            font-size: 2rem;
        }
        
        .emergency-links {
            display: flex;
            gap: 20px;
            justify-content: center;
            flex-wrap: wrap;
            margin-top: 30px;
        }
        
        .emergency-link {
            background: white;
            color: #f44336;
            padding: 15px 25px;
            border-radius: 25px;
            text-decoration: none;
            font-weight: 600;
            display: inline-flex;
            align-items: center;
            gap: 10px;
            transition: all 0.3s ease;
        }
        
        .emergency-link:hover {
            transform: scale(1.05);
            box-shadow: 0 5px 15px rgba(255, 255, 255, 0.3);
            color: #f44336;
        }
        
        /* Page Content */
        main {
            padding: 80px 20px;
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .page-header {
            text-align: center;
            margin-bottom: 60px;
        }
        
        .page-header h1 {
            font-size: 3rem;
            color: var(--deep-indigo);
            margin-bottom: 20px;
        }
        
        .page-header p {
            font-size: 1.3rem;
            color: var(--gentle-lavender);
            max-width: 600px;
            margin: 0 auto;
        }
        
        .contact-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
            gap: 40px;
            margin-bottom: 60px;
        }
        
        .contact-card {
            background: white;
            padding: 40px;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(42, 61, 102, 0.1);
            text-align: center;
        }
        
        .contact-icon {
            font-size: 3rem;
            color: var(--soft-yellow);
            margin-bottom: 20px;
        }
        
        .contact-card h3 {
            color: var(--deep-indigo);
            margin-bottom: 15px;
            font-size: 1.5rem;
        }
        
        .contact-card p {
            color: var(--gentle-lavender);
            margin-bottom: 20px;
            line-height: 1.6;
        }
        
        .contact-link {
            background: var(--soft-yellow);
            color: var(--deep-indigo);
            padding: 12px 25px;
            border-radius: 25px;
            text-decoration: none;
            font-weight: 600;
            display: inline-block;
            transition: all 0.3s ease;
        }
        
        .contact-link:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(244, 208, 111, 0.3);
            color: var(--deep-indigo);
        }
        
        @media (max-width: 768px) {
            nav {
                flex-direction: column;
                gap: 15px;
                padding: 1rem;
            }
            
            nav ul {
                flex-wrap: wrap;
                justify-content: center;
            }
            
            .contact-grid {
                grid-template-columns: 1fr;
            }
            
            .contact-card {
                padding: 30px 20px;
            }
            
            .emergency-links {
                flex-direction: column;
                align-items: center;
            }
        }
    </style>
</head>
<body>
    <header>
        <nav>
            <a href="/" class="logo">
                <div class="logo-img">
                    <i class="fas fa-heart"></i>
                </div>
                <span>Light in Silence</span>
            </a>
            
            <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/submit" class="nav-primary">Share Your Story</a></li>
                <li><a href="/check-reply" class="nav-primary">Check Reply</a></li>
                <li><a href="/blog">Blog</a></li>
                <li><a href="/events">Events</a></li>
                <li><a href="/resources">Resources</a></li>
                <li><a href="/contact" class="active">Contact</a></li>
                <li><a href="/about">About</a></li>
                <li><a href="/login">Login</a></li>
            </ul>
        </nav>
    </header>

    <main>
        <div class="page-header">
            <h1>Contact Us</h1>
            <p>We're here to listen and support you in whatever way we can</p>
        </div>

        <div class="emergency-section">
            <h2><i class="fas fa-exclamation-triangle"></i> Need Immediate Help?</h2>
            <p>If you're experiencing a mental health crisis or thinking about harming yourself, please reach out for immediate support:</p>
            <div class="emergency-links">
                <a href="tel:1-833-456-4566" class="emergency-link">
                    <i class="fas fa-phone"></i>
                    Crisis Line: 1-833-456-4566
                </a>
                <a href="tel:911" class="emergency-link">
                    <i class="fas fa-ambulance"></i>
                    Emergency: 911
                </a>
                <a href="sms:45645" class="emergency-link">
                    <i class="fas fa-sms"></i>
                    Text Support: 45645
                </a>
            </div>
        </div>

        <div class="contact-grid">
            <div class="contact-card">
                <div class="contact-icon">
                    <i class="fas fa-envelope"></i>
                </div>
                <h3>General Inquiries</h3>
                <p>Have questions about our platform, services, or want to learn more about how we can help?</p>
                <a href="mailto:support@lightinsilence.ca" class="contact-link">
                    Email Us
                </a>
            </div>

            <div class="contact-card">
                <div class="contact-icon">
                    <i class="fas fa-hands-helping"></i>
                </div>
                <h3>Volunteer Opportunities</h3>
                <p>Interested in becoming a volunteer responder and helping others in their journey?</p>
                <a href="/volunteer-info" class="contact-link">
                    Learn More
                </a>
            </div>

            <div class="contact-card">
                <div class="contact-icon">
                    <i class="fas fa-heart"></i>
                </div>
                <h3>Partnership & Donations</h3>
                <p>Want to support our mission through partnerships, sponsorship, or donations?</p>
                <a href="/donate" class="contact-link">
                    Support Us
                </a>
            </div>

            <div class="contact-card">
                <div class="contact-icon">
                    <i class="fas fa-map-marker-alt"></i>
                </div>
                <h3>Physical Mailboxes</h3>
                <p>Find locations of our community mailboxes where you can submit handwritten letters.</p>
                <a href="/locations" class="contact-link">
                    Find Locations
                </a>
            </div>
        </div>

        <div class="contact-card" style="max-width: 800px; margin: 0 auto;">
            <h3 style="color: var(--deep-indigo); margin-bottom: 20px; font-size: 1.8rem;">
                <i class="fas fa-lightbulb" style="color: var(--soft-yellow); margin-right: 15px;"></i>
                Our Promise to You
            </h3>
            <p style="color: var(--gentle-lavender); font-size: 1.1rem; line-height: 1.8; text-align: left;">
                When you reach out to us, whether through our platform or direct contact, you can expect:
            </p>
            <ul style="margin: 20px 0; padding-left: 20px; color: var(--gentle-lavender); text-align: left;">
                <li style="margin-bottom: 10px;"><strong>Respect & Dignity:</strong> Every interaction is handled with care and respect</li>
                <li style="margin-bottom: 10px;"><strong>Confidentiality:</strong> Your privacy is protected at all times</li>
                <li style="margin-bottom: 10px;"><strong>Non-Judgmental Support:</strong> We listen without judgment</li>
                <li style="margin-bottom: 10px;"><strong>Timely Responses:</strong> We aim to respond within 24-48 hours</li>
            </ul>
        </div>
    </main>
</body>
</html>`;
  
  return c.html(html);
});

staticRoutes.get('/check-reply', async (c) => {
  const html = `<!DOCTYPE html>
<html lang="en-CA">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Check Reply - Light in Silence</title>
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <style>
        :root {
            --deep-indigo: #2A3D66;
            --soft-yellow: #F4D06F;
            --warm-white: #FAFAFA;
            --gentle-lavender: #B39CD0;
            --dark-indigo: #1e2e4f;
            --light-yellow: #f8e2a0;
        }
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: 'Nunito', sans-serif;
            line-height: 1.6;
            color: var(--deep-indigo);
            background-color: var(--warm-white);
        }
        
        /* Navigation (same as other pages) */
        header {
            background-color: var(--deep-indigo);
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            position: sticky;
            top: 0;
            z-index: 100;
            padding: 0.3rem 0;
        }
        
        nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.3rem 2rem;
            max-width: 1400px;
            margin: 0 auto;
        }
        
        .logo {
            font-size: 1.3rem;
            font-weight: bold;
            color: var(--warm-white);
            text-decoration: none;
            display: flex;
            align-items: center;
            transition: transform 0.3s ease;
            padding: 0.4rem 0.8rem;
            border-radius: 50px;
            background-color: rgba(255, 255, 255, 0.1);
        }
        
        .logo:hover {
            transform: scale(1.05);
            background-color: rgba(255, 255, 255, 0.15);
        }
        
        .logo-img {
            height: 32px;
            width: 32px;
            margin-right: 10px;
            background-color: var(--soft-yellow);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--deep-indigo);
            font-size: 1rem;
        }
        
        nav ul {
            display: flex;
            list-style: none;
            align-items: center;
            gap: 0.6rem;
        }
        
        nav ul li {
            margin: 0 0.2rem;
            position: relative;
        }
        
        nav ul li a {
            color: var(--warm-white);
            text-decoration: none;
            transition: all 0.3s ease;
            font-weight: 600;
            padding: 0.4rem 0.8rem;
            border-radius: 50px;
            font-size: 0.9rem;
            cursor: pointer;
        }
        
        nav ul li a:hover {
            color: var(--soft-yellow);
            background-color: rgba(255, 255, 255, 0.1);
        }
        
        nav ul li a.active, .nav-primary {
            color: var(--soft-yellow);
            background-color: rgba(244, 208, 111, 0.15);
            font-weight: 700;
        }
        
        /* Dropdown styles */
        .dropdown {
            position: relative;
        }
        
        .dropdown-content {
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
            background-color: white;
            min-width: 200px;
            box-shadow: 0 8px 16px rgba(0,0,0,0.2);
            border-radius: 10px;
            z-index: 1000;
            padding: 10px 0;
        }
        
        .dropdown:hover .dropdown-content {
            display: block;
        }
        
        .dropdown-content a {
            color: var(--deep-indigo) !important;
            padding: 12px 20px;
            text-decoration: none;
            display: block;
            font-weight: 600;
            font-size: 0.9rem;
            transition: all 0.3s ease;
            border-radius: 0;
            background-color: transparent;
        }
        
        .dropdown-content a:hover {
            background-color: var(--soft-yellow) !important;
            color: var(--deep-indigo) !important;
        }
        
        .dropdown > a::after {
            content: ' ▼';
            font-size: 0.7rem;
            margin-left: 5px;
            transition: transform 0.3s ease;
        }
        
        .dropdown:hover > a::after {
            transform: rotate(180deg);
        }
        
        /* Page Content */
        main {
            padding: 80px 20px;
            max-width: 800px;
            margin: 0 auto;
        }
        
        .form-container {
            background: white;
            padding: 40px;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(42, 61, 102, 0.1);
            text-align: center;
        }
        
        .form-container h1 {
            color: var(--deep-indigo);
            margin-bottom: 20px;
            font-size: 2.5rem;
        }
        
        .form-container p {
            color: var(--gentle-lavender);
            margin-bottom: 30px;
            font-size: 1.1rem;
            line-height: 1.6;
        }
        
        .search-form {
            max-width: 400px;
            margin: 0 auto;
        }
        
        .form-group {
            margin-bottom: 20px;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 10px;
            color: var(--deep-indigo);
            font-weight: 600;
            text-align: left;
        }
        
        .form-group input {
            width: 100%;
            padding: 15px;
            border: 2px solid var(--gentle-lavender);
            border-radius: 10px;
            font-size: 1rem;
            font-family: inherit;
            transition: all 0.3s ease;
        }
        
        .form-group input:focus {
            outline: none;
            border-color: var(--soft-yellow);
            box-shadow: 0 0 10px rgba(244, 208, 111, 0.3);
        }
        
        .search-btn {
            background: linear-gradient(135deg, var(--soft-yellow), #f4d06f);
            color: var(--deep-indigo);
            padding: 15px 40px;
            border: none;
            border-radius: 50px;
            font-size: 1.1rem;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s ease;
            width: 100%;
            box-shadow: 0 8px 20px rgba(244, 208, 111, 0.3);
        }
        
        .search-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 12px 30px rgba(244, 208, 111, 0.4);
        }
        
        .help-section {
            background: var(--warm-white);
            padding: 30px;
            border-radius: 15px;
            margin-top: 40px;
            text-align: left;
        }
        
        .help-section h3 {
            color: var(--deep-indigo);
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .help-section ul {
            color: var(--gentle-lavender);
            padding-left: 20px;
        }
        
        .help-section li {
            margin-bottom: 8px;
        }
        
        @media (max-width: 768px) {
            nav {
                flex-direction: column;
                gap: 15px;
                padding: 1rem;
            }
            
            nav ul {
                flex-wrap: wrap;
                justify-content: center;
            }
            
            .form-container {
                padding: 30px 20px;
            }
        }
    </style>
</head>
<body>
    <header>
        <nav>
            <a href="/" class="logo">
                <div class="logo-img">
                    <i class="fas fa-heart"></i>
                </div>
                <span>Light in Silence</span>
            </a>
            
            <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/submit" class="nav-primary">Share Your Story</a></li>
                <li><a href="/check-reply" class="nav-primary active">Check Reply</a></li>
                
                <li class="dropdown">
                    <a href="#">Discover</a>
                    <div class="dropdown-content">
                        <a href="/blog"><i class="fas fa-blog" style="margin-right: 8px;"></i>Blog</a>
                        <a href="/events"><i class="fas fa-calendar" style="margin-right: 8px;"></i>Events</a>
                        <a href="/resources"><i class="fas fa-book" style="margin-right: 8px;"></i>Resources</a>
                    </div>
                </li>
                
                <li class="dropdown">
                    <a href="#">About</a>
                    <div class="dropdown-content">
                        <a href="/about"><i class="fas fa-info-circle" style="margin-right: 8px;"></i>Our Mission</a>
                        <a href="/contact"><i class="fas fa-envelope" style="margin-right: 8px;"></i>Contact Us</a>
                        <a href="/volunteer-info"><i class="fas fa-hands-helping" style="margin-right: 8px;"></i>Volunteer</a>
                        <a href="/donate"><i class="fas fa-heart" style="margin-right: 8px;"></i>Donate</a>
                    </div>
                </li>

                <li><a href="/login" class="login-btn">
                    <i class="fas fa-sign-in-alt" style="margin-right: 5px;"></i>Login
                </a></li>
            </ul>
        </nav>
    </header>

    <main>
        <div class="form-container">
            <h1><i class="fas fa-search" style="color: var(--soft-yellow); margin-right: 15px;"></i>Check Your Reply</h1>
            <p>
                Enter your letter code below to see if there's a response to your letter. 
                Your letter code was provided when you submitted your letter.
            </p>
            
            <form id="checkReplyForm" class="search-form">
                <div class="form-group">
                    <label for="letterCode">Letter Code</label>
                    <input type="text" id="letterCode" name="letterCode" required 
                           placeholder="Enter your letter code (e.g., ABC123XY)" 
                           pattern="[A-Za-z0-9-]+" 
                           title="Please enter a valid letter code">
                </div>
                
                <button type="submit" class="search-btn">
                    <i class="fas fa-search"></i> Check for Reply
                </button>
            </form>
            
            <div class="help-section">
                <h3><i class="fas fa-question-circle" style="color: var(--soft-yellow);"></i>Need Help?</h3>
                <ul>
                    <li><strong>Can't find your letter code?</strong> Check your email confirmation or the page that appeared after submitting your letter</li>
                    <li><strong>Code not working?</strong> Make sure you're entering it exactly as provided, including any dashes</li>
                    <li><strong>No reply yet?</strong> Our volunteers typically respond within 48-72 hours</li>
                    <li><strong>Still having trouble?</strong> <a href="/contact" style="color: var(--soft-yellow); text-decoration: none;">Contact our support team</a></li>
                </ul>
            </div>
        </div>
    </main>

    <script>
        document.getElementById('checkReplyForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const letterCode = document.getElementById('letterCode').value.trim();
            
            if (!letterCode) {
                alert('Please enter your letter code.');
                return;
            }
            
            try {
                const response = await fetch(\`/api/letters/\${letterCode}/responses\`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                
                const result = await response.json();
                
                if (response.ok) {
                    if (result.responses && result.responses.length > 0) {
                        // Redirect to response page
                        window.location.href = \`/response/\${letterCode}\`;
                    } else {
                        alert('No replies found yet. Please check back later - our volunteers typically respond within 48-72 hours.');
                    }
                } else {
                    if (response.status === 404) {
                        alert('Letter not found. Please check your letter code and try again.');
                    } else {
                        alert('Error: ' + (result.error || 'Failed to check for replies'));
                    }
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred while checking for replies. Please try again.');
            }
        });
        
        // Auto-format letter code input
        document.getElementById('letterCode').addEventListener('input', function() {
            this.value = this.value.toUpperCase();
        });
    </script>
</body>
</html>`;
  
  return c.html(html);
});

// Missing Pages - Add all the dropdown menu pages

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
            --dark-indigo: #1e2e4f;
            --light-yellow: #f8e2a0;
        }
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: 'Nunito', sans-serif;
            line-height: 1.6;
            color: var(--deep-indigo);
            background-color: var(--warm-white);
        }
        
        /* Header */
        header {
            background-color: var(--deep-indigo);
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            position: sticky;
            top: 0;
            z-index: 100;
            padding: 0.3rem 0;
        }
        
        nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.3rem 2rem;
            max-width: 1400px;
            margin: 0 auto;
        }
        
        .logo {
            font-size: 1.3rem;
            font-weight: bold;
            color: var(--warm-white);
            text-decoration: none;
            display: flex;
            align-items: center;
            transition: transform 0.3s ease;
            padding: 0.4rem 0.8rem;
            border-radius: 50px;
            background-color: rgba(255, 255, 255, 0.1);
        }
        
        .logo-img {
            height: 32px;
            width: 32px;
            margin-right: 10px;
            background-color: var(--soft-yellow);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--deep-indigo);
            font-size: 1rem;
        }
        
        nav ul {
            display: flex;
            list-style: none;
            align-items: center;
            gap: 0.6rem;
        }
        
        nav ul li a {
            color: var(--warm-white);
            text-decoration: none;
            transition: all 0.3s ease;
            font-weight: 600;
            padding: 0.4rem 0.8rem;
            border-radius: 50px;
            font-size: 0.9rem;
        }
        
        nav ul li a:hover {
            color: var(--soft-yellow);
            background-color: rgba(255, 255, 255, 0.1);
        }
        
        nav ul li a.active {
            color: var(--soft-yellow);
            background-color: rgba(244, 208, 111, 0.15);
            font-weight: 700;
        }
        
        /* Main content */
        .container {
            max-width: 500px;
            margin: 80px auto;
            padding: 20px;
        }
        
        .page-header {
            text-align: center;
            margin-bottom: 30px;
        }
        
        .page-header h1 {
            color: var(--deep-indigo);
            font-size: 2.5rem;
            margin-bottom: 10px;
        }
        
        .page-header p {
            color: var(--gentle-lavender);
            font-size: 1.1rem;
        }
        
        .form-container {
            background: white;
            padding: 40px;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(42, 61, 102, 0.1);
        }
        
        .form-group {
            margin-bottom: 25px;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: var(--deep-indigo);
            font-size: 1.1rem;
        }
        
        .form-group input {
            width: 100%;
            padding: 15px;
            border: 2px solid #e0e0e0;
            border-radius: 10px;
            font-size: 1rem;
            transition: all 0.3s ease;
        }
        
        .form-group input:focus {
            outline: none;
            border-color: var(--soft-yellow);
            box-shadow: 0 0 10px rgba(244, 208, 111, 0.3);
        }
        
        .remember-me {
            display: flex;
            align-items: center;
            margin-bottom: 30px;
        }
        
        .remember-me input {
            margin-right: 10px;
            transform: scale(1.2);
        }
        
        .btn-primary {
            background: linear-gradient(135deg, var(--soft-yellow), #f4d06f);
            color: var(--deep-indigo);
            padding: 15px;
            border: none;
            border-radius: 50px;
            font-size: 1.1rem;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s ease;
            width: 100%;
            margin-bottom: 25px;
            box-shadow: 0 8px 20px rgba(244, 208, 111, 0.3);
        }
        
        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 30px rgba(244, 208, 111, 0.4);
        }
        
        .btn-secondary {
            background: transparent;
            color: var(--deep-indigo);
            border: 2px solid var(--gentle-lavender);
            padding: 12px 25px;
            border-radius: 25px;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.3s ease;
            display: inline-block;
        }
        
        .btn-secondary:hover {
            background: var(--gentle-lavender);
            color: white;
            transform: translateY(-2px);
        }
        
        .divider {
            text-align: center;
            padding: 25px 0;
            border-top: 1px solid #e0e0e0;
        }
        
        .volunteer-card {
            margin-top: 30px;
            padding: 25px;
            background: linear-gradient(135deg, var(--gentle-lavender), var(--deep-indigo));
            border-radius: 15px;
            color: white;
            text-align: center;
        }
        
        .volunteer-card h3 {
            color: white;
            margin-bottom: 15px;
        }
        
        .volunteer-card p {
            margin-bottom: 20px;
            opacity: 0.9;
            line-height: 1.6;
        }
        
        .support-resources {
            margin-top: 20px;
            padding: 20px;
            background: white;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(42, 61, 102, 0.05);
            text-align: center;
        }
        
        .support-links {
            display: flex;
            gap: 15px;
            justify-content: center;
            flex-wrap: wrap;
        }
        
        .support-links a {
            color: var(--gentle-lavender);
            text-decoration: none;
            font-weight: 600;
            display: flex;
            align-items: center;
        }
    </style>
</head>
<body>
    <header>
        <nav>
            <a href="/" class="logo">
                <div class="logo-img">
                    <i class="fas fa-heart"></i>
                </div>
                <span>Light in Silence</span>
            </a>
            
            <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/submit">Share Your Story</a></li>
                <li><a href="/check-reply">Check Reply</a></li>
                <li><a href="/blog">Blog</a></li>
                <li><a href="/about">About</a></li>
                <li><a href="/contact">Contact</a></li>
                <li><a href="/login" class="active">Login</a></li>
            </ul>
        </nav>
    </header>

    <div class="container">
        <div class="page-header">
            <h1>Welcome Back</h1>
            <p>Sign in to your Light in Silence account</p>
        </div>
        
        <div class="form-container">
            <form method="POST" id="loginForm">
                <div class="form-group">
                    <label for="email">Email Address</label>
                    <input type="email" id="email" name="email" required placeholder="your.email@example.com">
                </div>
                
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" name="password" required placeholder="Enter your password">
                </div>
                
                <div class="remember-me">
                    <input type="checkbox" id="remember_me" name="remember_me">
                    <label for="remember_me">Remember me for 30 days</label>
                </div>
                
                <button type="submit" class="btn-primary">
                    <i class="fas fa-sign-in-alt" style="margin-right: 10px;"></i>Sign In
                </button>
            </form>
            
            <div class="divider">
                <p style="color: var(--gentle-lavender); margin-bottom: 15px;">Don't have an account yet?</p>
                <a href="/register" class="btn-secondary">
                    <i class="fas fa-user-plus" style="margin-right: 8px;"></i>Create Account
                </a>
            </div>
        </div>
        
        <div class="volunteer-card">
            <h3><i class="fas fa-hands-helping" style="margin-right: 10px;"></i>Want to Help Others?</h3>
            <p>Join our volunteer community and make a difference in someone's life by providing compassionate support.</p>
            <a href="/volunteer-info" class="btn-secondary" style="background-color: rgba(255,255,255,0.2); color: white; border: 2px solid rgba(255,255,255,0.3);">
                Learn About Volunteering
            </a>
        </div>
        
        <div class="support-resources">
            <p style="color: var(--deep-indigo); margin-bottom: 15px; font-weight: 600;">Need support right now?</p>
            <div class="support-links">
                <a href="/submit">
                    <i class="fas fa-envelope" style="margin-right: 8px;"></i>Share Your Story
                </a>
                <a href="/resources">
                    <i class="fas fa-life-ring" style="margin-right: 8px;"></i>Crisis Resources
                </a>
            </div>
        </div>
    </div>

    <script>
        // Check authentication state on page load
        document.addEventListener('DOMContentLoaded', function() {
            checkAuthState();
        });
        
        function checkAuthState() {
            const token = localStorage.getItem('authToken');
            const userData = localStorage.getItem('userData');
            
            if (token && userData) {
                try {
                    const user = JSON.parse(userData);
                    // Show user info in navigation instead of redirecting
                    updateLoginButton(user);
                } catch (error) {
                    console.error('Error parsing user data:', error);
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('userData');
                }
            }
        }
        
        function updateLoginButton(user) {
            const loginButton = document.querySelector('a[href="/login"]');
            if (loginButton) {
                loginButton.innerHTML = '<i class="fas fa-user" style="margin-right: 5px;"></i>Welcome, ' + user.username;
                loginButton.onclick = function(e) {
                    e.preventDefault();
                    if (confirm('Go to dashboard?')) {
                        if (user.isAdmin) {
                            window.location.href = '/admin';
                        } else if (user.isVolunteer) {
                            window.location.href = '/volunteer';
                        } else {
                            alert('Dashboard access: Admin/Volunteer only');
                        }
                    }
                };
            }
        }
        
        document.getElementById('loginForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = {
                email: formData.get('email'),
                password: formData.get('password'),
                remember_me: formData.get('remember_me') === 'on'
            };
            
            try {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });
                
                const result = await response.json();
                
                if (response.ok) {
                    // Store authentication data
                    localStorage.setItem('authToken', result.token);
                    localStorage.setItem('userData', JSON.stringify(result.user));
                    
                    // Show success message
                    alert('Login successful! Welcome back, ' + result.user.username + '!');
                    
                    // Redirect based on user role
                    if (result.user.isAdmin) {
                        window.location.href = '/admin';
                    } else if (result.user.isVolunteer) {
                        window.location.href = '/volunteer';
                    } else {
                        window.location.href = '/';
                    }
                } else {
                    alert('Error: ' + (result.error || 'Login failed'));
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred during login. Please try again.');
            }
        });
    </script>
</body>
</html>`;
  
  return c.html(html);
});

// Blog page
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
        :root { --deep-indigo: #2A3D66; --soft-yellow: #F4D06F; --warm-white: #FAFAFA; --gentle-lavender: #B39CD0; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Nunito', sans-serif; line-height: 1.6; color: var(--deep-indigo); background-color: var(--warm-white); }
        header { background-color: var(--deep-indigo); box-shadow: 0 4px 12px rgba(0,0,0,0.1); position: sticky; top: 0; z-index: 100; padding: 0.3rem 0; }
        nav { display: flex; justify-content: space-between; align-items: center; padding: 0.3rem 2rem; max-width: 1400px; margin: 0 auto; }
        .logo { font-size: 1.3rem; font-weight: bold; color: var(--warm-white); text-decoration: none; display: flex; align-items: center; transition: transform 0.3s ease; padding: 0.4rem 0.8rem; border-radius: 50px; background-color: rgba(255, 255, 255, 0.1); }
        .logo-img { height: 32px; width: 32px; margin-right: 10px; background-color: var(--soft-yellow); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--deep-indigo); font-size: 1rem; }
        nav ul { display: flex; list-style: none; align-items: center; gap: 0.6rem; }
        nav ul li a { color: var(--warm-white); text-decoration: none; transition: all 0.3s ease; font-weight: 600; padding: 0.4rem 0.8rem; border-radius: 50px; font-size: 0.9rem; }
        nav ul li a:hover { color: var(--soft-yellow); background-color: rgba(255, 255, 255, 0.1); }
        nav ul li a.active, .nav-primary { color: var(--soft-yellow); background-color: rgba(244, 208, 111, 0.15); font-weight: 700; }
        
        /* Dropdown styles - EXACT match to Flask localhost */
        .dropdown {
            position: relative;
        }
        
        .dropdown > a {
            pointer-events: auto !important;
            cursor: pointer;
        }
        
        .dropdown-content {
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
            background-color: white;
            min-width: 200px;
            box-shadow: 0 8px 16px rgba(0,0,0,0.2);
            border-radius: 10px;
            z-index: 1000;
            padding: 10px 0;
        }
        
        .dropdown:hover .dropdown-content {
            display: block;
        }
        
        .dropdown-content a {
            color: var(--deep-indigo) !important;
            padding: 12px 20px;
            text-decoration: none;
            display: block;
            border-radius: 0;
            background: none !important;
            font-weight: 500;
        }
        
        .dropdown-content a:hover {
            background: var(--warm-white) !important;
            color: var(--deep-indigo) !important;
        }
        
        .container { max-width: 1200px; margin: 80px auto; padding: 20px; }
        .page-header { text-align: center; margin-bottom: 60px; }
        .page-header h1 { color: var(--deep-indigo); font-size: 3rem; margin-bottom: 20px; }
        .page-header p { color: var(--gentle-lavender); font-size: 1.3rem; }
        .post-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 30px; }
        .post-card { background: white; padding: 30px; border-radius: 20px; box-shadow: 0 10px 30px rgba(42, 61, 102, 0.1); transition: transform 0.3s ease; }
        .post-card:hover { transform: translateY(-5px); }
        .post-card h2 { color: var(--deep-indigo); margin-bottom: 15px; font-size: 1.5rem; }
        .post-meta { color: var(--gentle-lavender); margin-bottom: 15px; font-size: 0.9rem; }
        .post-excerpt { color: var(--deep-indigo); line-height: 1.6; margin-bottom: 20px; }
        .read-more { background: var(--soft-yellow); color: var(--deep-indigo); padding: 10px 20px; border-radius: 25px; text-decoration: none; font-weight: 600; transition: all 0.3s ease; display: inline-block; }
        .read-more:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(244, 208, 111, 0.3); color: var(--deep-indigo); }
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
                <!-- Primary Actions -->
                <li><a href="/" class="nav-primary">Home</a></li>
                <li><a href="/submit" class="nav-primary">Share Your Story</a></li>
                <li><a href="/check-reply" class="nav-primary">Check Reply</a></li>
                
                <!-- Discover Dropdown -->
                <li class="dropdown">
                    <a href="#">Discover</a>
                    <div class="dropdown-content">
                        <a href="/blog">
                            <i class="fas fa-blog" style="margin-right: 8px;"></i>Blog
                        </a>
                        <a href="/events">
                            <i class="fas fa-calendar" style="margin-right: 8px;"></i>Events
                        </a>
                        <a href="/resources">
                            <i class="fas fa-book" style="margin-right: 8px;"></i>Resources
                        </a>
                    </div>
                </li>
                
                <!-- About Dropdown -->
                <li class="dropdown">
                    <a href="#">About</a>
                    <div class="dropdown-content">
                        <a href="/about">
                            <i class="fas fa-info-circle" style="margin-right: 8px;"></i>Our Mission
                        </a>
                        <a href="/contact">
                            <i class="fas fa-envelope" style="margin-right: 8px;"></i>Contact Us
                        </a>
                        <a href="/volunteer-info">
                            <i class="fas fa-hands-helping" style="margin-right: 8px;"></i>Volunteer
                        </a>
                        <a href="/donate">
                            <i class="fas fa-heart" style="margin-right: 8px;"></i>Donate
                        </a>
                    </div>
                </li>

                <!-- User Area - Will be updated by JavaScript for authenticated users -->
                <li><a href="/login" class="login-btn">
                    <i class="fas fa-sign-in-alt" style="margin-right: 5px;"></i>Login
                </a></li>
            </ul>
        </nav>
    </header>

    <div class="container">
        <div class="page-header">
            <h1><i class="fas fa-blog" style="color: var(--soft-yellow); margin-right: 20px;"></i>Our Blog</h1>
            <p>Mental health tips, success stories, and stress-relief techniques</p>
        </div>

        <div class="post-grid">
            <div class="post-card">
                <h2>Finding Light in the Smallest Moments</h2>
                <div class="post-meta"><i class="fas fa-calendar"></i> January 15, 2024 | <i class="fas fa-user"></i> Light in Silence Team</div>
                <div class="post-excerpt">
                    Even on the darkest days, there is light to be found. It might be in the warmth of a cup of tea, the sound of rain on the window, or a kind word from a stranger. This blog is about noticing and appreciating those small moments...
                </div>
                <a href="/blog/1" class="read-more">Read More <i class="fas fa-arrow-right"></i></a>
            </div>
            
            <div class="post-card">
                <h2>Managing Anxiety: Practical Daily Techniques</h2>
                <div class="post-meta"><i class="fas fa-calendar"></i> January 10, 2024 | <i class="fas fa-user"></i> Dr. Sarah Chen</div>
                <div class="post-excerpt">
                    Anxiety can feel overwhelming, but there are simple, evidence-based techniques you can use every day to manage symptoms and find calm. Learn about breathing exercises, grounding techniques, and mindfulness practices...
                </div>
                <a href="/blog/2" class="read-more">Read More <i class="fas fa-arrow-right"></i></a>
            </div>
            
            <div class="post-card">
                <h2>The Power of Community in Mental Health</h2>
                <div class="post-meta"><i class="fas fa-calendar"></i> January 5, 2024 | <i class="fas fa-user"></i> Community Team</div>
                <div class="post-excerpt">
                    Mental health challenges can feel isolating, but research shows that community support plays a crucial role in recovery and wellness. Discover how connecting with others can transform your mental health journey...
                </div>
                <a href="/blog/3" class="read-more">Read More <i class="fas fa-arrow-right"></i></a>
            </div>
        </div>
    </div>

    <script>
        // Authentication State Management for Blog Page
        document.addEventListener('DOMContentLoaded', function() {
            checkAuthState();
            fixDropdownNavigation();
        });

        function checkAuthState() {
            const token = localStorage.getItem('authToken');
            const userData = localStorage.getItem('userData');
            
            if (token && userData) {
                try {
                    const user = JSON.parse(userData);
                    updateLoginButton(user);
                } catch (error) {
                    console.error('Error parsing user data:', error);
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('userData');
                }
            }
        }
        
        function updateLoginButton(user) {
            const navMenu = document.getElementById('nav-menu');
            if (!navMenu) return;

            // Find and remove the login button
            const loginBtn = navMenu.querySelector('.login-btn');
            if (loginBtn && loginBtn.parentElement) {
                loginBtn.parentElement.remove();
            }

            // Add admin panel for admins (EXACT match to Flask localhost)
            if (user.isAdmin) {
                const adminLi = document.createElement('li');
                adminLi.innerHTML = '<a href="/admin" class="nav-primary">' +
                                  '<i class="fas fa-shield-alt" style="margin-right: 5px;"></i>Admin Panel</a>';
                navMenu.appendChild(adminLi);
            }
            
            // Add volunteer dashboard for volunteers and admins (EXACT match to Flask localhost)
            if (user.isVolunteer || user.isAdmin) {
                const volunteerLi = document.createElement('li');
                volunteerLi.innerHTML = '<a href="/volunteer">' +
                                      '<i class="fas fa-tachometer-alt" style="margin-right: 5px;"></i>Volunteer Dashboard</a>';
                navMenu.appendChild(volunteerLi);
            }
            
            // Add logout button (EXACT match to Flask localhost)
            const logoutLi = document.createElement('li');
            logoutLi.innerHTML = '<a href="#" onclick="logout()" class="logout-btn">' +
                               '<i class="fas fa-sign-out-alt" style="margin-right: 5px;"></i>Logout</a>';
            navMenu.appendChild(logoutLi);
        }
        
        function logout() {
            if (confirm('Are you sure you want to logout?')) {
                localStorage.removeItem('authToken');
                localStorage.removeItem('userData');
                window.location.href = '/';
            }
        }

        function fixDropdownNavigation() {
            const dropdowns = document.querySelectorAll('.dropdown');
            dropdowns.forEach(dropdown => {
                const mainLink = dropdown.querySelector('> a');
                if (mainLink) {
                    mainLink.addEventListener('click', function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                    });
                }
                
                dropdown.addEventListener('mouseenter', function() {
                    const content = this.querySelector('.dropdown-content');
                    if (content) {
                        content.style.display = 'block';
                    }
                });
                
                dropdown.addEventListener('mouseleave', function() {
                    const content = this.querySelector('.dropdown-content');
                    if (content) {
                        content.style.display = 'none';
                    }
                });
            });
        }
    </script>
</body>
</html>`;
  return c.html(html);
});

// Events page
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
        :root { --deep-indigo: #2A3D66; --soft-yellow: #F4D06F; --warm-white: #FAFAFA; --gentle-lavender: #B39CD0; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Nunito', sans-serif; line-height: 1.6; color: var(--deep-indigo); background-color: var(--warm-white); }
        header { background-color: var(--deep-indigo); box-shadow: 0 4px 12px rgba(0,0,0,0.1); position: sticky; top: 0; z-index: 100; padding: 0.3rem 0; }
        nav { display: flex; justify-content: space-between; align-items: center; padding: 0.3rem 2rem; max-width: 1400px; margin: 0 auto; }
        .logo { font-size: 1.3rem; font-weight: bold; color: var(--warm-white); text-decoration: none; display: flex; align-items: center; padding: 0.4rem 0.8rem; border-radius: 50px; background-color: rgba(255, 255, 255, 0.1); }
        .logo-img { height: 32px; width: 32px; margin-right: 10px; background-color: var(--soft-yellow); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--deep-indigo); font-size: 1rem; }
        nav ul { display: flex; list-style: none; align-items: center; gap: 0.6rem; }
        nav ul li a { color: var(--warm-white); text-decoration: none; font-weight: 600; padding: 0.4rem 0.8rem; border-radius: 50px; font-size: 0.9rem; }
        nav ul li a:hover { color: var(--soft-yellow); background-color: rgba(255, 255, 255, 0.1); }
        nav ul li a.active, .nav-primary { color: var(--soft-yellow); background-color: rgba(244, 208, 111, 0.15); font-weight: 700; }
        
        /* Dropdown styles - EXACT match to Flask localhost */
        .dropdown {
            position: relative;
        }
        
        .dropdown > a {
            pointer-events: auto !important;
            cursor: pointer;
        }
        
        .dropdown-content {
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
            background-color: white;
            min-width: 200px;
            box-shadow: 0 8px 16px rgba(0,0,0,0.2);
            border-radius: 10px;
            z-index: 1000;
            padding: 10px 0;
        }
        
        .dropdown:hover .dropdown-content {
            display: block;
        }
        
        .dropdown-content a {
            color: var(--deep-indigo) !important;
            padding: 12px 20px;
            text-decoration: none;
            display: block;
            border-radius: 0;
            background: none !important;
            font-weight: 500;
        }
        
        .dropdown-content a:hover {
            background: var(--warm-white) !important;
            color: var(--deep-indigo) !important;
        }
        .container { max-width: 1200px; margin: 80px auto; padding: 20px; }
        .page-header { text-align: center; margin-bottom: 60px; }
        .page-header h1 { color: var(--deep-indigo); font-size: 3rem; margin-bottom: 20px; }
        .page-header p { color: var(--gentle-lavender); font-size: 1.3rem; }
        .event-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 30px; }
        .event-card { background: white; padding: 30px; border-radius: 20px; box-shadow: 0 10px 30px rgba(42, 61, 102, 0.1); transition: transform 0.3s ease; border-top: 4px solid var(--soft-yellow); }
        .event-card:hover { transform: translateY(-5px); }
        .event-date { background: var(--soft-yellow); color: var(--deep-indigo); padding: 8px 16px; border-radius: 20px; font-weight: 700; font-size: 0.9rem; display: inline-block; margin-bottom: 15px; }
        .event-title { color: var(--deep-indigo); margin-bottom: 15px; font-size: 1.5rem; }
        .event-meta { color: var(--gentle-lavender); margin-bottom: 15px; }
        .event-description { color: var(--deep-indigo); line-height: 1.6; margin-bottom: 20px; }
        .register-btn { background: var(--gentle-lavender); color: white; padding: 12px 25px; border-radius: 25px; text-decoration: none; font-weight: 600; transition: all 0.3s ease; display: inline-block; }
        .register-btn:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(179, 156, 208, 0.3); color: white; }
    </style>
</head>
<body>
    <header>
        <nav>
            <a href="/" class="logo">
                <div class="logo-img"><i class="fas fa-heart"></i></div>
                <span>Light in Silence</span>
            </a>
            <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/submit">Share Your Story</a></li>
                <li><a href="/check-reply">Check Reply</a></li>
                <li><a href="/blog">Blog</a></li>
                <li><a href="/events" class="active">Events</a></li>
                <li><a href="/resources">Resources</a></li>
                <li><a href="/about">About</a></li>
                <li><a href="/contact">Contact</a></li>
                <li><a href="/login">Login</a></li>
            </ul>
        </nav>
    </header>

    <div class="container">
        <div class="page-header">
            <h1><i class="fas fa-calendar" style="color: var(--soft-yellow); margin-right: 20px;"></i>Upcoming Events</h1>
            <p>Join our community events and workshops</p>
        </div>

        <div class="event-grid">
            <div class="event-card">
                <div class="event-date"><i class="fas fa-calendar"></i> February 15, 2024</div>
                <h2 class="event-title">Mental Health Awareness Workshop</h2>
                <div class="event-meta">
                    <i class="fas fa-clock"></i> 2:00 PM - 4:00 PM | 
                    <i class="fas fa-map-marker-alt"></i> Online via Zoom
                </div>
                <div class="event-description">
                    Join us for an interactive workshop on mental health awareness, coping strategies, and building resilience. Perfect for anyone looking to learn more about mental wellness.
                </div>
                <a href="#" class="register-btn">Register Now</a>
            </div>
            
            <div class="event-card">
                <div class="event-date"><i class="fas fa-calendar"></i> February 22, 2024</div>
                <h2 class="event-title">Volunteer Training Session</h2>
                <div class="event-meta">
                    <i class="fas fa-clock"></i> 6:00 PM - 8:00 PM | 
                    <i class="fas fa-map-marker-alt"></i> Community Center, Toronto
                </div>
                <div class="event-description">
                    Learn how to become a volunteer responder and help others in their mental health journey. Training covers empathy, active listening, and crisis support.
                </div>
                <a href="#" class="register-btn">Register Now</a>
            </div>
            
            <div class="event-card">
                <div class="event-date"><i class="fas fa-calendar"></i> March 1, 2024</div>
                <h2 class="event-title">Community Support Group</h2>
                <div class="event-meta">
                    <i class="fas fa-clock"></i> 7:00 PM - 8:30 PM | 
                    <i class="fas fa-map-marker-alt"></i> Online & In-Person
                </div>
                <div class="event-description">
                    A safe space to connect with others, share experiences, and support each other on the mental health journey. All are welcome.
                </div>
                <a href="#" class="register-btn">Register Now</a>
            </div>
        </div>
    </div>
</body>
</html>`;
  return c.html(html);
});

// Resources page
staticRoutes.get('/resources', async (c) => {
  const html = `<!DOCTYPE html>
<html lang="en-CA">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mental Health Resources - Light in Silence</title>
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <style>
        :root { --deep-indigo: #2A3D66; --soft-yellow: #F4D06F; --warm-white: #FAFAFA; --gentle-lavender: #B39CD0; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Nunito', sans-serif; line-height: 1.6; color: var(--deep-indigo); background-color: var(--warm-white); }
        header { background-color: var(--deep-indigo); box-shadow: 0 4px 12px rgba(0,0,0,0.1); position: sticky; top: 0; z-index: 100; padding: 0.3rem 0; }
        nav { display: flex; justify-content: space-between; align-items: center; padding: 0.3rem 2rem; max-width: 1400px; margin: 0 auto; }
        .logo { font-size: 1.3rem; font-weight: bold; color: var(--warm-white); text-decoration: none; display: flex; align-items: center; padding: 0.4rem 0.8rem; border-radius: 50px; background-color: rgba(255, 255, 255, 0.1); }
        .logo-img { height: 32px; width: 32px; margin-right: 10px; background-color: var(--soft-yellow); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--deep-indigo); font-size: 1rem; }
        nav ul { display: flex; list-style: none; align-items: center; gap: 0.6rem; }
        nav ul li a { color: var(--warm-white); text-decoration: none; font-weight: 600; padding: 0.4rem 0.8rem; border-radius: 50px; font-size: 0.9rem; }
        nav ul li a:hover { color: var(--soft-yellow); background-color: rgba(255, 255, 255, 0.1); }
        nav ul li a.active { color: var(--soft-yellow); background-color: rgba(244, 208, 111, 0.15); font-weight: 700; }
        .container { max-width: 1200px; margin: 80px auto; padding: 20px; }
        .page-header { text-align: center; margin-bottom: 60px; }
        .page-header h1 { color: var(--deep-indigo); font-size: 3rem; margin-bottom: 20px; }
        .crisis-section { margin-bottom: 40px; padding: 30px; background: linear-gradient(135deg, #dc3545, #c82333); border-radius: 15px; color: white; text-align: center; }
        .crisis-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-top: 25px; }
        .crisis-card { background: rgba(255,255,255,0.2); padding: 20px; border-radius: 10px; }
        .crisis-card h3 { color: white; margin-bottom: 10px; }
        .crisis-card p { margin: 0; font-size: 1.2rem; font-weight: 700; }
        .resource-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 25px; }
        .resource-card { background: white; padding: 25px; border-radius: 15px; box-shadow: 0 5px 15px rgba(42, 61, 102, 0.1); border-top: 4px solid var(--gentle-lavender); }
        .resource-card h3 { color: var(--deep-indigo); margin-bottom: 15px; }
        .btn-secondary { background: transparent; color: var(--deep-indigo); border: 2px solid var(--gentle-lavender); padding: 8px 15px; border-radius: 20px; text-decoration: none; font-weight: 600; font-size: 0.9rem; }
    </style>
</head>
<body>
    <header>
        <nav>
            <a href="/" class="logo">
                <div class="logo-img"><i class="fas fa-heart"></i></div>
                <span>Light in Silence</span>
            </a>
            <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/submit">Share Your Story</a></li>
                <li><a href="/check-reply">Check Reply</a></li>
                <li><a href="/blog">Blog</a></li>
                <li><a href="/events">Events</a></li>
                <li><a href="/resources" class="active">Resources</a></li>
                <li><a href="/about">About</a></li>
                <li><a href="/contact">Contact</a></li>
                <li><a href="/login">Login</a></li>
            </ul>
        </nav>
    </header>

    <div class="container">
        <div class="page-header">
            <h1><i class="fas fa-life-ring" style="color: var(--soft-yellow); margin-right: 20px;"></i>Mental Health Resources</h1>
            <p>Support and information to help you on your journey</p>
        </div>

        <div class="crisis-section">
            <h2><i class="fas fa-exclamation-triangle"></i> Crisis Support - Available 24/7</h2>
            <p style="font-size: 1.1rem; margin-bottom: 25px;">If you're in immediate danger or crisis, please reach out now.</p>
            <div class="crisis-grid">
                <div class="crisis-card">
                    <h3><i class="fas fa-phone"></i> Talk to Someone</h3>
                    <p>1-833-456-4566</p>
                    <p style="font-size: 0.9rem; opacity: 0.8;">Crisis Services Canada</p>
                </div>
                <div class="crisis-card">
                    <h3><i class="fas fa-comment"></i> Text Support</h3>
                    <p>Text: 45645</p>
                    <p style="font-size: 0.9rem; opacity: 0.8;">Crisis Text Line</p>
                </div>
                <div class="crisis-card">
                    <h3><i class="fas fa-ambulance"></i> Emergency</h3>
                    <p>Call: 911</p>
                    <p style="font-size: 0.9rem; opacity: 0.8;">Immediate medical help</p>
                </div>
            </div>
        </div>

        <div class="resource-grid">
            <div class="resource-card">
                <h3><i class="fas fa-users"></i> Canadian Mental Health Association</h3>
                <p>National organization promoting mental health and supporting recovery.</p>
                <a href="https://cmha.ca" target="_blank" class="btn-secondary">Visit Website</a>
            </div>
            
            <div class="resource-card">
                <h3><i class="fas fa-brain"></i> Centre for Addiction and Mental Health</h3>
                <p>Canada's largest mental health teaching hospital providing resources and treatment.</p>
                <a href="https://camh.ca" target="_blank" class="btn-secondary">Visit Website</a>
            </div>
            
            <div class="resource-card">
                <h3><i class="fas fa-heart"></i> Kids Help Phone</h3>
                <p>24/7 support for young people through phone, text, and online chat.</p>
                <a href="https://kidshelpphone.ca" target="_blank" class="btn-secondary">Visit Website</a>
            </div>
            
            <div class="resource-card">
                <h3><i class="fas fa-leaf"></i> Mindfulness Apps</h3>
                <p>Free meditation and mindfulness apps: Headspace, Calm, Insight Timer, and Ten Percent Happier.</p>
                <a href="#" class="btn-secondary">Learn More</a>
            </div>
        </div>
    </div>
</body>
</html>`;
  return c.html(html);
});

// Volunteer Info page  
staticRoutes.get('/volunteer-info', async (c) => {
  const html = `<!DOCTYPE html>
<html lang="en-CA">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Volunteer With Us - Light in Silence</title>
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <style>
        :root { --deep-indigo: #2A3D66; --soft-yellow: #F4D06F; --warm-white: #FAFAFA; --gentle-lavender: #B39CD0; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Nunito', sans-serif; line-height: 1.6; color: var(--deep-indigo); background-color: var(--warm-white); }
        header { background-color: var(--deep-indigo); box-shadow: 0 4px 12px rgba(0,0,0,0.1); position: sticky; top: 0; z-index: 100; padding: 0.3rem 0; }
        nav { display: flex; justify-content: space-between; align-items: center; padding: 0.3rem 2rem; max-width: 1400px; margin: 0 auto; }
        .logo { font-size: 1.3rem; font-weight: bold; color: var(--warm-white); text-decoration: none; display: flex; align-items: center; padding: 0.4rem 0.8rem; border-radius: 50px; background-color: rgba(255, 255, 255, 0.1); }
        .logo-img { height: 32px; width: 32px; margin-right: 10px; background-color: var(--soft-yellow); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--deep-indigo); font-size: 1rem; }
        nav ul { display: flex; list-style: none; align-items: center; gap: 0.6rem; }
        nav ul li a { color: var(--warm-white); text-decoration: none; font-weight: 600; padding: 0.4rem 0.8rem; border-radius: 50px; font-size: 0.9rem; }
        nav ul li a:hover { color: var(--soft-yellow); background-color: rgba(255, 255, 255, 0.1); }
        nav ul li a.active { color: var(--soft-yellow); background-color: rgba(244, 208, 111, 0.15); font-weight: 700; }
        .container { max-width: 1200px; margin: 80px auto; padding: 20px; }
        .page-header { text-align: center; margin-bottom: 60px; }
        .page-header h1 { color: var(--deep-indigo); font-size: 3rem; margin-bottom: 20px; }
        .content-section { background: white; padding: 40px; border-radius: 20px; margin-bottom: 40px; box-shadow: 0 10px 30px rgba(42, 61, 102, 0.1); }
        .benefit-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 25px; margin-top: 25px; }
        .benefit-card { background: white; padding: 25px; border-radius: 15px; box-shadow: 0 5px 15px rgba(42, 61, 102, 0.1); border-top: 4px solid var(--soft-yellow); text-align: center; }
        .benefit-icon { width: 60px; height: 60px; background: var(--soft-yellow); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 15px; }
        .cta-section { background: linear-gradient(135deg, var(--gentle-lavender), var(--deep-indigo)); color: white; padding: 40px; border-radius: 20px; text-align: center; }
        .btn-primary { background: var(--soft-yellow); color: var(--deep-indigo); padding: 15px 30px; border-radius: 25px; text-decoration: none; font-weight: 600; display: inline-block; margin: 10px; }
    </style>
</head>
<body>
    <header>
        <nav>
            <a href="/" class="logo">
                <div class="logo-img"><i class="fas fa-heart"></i></div>
                <span>Light in Silence</span>
            </a>
            <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/submit">Share Your Story</a></li>
                <li><a href="/check-reply">Check Reply</a></li>
                <li><a href="/blog">Blog</a></li>
                <li><a href="/events">Events</a></li>
                <li><a href="/resources">Resources</a></li>
                <li><a href="/about">About</a></li>
                <li><a href="/contact">Contact</a></li>
                <li><a href="/volunteer-info" class="active">Volunteer</a></li>
                <li><a href="/login">Login</a></li>
            </ul>
        </nav>
    </header>

    <div class="container">
        <div class="page-header">
            <h1><i class="fas fa-hands-helping" style="color: var(--soft-yellow); margin-right: 20px;"></i>Become a Volunteer</h1>
            <p>Join our mission to bring light to those in silence</p>
        </div>

        <div class="content-section">
            <h2><i class="fas fa-heart" style="color: var(--soft-yellow); margin-right: 10px;"></i>Why Volunteer With Us?</h2>
            <p style="font-size: 1.2rem; margin-bottom: 30px;">At Light in Silence, volunteers are the heart of our mission. Your compassionate responses can provide hope, comfort, and connection to someone who needs it most.</p>
            
            <div class="benefit-grid">
                <div class="benefit-card">
                    <div class="benefit-icon">
                        <i class="fas fa-hands-helping" style="color: var(--deep-indigo); font-size: 1.5rem;"></i>
                    </div>
                    <h3 style="color: var(--deep-indigo);">Make a Real Impact</h3>
                    <p>Your words can be the light someone needs in their darkest moment.</p>
                </div>
                
                <div class="benefit-card">
                    <div class="benefit-icon">
                        <i class="fas fa-graduation-cap" style="color: var(--deep-indigo); font-size: 1.5rem;"></i>
                    </div>
                    <h3 style="color: var(--deep-indigo);">Learn & Grow</h3>
                    <p>Develop empathy and communication skills through comprehensive training.</p>
                </div>
                
                <div class="benefit-card">
                    <div class="benefit-icon">
                        <i class="fas fa-users" style="color: var(--deep-indigo); font-size: 1.5rem;"></i>
                    </div>
                    <h3 style="color: var(--deep-indigo);">Join a Community</h3>
                    <p>Connect with like-minded individuals passionate about mental health advocacy.</p>
                </div>
            </div>
        </div>

        <div class="cta-section">
            <h2 style="color: white; margin-bottom: 20px;">Ready to Make a Difference?</h2>
            <p style="margin-bottom: 30px; font-size: 1.1rem;">Join our community of compassionate volunteers and help us bring light to those who need it most.</p>
            <a href="/register" class="btn-primary">Sign Up to Volunteer</a>
            <a href="/contact" class="btn-primary">Learn More</a>
        </div>
    </div>
</body>
</html>`;
  return c.html(html);
});

// Donate page
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
        :root { --deep-indigo: #2A3D66; --soft-yellow: #F4D06F; --warm-white: #FAFAFA; --gentle-lavender: #B39CD0; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Nunito', sans-serif; line-height: 1.6; color: var(--deep-indigo); background-color: var(--warm-white); }
        header { background-color: var(--deep-indigo); box-shadow: 0 4px 12px rgba(0,0,0,0.1); position: sticky; top: 0; z-index: 100; padding: 0.3rem 0; }
        nav { display: flex; justify-content: space-between; align-items: center; padding: 0.3rem 2rem; max-width: 1400px; margin: 0 auto; }
        .logo { font-size: 1.3rem; font-weight: bold; color: var(--warm-white); text-decoration: none; display: flex; align-items: center; padding: 0.4rem 0.8rem; border-radius: 50px; background-color: rgba(255, 255, 255, 0.1); }
        .logo-img { height: 32px; width: 32px; margin-right: 10px; background-color: var(--soft-yellow); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--deep-indigo); font-size: 1rem; }
        nav ul { display: flex; list-style: none; align-items: center; gap: 0.6rem; }
        nav ul li { margin: 0 0.2rem; position: relative; }
        nav ul li a { color: var(--warm-white); text-decoration: none; font-weight: 600; padding: 0.4rem 0.8rem; border-radius: 50px; font-size: 0.9rem; }
        nav ul li a:hover { color: var(--soft-yellow); background-color: rgba(255, 255, 255, 0.1); }
        nav ul li a.active { color: var(--soft-yellow); background-color: rgba(244, 208, 111, 0.15); font-weight: 700; }
        
        /* Fixed Dropdown Menu Styles - Exact Flask Version */
        .dropdown {
            position: relative;
            display: inline-block;
        }
        
        .dropdown-content {
            display: none;
            position: absolute;
            background-color: var(--warm-white);
            min-width: 200px;
            box-shadow: 0 8px 16px rgba(0,0,0,0.2);
            border-radius: 10px;
            z-index: 1000;
            top: 100%;
            left: 0;
            padding: 8px 0;
            margin-top: 8px;
            border: 1px solid rgba(179, 156, 208, 0.2);
        }
        
        .dropdown:hover .dropdown-content {
            display: block;
        }
        
        /* Prevent main dropdown link from being clickable */
        .dropdown > a {
            pointer-events: none;
            cursor: default;
        }
        
        /* Re-enable pointer events for dropdown content */
        .dropdown:hover > a {
            pointer-events: all;
            cursor: pointer;
        }
        
        .dropdown-content a {
            color: var(--deep-indigo) !important;
            padding: 12px 20px;
            text-decoration: none;
            display: block;
            font-weight: 600;
            font-size: 0.9rem;
            transition: all 0.3s ease;
            border-radius: 0;
            background-color: transparent;
            pointer-events: all;
        }
        
        .dropdown-content a:hover {
            background-color: var(--soft-yellow) !important;
            color: var(--deep-indigo) !important;
        }
        
        .dropdown > a::after {
            content: ' ▼';
            font-size: 0.7rem;
            margin-left: 5px;
            transition: transform 0.3s ease;
        }
        
        .dropdown:hover > a::after {
            transform: rotate(180deg);
        }
        
        .container { max-width: 1000px; margin: 80px auto; padding: 20px; }
        .page-header { text-align: center; margin-bottom: 60px; }
        .page-header h1 { color: var(--deep-indigo); font-size: 3rem; margin-bottom: 20px; }
        .donate-card { background: white; padding: 40px; border-radius: 20px; box-shadow: 0 10px 30px rgba(42, 61, 102, 0.1); text-align: center; }
        .impact-section { background: linear-gradient(135deg, var(--gentle-lavender), var(--deep-indigo)); color: white; padding: 40px; border-radius: 20px; margin: 40px 0; }
        .btn-primary { background: var(--soft-yellow); color: var(--deep-indigo); padding: 15px 30px; border-radius: 25px; text-decoration: none; font-weight: 600; display: inline-block; margin: 10px; transition: all 0.3s ease; }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(244, 208, 111, 0.3); color: var(--deep-indigo); }
    </style>
</head>
<body>
    <header>
        <nav>
            <a href="/" class="logo">
                <div class="logo-img"><i class="fas fa-heart"></i></div>
                <span>Light in Silence</span>
            </a>
            <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/submit">Share Your Story</a></li>
                <li><a href="/check-reply">Check Reply</a></li>
                
                <li class="dropdown">
                    <a href="#">Discover</a>
                    <div class="dropdown-content">
                        <a href="/blog"><i class="fas fa-blog" style="margin-right: 8px;"></i>Blog</a>
                        <a href="/events"><i class="fas fa-calendar" style="margin-right: 8px;"></i>Events</a>
                        <a href="/resources"><i class="fas fa-book" style="margin-right: 8px;"></i>Resources</a>
                    </div>
                </li>
                
                <li class="dropdown">
                    <a href="#">About</a>
                    <div class="dropdown-content">
                        <a href="/about"><i class="fas fa-info-circle" style="margin-right: 8px;"></i>Our Mission</a>
                        <a href="/contact"><i class="fas fa-envelope" style="margin-right: 8px;"></i>Contact Us</a>
                        <a href="/volunteer-info"><i class="fas fa-hands-helping" style="margin-right: 8px;"></i>Volunteer</a>
                        <a href="/donate" class="active"><i class="fas fa-heart" style="margin-right: 8px;"></i>Donate</a>
                    </div>
                </li>

                <li><a href="/login" class="login-btn">
                    <i class="fas fa-sign-in-alt" style="margin-right: 5px;"></i>Login
                </a></li>
            </ul>
        </nav>
    </header>

    <div class="container">
        <div class="page-header">
            <h1><i class="fas fa-heart" style="color: var(--soft-yellow); margin-right: 20px;"></i>Support Our Mission</h1>
            <p>Help us bring light to those who need it most</p>
        </div>

        <div class="donate-card">
            <h2 style="color: var(--deep-indigo); margin-bottom: 20px;">Make a Difference Today</h2>
            <p style="font-size: 1.2rem; margin-bottom: 30px; color: var(--gentle-lavender);">
                Your donation helps us provide free mental health support, maintain our platform, and train volunteers to help those in crisis.
            </p>
            
            <div style="margin: 30px 0;">
                <a href="#" class="btn-primary">Donate $25</a>
                <a href="#" class="btn-primary">Donate $50</a>
                <a href="#" class="btn-primary">Donate $100</a>
                <a href="#" class="btn-primary">Custom Amount</a>
            </div>
        </div>

        <div class="impact-section">
            <h2 style="color: white; margin-bottom: 20px; text-align: center;">Your Impact</h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; text-align: center;">
                <div>
                    <h3 style="color: var(--soft-yellow);">$25</h3>
                    <p>Provides crisis support for 5 people</p>
                </div>
                <div>
                    <h3 style="color: var(--soft-yellow);">$50</h3>
                    <p>Trains 1 volunteer responder</p>
                </div>
                <div>
                    <h3 style="color: var(--soft-yellow);">$100</h3>
                    <p>Supports our platform for 1 month</p>
                </div>
            </div>
        </div>

        <div class="donate-card">
            <h3 style="color: var(--deep-indigo); margin-bottom: 15px;">Other Ways to Help</h3>
            <p style="margin-bottom: 20px;">Can't donate right now? Here are other ways to support our mission:</p>
            <a href="/volunteer-info" class="btn-primary">Become a Volunteer</a>
            <a href="/submit" class="btn-primary">Share Your Story</a>
        </div>
    </div>
</body>
</html>`;
  return c.html(html);
});

// Registration page
staticRoutes.get('/register', async (c) => {
  const html = `<!DOCTYPE html>
<html lang="en-CA">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Create Account - Light in Silence</title>
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <style>
        :root { --deep-indigo: #2A3D66; --soft-yellow: #F4D06F; --warm-white: #FAFAFA; --gentle-lavender: #B39CD0; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Nunito', sans-serif; line-height: 1.6; color: var(--deep-indigo); background-color: var(--warm-white); }
        header { background-color: var(--deep-indigo); box-shadow: 0 4px 12px rgba(0,0,0,0.1); position: sticky; top: 0; z-index: 100; padding: 0.3rem 0; }
        nav { display: flex; justify-content: space-between; align-items: center; padding: 0.3rem 2rem; max-width: 1400px; margin: 0 auto; }
        .logo { font-size: 1.3rem; font-weight: bold; color: var(--warm-white); text-decoration: none; display: flex; align-items: center; padding: 0.4rem 0.8rem; border-radius: 50px; background-color: rgba(255, 255, 255, 0.1); }
        .logo-img { height: 32px; width: 32px; margin-right: 10px; background-color: var(--soft-yellow); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--deep-indigo); font-size: 1rem; }
        nav ul { display: flex; list-style: none; align-items: center; gap: 0.6rem; }
        nav ul li a { color: var(--warm-white); text-decoration: none; font-weight: 600; padding: 0.4rem 0.8rem; border-radius: 50px; font-size: 0.9rem; }
        nav ul li a:hover { color: var(--soft-yellow); background-color: rgba(255, 255, 255, 0.1); }
        nav ul li a.active { color: var(--soft-yellow); background-color: rgba(244, 208, 111, 0.15); font-weight: 700; }
        .container { max-width: 600px; margin: 80px auto; padding: 20px; }
        .page-header { text-align: center; margin-bottom: 30px; }
        .page-header h1 { color: var(--deep-indigo); font-size: 2.5rem; margin-bottom: 10px; }
        .form-container { background: white; padding: 40px; border-radius: 20px; box-shadow: 0 10px 30px rgba(42, 61, 102, 0.1); }
        .form-group { margin-bottom: 25px; }
        .form-group label { display: block; margin-bottom: 8px; font-weight: 600; color: var(--deep-indigo); font-size: 1.1rem; }
        .form-group input { width: 100%; padding: 15px; border: 2px solid #e0e0e0; border-radius: 10px; font-size: 1rem; transition: all 0.3s ease; }
        .form-group input:focus { outline: none; border-color: var(--soft-yellow); box-shadow: 0 0 10px rgba(244, 208, 111, 0.3); }
        .btn-primary { background: linear-gradient(135deg, var(--soft-yellow), #f4d06f); color: var(--deep-indigo); padding: 15px; border: none; border-radius: 50px; font-size: 1.1rem; font-weight: 700; cursor: pointer; transition: all 0.3s ease; width: 100%; margin-bottom: 25px; box-shadow: 0 8px 20px rgba(244, 208, 111, 0.3); }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 30px rgba(244, 208, 111, 0.4); }
        .btn-secondary { background: transparent; color: var(--deep-indigo); border: 2px solid var(--gentle-lavender); padding: 12px 25px; border-radius: 25px; text-decoration: none; font-weight: 600; transition: all 0.3s ease; display: inline-block; }
        .btn-secondary:hover { background: var(--gentle-lavender); color: white; transform: translateY(-2px); }
        .divider { text-align: center; padding: 25px 0; border-top: 1px solid #e0e0e0; }
        .requirements-card { background: var(--warm-white); padding: 20px; border-radius: 10px; margin-bottom: 25px; border-left: 4px solid var(--gentle-lavender); }
        .volunteer-card { margin-top: 30px; padding: 25px; background: linear-gradient(135deg, var(--gentle-lavender), var(--deep-indigo)); border-radius: 15px; color: white; text-align: center; }
    </style>
</head>
<body>
    <header>
        <nav>
            <a href="/" class="logo">
                <div class="logo-img"><i class="fas fa-heart"></i></div>
                <span>Light in Silence</span>
            </a>
            <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/submit">Share Your Story</a></li>
                <li><a href="/check-reply">Check Reply</a></li>
                <li><a href="/about">About</a></li>
                <li><a href="/contact">Contact</a></li>
                <li><a href="/login">Login</a></li>
                <li><a href="/register" class="active">Register</a></li>
            </ul>
        </nav>
    </header>

    <div class="container">
        <div class="page-header">
            <h1>Join Our Community</h1>
            <p>Create your Light in Silence volunteer account</p>
        </div>
        
        <div class="form-container">
            <form method="POST" id="registerForm">
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 25px;">
                    <div class="form-group">
                        <label for="username">Username</label>
                        <input type="text" id="username" name="username" required placeholder="Choose a username">
                    </div>
                    <div class="form-group">
                        <label for="email">Email Address</label>
                        <input type="email" id="email" name="email" required placeholder="your.email@example.com">
                    </div>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 25px;">
                    <div class="form-group">
                        <label for="password">Password</label>
                        <input type="password" id="password" name="password" required placeholder="Create a strong password">
                    </div>
                    <div class="form-group">
                        <label for="password2">Confirm Password</label>
                        <input type="password" id="password2" name="password2" required placeholder="Confirm your password">
                    </div>
                </div>
                
                <div class="requirements-card">
                    <h3 style="color: var(--deep-indigo); margin-bottom: 15px;"><i class="fas fa-shield-alt" style="margin-right: 10px; color: var(--gentle-lavender);"></i>Password Requirements</h3>
                    <ul style="list-style: none; padding: 0; color: var(--deep-indigo);">
                        <li style="margin-bottom: 8px;"><i class="fas fa-check-circle" style="margin-right: 8px; color: var(--gentle-lavender);"></i>At least 8 characters long</li>
                        <li style="margin-bottom: 8px;"><i class="fas fa-check-circle" style="margin-right: 8px; color: var(--gentle-lavender);"></i>Contains both letters and numbers</li>
                        <li><i class="fas fa-check-circle" style="margin-right: 8px; color: var(--gentle-lavender);"></i>Avoid common words or personal information</li>
                    </ul>
                </div>
                
                <button type="submit" class="btn-primary">
                    <i class="fas fa-user-plus" style="margin-right: 10px;"></i>Create My Account
                </button>
            </form>
            
            <div class="divider">
                <p style="color: var(--gentle-lavender); margin-bottom: 15px;">Already have an account?</p>
                <a href="/login" class="btn-secondary">
                    <i class="fas fa-sign-in-alt" style="margin-right: 8px;"></i>Sign In
                </a>
            </div>
        </div>
        
        <div class="volunteer-card">
            <h3><i class="fas fa-hands-helping" style="margin-right: 10px;"></i>Volunteer Commitment</h3>
            <p style="margin-bottom: 20px; opacity: 0.9;">By creating an account, you'll gain access to volunteer training and the opportunity to help others in their mental health journey.</p>
        </div>
    </div>

    <script>
        document.getElementById('registerForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = {
                username: formData.get('username'),
                email: formData.get('email'),
                password: formData.get('password'),
                password2: formData.get('password2')
            };
            
            if (data.password !== data.password2) {
                alert('Passwords do not match!');
                return;
            }
            
            try {
                const response = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });
                
                const result = await response.json();
                
                if (response.ok) {
                    alert('Registration successful! Please log in.');
                    window.location.href = '/login';
                } else {
                    alert('Error: ' + (result.error || 'Registration failed'));
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred during registration. Please try again.');
            }
        });
    </script>
</body>
</html>`;
  return c.html(html);
});

// Volunteer Dashboard page  
staticRoutes.get('/volunteer', async (c) => {
  const html = `<!DOCTYPE html>
<html lang="en-CA">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Volunteer Dashboard - Light in Silence</title>
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <style>
        :root { --deep-indigo: #2A3D66; --soft-yellow: #F4D06F; --warm-white: #FAFAFA; --gentle-lavender: #B39CD0; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Nunito', sans-serif; line-height: 1.6; color: var(--deep-indigo); background-color: var(--warm-white); }
        header { background-color: var(--deep-indigo); box-shadow: 0 4px 12px rgba(0,0,0,0.1); position: sticky; top: 0; z-index: 100; padding: 0.3rem 0; }
        nav { display: flex; justify-content: space-between; align-items: center; padding: 0.3rem 2rem; max-width: 1400px; margin: 0 auto; }
        .logo { font-size: 1.3rem; font-weight: bold; color: var(--warm-white); text-decoration: none; display: flex; align-items: center; padding: 0.4rem 0.8rem; border-radius: 50px; background-color: rgba(255, 255, 255, 0.1); }
        .logo-img { height: 32px; width: 32px; margin-right: 10px; background-color: var(--soft-yellow); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--deep-indigo); font-size: 1rem; }
        nav ul { display: flex; list-style: none; align-items: center; gap: 0.6rem; }
        nav ul li a { color: var(--warm-white); text-decoration: none; font-weight: 600; padding: 0.4rem 0.8rem; border-radius: 50px; font-size: 0.9rem; }
        nav ul li a:hover { color: var(--soft-yellow); background-color: rgba(255, 255, 255, 0.1); }
        nav ul li a.active { color: var(--soft-yellow); background-color: rgba(244, 208, 111, 0.15); font-weight: 700; }
        
        .volunteer-container { max-width: 1400px; margin: 0 auto; padding: 20px; }
        .volunteer-header { background: linear-gradient(135deg, var(--gentle-lavender), var(--deep-indigo)); border-radius: 25px; padding: 50px 40px; margin-bottom: 40px; text-align: center; color: white; }
        .volunteer-header h1 { font-size: 3rem; margin-bottom: 15px; font-weight: 800; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 25px; margin-bottom: 50px; }
        .stat-card { background: white; border-radius: 20px; padding: 40px; text-align: center; box-shadow: 0 10px 30px rgba(42, 61, 102, 0.08); transition: all 0.3s ease; }
        .stat-card:hover { transform: translateY(-10px); box-shadow: 0 20px 50px rgba(42, 61, 102, 0.15); }
        .stat-number { font-size: 4rem; font-weight: 800; margin-bottom: 15px; color: var(--deep-indigo); line-height: 1; }
        .letters-section { background: white; border-radius: 25px; padding: 30px; box-shadow: 0 10px 30px rgba(42, 61, 102, 0.08); }
        .letter-item { padding: 25px; border-left: 4px solid var(--soft-yellow); margin-bottom: 20px; background: var(--warm-white); border-radius: 10px; }
    </style>
</head>
<body>
    <header>
        <nav>
            <a href="/" class="logo">
                <div class="logo-img"><i class="fas fa-heart"></i></div>
                <span>Light in Silence</span>
            </a>
            <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/volunteer" class="active">Volunteer Dashboard</a></li>
                <li><a href="/admin">Admin Panel</a></li>
                <li><a href="#" onclick="logout()">Logout</a></li>
            </ul>
        </nav>
    </header>

    <div class="volunteer-container">
        <div class="volunteer-header">
            <h1><i class="fas fa-hands-helping"></i> Volunteer Dashboard</h1>
            <p>Help others find light in their darkness</p>
        </div>
        
        <div class="stats-grid">
            <div class="stat-card">
                <i class="fas fa-envelope" style="font-size: 3.5rem; color: #e74c3c; margin-bottom: 20px;"></i>
                <div class="stat-number" id="unprocessedLetters">-</div>
                <div style="font-size: 1.2rem; color: var(--gentle-lavender); font-weight: 600;">Unprocessed Letters</div>
            </div>
            
            <div class="stat-card">
                <i class="fas fa-flag" style="font-size: 3.5rem; color: #f39c12; margin-bottom: 20px;"></i>
                <div class="stat-number" id="flaggedLetters">-</div>
                <div style="font-size: 1.2rem; color: var(--gentle-lavender); font-weight: 600;">Flagged for Review</div>
            </div>
            
            <div class="stat-card">
                <i class="fas fa-reply" style="font-size: 3.5rem; color: #2ecc71; margin-bottom: 20px;"></i>
                <div class="stat-number" id="myResponses">-</div>
                <div style="font-size: 1.2rem; color: var(--gentle-lavender); font-weight: 600;">My Responses</div>
            </div>
        </div>
        
        <div class="letters-section">
            <h3 style="color: var(--deep-indigo); margin-bottom: 25px; font-size: 1.8rem;">
                <i class="fas fa-inbox"></i> Letters Awaiting Response
            </h3>
            <div id="lettersList">
                <div class="letter-item">
                    <div style="margin-bottom: 15px;">
                        <h4 style="color: var(--deep-indigo); margin-bottom: 5px;">Academic Pressure</h4>
                        <p style="color: var(--gentle-lavender); font-size: 0.9rem;">
                            <i class="fas fa-calendar"></i> January 30, 2025 | <i class="fas fa-tag"></i> ABC12345
                        </p>
                    </div>
                    <p style="color: var(--deep-indigo); line-height: 1.6; margin-bottom: 15px;">
                        I'm struggling with the pressure from school and my parents. Everything feels overwhelming and I don't know how to cope...
                    </p>
                    <div style="display: flex; gap: 10px;">
                        <button class="btn" style="background: var(--soft-yellow); color: var(--deep-indigo); padding: 10px 20px; border: none; border-radius: 25px; font-weight: 600; cursor: pointer;">
                            <i class="fas fa-reply"></i> Respond
                        </button>
                        <button class="btn" style="background: #f44336; color: white; padding: 10px 20px; border: none; border-radius: 25px; font-weight: 600; cursor: pointer;">
                            <i class="fas fa-flag"></i> Flag
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        function logout() {
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
            window.location.href = '/';
        }
        
        // Load volunteer data
        async function loadVolunteerData() {
            try {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    window.location.href = '/login';
                    return;
                }
                
                const response = await fetch('/api/volunteer/stats', {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    document.getElementById('unprocessedLetters').textContent = data.unprocessedLetters || 0;
                    document.getElementById('flaggedLetters').textContent = data.flaggedLetters || 0;
                    document.getElementById('myResponses').textContent = data.myResponses || 0;
                }
            } catch (error) {
                console.error('Error loading volunteer data:', error);
            }
        }
        
        document.addEventListener('DOMContentLoaded', loadVolunteerData);
    </script>
</body>
</html>`;
  return c.html(html);
});

// Admin Dashboard page
staticRoutes.get('/admin', async (c) => {
  const html = `<!DOCTYPE html>
<html lang="en-CA">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard - Light in Silence</title>
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <style>
        :root { --deep-indigo: #2A3D66; --soft-yellow: #F4D06F; --warm-white: #FAFAFA; --gentle-lavender: #B39CD0; --dark-indigo: #1e2e4f; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Nunito', sans-serif; line-height: 1.6; color: var(--deep-indigo); background-color: var(--warm-white); }
        header { background-color: var(--deep-indigo); box-shadow: 0 4px 12px rgba(0,0,0,0.1); position: sticky; top: 0; z-index: 100; padding: 0.3rem 0; }
        nav { display: flex; justify-content: space-between; align-items: center; padding: 0.3rem 2rem; max-width: 1400px; margin: 0 auto; }
        .logo { font-size: 1.3rem; font-weight: bold; color: var(--warm-white); text-decoration: none; display: flex; align-items: center; padding: 0.4rem 0.8rem; border-radius: 50px; background-color: rgba(255, 255, 255, 0.1); }
        .logo-img { height: 32px; width: 32px; margin-right: 10px; background-color: var(--soft-yellow); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--deep-indigo); font-size: 1rem; }
        nav ul { display: flex; list-style: none; align-items: center; gap: 0.6rem; }
        nav ul li a { color: var(--warm-white); text-decoration: none; font-weight: 600; padding: 0.4rem 0.8rem; border-radius: 50px; font-size: 0.9rem; }
        nav ul li a:hover { color: var(--soft-yellow); background-color: rgba(255, 255, 255, 0.1); }
        nav ul li a.active { color: var(--soft-yellow); background-color: rgba(244, 208, 111, 0.15); font-weight: 700; }
        
        .admin-container { max-width: 1400px; margin: 0 auto; padding: 20px; }
        .admin-header { background: linear-gradient(135deg, var(--deep-indigo), var(--dark-indigo)); border-radius: 25px; padding: 50px 40px; margin-bottom: 40px; text-align: center; color: white; }
        .admin-header h1 { font-size: 3rem; margin-bottom: 15px; font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 20px; }
        .admin-header p { font-size: 1.4rem; opacity: 0.9; margin-bottom: 20px; }
        .user-role-badge { display: inline-block; padding: 12px 25px; background: var(--soft-yellow); color: var(--deep-indigo); border-radius: 50px; font-weight: 700; font-size: 1rem; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 5px 20px rgba(244, 208, 111, 0.4); }
        
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 25px; margin-bottom: 50px; }
        .stat-card { background: white; border-radius: 20px; padding: 40px; text-align: center; box-shadow: 0 10px 30px rgba(42, 61, 102, 0.08); transition: all 0.3s ease; position: relative; overflow: hidden; border: 1px solid rgba(179, 156, 208, 0.1); }
        .stat-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 6px; transition: all 0.3s ease; }
        .stat-card.users::before { background: linear-gradient(135deg, #3498db, #2980b9); }
        .stat-card.letters::before { background: linear-gradient(135deg, #e74c3c, #c0392b); }
        .stat-card.responses::before { background: linear-gradient(135deg, #2ecc71, #27ae60); }
        .stat-card.pending::before { background: linear-gradient(135deg, #f39c12, #e67e22); }
        .stat-card:hover { transform: translateY(-10px); box-shadow: 0 20px 50px rgba(42, 61, 102, 0.15); }
        .stat-icon { font-size: 3.5rem; margin-bottom: 20px; opacity: 0.8; }
        .stat-card.users .stat-icon { color: #3498db; }
        .stat-card.letters .stat-icon { color: #e74c3c; }
        .stat-card.responses .stat-icon { color: #2ecc71; }
        .stat-card.pending .stat-icon { color: #f39c12; }
        .stat-number { font-size: 4rem; font-weight: 800; margin-bottom: 15px; color: var(--deep-indigo); line-height: 1; }
        .stat-label { font-size: 1.2rem; color: var(--gentle-lavender); font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }
        .stat-description { font-size: 0.95rem; color: #666; margin-top: 10px; line-height: 1.4; }
        
        .quick-actions { background: linear-gradient(135deg, var(--gentle-lavender), #e8d5f2); border-radius: 25px; padding: 40px; margin-bottom: 40px; }
        .quick-actions h3 { color: var(--deep-indigo); margin-bottom: 30px; font-size: 1.8rem; font-weight: 700; text-align: center; display: flex; align-items: center; justify-content: center; gap: 15px; }
        .action-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 25px; }
        .action-card { background: white; padding: 30px; border-radius: 20px; text-align: center; transition: all 0.3s ease; text-decoration: none; color: var(--deep-indigo); box-shadow: 0 5px 15px rgba(42, 61, 102, 0.08); }
        .action-card:hover { transform: translateY(-5px); box-shadow: 0 15px 30px rgba(42, 61, 102, 0.15); color: var(--deep-indigo); }
        .action-icon { font-size: 3rem; margin-bottom: 20px; color: var(--soft-yellow); }
        .action-card h4 { margin-bottom: 10px; font-size: 1.3rem; }
        .action-card p { color: var(--gentle-lavender); font-size: 0.95rem; }
        
        .recent-activity { background: white; border-radius: 25px; padding: 30px; box-shadow: 0 10px 30px rgba(42, 61, 102, 0.08); }
        .recent-activity h3 { color: var(--deep-indigo); margin-bottom: 25px; font-size: 1.8rem; display: flex; align-items: center; gap: 15px; }
        .activity-item { padding: 20px; border-left: 4px solid var(--soft-yellow); margin-bottom: 15px; background: var(--warm-white); border-radius: 10px; }
        .activity-meta { color: var(--gentle-lavender); font-size: 0.9rem; margin-bottom: 5px; }
        .activity-content { color: var(--deep-indigo); }
    </style>
</head>
<body>
    <header>
        <nav>
            <a href="/" class="logo">
                <div class="logo-img"><i class="fas fa-heart"></i></div>
                <span>Light in Silence</span>
            </a>
            <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/admin" class="active">Admin Dashboard</a></li>
                <li><a href="/volunteer">Volunteer Dashboard</a></li>
                <li><a href="#" onclick="logout()">Logout</a></li>
            </ul>
        </nav>
    </header>

    <div class="admin-container">
        <div class="admin-header">
            <h1>
                <i class="fas fa-shield-alt"></i>
                Admin Dashboard
            </h1>
            <p>Welcome to the administrative control center</p>
            <div class="user-role-badge">Administrator</div>
        </div>
        
        <div class="stats-grid">
            <div class="stat-card users">
                <i class="fas fa-users stat-icon"></i>
                <div class="stat-number" id="totalUsers">-</div>
                <div class="stat-label">Total Users</div>
                <div class="stat-description">Active platform members</div>
            </div>
            
            <div class="stat-card letters">
                <i class="fas fa-envelope stat-icon"></i>
                <div class="stat-number" id="totalLetters">-</div>
                <div class="stat-label">Letters Received</div>
                <div class="stat-description">Stories shared on platform</div>
            </div>
            
            <div class="stat-card responses">
                <i class="fas fa-reply stat-icon"></i>
                <div class="stat-number" id="totalResponses">-</div>
                <div class="stat-label">Responses Sent</div>
                <div class="stat-description">Support provided to users</div>
            </div>
            
            <div class="stat-card pending">
                <i class="fas fa-clock stat-icon"></i>
                <div class="stat-number" id="pendingLetters">-</div>
                <div class="stat-label">Pending Review</div>
                <div class="stat-description">Letters awaiting response</div>
            </div>
        </div>
        
        <div class="quick-actions">
            <h3>
                <i class="fas fa-bolt"></i>
                Quick Actions
            </h3>
            <div class="action-grid">
                <a href="/admin/users" class="action-card">
                    <i class="fas fa-users-cog action-icon"></i>
                    <h4>Manage Users</h4>
                    <p>Add, edit, or remove user accounts and permissions</p>
                </a>
                
                <a href="/admin/content" class="action-card">
                    <i class="fas fa-shield-alt action-icon"></i>
                    <h4>Content Moderation</h4>
                    <p>Review and moderate user-submitted content</p>
                </a>
                
                <a href="/volunteer" class="action-card">
                    <i class="fas fa-tachometer-alt action-icon"></i>
                    <h4>Volunteer Dashboard</h4>
                    <p>View and respond to pending letters</p>
                </a>
                
                <a href="#" onclick="exportData()" class="action-card">
                    <i class="fas fa-download action-icon"></i>
                    <h4>Export Data</h4>
                    <p>Download platform statistics and reports</p>
                </a>
            </div>
        </div>
        
        <div class="recent-activity">
            <h3>
                <i class="fas fa-chart-line"></i>
                Recent Activity
            </h3>
            <div id="recentActivity">
                <div class="activity-item">
                    <div class="activity-meta">2 minutes ago</div>
                    <div class="activity-content">New letter submitted by anonymous user</div>
                </div>
                <div class="activity-item">
                    <div class="activity-meta">15 minutes ago</div>
                    <div class="activity-content">Volunteer responded to letter #ABC123</div>
                </div>
                <div class="activity-item">
                    <div class="activity-meta">1 hour ago</div>
                    <div class="activity-content">New user registered as volunteer</div>
                </div>
            </div>
        </div>
    </div>

    <script>
        // Load dashboard data
        async function loadDashboardData() {
            try {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    window.location.href = '/login';
                    return;
                }
                
                const response = await fetch('/api/admin/stats', {
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    document.getElementById('totalUsers').textContent = data.totalUsers || 0;
                    document.getElementById('totalLetters').textContent = data.totalLetters || 0;
                    document.getElementById('totalResponses').textContent = data.totalResponses || 0;
                    document.getElementById('pendingLetters').textContent = data.pendingLetters || 0;
                } else if (response.status === 401) {
                    localStorage.removeItem('authToken');
                    window.location.href = '/login';
                }
            } catch (error) {
                console.error('Error loading dashboard data:', error);
            }
        }
        
        function logout() {
            localStorage.removeItem('authToken');
            window.location.href = '/login';
        }
        
        function exportData() {
            alert('Export functionality will be implemented soon!');
        }
        
        // Load data when page loads
        document.addEventListener('DOMContentLoaded', loadDashboardData);
        
        // Auto-refresh every 30 seconds
        setInterval(loadDashboardData, 30000);
    </script>
</body>
</html>`;
  return c.html(html);
});

// Privacy Policy page
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
        :root { --deep-indigo: #2A3D66; --soft-yellow: #F4D06F; --warm-white: #FAFAFA; --gentle-lavender: #B39CD0; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Nunito', sans-serif; line-height: 1.6; color: var(--deep-indigo); background-color: var(--warm-white); }
        header { background-color: var(--deep-indigo); box-shadow: 0 4px 12px rgba(0,0,0,0.1); position: sticky; top: 0; z-index: 100; padding: 0.3rem 0; }
        nav { display: flex; justify-content: space-between; align-items: center; padding: 0.3rem 2rem; max-width: 1400px; margin: 0 auto; }
        .logo { font-size: 1.3rem; font-weight: bold; color: var(--warm-white); text-decoration: none; display: flex; align-items: center; padding: 0.4rem 0.8rem; border-radius: 50px; background-color: rgba(255, 255, 255, 0.1); }
        .logo-img { height: 32px; width: 32px; margin-right: 10px; background-color: var(--soft-yellow); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--deep-indigo); font-size: 1rem; }
        nav ul { display: flex; list-style: none; align-items: center; gap: 0.6rem; }
        nav ul li a { color: var(--warm-white); text-decoration: none; font-weight: 600; padding: 0.4rem 0.8rem; border-radius: 50px; font-size: 0.9rem; }
        nav ul li a:hover { color: var(--soft-yellow); background-color: rgba(255, 255, 255, 0.1); }
        nav ul li a.active { color: var(--soft-yellow); background-color: rgba(244, 208, 111, 0.15); font-weight: 700; }
        
        .container { max-width: 1000px; margin: 80px auto; padding: 20px; }
        .page-header { text-align: center; margin-bottom: 60px; }
        .page-header h1 { color: var(--deep-indigo); font-size: 3rem; margin-bottom: 20px; }
        .policy-content { background: white; padding: 40px; border-radius: 20px; box-shadow: 0 10px 30px rgba(42, 61, 102, 0.1); }
        .policy-section { margin-bottom: 40px; }
        .policy-section h2 { color: var(--deep-indigo); margin-bottom: 20px; font-size: 1.8rem; border-bottom: 2px solid var(--soft-yellow); padding-bottom: 10px; }
        .policy-section h3 { color: var(--deep-indigo); margin-bottom: 15px; font-size: 1.3rem; }
        .policy-section p { margin-bottom: 15px; line-height: 1.8; }
        .policy-section ul { margin-left: 30px; margin-bottom: 15px; }
        .policy-section li { margin-bottom: 8px; }
        .highlight-box { background: var(--warm-white); padding: 25px; border-radius: 15px; border-left: 4px solid var(--soft-yellow); margin: 20px 0; }
    </style>
</head>
<body>
    <header>
        <nav>
            <a href="/" class="logo">
                <div class="logo-img"><i class="fas fa-heart"></i></div>
                <span>Light in Silence</span>
            </a>
            <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/submit">Share Your Story</a></li>
                <li><a href="/about">About</a></li>
                <li><a href="/contact">Contact</a></li>
                <li><a href="/privacy" class="active">Privacy</a></li>
                <li><a href="/login">Login</a></li>
            </ul>
        </nav>
    </header>

    <div class="container">
        <div class="page-header">
            <h1><i class="fas fa-shield-alt" style="color: var(--soft-yellow); margin-right: 20px;"></i>Privacy Policy</h1>
            <p>How we protect and handle your information</p>
        </div>

        <div class="policy-content">
            <div class="highlight-box">
                <h3><i class="fas fa-heart" style="color: var(--soft-yellow); margin-right: 10px;"></i>Our Commitment to Your Privacy</h3>
                <p>At Light in Silence, your privacy and anonymity are paramount. We are committed to protecting your personal information and ensuring your mental health journey remains confidential and secure.</p>
            </div>

            <div class="policy-section">
                <h2>Information We Collect</h2>
                <h3>Anonymous Letters</h3>
                <p>When you submit a letter through our platform, we collect:</p>
                <ul>
                    <li>The content of your letter</li>
                    <li>Optional topic categorization</li>
                    <li>Anonymous email (only if you choose email replies)</li>
                    <li>General timestamp information</li>
                </ul>
                
                <h3>Account Information (Volunteers Only)</h3>
                <p>For registered volunteers and administrators:</p>
                <ul>
                    <li>Username and email address</li>
                    <li>Encrypted password</li>
                    <li>Role and permission levels</li>
                    <li>Activity logs for quality assurance</li>
                </ul>
            </div>

            <div class="policy-section">
                <h2>How We Use Your Information</h2>
                <p>We use collected information solely for:</p>
                <ul>
                    <li>Providing mental health support and responses</li>
                    <li>Connecting you with appropriate volunteers or AI assistance</li>
                    <li>Ensuring platform safety and content moderation</li>
                    <li>Improving our services and user experience</li>
                    <li>Complying with legal requirements when necessary</li>
                </ul>
            </div>

            <div class="policy-section">
                <h2>Data Protection & Security</h2>
                <p>We implement industry-standard security measures:</p>
                <ul>
                    <li>End-to-end encryption for all communications</li>
                    <li>Secure cloud infrastructure with regular backups</li>
                    <li>Limited access controls for staff and volunteers</li>
                    <li>Regular security audits and updates</li>
                    <li>Automatic data purging after specified periods</li>
                </ul>
            </div>

            <div class="highlight-box">
                <h3><i class="fas fa-exclamation-triangle" style="color: #f39c12; margin-right: 10px;"></i>Crisis Situations</h3>
                <p>In cases where we identify immediate risk of harm to yourself or others, we may need to contact emergency services or crisis intervention teams. Your safety is our highest priority.</p>
            </div>

            <div class="policy-section">
                <h2>Your Rights</h2>
                <p>You have the right to:</p>
                <ul>
                    <li>Request deletion of your submitted content</li>
                    <li>Access information we have about you</li>
                    <li>Correct any inaccurate information</li>
                    <li>Withdraw consent for data processing</li>
                    <li>File complaints with privacy authorities</li>
                </ul>
            </div>

            <div class="policy-section">
                <h2>Contact Us</h2>
                <p>If you have questions about this privacy policy or your data:</p>
                <div class="highlight-box">
                    <p><i class="fas fa-envelope" style="color: var(--soft-yellow); margin-right: 10px;"></i>Email: privacy@lightinsilence.ca</p>
                    <p><i class="fas fa-phone" style="color: var(--soft-yellow); margin-right: 10px;"></i>Phone: 1-833-456-4566</p>
                </div>
            </div>

            <div class="policy-section">
                <h2>Updates to This Policy</h2>
                <p>We may update this privacy policy periodically. We will notify users of any significant changes through our platform and website.</p>
                <p style="margin-top: 20px; color: var(--gentle-lavender); font-style: italic;">Last updated: January 30, 2025</p>
            </div>
        </div>
    </div>
</body>
</html>`;
  return c.html(html);
});

// Terms of Service page
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
        :root { --deep-indigo: #2A3D66; --soft-yellow: #F4D06F; --warm-white: #FAFAFA; --gentle-lavender: #B39CD0; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Nunito', sans-serif; line-height: 1.6; color: var(--deep-indigo); background-color: var(--warm-white); }
        header { background-color: var(--deep-indigo); box-shadow: 0 4px 12px rgba(0,0,0,0.1); position: sticky; top: 0; z-index: 100; padding: 0.3rem 0; }
        nav { display: flex; justify-content: space-between; align-items: center; padding: 0.3rem 2rem; max-width: 1400px; margin: 0 auto; }
        .logo { font-size: 1.3rem; font-weight: bold; color: var(--warm-white); text-decoration: none; display: flex; align-items: center; padding: 0.4rem 0.8rem; border-radius: 50px; background-color: rgba(255, 255, 255, 0.1); }
        .logo-img { height: 32px; width: 32px; margin-right: 10px; background-color: var(--soft-yellow); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--deep-indigo); font-size: 1rem; }
        nav ul { display: flex; list-style: none; align-items: center; gap: 0.6rem; }
        nav ul li a { color: var(--warm-white); text-decoration: none; font-weight: 600; padding: 0.4rem 0.8rem; border-radius: 50px; font-size: 0.9rem; }
        nav ul li a:hover { color: var(--soft-yellow); background-color: rgba(255, 255, 255, 0.1); }
        nav ul li a.active { color: var(--soft-yellow); background-color: rgba(244, 208, 111, 0.15); font-weight: 700; }
        
        .container { max-width: 1000px; margin: 80px auto; padding: 20px; }
        .page-header { text-align: center; margin-bottom: 60px; }
        .page-header h1 { color: var(--deep-indigo); font-size: 3rem; margin-bottom: 20px; }
        .terms-content { background: white; padding: 40px; border-radius: 20px; box-shadow: 0 10px 30px rgba(42, 61, 102, 0.1); }
        .terms-section { margin-bottom: 40px; }
        .terms-section h2 { color: var(--deep-indigo); margin-bottom: 20px; font-size: 1.8rem; border-bottom: 2px solid var(--soft-yellow); padding-bottom: 10px; }
        .terms-section h3 { color: var(--deep-indigo); margin-bottom: 15px; font-size: 1.3rem; }
        .terms-section p { margin-bottom: 15px; line-height: 1.8; }
        .terms-section ul { margin-left: 30px; margin-bottom: 15px; }
        .terms-section li { margin-bottom: 8px; }
        .highlight-box { background: var(--warm-white); padding: 25px; border-radius: 15px; border-left: 4px solid var(--soft-yellow); margin: 20px 0; }
    </style>
</head>
<body>
    <header>
        <nav>
            <a href="/" class="logo">
                <div class="logo-img"><i class="fas fa-heart"></i></div>
                <span>Light in Silence</span>
            </a>
            <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/submit">Share Your Story</a></li>
                <li><a href="/about">About</a></li>
                <li><a href="/contact">Contact</a></li>
                <li><a href="/terms" class="active">Terms</a></li>
                <li><a href="/login">Login</a></li>
            </ul>
        </nav>
    </header>

    <div class="container">
        <div class="page-header">
            <h1><i class="fas fa-file-contract" style="color: var(--soft-yellow); margin-right: 20px;"></i>Terms of Service</h1>
            <p>Guidelines for using Light in Silence platform</p>
        </div>

        <div class="terms-content">
            <div class="highlight-box">
                <h3><i class="fas fa-handshake" style="color: var(--soft-yellow); margin-right: 10px;"></i>Welcome to Light in Silence</h3>
                <p>By using our platform, you agree to these terms. Our goal is to provide a safe, supportive environment for mental health and well-being.</p>
            </div>

            <div class="terms-section">
                <h2>Acceptance of Terms</h2>
                <p>By accessing and using Light in Silence, you accept and agree to be bound by the terms and provision of this agreement.</p>
            </div>

            <div class="terms-section">
                <h2>Platform Purpose</h2>
                <p>Light in Silence is designed to:</p>
                <ul>
                    <li>Provide anonymous mental health support</li>
                    <li>Connect individuals with trained volunteers</li>
                    <li>Offer AI-assisted guidance and resources</li>
                    <li>Foster a supportive community environment</li>
                </ul>
            </div>

            <div class="terms-section">
                <h2>User Responsibilities</h2>
                <h3>When Submitting Content:</h3>
                <ul>
                    <li>Be honest and authentic in your communications</li>
                    <li>Respect the privacy and dignity of others</li>
                    <li>Do not share content that could harm others</li>
                    <li>Follow community guidelines and ethical standards</li>
                </ul>
                
                <h3>Prohibited Content:</h3>
                <ul>
                    <li>Threats of violence or self-harm</li>
                    <li>Harassment or bullying</li>
                    <li>Discriminatory or hateful language</li>
                    <li>Spam or commercial solicitation</li>
                    <li>False or misleading information</li>
                </ul>
            </div>

            <div class="highlight-box">
                <h3><i class="fas fa-exclamation-triangle" style="color: #f39c12; margin-right: 10px;"></i>Not Professional Medical Advice</h3>
                <p>Light in Silence provides peer support and general guidance. Our services are not a substitute for professional medical care, therapy, or emergency services.</p>
            </div>

            <div class="terms-section">
                <h2>Crisis Situations</h2>
                <p>If you are in immediate danger or contemplating self-harm:</p>
                <ul>
                    <li>Contact emergency services (911) immediately</li>
                    <li>Call the Crisis Line: 1-833-456-4566</li>
                    <li>Text 45645 for immediate support</li>
                    <li>Visit your nearest emergency room</li>
                </ul>
            </div>

            <div class="terms-section">
                <h2>Volunteer Guidelines</h2>
                <p>Volunteers and staff must:</p>
                <ul>
                    <li>Maintain confidentiality and anonymity</li>
                    <li>Provide compassionate, non-judgmental support</li>
                    <li>Follow training protocols and guidelines</li>
                    <li>Report concerning content appropriately</li>
                    <li>Respect professional boundaries</li>
                </ul>
            </div>

            <div class="terms-section">
                <h2>Limitation of Liability</h2>
                <p>Light in Silence and its operators are not liable for:</p>
                <ul>
                    <li>Actions taken based on information received through the platform</li>
                    <li>Technical issues or service interruptions</li>
                    <li>Content submitted by other users</li>
                    <li>Outcomes of support provided</li>
                </ul>
            </div>

            <div class="terms-section">
                <h2>Modifications</h2>
                <p>We reserve the right to modify these terms at any time. Users will be notified of significant changes through the platform.</p>
                <p style="margin-top: 20px; color: var(--gentle-lavender); font-style: italic;">Last updated: January 30, 2025</p>
            </div>
        </div>
    </div>
</body>
</html>`;
  return c.html(html);
});

export { staticRoutes }; 