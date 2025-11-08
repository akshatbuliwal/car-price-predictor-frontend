import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
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

  const BASE_URL = "https://car-price-predictor-zk01.onrender.com";


  const BASE_URL = "https://car-price-predictor-zk01.onrender.com";


  useEffect(() => {
<<<<<<< HEAD
    axios
      .get(`${BASE_URL}/options`)
      .then((response) => {
        setCompanies(response.data.companies);
        setModelsByCompany(response.data.models_by_company);
        setFuelTypes(response.data.fuel_types);
        setYears(response.data.years);
      })
      .catch((error) => {
        console.error("Error fetching dropdown options:", error);
        alert("Failed to load dropdowns. Is the backend awake?");
      });
=======
    // Fetch dropdown options from backend
    const fetchOptions = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/options`);
        console.log("✅ Dropdown data received:", response.data);

        setCompanies(response.data.companies || []);
        setModelsByCompany(response.data.models_by_company || {});
        setFuelTypes(response.data.fuel_types || []);
        setYears(response.data.years || []);
      } catch (error) {
        console.error("❌ Error fetching dropdown options:", error);
        alert("Failed to load dropdowns. Is the backend awake?");
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
>>>>>>> b75c482 (Fix dropdown and API integration)
  }, []);

  const handleCompanyChange = (e) => {
    const company = e.target.value.trim();
    setSelectedCompany(company);
    setSelectedModel(""); // reset model
  };

<<<<<<< HEAD
  const handlePredict = () => {
    if (
      !selectedCompany ||
      !selectedModel ||
      !selectedYear ||
      !selectedFuelType ||
      !kmsDriven
    ) {
=======
  const handlePredict = async () => {
    if (!selectedCompany || !selectedModel || !selectedYear || !selectedFuelType || !kmsDriven) {
>>>>>>> b75c482 (Fix dropdown and API integration)
      alert("Please fill in all fields.");
      return;
    }

<<<<<<< HEAD
    axios
      .post(
=======
    try {
      const response = await axios.post(
>>>>>>> b75c482 (Fix dropdown and API integration)
        `${BASE_URL}/predict`,
        {
          company: selectedCompany,
          name: selectedModel,
          year: parseInt(selectedYear),
          fuel_type: selectedFuelType,
          kms_driven: parseInt(kmsDriven),
        },
<<<<<<< HEAD
        {
          headers: { "Content-Type": "application/json" },
        }
      )
      .then((response) => {
        setResult(response.data.estimated_price);
      })
      .catch((error) => {
        console.error("Prediction failed:", error);
        alert("Prediction failed. Please check your inputs or try again.");
      });
=======
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("✅ Prediction response:", response.data);
      setResult(response.data.estimated_price);
    } catch (error) {
      console.error("❌ Prediction failed:", error);
      alert("Prediction failed. Please check your inputs or try again.");
    }
>>>>>>> b75c482 (Fix dropdown and API integration)
  };

  if (loading) {
    return <p>Loading dropdowns...</p>;
  }

  return (
    <div className="App">
      <h1>🚗 Car Price Predictor</h1>

      {/* Company Dropdown */}
      <div className="form-group">
        <label>Company:</label>
        <select value={selectedCompany} onChange={handleCompanyChange}>
          <option value="">Select Company</option>
          {companies.map((company) => (
            <option key={company} value={company}>
              {company}
            </option>
          ))}
        </select>
      </div>

      {/* Model Dropdown */}
      {selectedCompany && (
        <div className="form-group">
          <label>Model:</label>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
          >
            <option value="">Select Model</option>
            {modelsByCompany[selectedCompany]?.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Year Dropdown */}
      <div className="form-group">
        <label>Year:</label>
        <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
          <option value="">Select Year</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* Fuel Type Dropdown */}
      <div className="form-group">
        <label>Fuel Type:</label>
        <select value={selectedFuelType} onChange={(e) => setSelectedFuelType(e.target.value)}>
          <option value="">Select Fuel Type</option>
          {fuelTypes.map((fuel) => (
            <option key={fuel} value={fuel}>
              {fuel}
            </option>
          ))}
        </select>
      </div>

      {/* KMs Driven Input */}
      <div className="form-group">
        <label>KMs Driven:</label>
        <input
          type="number"
          placeholder="Enter KMs driven"
          value={kmsDriven}
          onChange={(e) => setKmsDriven(e.target.value)}
        />
      </div>

      {/* Predict Button */}
      <button onClick={handlePredict}>Predict Price</button>

      {/* Result Display */}
      {result !== null && (
        <h3 style={{ marginTop: "20px" }}>
          Estimated Price: ₹ {result} Lakhs
        </h3>
      )}
    </div>
  );
}

export default App;
