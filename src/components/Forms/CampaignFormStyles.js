import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`


.container {
  width: 100%;
  max-width: 500px;
  margin: 20px auto; /* Adjust margin to be responsive */
  padding: 20px;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

h1, h2 {
  text-align: center;
  color: #333;
}

.form-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.hidden {
  display: none;
}

.option-button, .cancel-button {
  background-color: #007bff;
  color: #fff;
  padding: 10px 20px;
  margin: 10px 5px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-weight: 600;
}

.go-back-button {
  margin: 0;
}

.option-button:hover, .create-ad-button:hover, .go-back-button:hover, .cancel-button:hover {
  background-color: #0056b3;
}

label {
  text-align: left;
  margin-top: 10px;
  margin-bottom: 5px;
}

input[type="text"], input[type="file"], textarea, select {
  width: 420px;
  max-width: 100%; /* Ensure it takes the full width */
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  text-align: left;
  box-sizing: border-box;
}

form {
  width: 100%;
}

p {
  text-align: center;
  font-size: 1.2em;
  color: #333;
}

.progress-container {
  width: 100%;
  margin-top: 20px;
  text-align: center;
}

.progress-bar {
  width: 100%;
  height: 20px;
  background-color: #333;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 10px;
  position: relative;
}

.progress-bar-fill {
  height: 100%;
  width: 0;
  background-color: #007bff;
  transition: width 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333;
  font-weight: bold;
}

.progress-bar-step {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #333;
  font-weight: bold;
}

.header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.go-back-icon {
  cursor: pointer;
  margin-right: 30px;
  width: 10px;
  height: 14px;
}

.button-container2 {
  display: flex;
  justify-content: flex-start; /* Align buttons to the left */
  align-items: center; /* Ensure buttons are centered vertically */
  width: 100%; /* Ensure the container takes the full width */
  margin-top: 20px; /* Add some space above the buttons */
}

.create-ad-button, .go-back-button {
  margin-right: 10px; /* Space between buttons */
}

.create-ad-button, .go-back-button {
  background-color: #5356FF;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 5px; /* Ensure both buttons have the same border-radius */
  font-family: 'Poppins', sans-serif;
  font-size: 13px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-weight: 600;
  height: 40px; /* Set a fixed height for consistency */
  line-height: normal; /* Prevent font size from affecting button height */
}

.create-ad-button:hover {
  background-color: #4044C9;
}

.go-back-button {
  background-color: #050315;
}

.go-back-button:hover {
  background-color: #0e0933;
}

/* Media Queries for Responsive Design */
@media (max-width: 900px) {
  .container {
      margin: 10px auto; /* Reduce margins for smaller screens */
      padding: 10px;
  }
}

@media (max-width: 520px) {
  .container {
      margin: 5px auto; /* Further reduce margins for mobile devices */
      padding: 5px;
  }

  .create-ad-button, .go-back-button {
    font-size: 11px; /* Adjust font size for smaller screens */
    padding: 8px 12px; /* Adjust padding for smaller screens */
}
input[type="text"], input[type="file"], textarea, select {
  width: 100%;
}

h2{
  font-size: 20px;
}
.go-back-icon{
  margin-right: 10px;
}
}

`;

export default GlobalStyle;
