import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  /* Poppins  */

@import url("https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");

@import url("https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap");

:root {
    --font-primary: "Poppins", sans-serif;
}

* {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    font-family: var(--font-primary);
}

html {
    scroll-behavior: smooth;
}

body {
    background-color: #eeeeee;
    position: relative;
    z-index: 0;
    height: 100vh;
}

body::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url('./assets/dot.svg');
    background-repeat: repeat;
    background-size: 45px 45px;
    background-position: 100px 10px;
    z-index: -2;
    opacity: 0.2;
}
  
nav {
    padding: 25px 120px;
    display: flex;
    align-items: center;
    backdrop-filter: blur(3px);
    position: relative;
}

.nav-shadow {
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
}

nav .header-logo {
    width: 285px;
}

.hamburg-menu,
.close-sidebar {
    display: none;
}

.nav-menu-btn-container {
    display: flex;
    justify-content: space-between;
    width: 71%;
    margin-left: auto;
}

.no-dec{
    text-decoration: none;
}

nav ul {
    display: flex;
    align-items: center;
    gap: 60px;
}

nav ul li {
    list-style-type: none;
}

nav ul li a {
    text-decoration: none;
    font-size: 20px;
    font-weight: 400;
    line-height: 30px;
    color: #000;
}

.active-tab {
    color: #5356ff;
}

.nav-btn-container {
    display: flex;
    align-items: center;
    gap: 40px;
}

.nav-btn-container button:hover {
  background-color: #e9e9e9;
  cursor: pointer; /* Ensures the cursor changes to a pointer on hover */
}

.price-start-btn:hover, .get-start-btn:hover{
    cursor: pointer;
}
.nav-btn-container button {
    padding: 10px 24px;
    font-size: 20px;
    font-weight: 400;
    line-height: 30px;
    text-align: center;
    border-radius: 8px;
    border: 1px solid #050315;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #050315;
}

.nav-btn-container button:last-child {
    color: #eeeeee;
    border: 1px solid #5356ff;
    background-color: #5356ff;
    gap: 8px;
}

/* ======= HERO SECTION ======= */
.affiliate-hero {
    position: relative;
    background-color: #f9fafb;
    text-align: center;
    padding: 100px 20px 150px; /* Increased bottom padding */
    overflow: hidden;
}

/* Background Dotted Pattern */
.affiliate-hero::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url('./assets/dot.svg');
    background-repeat: repeat;
    background-size: 45px 45px;
    opacity: 0.2;
    z-index: 0;
}

.hero-bottom-shadow {
    position: absolute;
    bottom: 10;
    right: 0;
    width: 250px;
    z-index: 10;  /* Bring to front */
}

/* Content Box */
.affiliate-content {
    position: relative;
    z-index: 1;
    max-width: 800px;
    margin: auto;
}

/* HEADINGS */
.affiliate-content h1 {
    font-size: 32px;
    font-weight: 700;
    color: #000;
    margin-bottom: 15px;
}

/* Highlighted Words */
.highlight {
    color: #5356FF;
}

/* PARAGRAPH */
.affiliate-content p {
    font-size: 18px;
    color: #666;
    margin-bottom: 20px;
    line-height: 1.6;
}

/* CTA BUTTON */
.affiliate-btn {
    background: #5356FF;
    color: white;
    font-size: 16px;
    font-weight: bold;
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: opacity 0.3s ease;
}

.affiliate-btn:hover {
    opacity: 0.8;
}

@media (max-width: 1135px) {
    .affiliate-hero {
        padding-top: 140px;
    }
}

/* Affiliate Benefits Section */
.affiliate-benefits-section {
    text-align: center;
    padding: 80px 120px;
    background-color: #fff;
}

.affiliate-benefits-heading {
    font-size: 40px;
    font-weight: 700;
    color: #000;
    margin-bottom: 50px;
}

.affiliate-benefits-heading span {
    color: #5356FF;
}

/* Grid Container */
.affiliate-benefits-container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    justify-content: center;
    align-items: stretch;
}

/* Benefit Card */
.affiliate-benefit-card {
    background: #fff;
    border: 2px solid rgba(83, 86, 255, 0.5);
    border-radius: 12px;
    padding: 25px;
    text-align: left;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease-in-out;
}

.affiliate-benefit-card:hover {
    box-shadow: 0px 6px 15px rgba(0, 0, 0, 0.15);
}

