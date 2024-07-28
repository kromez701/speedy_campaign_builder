import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
.container {
  text-align: center;
  font-family: 'Poppins', sans-serif;
  width: 100%;
  max-width: 600px; /* Set a maximum width */
  margin: 20px auto; /* Center the container and add top/bottom margin */
  padding: 20px; /* Add some padding for better spacing */
  box-sizing: border-box; /* Include padding and border in the element's total width and height */
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

h1 {
  font-size: 24px;
  margin-bottom: 20px;
}

.form-container {
  display: block;
  width: 100%; /* Ensure it takes full width of the container */
}

.option-button {
  background-color: #5356FF;
  color: white;
  border: none;
  padding: 12px 16px;
  border-radius: 5px;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin: 10px; /* Add space between buttons */
  display: inline-block;
}

.option-button:hover {
  background-color: #4044C9;
}

/* Media Queries for Responsive Design */
@media (max-width: 960px) {
  .container {
      width: 100%; /* Keep width 100% */
      padding: 10px;
  }

  .option-button {
      font-size: 12px; /* Adjust font size for smaller screens */
      padding: 10px 14px; /* Adjust padding for smaller screens */
  }
}

@media (max-width: 520px) {
  .container {
      width: 100%; /* Keep width 100% */
      padding: 5px;
  }

  h1 {
      font-size: 20px; /* Adjust font size for smaller screens */
  }

  .option-button {
      font-size: 12px; /* Adjust font size for smaller screens */
      padding: 8px 12px; /* Adjust padding for smaller screens */
  }
}

`;

export default GlobalStyle;
