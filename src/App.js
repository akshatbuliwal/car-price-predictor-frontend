import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const BASE_URL = "https://car-price-predictor-zk01.onrender.com";


  const [companies, setCompanies] = useState([]);
  const [modelsByCompany, setModelsByCompany] = useState({});
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [fuelTypes, setFuelTypes] = useState([]);
  const [selectedFuelType, setSelectedFuelType] = useState("");
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [kmsDriven, setKmsDriven] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/options`);
        setCompanies(response.data.companies || []);
        setModelsByCompany(response.data.models_by_company || {});
        setFuelTypes(response.data.fuel_types || []);
        setYears(response.data.years || []);
      } catch (error) {
        console.error("Error fetching dropdown options:", error);
        window.alert("Failed to load dropdowns. Start backend first?");
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, []);

  const handleCompanyChange = (e) => {
    const company = e.target.value;
    setSelectedCompany(company);
    setSelectedModel("");
  };

  const handlePredict = async () => {
    if (!selectedCompany || !selectedModel || !selectedYear || !selectedFuelType || !kmsDriven) {
      return window.alert("Please fill in all fields");
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/predict`,
        {
          company: selectedCompany,
          name: selectedModel,
          year: parseInt(selectedYear),
          fuel_type: selectedFuelType,
          kms_driven: parseInt(kmsDriven),
        },
        { headers: { "Content-Type": "application/json" } }
      );

      setResult(response.data.estimated_price);
    } catch (error) {
      console.error("Prediction failed:", error);
      window.alert("Prediction failed. Check backend console.");
    }
  };

  if (loading) return <h2>Loading options...</h2>;

  return (
    <div className="App">
      <h1>🚗 Car Price Predictor</h1>

      <div className="form-group">
        <label>Company:</label>
        <select value={selectedCompany} onChange={handleCompanyChange}>
          <option value="">Select Company</option>
          {companies.map((company) => (
            <option key={company} value={company}>{company}</option>
          ))}
        </select>
      </div>

      {selectedCompany && (
        <div className="form-group">
          <label>Model:</label>
          <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)}>
            <option value="">Select Model</option>
            {modelsByCompany[selectedCompany]?.map((model) => (
              <option key={model} value={model}>{model}</option>
            ))}
          </select>
        </div>
      )}

      <div className="form-group">
        <label>Year:</label>
        <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
          <option value="">Select Year</option>
          {years.map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Fuel Type:</label>
        <select value={selectedFuelType} onChange={(e) => setSelectedFuelType(e.target.value)}>
          <option value="">Select Fuel Type</option>
          {fuelTypes.map((fuel) => (
            <option key={fuel} value={fuel}>{fuel}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>KMs Driven:</label>
        <input
          type="number"
          placeholder="Enter KMs driven"
          value={kmsDriven}
          onChange={(e) => setKmsDriven(e.target.value)}
        />
      </div>

      <button onClick={handlePredict}>Predict Price</button>

      {result !== null && (
        <h3>Estimated Price: ₹ {result} Lakhs</h3>
      )}
    </div>
  );
}

export default App;
