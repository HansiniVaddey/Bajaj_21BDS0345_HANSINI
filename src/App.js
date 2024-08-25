import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; // Import the CSS file

function App() {
  const [jsonInput, setJsonInput] = useState('');
  const [responseData, setResponseData] = useState(null);
  const [options, setOptions] = useState([]);
  const [error, setError] = useState('');

  const handleJsonChange = (event) => {
    setJsonInput(event.target.value);
  };

  const handleOptionsChange = (event) => {
    const selectedOptions = Array.from(
      event.target.selectedOptions,
      (option) => option.value
    );
    setOptions(selectedOptions);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(''); // Reset error
    setResponseData(null); // Reset previous response

    try {
      const parsedJson = JSON.parse(jsonInput);

      // Validate that the JSON contains the expected "data" key
      if (!parsedJson.data || !Array.isArray(parsedJson.data)) {
        setError("JSON must contain a 'data' array.");
        return;
      }

      // Use the environment variable for the API URL
      const response = await axios.post(process.env.REACT_APP_API_URL, parsedJson);
      setResponseData(response.data);
    } catch (error) {
      setError('Invalid JSON input');
    }
  };

  const fetchOperationCode = async () => {
    try {
      const response = await axios.get(process.env.REACT_APP_API_URL);
      alert(`Operation Code: ${response.data.operation_code}`);
    } catch (error) {
      alert('Failed to fetch operation code');
    }
  };

  const renderResponse = () => {
    if (!responseData) return null;

    let filteredData = responseData;

    if (options.includes('Alphabets')) {
      filteredData = {
        ...filteredData,
        numbers: [],
      };
    }

    if (options.includes('Numbers')) {
      filteredData = {
        ...filteredData,
        alphabets: [],
      };
    }

    if (!options.includes('Highest lowercase alphabet')) {
      filteredData = {
        ...filteredData,
        highest_lowercase_alphabet: [],
      };
    }

    return (
      <pre className="response">
        {JSON.stringify(filteredData, null, 2)}
      </pre>
    );
  };

  return (
    <div className="App">
      <h1>BFHL Frontend Application</h1>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <textarea
            value={jsonInput}
            onChange={handleJsonChange}
            placeholder='Enter JSON input'
            rows='5'
            cols='50'
            className="json-input"
          />
          <br />
          <button type='submit' className="submit-button">Submit</button>
        </form>
        {error && <p className="error-message">{error}</p>}
        {responseData && (
          <>
            <label htmlFor='options' className="dropdown-label">Select Options: </label>
            <select id='options' multiple onChange={handleOptionsChange} className="dropdown">
              <option value='Alphabets'>Alphabets</option>
              <option value='Numbers'>Numbers</option>
              <option value='Highest lowercase alphabet'>
                Highest lowercase alphabet
              </option>
            </select>
            {renderResponse()}
          </>
        )}
        <button onClick={fetchOperationCode} className="operation-button">Get Operation Code</button>
      </div>
    </div>
  );
}

export default App;
