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
                        <li><a href="#" className="active-tab">Home</a></li>
                        <li><a href="#benefit-section">Benefits</a></li>
                        <li><a href="#pricing-section">Pricing</a></li>
                        <li><a href="#faq-section">FAQ’s</a></li>
                        <li><a href="#contact-section">Contact</a></li>
                    </ul>
                    <div className="nav-btn-container">
                        <button onClick={() => navigate('/login')}>Login</button>
                        <a className="no-dec" href="#pricing-section">
                        <button className="get-started">
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
            <h1>Terms of Service for QuickCampaigns</h1>
            <section>
                <h2>1. Introduction</h2>
                <p>
                Welcome to QuickCampaigns, a platform operated by Crown18 Limited, designed to help marketers 
                create and upload Facebook Ads campaigns directly from their desktop, streamlining the campaign creation process. 
                These Terms of Service ("Terms") govern your use of QuickCampaigns, including all features, content, 
                and functionality provided. By accessing the platform, you agree to comply with these Terms.
                </p>
            </section>

            <section>
                <h2>2. Eligibility</h2>
                <p>
                You must be at least 18 years old and legally authorized to enter into agreements. 
                By using QuickCampaigns, you confirm that you meet these eligibility requirements.
                </p>
            </section>

            <section>
                <h2>3. Account Registration and Access</h2>
                <p>
                To use the platform, you must create an account with accurate and complete information, including a valid email address. 
                You are responsible for maintaining the security of your account credentials. Notify us immediately at 
                <a href="mailto:support@example.com">[support email]</a> if you suspect unauthorized access.
                </p>
            </section>

            <section>
                <h2>4. Subscription Terms</h2>
                <p>
                QuickCampaigns offers a Free Trial, Professional Plan, and Enterprise Plan. Subscription plans renew automatically 
                each month, with charges billed to your registered payment method unless canceled before the next billing cycle. 
                Plan upgrades or downgrades will take effect in the next billing cycle.
                </p>
            </section>

            <section>
                <h2>5. Refund Policy</h2>
                <p>
                Customers may request a refund within 30 days of purchase if they are not satisfied with the software. 
                Refunds are issued to the original payment method. Refer to our Refund Policy for full details.
                </p>
            </section>

            <section>
                <h2>6. User Conduct</h2>
                <p>Users agree not to:</p>
                <ul>
                <li>Misuse the software or resell its features without authorization.</li>
                <li>Provide false information or impersonate others.</li>
                <li>Use the platform to create misleading or illegal ads.</li>
                </ul>
                <p>Violation of these terms may result in account suspension or termination.</p>
            </section>

            <section>
                <h2>7. Limitation of Liability</h2>
                <p>
                QuickCampaigns, its owners, and affiliates are not liable for any indirect, incidental, or consequential 
                damages resulting from the use of the software, including data loss, ad account issues, or interruptions beyond our control.
                </p>
            </section>

            <section>
                <h2>8. Intellectual Property</h2>
                <p>
                All content, trademarks, and technology related to QuickCampaigns are the property of Crown18 Limited. 
                Users retain rights to the campaigns they create, but all platform tools and templates remain the property of Crown18 Limited.
                </p>
            </section>

            <section>
                <h2>9. Termination</h2>
                <p>
                Accounts may be terminated for violation of these Terms. Users can cancel subscriptions at any time, but fees for 
                the current billing cycle are non-refundable.
                </p>
            </section>

            <section>
                <h2>10. Dispute Resolution</h2>
                <p>
                Disputes will be resolved under the jurisdiction applicable to Crown18 Limited.
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
                    <li><a href="#benefit-section">Benefits</a></li>
                    <li><a href="#pricing-section">Pricing</a></li>
                    <li><a href="#review-section">Reviews</a></li>
                    <li><a href="#faq-section">FAQ’s</a></li>
                </ul>
                </div>
                <div>
                <p>Help</p>
                <ul>
                    <li><a href="#contact-section">Contact</a></li>
                    <li><a href="/terms-of-service">Terms & Conditions</a></li>
                    <li><a href="/privacy-policy">Privacy Policy</a></li>
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