/* Icon */
.affiliate-benefit-icon {
    width: 30px;
    height: 30px;
    background-color: #5356FF;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    margin-bottom: 15px;
}

/* Heading */
.affiliate-benefit-title {
    font-size: 20px;
    font-weight: 600;
    color: #000;
    margin-bottom: 10px;
}

/* Description */
.affiliate-benefit-desc {
    font-size: 16px;
    color: #666;
    line-height: 1.5;
}

/* Responsive */
@media (max-width: 1024px) {
    .affiliate-benefits-container {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 768px) {
    .affiliate-benefits-container {
        grid-template-columns: 1fr;
    }
    .affiliate-benefits-section {
        padding: 50px 30px;
    }
}
/* Container Styles */
.steps-container {
    text-align: center;
    padding: 60px 10px; /* Reduced side padding */
    background: linear-gradient(to right, #ffffff, #f0f4ff);
}

/* Title */
.steps-title {
    font-size: 32px;
    font-weight: bold;
    margin-bottom: 50px;
    color: #333;
}

.highlight {
    color: #5356FF;
}

/* Grid Layout */
.steps-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px; /* Increased spacing between steps */
    max-width: 900px;
    margin: auto;
}

/* Step Box */
.step-box {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 18px;
    border: 2px solid #5356FF;
    border-radius: 10px;
    background: white;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    width: 100%;
    min-height: 120px;
}

/* Step Number (Uniform Rounded Square) */
.step-number {
    width: 60px;
    height: 60px;
    font-size: 22px;
    font-weight: bold;
    color: white;
    background: black;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px; /* Ensures rounded square */
    flex-shrink: 0;
}

/* Step Content (Ensures uniform height) */
.step-content {
    flex-grow: 1;
    display: flex;
    align-items: center;
}

/* Step Text */
.step-text {
    color: #444;
    font-size: 16px;
    text-align: left;
}

/* Mobile Layout */
.steps-mobile {
    display: none;
}

/* Responsive Styles */
@media (max-width: 768px) {
    .steps-grid {
        display: none;
    }

    .steps-mobile {
        display: flex;
        flex-direction: column;
        gap: 20px; /* Increased spacing for better readability */
    }

    .step-box {
        justify-content: center;
        text-align: left;
        width: 90%;
        margin: auto;
    }
}

.who-benefits-section {
    text-align: center;
    padding: 80px 20px;
    background-color: #fff;
}

.who-benefits-section h2 {
    font-size: 28px;
    font-weight: bold;
    margin-bottom: 40px;
}

.highlight {
    color: #5356FF;
}

/* Grid Layout */
.benefits-grid {
    display: flex;
    justify-content: center;
    gap: 40px;
    flex-wrap: wrap;
}

/* Benefit Card */
.benefit-card {
    flex: 1;
    max-width: 250px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    margin-top:20px;
}

.benefit-card-img {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40%; /* This ensures all images are inside an equal-sized space */
}

.benefit-card p {
    margin-top:20px;
    font-size: 16px;
    color: #333;
}

/* Mobile: Stack the items */
@media (max-width: 768px) {
    .benefits-grid {
        flex-direction: column;
        align-items: center;
        gap: 30px;
    }
}

/* CTA Section */
.cta-section {
    position: relative;
    background-color: #f9fafb;
    text-align: center;
    padding: 80px 20px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
}

/* Background Container */
.cta-bg {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
}

/* Background Images */
.cta-bg-img {
    position: absolute;
    width: 300px;
    max-width: 30vw;
    opacity: 1;
    z-index: 2;
}

/* Top Left Background Image */
.cta-top-shadow {
    top: -20%;
    left: -10%;
}

/* Bottom Right Background Image */
.cta-bottom-shadow {
    bottom: -20%;
    right: -10%;
}

/* CTA Content */
.cta-content {
    position: relative;
    z-index: 3;
    max-width: 800px;
    margin: auto;
}

/* Desktop Text - Default */
.desktop-text {
    display: block;
}

/* Mobile Text - Hidden by Default */
.mobile-text {
    display: none;
}

/* Heading */
.cta-content h2 {
    font-size: 36px;
    font-weight: 700;
    color: #000;
    margin-bottom: 15px;
}

/* Highlighted Words */
.highlight {
    color: #5356FF;
}

/* Paragraph */
.cta-content p {
    font-size: 18px;
    color: #666;
    margin-bottom: 30px;
    line-height: 1.6;
}

/* Centering Button Properly */
.cta-btn-container {
    display: flex;
    justify-content: center;
}

/* CTA Button */
.cta-btn {
    background: #5356FF;
    color: white;
    font-size: 18px;
    font-weight: bold;
    padding: 14px 28px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 10px;
    transition: background 0.3s ease;
    font-weight: 600;
}

.cta-btn:hover {
    background: #4246e3;
}

/* Responsive */
@media (max-width: 768px) {
    .cta-section {
        padding: 50px 20px;
    }

    .cta-bg-img {
        width: 180px;
    }

    .cta-top-shadow {
        top: -15%;
        left: -15%;
    }

    .cta-bottom-shadow {
        bottom: -15%;
        right: 0;
    }

    .cta-content h2 {
        font-size: 28px;
    }

    .cta-btn {
        font-size: 16px;
        padding: 12px 24px;
    }

    /* Swap Text on Mobile */
    .desktop-text {
        display: none;
    }

    .mobile-text {
        display: block;
    }
}

.faq-section {
      padding: 80px 120px;
      text-align: center;
      background-color: #fff;
      font-family: "Inter", sans-serif;
  }

  .faq-heading {
      font-size: 45px;
      font-weight: 700;
      line-height: 58.09px;
      color: #050315;
      font-family: "Inter", sans-serif;
  }

  .faq-desc {
      font-size: 20px;
      font-weight: 400;
      line-height: 24.2px;
      margin: 25px 0 80px 0;
      color: #050315b2;
      font-family: "Inter", sans-serif;
  }

  .faqs-container {
      width: 75%; /* Reduced from 898px to 75% */
      max-width: 750px; /* Prevent it from getting too wide */
      border: 1px solid #050315b2;
      margin-inline: auto;
      text-align: left;
      border-radius: 16px;
      font-family: "Inter", sans-serif;
  }

  .faq {
      padding: 40px 20px 20px 20px;
      border-bottom: 1px solid #050315b2;
      border-radius: 16px;
      font-family: "Inter", sans-serif;
  }

  .faq-single-heading {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 20px;
      font-weight: 700;
      line-height: 24.2px;
      color: #000;
      cursor: pointer;
      user-select: none;
      font-family: "Inter", sans-serif;
  }

  .faq-single-heading span {
      font-weight: 300;
      font-size: 40px;
      font-family: "Inter", sans-serif;
  }

  .faq-single-desc {
      font-size: 20px;
      font-weight: 400;
      line-height: 24.2px;
      max-height: 0;
      overflow: hidden;
      padding-top: 20px;
      font-family: "Inter", sans-serif;
  }

  .faq.open .faq-single-desc {
      max-height: 350px;
  }

  /* ✅ Adjusting width for smaller screens */
  @media (max-width: 1024px) {
      .faqs-container {
          width: 85%;
          max-width: 650px;
      }
  }

  @media (max-width: 768px) {
      .faq-heading {
          font-size: 28px;
      }

      .faq-desc {
          font-size: 18px;
      }

      .faqs-container {
          width: 100%;
          max-width: none;
      }

      .faq-single-heading {
          font-size: 18px;
      }

      .faq-single-desc {
          font-size: 16px;
      }
  }
footer {
    padding: 80px 120px;
    background-color: #1e1e1e;
    display: flex;
    justify-content: space-between;
}

.footer-logo {
    width: 285px;
    margin-bottom: 20px;
}

.footer-logo span {
    color: #5356ffb2;
}

.footer-logo-desc {
    font-size: 20px;
    font-weight: 400;
    line-height: 30px;
    color: #fff;
}

.footer-column-container {
    display: flex;
    justify-content: space-between;
}

.footer-column-container div p,
.footer-third-col p {
    font-size: 24px;
    font-weight: 500;
    line-height: 36px;
    margin-bottom: 50px;
    color: #858585;
}

.footer-column-container div ul {
    display: flex;
    flex-direction: column;
    gap: 40px;
}

.footer-column-container div ul li {
    list-style-type: none;
}

.footer-column-container div ul li a {
    text-decoration: none;
    font-size: 20px;
    font-weight: 400;
    line-height: 30px;
    text-align: left;
    color: #eeeeee;
}

.footer-first-col {
    width: 20%;
    min-width: 311px;
}

.footer-second-col {
    width: 50%;
    justify-content: space-around;
}

.footer-third-col {
    width: 20%;
}

.footer-third-col input {
    padding: 14px;
    font-size: 20px;
    font-weight: 400;
    line-height: 30px;
    border-radius: 8px;
    width: 100%;
    color: #858585;
    margin-bottom: 20px;
}

.footer-third-col .subscribe-btn {
    padding: 12px 24px;
    width: 100%;
    background-color: #5356ff;
    color: #fff;
    border-radius: 8px;
    border: none;
    outline: none;
    font-size: 1rem;
}

/* Media Queries  */

@media (max-width: 1620px) {
    nav ul {
        gap: 40px;
    }

    nav .logo {
        font-size: 28px;
    }

    .have-que-inner {
        width: 100%;
    }

    .nav-btn-container {
        gap: 15px;
    }

    .how-works-card {
        width: 100%;
    }

    .benefit-heading {
        width: 70%;
    }
}

@media (max-width: 1440px) {
    nav {
        padding: 25px 90px;
    }

    nav .logo {
        font-size: 24px;
    }

    nav ul {
        gap: 28px;
    }

    nav ul li a {
        font-size: 18px;
    }

    .nav-btn-container button {
        font-size: 18px;
    }

    .nav-btn-container button {
        padding: 10px 18px;
    }

    .hero-heading,
    .old-new-way-section-heading,
    .benefit-heading,
    .price-heading,
    .customer-say-heading,
    .get-start-heading,
    .faq-heading,
    .contact-us-heading {
        font-size: 34px;
        line-height: 52px;
    }
    
}

@media (max-width: 1330px) {
    .hero-inner {
        width: 70%;
    }

    .customer-say-container {
        gap: 100px;
    }
}

@media (max-width: 1135px) {
    body {
        background-color: #fff;
    }

    .nav-shadow,
    .hero-mid-shadow,
    .hero-bottom-shadow {
        display: none;
    }

    nav {
        justify-content: space-between;
        width: 100%;
        background-color: #fff;
        position: fixed;
        top: 0;
        z-index: 12;
    }

    .hamburg-menu,
    .close-sidebar {
        display: block;
    }

    .nav-menu-btn-container {
        position: fixed;
        top: 0;
        right: -100%;
        display: block;
        background-color: #fff;
        height: 100vh;
        z-index: 10;
        width: 300px;
        padding: 20px;
        transition: all 0.5s ease;
    }

    .close-sidebar {
        font-size: 40px;
    }

    nav ul {
        display: block;
    }

    nav ul li {
        margin-bottom: 14px;
    }

    .nav-btn-container {
        display: block;
        margin-top: 20px;
    }

    .nav-btn-container button {
        margin-bottom: 14px;
    }

    nav .header-logo {
        width: 198px;
    }

    .hero {
        padding-top: 45px;
        z-index: -1;
    }

    footer {
        flex-wrap: wrap;
        gap: 70px;
    }

    .footer-logo {
        width: 198px;
    }

    .footer-third-col {
        width: 30%;
    }

    .footer-first-col,
    .footer-column-container,
    .footer-third-col {
        width: 100%;
    }

    .footer-column-container {
        justify-content: space-between;
    }
}

@media (max-width: 768px) {

    nav {
        padding: 18px 24px;
    }

    nav .logo {
        font-size: 20px;
        line-height: 30px;
    }

    .hero-heading,
    .old-new-way-section-heading,
    .benefit-heading,
    .price-heading,
    .customer-say-heading,
    .get-start-heading,
    .faq-heading,
    .contact-us-heading,
    .how-work-heading,
    .have-que-inner p {
        font-size: 1.5rem;
        line-height: 34px;
    }

    .old-new-way-section,
    .benefit-section,
    .how-works-section,
    .pricing-section,
    .customer-say-section,
    .get-start-section,
    .faq-section,
    .have-que-section,
    .contact-us-section,
    footer {
        padding-inline: 24px;
    }

    .benefit-section,
    .customer-say-section,
    .faq-section {
        padding-block: 60px;
    }


    .footer-logo-desc {
        font-size: 16px;
        line-height: 25px;
    }

    .footer-column-container div p,
    .footer-third-col p {
        font-size: 16px;
        margin-bottom: 30px;
    }

    .footer-column-container div ul {
        gap: 30px;
    }

    .footer-column-container div ul li a {
        font-size: 16px;
        line-height: 25px;
    }

    .footer-third-col input {
        font-size: 14px;
    }
}


.hero {
    background: rgba(0, 255, 0, 0.3);  /* Semi-transparent green */
}
.hero-video {
    background: rgba(0, 0, 255, 0.3);  /* Semi-transparent blue */
}

`;

export default GlobalStyle;


