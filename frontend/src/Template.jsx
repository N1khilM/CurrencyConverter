import { useState } from "react";
import axios from "axios";
import "./CurrencyConverter.css";

function App() {
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    amount: "",
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const currencyCodes = ["USD", "EUR", "GBP", "GHS", "JPY", "CAD"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Add a function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Call API to convert currency here
    axios
      .post("/convert", formData)
      .then((response) => {
        setResult(response.data.result);
        setError(null);
      })
      .catch((error) => {
        setError(error.message);
        setResult(null);
      });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          From:
          <select name="from" value={formData.from} onChange={handleChange}>
            {currencyCodes.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
        </label>
        <label>
          To:
          <select name="to" value={formData.to} onChange={handleChange}>
            {currencyCodes.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
        </label>
        <label>
          Amount:
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Convert</button>
      </form>
      {result && <p>Result: {result}</p>}
      {error && <p>Error: {error}</p>}
    </div>
  );
}

export default App;
