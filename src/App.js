import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const backendURL = "https://car-price-predictor-zk01.onrender.com";

  const [companies, setCompanies] = useState([]);
  const [modelsByCompany, setModelsByCompany] = useState({});
  const [fuelTypes, setFuelTypes] = useState([]);
  const [years, setYears] = useState([]);

  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedFuel, setSelectedFuel] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [kmsDriven, setKmsDriven] = useState("");
  const [predictedPrice, setPredictedPrice] = useState(null);

  // Fetch dropdown data on page load
  useEffect(() => {
    axios.get(`${backendURL}/options`)
      .then(response => {
        setCompanies(response.data.companies);
        setModelsByCompany(response.data.models_by_company);
        setFuelTypes(response.data.fuel_types);
        setYears(response.data.years.reverse()); // show recent years first
      })
      .catch(error => console.error("Error fetching options:", error));
  }, []);

  const handlePredict = () => {
    const payload = {
      company: selectedCompany,
      name: selectedModel,
      fuel_type: selectedFuel,
      year: parseInt(selectedYear),
      kms_driven: parseInt(kmsDriven)
    };

    axios.post(`${backendURL}/predict`, payload)
      .then(response => setPredictedPrice(response.data.predicted_price))
      .catch(error => {
        console.error("Prediction failed:", error);
        setPredictedPrice(null);
      });
  };

  return (
    <div className="App">
      <h1>Car Price Predictor</h1>

      <div className="form-group">
        <label>Company:</label>
        <select value={selectedCompany} onChange={e => {
          setSelectedCompany(e.target.value);
          setSelectedModel(""); // Reset model
        }}>
          <option value="">Select</option>
          {companies.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      <div className="form-group">
        <label>Car Model:</label>
        <select
          value={selectedModel}
          onChange={e => setSelectedModel(e.target.value)}
          disabled={!selectedCompany}
        >
          <option value="">Select</option>
          {selectedCompany && modelsByCompany[selectedCompany]?.map(m => (
            <option key={m}>{m}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Fuel Type:</label>
        <select
          value={selectedFuel}
          onChange={e => setSelectedFuel(e.target.value)}
        >
          <option value="">Select</option>
          {fuelTypes.map(f => <option key={f}>{f}</option>)}
        </select>
      </div>

      <div className="form-group">
        <label>Year:</label>
        <select
          value={selectedYear}
          onChange={e => setSelectedYear(e.target.value)}
        >
          <option value="">Select</option>
          {years.map(y => <option key={y}>{y}</option>)}
        </select>
      </div>

      <div className="form-group">
        <label>Kilometers Driven:</label>
        <input
          type="number"
          value={kmsDriven}
          onChange={e => setKmsDriven(e.target.value)}
        />
      </div>

      <button onClick={handlePredict}>Predict Price</button>

      {predictedPrice !== null && (
        <div className="result">
          <h2>Predicted Price: ₹{predictedPrice.toLocaleString()}</h2>
        </div>
      )}
    </div>
  );
}

export default App;
