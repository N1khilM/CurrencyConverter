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

  const currencyCodes = [
    "USD",
    "EUR",
    "GBP",
    "GHS",
    "JPY",
    "CAD",
    "INR",
    "MYR",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Add a function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/convert",
        formData
      );
      setResult(response?.data);
      setError("");
    } catch {
      error;
    }
    {
      setError(
        "Error",
        error?.response ? error?.response?.data : error?.message
      );
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          From:
          <select
            name="from"
            value={formData.from}
            onChange={handleChange}
            className="input"
          >
            <option value="">Select from Currency</option>
            {currencyCodes.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
        </label>
        <label>
          To:
          <select
            name="to"
            value={formData.to}
            onChange={handleChange}
            className="input"
          >
            <option value="">Select to Currency</option>
            {currencyCodes.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
        </label>

        <input
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          placeholder="Amount"
          type="number"
          className="input"
        />

        <button type="submit" className="submit-btn">
          Convert
        </button>
      </form>
      {result && (
        <div className="result">
          <p>
            Converted Amount : {result.convertedAmount} {result.target}
          </p>
          <p>Conversion Rate: {result.conversionRate}</p>
        </div>
      )}

      <section className="additional-info">
        <h1>Why Choose Global Currency Converter?</h1>
        <p>
          Global Currency Converter is a free online tool that allows you to
          convert one currency to another
        </p>
      </section>
    </div>
  );
}

export default App;
