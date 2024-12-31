import React from 'react';
import { useNavigate } from 'react-router-dom';
import ScopedGlobalStyle from './PolicyPageStyles'; // Ensure this path matches the actual file location

const CookiePolicy = () => {
    const navigate = useNavigate();

    const handleHamburgMenuClick = () => {
        document.querySelector('.nav-menu-btn-container').style.right = '0';
    };

    const handleCloseSidebarClick = () => {
        document.querySelector('.nav-menu-btn-container').style.right = '-310px';
    };

    return (
        <div id="cookie-policy">
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
                <h1>Cookie Policy for QuickCampaigns.io</h1>
                <p className="lastUpdated">Last Updated: December 30, 2024</p>
                <p>
                    At QuickCampaigns.io, we use cookies to enhance user experience, improve site performance, and serve personalized content. Below is a detailed list of the cookies we use, categorized by function. Users can manage their preferences at any time by visiting the <a href="/cookie-settings" className="link">Cookie Settings</a> page.
                </p>

                <section>
                    <h2>1. Essential Cookies (Always Active)</h2>
                    <ul>
                        <li><strong>session_id:</strong> Maintains user login sessions. <em>Expires:</em> End of session.</li>
                        <li><strong>csrf_token:</strong> Ensures secure form submissions. <em>Expires:</em> 1 day.</li>
                        <li><strong>cookie_consent_status:</strong> Stores consent preferences. <em>Expires:</em> 365 days.</li>
                    </ul>
                </section>

                <section>
                    <h2>2. Analytics Cookies</h2>
                    <ul>
                        <li><strong>_ga:</strong> Tracks visits. <em>Expires:</em> 2 years.</li>
                        <li><strong>_gid:</strong> Tracks activity. <em>Expires:</em> 1 day.</li>
                    </ul>
                </section>

                <section>
                    <h2>3. Marketing Cookies</h2>
                    <ul>
                        <li><strong>fr:</strong> Retargeting ads. <em>Expires:</em> 90 days.</li>
                    </ul>
                </section>

                <section>
                    <h2>4. Functional Cookies</h2>
                    <ul>
                        <li><strong>theme:</strong> Stores theme preferences. <em>Expires:</em> 30 days.</li>
                    </ul>
                </section>

                <section>
                    <p>For questions, contact <a href="mailto:support@quickcampaigns.io" className="link">support@quickcampaigns.io</a>.</p>
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

export default CookiePolicy;
