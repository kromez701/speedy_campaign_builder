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
    background-image: url('/assets/dot.svg');
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

.hero {
    background-color: rgba(255, 255, 255, 0.02);
    position: relative;
    overflow: hidden;
}

.hero-mid-shadow {
    position: absolute;
    top: 70%;
    left: 50%;
    z-index: -1;
    transform: translate(-50%, -50%);
}

.hero-bottom-shadow {
    position: absolute;
    right: 0;
    bottom: -310px;
    z-index: -1;
}

.hero-inner {
    width: 62%;
    justify-content: center;
    align-items: center;
    margin: 50px auto 0 auto;
}

.hero-heading {
    font-size: 48px;
    font-weight: 700;
    line-height: 72px;
    text-align: center;
}

.hero-heading span {
    color: #5356ffb2;
}

.hero-description {
    margin: 35px 0 70px 0;
    font-size: 20px;
    font-weight: 400;
    line-height: 30px;
    text-align: center;
    color: #050315b2;
}

.hero-video {
    background: linear-gradient(180deg, #67c6e3 0%, rgba(83, 86, 255, 0.7) 100%);
    width: 100%;
    height: 591px;
    border-radius: 16px 16px 0px 0px;
    position: relative;
}

.hero-video svg {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.old-new-way-section {
    background-color: #fff;
    padding: 40px 120px;
    /* display: flex; */
    flex-direction: column;
}

.old-new-way-section div {
    position: relative;
}

.old-new-way-section div:first-child {
    border-right: 4px solid #5356ff;
    padding-right: 15px;
    padding-top: 30px;
    padding-bottom: 110px;
    width: 50%;
}

.old-new-way-section div:first-child svg {
    position: absolute;
    right: -24px;
    top: 55px;
}

.old-new-way-section-heading {
    font-size: 40px;
    font-weight: 700;
    line-height: 64px;
    color: #050315;
    text-transform: capitalize;
}

.old-new-way-section-heading span {
    color: #5356ffb2;
}

.old-new-way-section-desc {
    font-size: 20px;
    font-weight: 400;
    line-height: 30px;
    color: #050315b2;
    margin-top: 60px;
}

.new-way-wrapper {
    align-self: flex-end;
    padding-left: 59px;
    width: 50.23%;
    border-left: 4px solid #5356ff;
    margin: 0 0 0 auto;
    padding-bottom: 40px;
}

.new-way-wrapper svg {
    position: absolute;
    top: 0;
    left: -24px;
}

.benefit-section {
    background-color: #fff;
    padding: 80px 121px;
}

.benefit-heading {
    font-size: 40px;
    font-weight: 700;
    line-height: 64px;
    text-align: center;
    color: #000000;
    width: 50%;
    margin: 0 auto;
}

.benefit-heading span:first-child {
    color: #5356ffb2;
}

.benefit-heading span:nth-child(2) {
    color: #67c6e3b2;
}

.benefit-heading span:last-child {
    color: #378ce7b2;
}

.benefit-card-container {
    margin-top: 60px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 20px;
}

.benefit-card {
    width: calc(33.7% - 20px);
    border: 0 solid transparent;
    border-radius: 16px;
    background: linear-gradient(90deg, #5356ff 0%, #378ce7 50%, #67c6e3 100%);
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0px 16px 32px -4px #0c0c0d1a;
    padding: 4px;
}

.benefit-card-wrapper {
    width: 100%;
    height: 100%;
    background-color: #fff;
    border-radius: 14px;
    padding: 31px 10px;
    text-align: center;
}

.benefit-card-heading {
    font-size: 24px;
    font-weight: 700;
    line-height: 36px;
    color: #050315;
    margin-top: 35px;
    margin-bottom: 25px;
}

.benefit-card-desc {
    font-size: 20px;
    font-weight: 400;
    line-height: 30px;
    color: #050315b2;
}

.how-works-section {
    display: flex;
    justify-content: space-between;
    background: #ffffff05;
    padding: 79px 120px 78px 120px;
    position: relative;
    overflow: hidden;
}

.how-work-bottom-shadow {
    position: absolute;
    bottom: -280px;
    left: 0;
    z-index: -1;
}

.how-work-mid-shadow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 15%;
    z-index: -1;
}

.how-work-right-shadow {
    position: absolute;
    top: -260px;
    right: 0;
    z-index: -1;
}

.how-work-left {
    width: calc(50% - 100px);
}

.how-works-card-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.how-work-heading {
    font-size: 32px;
    font-weight: 700;
    line-height: 48px;
    color: #000;
    margin-bottom: 40px;
}

.how-works-card {
    width: 75%;
    border: 0 solid transparent;
    border-radius: 16px;
    background: linear-gradient(90deg, #5356ff 0%, #378ce7 50%, #67c6e3 100%);
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 4px;
    box-shadow: 0px 16px 32px -4px #0c0c0d1a;
}

.how-works-card-wrapper {
    width: 100%;
    height: 100%;
    background-color: #fff;
    border-radius: 14px;
    padding: 30px 16px;
    display: flex;
    align-items: center;
    gap: 28px;
}

.how-work-card-number {
    font-size: 24px;
    font-weight: 700;
    line-height: 36px;
    min-width: 70px;
    min-height: 70px;
    border-radius: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #eeeeee;
    background-color: #050315;
}

.how-work-card-desc {
    font-size: 20px;
    font-weight: 400;
    line-height: 30px;
    color: #000;
}

.how-work-right {
    width: 47%;
}

.how-works-video {
    background: linear-gradient(180deg, #67c6e3 0%, rgba(83, 86, 255, 0.7) 100%);
    width: 100%;
    height: 100%;
    border-radius: 16px;
    position: relative;
}

.how-works-video svg {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.pricing-section {
    padding: 80px 120px;
    background-color: #fff;
}

.price-heading {
    font-size: 45px;
    font-weight: 700;
    line-height: 72px;
    text-align: center;
    color: #050315;
}

.price-heading span {
    color: #5356ff;
}

.price-desc {
    font-size: 20px;
    font-weight: 400;
    line-height: 30px;
    text-align: center;
    color: #050315;
    margin-top: 16px;
    margin-bottom: 60px;
}

.price-card-container {
    display: flex;
    justify-content: center;
    gap: 32px;
}

.price-card {
    padding: 40px 32px 32px 32px;
    border-radius: 16px;
    border: 1px solid #eaecf0;
    box-shadow: 0px 12px 16px -4px #10182814;
    width: 384px;
}

.price-card-price {
    font-size: 48px;
    font-weight: 600;
    line-height: 60px;
    letter-spacing: -0.02em;
    text-align: center;
    color: #101828;
}

.price-card-accounts {
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
    text-align: center;
    color: #667085;
    margin-block: 16px;
}

.price-card-plan {
    font-size: 24px;
    font-weight: 600;
    line-height: 30px;
    text-align: center;
    color: #101828;
}

.price-card-plan-desc {
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
    text-align: center;
    color: #667085;
    margin-top: 4px;
}

.price-card-feature-container {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-top: 32px;
}

.price-card-feature {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
    text-align: left;
    color: #667085;
}

.price-card-feature svg {
    min-width: 24px;
    max-width: 24px;
    min-height: 24px;
    max-height: 24px;
}

.price-start-btn {
    margin-top: 40px;
    padding: 12px 24px;
    width: 100%;
    background-color: #5356ff;
    color: #fff;
    border-radius: 8px;
    border: none;
    outline: none;
    font-size: 1rem;
}

.popular-plan {
    position: relative;
}

.popular-plan-wrapper {
    position: absolute;
    right: 20px;
    top: -23px;
}

.popular-plan-wrapper p {
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
    text-align: left;
    color: #5356ff;
    position: absolute;
    right: -90px;
    top: -5px;
}

.enterprise-plan-wrapper p {
    right: -70px;
}

.customer-say-section {
    background-color: #fff;
    padding: 109px 120px 80px 120px;
}

.customer-say-heading {
    font-size: 40px;
    font-weight: 700;
    line-height: 72px;
    text-align: center;
    color: #000;
    margin-bottom: 60px;
}

.customer-say-container {
    display: flex;
    justify-content: center;
    gap: 320px;
}

.single-customer-say {
    width: 577px;
    text-align: center;
}

.single-customer-say p {
    font-size: 20px;
    font-weight: 400;
    line-height: 30px;
    text-align: center;
    color: #000;
    margin-top: 40px;
}

.single-customer-say p span:first-child {
    font-weight: 500;
}

.single-customer-say p span:last-child {
    color: #050315b2;
}

.get-start-section {
    padding: 45px 120px 51px 120px;
    background-color: #ffffff05;
    display: flex;
    position: relative;
    overflow: hidden;
}

.get-start-shadow {
    position: absolute;
    bottom: -350px;
    left: 0;
    z-index: -1;
}

.money-back-shadow {
    position: absolute;
    top: -350px;
    right: 0;
    z-index: -1;
}

.get-start-wrapper-first {
    padding-right: 117px;
    border-right: 2px solid #050315b2;
    width: 48%;
}

.get-start-wrapper-last {
    padding-left: 117px;
    width: 52%;
}

.get-start-heading {
    font-size: 40px;
    font-weight: 700;
    line-height: 64px;
    color: #000000;
    margin-bottom: 40px;
}

.get-start-desc {
    font-size: 20px;
    font-weight: 400;
    line-height: 30px;
    color: #050315b2;
}

.get-start-btn {
    padding: 10px 14px;
    background-color: #5356ff;
    color: #fff;
    border: none;
    outline: none;
    display: flex;
    align-items: center;
    gap: 8px;
    border-radius: 8px;
    margin-top: 40px;
    font-size: 1rem;
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
    width: 898px;
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

    /* transition: max-height 0.3s ease-out; */
}

.have-que-section {
    background-color: #ffffff05;
    padding: 80px 120px;
    position: relative;
    overflow: hidden;
}

.have-que-left-shadow {
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
}

.have-que-right-shadow {
    position: absolute;
    top: -270px;
    right: 0;
    z-index: -1;
}

.have-que-inner {
    background-color: #fff;
    border-radius: 16px;
    width: 1476px;
    padding: 60px 32px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 170px;
    margin-inline: auto;
}

.have-que-inner p {
    font-size: 40px;
    font-weight: 700;
    line-height: 60px;
    text-align: center;
}

.have-que-inner button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    font-size: 20px;
    font-weight: 400;
    line-height: 30px;
    background-color: #1e1e1e;
    border-radius: 8px;
    border: none;
    outline: none;
    min-width: 220px;
    height: 80px;
    color: #eeeeee;
    position: relative;
    z-index: 2;
}

.book-btn-box {
    position: relative;
}

.have-que-btn-shadow {
    position: absolute;
    top: -85px;
    left: -100px;
    z-index: 1;
}

.contact-us-section {
    background-color: #fff;
    padding: 46px 120px 126px 120px;
}

.contact-us-heading {
    font-size: 48px;
    font-weight: 700;
    line-height: 58.09px;
    text-align: center;
    color: #000;
    font-family: "Inter", sans-serif;
}

.contact-form {
    width: 598px;
    box-shadow: 0px 16px 32px -8px #0c0c0d66;
    padding: 71px 37px;
    border-radius: 16px;
    margin-top: 59px;
    margin-inline: auto;
}

.send-msg-heading {
    font-size: 32px;
    font-weight: 500;
    line-height: 38.73px;
    color: #050315b2;
    margin-bottom: 50px;
    font-family: "Inter", sans-serif;
}

.contact-form label {
    font-family: var(--font-primary);
    font-size: 20px;
    font-weight: 400;
    line-height: 30px;
    text-align: left;
    color: #000;
}

.contact-form input,
.contact-form textarea {
    font-family: var(--font-primary);
    padding: 14px;
    border-radius: 8px;
    border: 1px solid #858585;
    font-size: 20px;
    font-weight: 400;
    line-height: 30px;
    color: #858585;
    width: 100%;
}

.contact-form div {
    margin-bottom: 20px;
}

.contact-send-msg {
    padding: 12px 24px;
    width: 100%;
    background-color: #5356ff;
    color: #fff;
    border-radius: 8px;
    border: none;
    outline: none;
    font-size: 1rem;
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