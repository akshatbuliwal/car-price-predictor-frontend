import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const backendURL = "https://car-price-predictor-zk01.onrender.com";

function App() {
  const [companies, setCompanies] = useState([]);
  const [modelsByCompany, setModelsByCompany] = useState({});
  const [models, setModels] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [year, setYear] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [kmsDriven, setKmsDriven] = useState("");
  const [fuelTypes, setFuelTypes] = useState([]);
  const [years, setYears] = useState([]);
  const [predictedPrice, setPredictedPrice] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`${backendURL}/options`)
      .then((res) => {
        setCompanies(res.data.companies);
        setModelsByCompany(res.data.models_by_company);
        setFuelTypes(res.data.fuel_types);
        setYears(res.data.years);
      })
      .catch((err) => {
        console.error("Error fetching options:", err);
        setError("Failed to fetch dropdown options.");
      });
  }, []);

  useEffect(() => {
    if (selectedCompany && modelsByCompany[selectedCompany]) {
      setModels(modelsByCompany[selectedCompany]);
    } else {
      setModels([]);
    }
  }, [selectedCompany, modelsByCompany]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPredictedPrice(null);
    setError("");

    try {
      const response = await axios.post(`${backendURL}/predict`, {
        company: selectedCompany,
        name: selectedModel,
        year: year,
        fuel_type: fuelType,
        kms_driven: kmsDriven,
      });

      setPredictedPrice(response.data.estimated_price);
    } catch (err) {
      console.error("Prediction error:", err.response?.data || err.message);
      setError(err.response?.data?.error || "Prediction failed.");
    }
  };

  return (
    <div className="App">
      <h1>🚗 Car Price Predictor</h1>

      <form onSubmit={handleSubmit}>
        <select value={selectedCompany} onChange={(e) => setSelectedCompany(e.target.value)} required>
          <option value="">Select Company</option>
          {companies.map((company) => (
            <option key={company} value={company}>{company}</option>
          ))}
        </select>

        <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)} required>
          <option value="">Select Model</option>
          {models.map((model) => (
            <option key={model} value={model}>{model}</option>
          ))}
        </select>

        <select value={year} onChange={(e) => setYear(e.target.value)} required>
          <option value="">Select Year</option>
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>

        <select value={fuelType} onChange={(e) => setFuelType(e.target.value)} required>
          <option value="">Select Fuel Type</option>
          {fuelTypes.map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>

        <input
          type="number"
          placeholder="KMs Driven"
          value={kmsDriven}
          onChange={(e) => setKmsDriven(e.target.value)}
          required
        />

        <button type="submit">Predict Price</button>
      </form>

      {predictedPrice !== null && (
        <h2>Estimated Price: ₹ {predictedPrice} Lakh</h2>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default App;
