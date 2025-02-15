import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ScopedGlobalStyle from './AffiliateStyles'; // Ensure this path matches the actual file location

const Affiliate = () => {
    const navigate = useNavigate();

    const handleHamburgMenuClick = () => {
        document.querySelector('.nav-menu-btn-container').style.right = '0';
    };

    const handleCloseSidebarClick = () => {
        document.querySelector('.nav-menu-btn-container').style.right = '-310px';
    };

    const [openFAQ, setOpenFAQ] = useState(null);

    const handleFaqClick = (index) => {
        setOpenFAQ(openFAQ === index ? null : index);
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
            <main className="">
            <section className="affiliate-hero">
                {/* Background Image in Bottom Right */}
                <img className="back- hero-bottom-shadow" src="./assets/hero-bottom-shadow.svg" alt="" />

                <div className="affiliate-content">
                    <h1>
                    Join Our <span className="highlight">Affiliate Programs</span> And Earn Big
                    With Our <span className="highlight">AI Facebook</span> Campaign Builder
                    </h1>

                    <p>
                    Are you a digital marketer, influencer, or entrepreneur looking for a new way to earn
                    passive income? Join our affiliate program and start earning commissions by
                    promoting our revolutionary Facebook Ads creation software.
                    </p>

                    <button className="affiliate-btn">Learn More →</button>
                </div>
            </section>
            <div className="affiliate-benefits-section">
                <h2 className="affiliate-benefits-heading">
                    Why Become an <span>Affiliate?</span>
                </h2>

                <div className="affiliate-benefits-container">
                    {/* Card 1 */}
                    <div className="affiliate-benefit-card">
                    <div className="affiliate-benefit-icon"><img src="./assets/Vector_affiliate.png"></img></div>
                    <p className="affiliate-benefit-title">High Commissions</p>
                    <p className="affiliate-benefit-desc">
                        Earn a generous 30% commission on every sale you refer. Our high-converting sales page and compelling product make it easy to earn big.
                    </p>
                    </div>

                    {/* Card 2 */}
                    <div className="affiliate-benefit-card">
                    <div className="affiliate-benefit-icon"><img src="./assets/Vector_aff2.png"></img></div>
                    <p className="affiliate-benefit-title">Recurring Revenue</p>
                    <p className="affiliate-benefit-desc">
                        With our subscription-based model, you'll earn commissions not just on the initial sale, but on every renewal as well. Build a passive income stream that grows over time.
                    </p>
                    </div>

                    {/* Card 3 */}
                    <div className="affiliate-benefit-card">
                    <div className="affiliate-benefit-icon"><img src="./assets/Vector_aff3.png"></img></div>
                    <p className="affiliate-benefit-title">Easy Promotion</p>
                    <p className="affiliate-benefit-desc">
                        We provide you with a unique affiliate link and a variety of marketing materials, including banners, email templates, and social media posts. Promote the software on your website, blog, social media, or email list with ease.
                    </p>
                    </div>

                    {/* Card 4 */}
                    <div className="affiliate-benefit-card">
                    <div className="affiliate-benefit-icon"><img src="./assets/Vector_aff4.png"></img></div>
                    <p className="affiliate-benefit-title">In-Demand Product</p>
                    <p className="affiliate-benefit-desc">
                        Our software solves a major pain point for digital marketers - slow, inefficient Facebook Ads campaign creation. With a growing demand for this solution, you'll have a wide audience to promote to.
                    </p>
                    </div>

                    {/* Card 5 */}
                    <div className="affiliate-benefit-card">
                    <div className="affiliate-benefit-icon"><img src="./assets/Vector_aff5.png"></img></div>
                    <p className="affiliate-benefit-title">Trusted Brand</p>
                    <p className="affiliate-benefit-desc">
                        Our software has already helped countless marketers save time and boost their ad performance. You can promote with confidence, knowing you're recommending a high-quality, proven product.
                    </p>
                    </div>
                </div>
                </div>

                <div className="steps-container">
                <h2 className="steps-title">
                    It’s easy to <span className="highlight">get started</span>
                </h2>

                {/* Desktop Layout */}
                <div className="steps-grid">
                    {steps.map((step, index) => (
                    <div
                        key={index}
                        className={`step-box ${index % 2 === 0 ? "left" : "right"}`}
                    >
                        <div className="step-number">{index + 1}</div>
                        <p className="step-text">{step}</p>
                    </div>
                    ))}
                    <div className="dotted-line"></div>
                </div>

                {/* Mobile Layout */}
                <div className="steps-mobile">
                    {steps.map((step, index) => (
                    <div key={index} className="step-box">
                        <div className="step-number">{index + 1}</div>
                        <p className="step-text">{step}</p>
                    </div>
                    ))}
                </div>
                </div>
            <div className="who-benefits-section">
                <h2>
                    Who Can <span className="highlight">Benefit?</span>
                </h2>

                <div className="benefits-grid">
                    {/* Card 1 */}
                    <div className="benefit-card">
                    <img src="./assets/undraw_team_collaboration_re_ow29.png" alt="Digital Marketing Agencies" />
                    <p>Digital Marketing Agencies Looking To Offer Additional Value To Their Clients</p>
                    </div>

                    {/* Card 2 */}
                    <div className="benefit-card">
                    <img src="./assets/undraw_social_girl_re_kdrx.png" alt="Bloggers and Influencers" />
                    <p>Bloggers And Influencers In The Digital Marketing, Entrepreneurship, Or E-Commerce Niches</p>
                    </div>

                    {/* Card 3 */}
                    <div className="benefit-card">
                    <img src="./assets/undraw_mail_re_duel.png" alt="Email Marketers" />
                    <p>Email Marketers With A List Of Potential Customers</p>
                    </div>

                    {/* Card 4 */}
                    <div className="benefit-card">
                    <img src="./assets/undraw_people_re_8spw.png" alt="Anyone with an audience" />
                    <p>Anyone With An Audience Interested In Facebook Ads And Marketing Optimization</p>
                    </div>
                </div>
            </div>
            
            <div className="cta-section">
            {/* Background images */}
            <div className="cta-bg">
                <img className="cta-bg-img cta-top-shadow" src="./assets/hero-center-shadow.svg" alt="" />
                <img className="cta-bg-img cta-bottom-shadow" src="./assets/hero-bottom-shadow.svg" alt="" />
            </div>

            {/* CTA Content */}
            <div className="cta-content">
                <h2 className="cta-heading">
                <span className="desktop-text">
                    Ready To Start <span className="highlight">Earning</span> Passive Income By Promoting A Game-Changing Software?
                </span>
                <span className="mobile-text">
                    Start <span className="highlight">Earning</span> Passive Income Today
                </span>
                </h2>
                <p>
                Sign Up For Our Affiliate Program Today And Join A Community Of Successful
                Marketers. The More You Promote, The More You Earn – The Sky’s The Limit!
                </p>

                {/* CTA Button */}
                <div className="cta-btn-container">
                <button className="cta-btn">
                    Sign Up
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 8L22 12M22 12L18 16M22 12H2" stroke="white" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
                </div>
            </div>
            </div>
            <div id="faq-section" className="faq-section">
                <p className="faq-heading">Frequently Asked Questions</p>
                <p className="faq-desc">Ask everything you need to know about our products</p>

                <div className="faqs-container">
                    {faqData.map((faq, index) => (
                    <div key={index} className={`faq ${openFAQ === index ? 'open' : ''}`}>
                        <p className="faq-single-heading" onClick={() => handleFaqClick(index)}>
                        {faq.question} <span>{openFAQ === index ? '−' : '+'}</span>
                        </p>
                        <p className="faq-single-desc" style={{ maxHeight: openFAQ === index ? '350px' : '0' }}>
                        {faq.answer}
                        </p>
                    </div>
                    ))}
                </div>
                </div>
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

const faqData = [
    {
      question: 'How Much Can I Earn As An Affiliate?',
      answer: 'Our affiliates earn a commission ...................',
    },
    {
      question: 'How Do I Get Paid?',
      answer: 'We pay our affiliates monthly via PayPal or direct bank transfer. You’ll receive your commissions within the first week of each month.',
    },
    {
      question: 'What Marketing Materials Do You Provide?',
      answer: 'We offer banners, email templates, and social media content to help you promote QuickCampaigns effectively.',
    },
  ];

const benefits = [
    {
      icon: "📈",
      title: "High Commissions",
      description:
        "Earn a generous 30% commission on every sale you refer. Our high-converting sales page and compelling product make it easy to earn big.",
    },
    {
      icon: "💰",
      title: "Recurring Revenue",
      description:
        "With our subscription-based model, you'll earn commissions not just on the initial sale, but on every renewal as well. Build a passive income stream that grows over time.",
    },
    {
      icon: "📣",
      title: "Easy Promotion",
      description:
        "We provide you with a unique affiliate link and a variety of marketing materials, including banners, email templates, and social media posts. Promote the software on your website, blog, social media, or email list with ease.",
    },
    {
      icon: "🔥",
      title: "In-Demand Product",
      description:
        "Our software solves a major pain point for digital marketers - slow, inefficient Facebook Ads campaign creation. With a growing demand for this solution, you'll have a wide audience to promote to.",
    },
    {
      icon: "🏆",
      title: "Trusted Brand",
      description:
        "Our software has already helped countless marketers save time and boost their ad performance. You can promote with confidence, knowing you're recommending a high-quality, proven product.",
    },
  ];

  const steps = [
    "Sign up for our affiliate program using the form below.",
    "Receive your unique affiliate link and access to our marketing materials.",
    "Promote the software using your affiliate link on your website, blog, social media, or email list.",
    "Earn a 30% commission on every sale made through your unique link.",
    "Get paid monthly via PayPal or direct bank transfer."
  ];
  
export default Affiliate;
