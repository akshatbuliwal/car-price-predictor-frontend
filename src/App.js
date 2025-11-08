import React, { useEffect, useState } from "react";
import axios from "axios";
// Using Tailwind CSS for all styling, so we remove external CSS import.

// Custom Modal component to replace window.alert
const AlertModal = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 p-6 rounded-xl shadow-2xl max-w-sm w-full transform transition-all duration-300 scale-100 border border-red-600">
        <h3 className="text-xl font-bold text-red-400 mb-4">Input Required</h3>
        <p className="text-gray-200 mb-6">{message}</p>
        <button
          onClick={onClose}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition duration-150 shadow-md"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};

// Reusable Dropdown Component for cleaner JSX
const Dropdown = ({ label, value, onChange, options, defaultText }) => (
  <div className="flex flex-col space-y-3">
    <label className="text-lg font-medium text-gray-300">{label}</label>
    <select
      value={value}
      onChange={onChange}
      className="px-5 py-3 border border-gray-600 bg-gray-700 text-white rounded-xl focus:ring-indigo-500 focus:border-indigo-500 appearance-none transition duration-150 shadow-md text-base"
    >
      <option value="" disabled>
        {defaultText}
      </option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);


// Main App Component
const App = () => {
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
  const [errorModalMessage, setErrorModalMessage] = useState("");
  const [isPredicting, setIsPredicting] = useState(false);

  const BASE_URL = "https://car-price-predictor-zk01.onrender.com";

  // --- API Fetch for Dropdowns ---
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/options`);

        // Data sanitization and null checks
        setCompanies(Array.isArray(response.data.companies) ? response.data.companies : []);
        setModelsByCompany(response.data.models_by_company || {});
        setFuelTypes(Array.isArray(response.data.fuel_types) ? response.data.fuel_types : []);
        setYears(Array.isArray(response.data.years) ? response.data.years : []);
      } catch (error) {
        console.error("❌ Error fetching dropdown options:", error);
        setErrorModalMessage("Failed to load car data. Please ensure the backend server is running.");
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, []);

  const handleCompanyChange = (e) => {
    const company = e.target.value.trim();
    setSelectedCompany(company);
    setSelectedModel(""); // reset model when company changes
    setResult(null); // Clear previous result
  };

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    setResult(null); // Clear previous result on any input change
  };

  // --- API Call for Prediction ---
  const handlePredict = async () => {
    if (!selectedCompany || !selectedModel || !selectedYear || !selectedFuelType || !kmsDriven) {
      setErrorModalMessage("Please select a value for all fields before predicting.");
      return;
    }

    setIsPredicting(true);
    setResult(null);

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

      // Extract the price, ensuring it handles potential data format issues
      const estimatedPrice = response.data.estimated_price || 'N/A';
      setResult(estimatedPrice);
    } catch (error) {
      console.error("❌ Prediction failed:", error);
      setErrorModalMessage("Prediction failed. Please check your inputs or backend API response.");
    } finally {
      setIsPredicting(false);
    }
  };

  // --- Loading State UI ---
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
        <div className="text-center p-8 bg-gray-800 shadow-xl rounded-2xl border border-gray-700">
          <svg className="animate-spin h-8 w-8 text-indigo-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <h2 className="text-xl font-semibold text-gray-300">Loading Car Options...</h2>
          <p className="text-sm text-gray-400 mt-1">Fetching data from backend at: {BASE_URL}</p>
        </div>
      </div>
    );
  }

  // --- Main Application UI ---
  return (
    <div className="min-h-screen bg-gray-900 flex items-start justify-center p-4 sm:p-8 font-sans">
      <AlertModal message={errorModalMessage} onClose={() => setErrorModalMessage("")} />

      <div className="w-full max-w-xl bg-gray-800 p-8 sm:p-12 mt-10 rounded-3xl shadow-2xl border border-gray-700">

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center text-white mb-10 flex items-center justify-center">
          <span role="img" aria-label="car" className="mr-4 text-5xl">🚗</span>
          Car Price Predictor
        </h1>

        {/* Form Grid with increased spacing */}
        <div className="grid grid-cols-1 gap-8">

          {/* Company Dropdown */}
          <Dropdown
            label="Manufacturer"
            value={selectedCompany}
            onChange={handleCompanyChange}
            options={companies}
            defaultText="Select Company"
          />

          {/* Model Dropdown */}
          {selectedCompany && (
            <Dropdown
              label="Model"
              value={selectedModel}
              onChange={handleInputChange(setSelectedModel)}
              options={modelsByCompany[selectedCompany] || []}
              defaultText="Select Model"
            />
          )}

          {/* Year Dropdown */}
          <Dropdown
            label="Registration Year"
            value={selectedYear}
            onChange={handleInputChange(setSelectedYear)}
            options={years}
            defaultText="Select Year"
          />

          {/* Fuel Type Dropdown */}
          <Dropdown
            label="Fuel Type"
            value={selectedFuelType}
            onChange={handleInputChange(setSelectedFuelType)}
            options={fuelTypes}
            defaultText="Select Fuel Type"
          />

          {/* KMs Driven Input */}
          <div className="flex flex-col space-y-3">
            <label className="text-lg font-medium text-gray-300">KMs Driven (in km)</label>
            <input
              type="number"
              placeholder="e.g., 50,000"
              value={kmsDriven}
              onChange={handleInputChange(setKmsDriven)}
              className="px-5 py-3 border border-gray-600 bg-gray-700 text-white rounded-xl focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 shadow-md text-base"
            />
          </div>

        </div>

        {/* Predict Button (Bigger) */}
        <button
          onClick={handlePredict}
          disabled={isPredicting}
          className={`w-full mt-12 py-4 rounded-xl font-bold text-xl transition duration-300 transform hover:scale-[1.01] shadow-2xl ${
            isPredicting
              ? 'bg-gray-600 text-gray-300 cursor-not-allowed flex items-center justify-center'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white'
          }`}
        >
          {isPredicting ? (
            <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                PREDICTING PRICE...
            </div>
          ) : (
            'PREDICT PRICE'
          )}
        </button>

        {/* Result Display (Bigger) */}
        {result !== null && (
          <div className="mt-10 p-8 bg-green-900 border-l-8 border-green-500 rounded-xl shadow-xl">
            <h3 className="text-xl font-bold text-green-300 flex items-center">
              <span className="mr-3 text-3xl">💰</span> ESTIMATED PRICE:
            </h3>
            <p className="text-5xl font-extrabold text-green-400 mt-3 tracking-wider">
              ₹ {result} Lakhs
            </p>
            <p className="text-sm text-green-400 opacity-80 mt-4">
              This price is generated by the machine learning model on your backend.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;