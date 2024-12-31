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
                <h1>Refund Policy for QuickCampaigns</h1>

                <section>
                    <h2>1. Overview</h2>
                    <p>
                        We offer a 30-day money-back guarantee for all subscriptions. If you are not satisfied with the software, 
                        you may request a full refund.
                    </p>
                </section>

                <section>
                    <h2>2. Eligibility</h2>
                    <p>Refunds must be requested within 30 days of the initial purchase.</p>
                    <p>Only subscriptions with no more than one active campaign upload will be eligible for refunds.</p>
                </section>

                <section>
                    <h2>3. Refund Process</h2>
                    <p>To request a refund, contact <a href="mailto:support@quickcampaigns.io">[support@quickcampaigns.io]</a> with your account details.</p>
                    <p>Refunds will be processed within 7 business days to the original payment method.</p>
                </section>

                <section>
                    <h2>4. Limitations</h2>
                    <p>Refunds are not provided after 30 days.</p>
                    <p>Accounts that abuse the refund process may be flagged for review.</p>
                </section>

                <h1>Affiliate Program Terms for QuickCampaigns</h1>

                <section>
                    <h2>1. Introduction</h2>
                    <p>
                        The QuickCampaigns Affiliate Program allows you to earn 30% recurring commission on referrals that lead to 
                        new subscriptions.
                    </p>
                </section>

                <section>
                    <h2>2. Enrollment and Eligibility</h2>
                    <p>
                        Affiliates must apply and be approved before accessing affiliate tools. We reserve the right to accept or 
                        deny applicants at our discretion.
                    </p>
                </section>

                <section>
                    <h2>3. Commission Structure</h2>
                    <p>Affiliates earn 30% of each successful subscription payment.</p>
                    <p>Payments are made monthly once the minimum payout threshold is met.</p>
                </section>

                <section>
                    <h2>4. Affiliate Responsibilities</h2>
                    <ul>
                        <li>Promote the software responsibly and ethically.</li>
                        <li>Avoid false advertising or misleading claims.</li>
                        <li>Follow applicable advertising regulations.</li>
                    </ul>
                </section>

                <section>
                    <h2>5. Termination</h2>
                    <p>
                        Affiliate accounts may be terminated for violations, including spam marketing, false claims, or misuse of 
                        branding.
                    </p>
                    <p>
                        For questions regarding the affiliate program, contact <a href="mailto:support@example.com">[support email]</a>.
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
