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
  const [error, setError] = useState("");

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error state
    setResult(null); // Clear previous result

    if (!formData.from || !formData.to || !formData.amount) {
      setError("Please fill out all fields before converting.");
      return;
    }

    try {
      const response = await axios.post(
        "https://currencyconverter-d6w2.onrender.com/api/convert",
        formData
      );
      setResult(response?.data);
    } catch (error) {
      setError(
        error?.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
  };

  return (
    <div className="app-container">
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

      {error && <div className="error-message">{error}</div>}
      {result && (
        <div className="result">
          <p>
            Converted Amount: {result.convertedAmount} {result.target}
          </p>
          <p>Conversion Rate: {result.conversionRate}</p>
        </div>
      )}

      <section className="additional-info">
        <h1>Why Choose Global Currency Converter?</h1>
        <p>
          Global Currency Converter is a free online tool that allows you to
          convert one currency to another in real-time with high accuracy.
        </p>
      </section>
    </div>
  );
}

export default App;
