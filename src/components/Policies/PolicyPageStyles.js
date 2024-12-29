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

    .price-card-price {
        font-size: 2.5rem;
    }

    .hero-description,
    .old-new-way-section-desc {
        font-size: 16px;
        line-height: 25px;
    }

    .benefit-card-heading {
        font-size: 1.3rem;
        line-height: 30px;
    }

    .how-works-card-wrapper {
        padding: 15px 10px;
    }

    .how-work-card-desc {
        font-size: 16px;
        line-height: 25px;
    }

    .price-desc {
        font-size: 16px;
        line-height: 24px;
    }

    .faq-single-heading {
        font-size: 18px;
        line-height: 21px;
    }

    .faq-single-desc {
        font-size: 16px;
        line-height: 21px;
    }

    .have-que-inner p {
        font-size: 30px;
        line-height: 40px;
    }

    .get-start-heading {
        margin-bottom: 30px;
    }

    .get-start-desc {
        font-size: 16px;
        line-height: 24px;
    }

    .contact-form {
        padding: 41px 30px;
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

    .old-new-way-section div:first-child {
        border-left: 4px solid #5356ff;
        padding-left: 25px;
        width: 100%;
        border-right: none;
        padding-bottom: 40px;
    }

    .old-new-way-section div:first-child svg {
        left: -24px;
    }

    .new-way-wrapper {
        width: 100%;
        padding-left: 25px;
    }

    .benefit-heading {
        width: 100%;
    }

    .benefit-card {
        width: calc(50.7% - 20px);
    }

    .how-works-section {
        flex-direction: column;
        padding-bottom: 0;
    }

    .how-work-left,
    .how-work-right {
        width: 100%;
    }

    .how-work-right {
        margin-top: 40px;
        height: 385px;
    }

    .how-works-video {
        border-radius: 16px 16px 0 0;
    }

    .price-card-container {
        flex-wrap: wrap;
        gap: 32px;
    }

    .popular-plan-wrapper {
        right: 50px;
    }

    .faqs-container {
        width: 100%;
    }

    .get-start-section {
        flex-direction: column;
    }

    .get-start-wrapper-first {
        width: 100%;
        padding-right: 0;
        border-right: none;
        padding-bottom: 40px;
        margin-bottom: 40px;
        border-bottom: 2px solid #050315b2;
    }

    .get-start-wrapper-last {
        width: 100%;
        padding-left: 0;
    }

    .have-que-inner {
        flex-direction: column;
        gap: 80px;
    }

    .have-que-btn-shadow {
        top: -105px;
    }

    .have-que-inner {
        padding-bottom: 80px;
    }

    .have-que-inner p {
        text-align: center;
    }

    .send-msg-heading {
        font-size: 24px;
        margin-bottom: 30px;
    }

    .contact-form label {
        font-size: 16px;
    }

    .contact-form input,
    .contact-form textarea {
        font-size: 16px;
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

    .price-card {
        width: 100%;
    }

    .how-works-section {
        padding-top: 24px;
    }

    .how-works-card-wrapper {
        gap: 16px;
        padding: 6px;
    }

    .how-work-card-number {
        width: 68px;
        height: 68px;
    }

    .how-work-card-desc {
        font-size: 12px;
        line-height: 18px;
    }

    .faq-desc {
        font-size: 15px;
        line-height: 24px;
        margin: 20px 0 40px 0;
    }

    .faq-single-heading span {
        font-size: 30px;
    }

    .have-que-inner button {
        height: 50px;
        font-size: 16px;
        min-width: 200px;
    }

    .hero-inner {
        width: calc(100% - 48px);
    }

    .old-new-way-section-desc {
        margin-top: 30px;
    }

    .benefit-card {
        width: 100%;
    }

    .benefit-card-wrapper {
        padding: 23px 10px;
    }

    .benefit-card-desc {
        font-size: 14px;
        line-height: 23px;
    }

    .customer-say-container {
        flex-direction: column;
    }

    .pricing-section {
        padding-block: 43px;
    }

    .single-customer-say {
        width: 100%;
    }

    .contact-form {
        width: 100%;
    }

    .contact-form input,
    .contact-form textarea {
        margin-top: 15px;
    }

    .popular-plan-wrapper {
        right: 35%;
    }

    .single-customer-say p {
        font-size: 16px;
        line-height: 25px;
        margin-top: 20px;
    }

    .get-start-desc {
        font-size: 16px;
        line-height: 25px;
    }

    .faq-single-heading {
        font-size: 15px;
        line-height: 19px;
    }

    .faq-single-desc {
        font-size: 13px;
        line-height: 18px;
    }

    .send-msg-heading {
        font-size: 16px;
        margin-bottom: 20px;
    }

    .contact-form label {
        font-size: 14px;
    }

    .contact-form input,
    .contact-form textarea {
        font-size: 12px;
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
`;

export default GlobalStyle;
