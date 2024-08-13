import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`

.form-container {
    margin: 20px;
  }
  
  .form-container input,
  .form-container textarea,
  .form-container select {
    width: 100%;
    max-width: 500px; /* Set a consistent max width */
    padding: 8px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box; /* Include padding and border in the width */
    font-family: 'Poppins', sans-serif; /* Set the desired font */
    color: #333; /* Set the desired text color */
  }
  
  form fieldset {
    margin-bottom: 20px;
    padding: 20px;
    border: 1px solid #ccc;
  }
  
  form legend {
    font-weight: bold;
    margin-bottom: 10px;
  }
  
  form label {
    display: block;
    margin-bottom: 5px;
    text-align: left; /* Align labels to the left */
    font-family: 'Poppins', sans-serif; /* Set the desired font */
    color: #333; /* Set the desired text color */
  }
  
  form input,
  form select {
    width: 100%;
    max-width: 420px; /* Ensure all input elements have the same max width */
    padding: 8px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box; /* Include padding and border in the width */
    font-family: 'Poppins', sans-serif; /* Set the desired font */
    color: #333; /* Set the desired text color */
  }
  
  button.save-config-button,
  button.go-back-button {
    padding: 10px 20px;
    margin-right: 10px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  button.save-config-button {
    background-color: #4CAF50;
    color: white;
  }
  
  h2 {
    text-align: center;
    margin-bottom: 20px;
  }
  
  h3 {
    text-align: center;
    margin-bottom: 40px;
    margin-top: 20px;
  }
  
  .age-range-container {
    display: flex;
    align-items: center;
  }
  
  .age-range-separator {
    margin: 0 10px;
    font-size: 0.9em;
  }
  
  textarea {
    width: 100%;
    max-width: 420px; /* Ensure textarea also has the same max width */
    padding: 8px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box; /* Include padding and border in the width */
    font-family: 'Poppins', sans-serif; /* Set the desired font */
    color: #333; /* Set the desired text color */
  }
  
  /* Selector for the labels and textareas of Primary Text, Headline, and Description */
  label[for="ad_creative_primary_text"], 
  #ad_creative_primary_text,
  label[for="ad_creative_headline"], 
  #ad_creative_headline,
  label[for="ad_creative_description"], 
  #ad_creative_description {
    /* Your styles here */
    max-width: 420px;
  }

  .button {
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

.manual-options {
    display: flex;
    flex-direction: column;
}

.manual-options .option-container {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
}

.manual-options input[type="checkbox"] {
    margin-right: 10px;
}

.manual-options h4 {
    font-weight: bold;
    margin-top: 20px;
    margin-bottom: 10px;
}

/* styles.css */
.MuiCheckbox-root {
  color: #5356FF;
}

.MuiCheckbox-root.Mui-checked {
  color: #5356FF !important;
}

  `;

  export default GlobalStyle;
  