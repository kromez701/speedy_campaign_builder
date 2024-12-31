import React from 'react';
import { useNavigate } from 'react-router-dom';
import ScopedGlobalStyle from './PolicyPageStyles'; // Ensure this path matches the actual file location

const DataDeletionPolicy = () => {
    const navigate = useNavigate(); // Initialize useNavigate
  
    const handleHamburgMenuClick = () => {
        document.querySelector('.nav-menu-btn-container').style.right = '0';
    };
  
    const handleCloseSidebarClick = () => {
        document.querySelector('.nav-menu-btn-container').style.right = '-310px';
    };
  
    return (
        <div id="data-deletion-policy">
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
                <h1>Data Deletion Policy for QuickCampaigns</h1>

                <section>
                    <h2>Last Updated: December 29, 2024</h2>
                </section>

                <section>
                    <h2>Introduction</h2>
                    <p>
                        At QuickCampaigns.io, we prioritize user privacy and data protection. In compliance with Facebook’s platform policies 
                        and GDPR, we offer users full control over their personal data. If you no longer wish to use our services and would 
                        like to request the deletion of your data, please follow the instructions below.
                    </p>
                </section>

                <section>
                    <h2>How to Request Data Deletion</h2>
                    <h3>Option 1: Delete via Account Settings (Recommended)</h3>
                    <p>
                        1. Log in to your QuickCampaigns.io account.<br />
                        2. Navigate to Settings - Account.<br />
                        3. Click on "Delete Account" and confirm your request.<br />
                        Upon confirmation, all personal data associated with your account will be permanently deleted within 7 business days, 
                        except for data we are required to retain by law.
                    </p>

                    <h3>Option 2: Request Deletion by Email</h3>
                    <p>
                        Alternatively, you can email us directly at:<br />
                        📧 <a href="mailto:support@quickcampaigns.io">support@quickcampaigns.io</a>
                    </p>
                    <ul>
                        <li>Subject: Data Deletion Request</li>
                        <li>Required Details: Full Name, Registered Email Address, and (Optional) Reason for Data Deletion</li>
                    </ul>
                    <p>
                        We will process your request within 7 business days and confirm once your data has been deleted.
                    </p>
                </section>

                <section>
                    <h2>Automatic Data Deletion (Inactivity)</h2>
                    <p>
                        Accounts inactive for 12 months will be automatically deleted after receiving a 30-day prior notification. Users will 
                        have the opportunity to log in and reactivate their accounts before automatic deletion occurs.
                    </p>
                </section>

                <section>
                    <h2>Important Notes</h2>
                    <ul>
                        <li>Ad-related data (e.g., Facebook Ads uploaded through QuickCampaigns) may still exist within your Facebook account. 
                        To delete ad data, follow Facebook’s data deletion process directly.</li>
                        <li>Data required for legal, regulatory, or security reasons may be retained as per applicable laws.</li>
                    </ul>
                </section>

                <section>
                    <h2>Need Help?</h2>
                    <p>
                        If you have any questions or encounter issues during the data deletion process, feel free to contact our support team at:<br />
                        📧 <a href="mailto:support@quickcampaigns.io">support@quickcampaigns.io</a>
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

export default DataDeletionPolicy;
