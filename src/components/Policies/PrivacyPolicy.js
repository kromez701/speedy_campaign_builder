import React from 'react';
import { useNavigate } from 'react-router-dom';
import ScopedGlobalStyle from './PolicyPageStyles'; // Ensure this path matches the actual file location

const TermsOfService = () => {
    const navigate = useNavigate(); // Initialize useNavigate
  
    const handleHamburgMenuClick = () => {
      document.querySelector('.nav-menu-btn-container').style.right = '0';
    };
  
    const handleCloseSidebarClick = () => {
      document.querySelector('.nav-menu-btn-container').style.right = '-310px';
    };
  
    return (
        <div id="terms-of-service">
            {/* Scoped Global Styles */}
            <ScopedGlobalStyle />
            
            {/* Header */}
            <header>
                <nav>
                    <img className="back-shadow nav-shadow" src="./assets/nav-shadow.svg" alt="" />
                    <a href="/">
                    <img className="header-logo" src="./assets/logo-header.png" alt="" />
                    </a>
                    <svg className="hamburg-menu" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={handleHamburgMenuClick}>
                    <path d="M3 6H21M3 12H21M3 18H21" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>

                    <div className="nav-menu-btn-container">
                    <span className="close-sidebar" onClick={handleCloseSidebarClick}>&times;</span>
                    <ul>
                        <li><a href="/" className="active-tab">Home</a></li>
                        <li>
                            <a
                                href="/"
                                onClick={(e) => {
                                e.preventDefault(); // Prevent default anchor behavior
                                navigate('/', { state: { section: 'benefit-section' } });
                                }}
                                className="nav-link"
                            >
                                Benefits
                            </a>
                            </li>
                            <li>
                            <a
                                href="/"
                                onClick={(e) => {
                                e.preventDefault();
                                navigate('/', { state: { section: 'pricing-section' } });
                                }}
                                className="nav-link"
                            >
                                Pricing
                            </a>
                            </li>
                            <li>
                            <a
                                href="/"
                                onClick={(e) => {
                                e.preventDefault();
                                navigate('/', { state: { section: 'faq-section' } });
                                }}
                                className="nav-link"
                            >
                                FAQ’s
                            </a>
                            </li>
                            <li>
                            <a
                                href="/"
                                onClick={(e) => {
                                e.preventDefault();
                                navigate('/', { state: { section: 'contact-section' } });
                                }}
                                className="nav-link"
                            >
                                Contact
                            </a>
                        </li>
                    </ul>
                    <div className="nav-btn-container">
                        <button onClick={() => navigate('/login')}>Login</button>
                        <a className="no-dec" href="#pricing-section">
                        <button className="get-started" onClick={() => {navigate('/', { state: { section: 'pricing-section' } }); }}>
                            Get Started
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 8L22 12M22 12L18 16M22 12H2" stroke="#EEEEEE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                        </a>
                    </div>
                    </div>
            </nav>
            </header>

            {/* Main Content */}
            <main className="content">
                <h1>Privacy Policy for QuickCampaigns</h1>

                <section>
                    <h2>1. Introduction</h2>
                    <p>
                        QuickCampaigns is committed to protecting your privacy. This Privacy Policy explains our data 
                        collection practices and your rights regarding your information.
                    </p>
                </section>

                <section>
                    <h2>2. Data Collection</h2>
                    <p>
                        <strong>Account Information:</strong> Collected during registration (name, email, company name, payment details).
                    </p>
                    <p>
                        <strong>Usage Data:</strong> We track interactions with the platform, including ad uploads and account activity.
                    </p>
                    <p>
                        <strong>Payment Information:</strong> Securely processed through third-party providers. Payment data is not stored on our servers.
                    </p>
                </section>

                <section>
                    <h2>3. Data Storage and Security</h2>
                    <p>
                        Data is securely stored on cloud servers and encrypted to protect user information. Only authorized 
                        personnel have access to sensitive data.
                    </p>
                </section>

                <section>
                    <h2>4. Use of Data</h2>
                    <ul>
                        <li>Improve user experience and software functionality.</li>
                        <li>Provide customer support and resolve technical issues.</li>
                        <li>Send promotional emails (with opt-out options).</li>
                    </ul>
                </section>

                <section>
                    <h2>5. User Rights</h2>
                    <p>
                        You may request access, modification, or deletion of your personal data by contacting 
                        <a href="mailto:support@quickcampaigns.io"> [support@quickcampaigns.io]</a>.
                    </p>
                </section>

                <section>
                    <h2>6. Cookies</h2>
                    <p>
                        We use cookies to enhance user experience. You can adjust cookie settings through your browser.
                    </p>
                </section>

                <section>
                    <h2>7. Policy Changes</h2>
                    <p>
                        We reserve the right to update this Privacy Policy. Users will be notified of significant changes.
                    </p>
                </section>
            </main>

            {/* Footer */}
            <footer>
            <div className="footer-first-col">
                <a href="/">
                <img className="footer-logo" src="./assets/logo-footer.png" alt="QuickCampaigns Footer Logo" />
                </a>
                <p className="footer-logo-desc">
                Our software intelligently creates campaigns, ad sets, and ads based on your selected folders and default settings.
                </p>
            </div>
            <div className="footer-column-container footer-second-col">
                <div>
                <p>Pages</p>
                <ul>
                    <li><a href="/">Home</a></li>
                    <li>
                        <a
                            href="/"
                            onClick={(e) => {
                            e.preventDefault(); // Prevent default anchor behavior
                            navigate('/', { state: { section: 'benefit-section' } });
                            }}
                            className="nav-link"
                        >
                            Benefits
                        </a>
                        </li>
                        <li>
                        <a
                            href="/"
                            onClick={(e) => {
                            e.preventDefault();
                            navigate('/', { state: { section: 'pricing-section' } });
                            }}
                            className="nav-link"
                        >
                            Pricing
                        </a>
                        </li>
                        <li>
                            <a
                                href="/"
                                onClick={(e) => {
                                e.preventDefault();
                                navigate('/', { state: { section: 'review-section' } });
                                }}
                                className="nav-link"
                            >
                                Reviews
                            </a>
                        </li>
                        <li>
                        <a
                            href="/"
                            onClick={(e) => {
                            e.preventDefault();
                            navigate('/', { state: { section: 'faq-section' } });
                            }}
                            className="nav-link"
                        >
                            FAQ’s
                        </a>
                    </li>
                        
                </ul>
                </div>
                <div>
                <p>Help</p>
                <ul>
                    <li>
                        <a
                            href="/"
                            onClick={(e) => {
                            e.preventDefault();
                            navigate('/', { state: { section: 'contact-section' } });
                            }}
                            className="nav-link"
                        >
                            Contact
                        </a>
                    </li>
                    <li><a href="/terms-of-service">Terms & Conditions</a></li>
                    <li><a href="/privacy-policy">Privacy Policy</a></li>
                    <li><a href="/refund-policy">Refund Policy</a></li>
                    <li><a href="/deletion-policy">Data Deletion Policy</a></li>
                    <li><a href="/cookies-policy">Cookies Policy</a></li>
                </ul>
                </div>
            </div>
            <div className="footer-third-col">
                <p>Newsletter</p>
                <input type="text" placeholder="Enter your email" />
                <br />
                <button className="subscribe-btn">Subscribe Now</button>
            </div>
            </footer>
        </div>
);
};

export default TermsOfService;
