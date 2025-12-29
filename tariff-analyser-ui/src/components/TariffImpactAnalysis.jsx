import React, { useEffect, useState, useCallback } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import API from "../api";
import "../App.css";

const YEARS = [2021, 2022, 2023, 2024, 2025];
const MODEL_TYPES = ["Advanced", "Moderate", "Basic"];
const PERIODS = ["Pre-Trump", "Trump Era", "Current"];
const PIE_COLORS = ["#2563eb", "#f97316", "#22c55e", "#a855f7"];

const TariffImpactAnalysis = () => {
  const [industryOptions, setIndustryOptions] = useState([]);
  const [subIndustryOptions, setSubIndustryOptions] = useState([]);
  const [countryOptions, setCountryOptions] = useState([]);
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [tariffRows, setTariffRows] = useState([]);

  const [filters, setFilters] = useState({
    year: "",
    productCategoryId: "",
    subcategoryId: "",
    originCountryCode: "",
    destinationCountryCode: "",
    currencyCode: "",
    modelType: "",
    period: "Pre-Trump",
    minTaxRate: 0,
    maxTaxRate: 100,
  });

  const [viewImpactFor, setViewImpactFor] = useState("Buyer");
  const [barData, setBarData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [summaryData, setSummaryData] = useState(null);
  const [loadingDropdowns, setLoadingDropdowns] = useState(false);
  const [loadingCharts, setLoadingCharts] = useState(false);
  const [error, setError] = useState("");

  // 🔥 FIXED: Buyer/Seller swaps countries & recalculates EVERY TIME
  const buildChartFromTariff = useCallback(() => {
    console.log("🔥🔥 RECALCULATING - View:", viewImpactFor, "Filters:", filters);
    
    if (!tariffRows || tariffRows.length === 0) {
      console.log("No tariff data");
      return;
    }

    // 🔥 BUYER/SELLER: DYNAMICALLY SWAP COUNTRIES
    let searchOrigin, searchDestination;
    
    if (viewImpactFor === "Buyer") {
      // Buyer: Normal Origin → Destination (import)
      searchOrigin = filters.originCountryCode;
      searchDestination = filters.destinationCountryCode;
      console.log("📦 BUYER MODE: Searching", searchOrigin, "→", searchDestination);
    } else {
      // Seller: SWAP Destination → Origin (export)
      searchOrigin = filters.destinationCountryCode;
      searchDestination = filters.originCountryCode;
      console.log("📤 SELLER MODE: SWAPPED", searchOrigin, "→", searchDestination);
    }

    // 🔥 FIND EXACT MATCH with swapped countries
    let selectedRow = null;
    let bestMatchCount = 0;
    
    for (let row of tariffRows) {
      let matchCount = 0;
      
      // Count matches
      if (!filters.productCategoryId || row["Product Category"] === filters.productCategoryId) matchCount++;
      if (!filters.subcategoryId || row["Subcategory"] === filters.subcategoryId) matchCount++;
      if (!filters.year || !row.Year || Number(row.Year) === Number(filters.year)) matchCount++;
      if (!searchOrigin || row["Origin Country"] === searchOrigin) matchCount++;
      if (!searchDestination || row["Destination Country"] === searchDestination) matchCount++;
      
      // Duty rate filter
      const dutyRate = Number(row["Duty Rate (%)"] || row["Duty Rate"] || row["duty rate"] || row["duty_rate"] || 0);
      if (dutyRate < Number(filters.minTaxRate) || dutyRate > Number(filters.maxTaxRate)) continue;
      
      if (matchCount > bestMatchCount) {
        bestMatchCount = matchCount;
        selectedRow = row;
      }
    }

    // 🔥 FALLBACK if no perfect match
    if (!selectedRow) {
      for (let row of tariffRows) {
        const dutyRate = Number(row["Duty Rate (%)"] || row["Duty Rate"] || row["duty rate"] || row["duty_rate"] || 0);
        if (dutyRate > 0) {
          selectedRow = row;
          break;
        }
      }
    }

    if (!selectedRow) selectedRow = tariffRows[0];

    const dutyRate = Number(
      selectedRow["Duty Rate (%)"] || 
      selectedRow["Duty Rate"] || 
      selectedRow["duty rate"] || 
      selectedRow["duty_rate"] || 
      25
    );

    // 🔥 SHOW EXACT ROUTE USED
    const route = `${selectedRow["Origin Country"] || '?'} → ${selectedRow["Destination Country"] || '?'}`;
    const dataSource = `${viewImpactFor}: ${selectedRow["Product Category"] || 'Unknown'} / ${selectedRow["Subcategory"] || 'N/A'} (${dutyRate}%) | ${route}`;

    console.log("✅ ✅ SELECTED ROW:", dataSource, "| Matches:", bestMatchCount);

    // 🔥 GENERATE CHARTS
    const shipmentValue = 100000;
    
    let preTrumpMultiplier = 0.5;
    let currentMultiplier = 0.8;
    
    if (filters.modelType === "Advanced") {
      preTrumpMultiplier = 0.4;
      currentMultiplier = 0.75;
    } else if (filters.modelType === "Moderate") {
      preTrumpMultiplier = 0.45;
      currentMultiplier = 0.85;
    }

    const preTrumpRate = dutyRate * preTrumpMultiplier;
    const trumpRate = dutyRate;
    const currentRate = dutyRate * currentMultiplier;

    const barChartData = [
      { period: "Pre-Trump", "Duty Rate": preTrumpRate, "Additional Cost": (shipmentValue * preTrumpRate) / 100 },
      { period: "Trump Era", "Duty Rate": trumpRate, "Additional Cost": (shipmentValue * trumpRate) / 100 },
      { period: "Current", "Duty Rate": currentRate, "Additional Cost": (shipmentValue * currentRate) / 100 },
    ];

    const baseTariff = (shipmentValue * trumpRate) / 100;
    const antiDumping = baseTariff * 0.3;
    const countervailing = baseTariff * 0.2;
    const section301 = baseTariff * 0.36;

    const pieChartData = [
      { name: "Base Tariff", value: baseTariff },
      { name: "Anti-Dumping Duty", value: antiDumping },
      { name: "Countervailing Duty", value: countervailing },
      { name: "Section 301 Tariff", value: section301 },
    ];

    const summary = {
      baseTariff: baseTariff.toFixed(2),
      antiDumping: antiDumping.toFixed(2),
      countervailing: countervailing.toFixed(2),
      section301: section301.toFixed(2),
      totalDutyCost: (baseTariff + antiDumping + countervailing + section301).toFixed(2),
      dutyRate: dutyRate.toFixed(2),
      dataSource,
      currency: filters.currencyCode || "USD",
      modelType: filters.modelType || "Basic",
      viewImpactFor,
      route,
      shipmentValue: shipmentValue.toLocaleString(),
    };

    // 🔥 FORCE CHART UPDATE
    setBarData(barChartData);
    setPieData(pieChartData);
    setSummaryData(summary);
    
    console.log("✅ ✅ CHARTS CHANGED -", viewImpactFor, "MODE | Duty Rate:", dutyRate, "%");
  }, [tariffRows, filters, viewImpactFor]);

  // 🔥 LOAD DATA (unchanged)
  useEffect(() => {
    const loadData = async () => {
      setLoadingDropdowns(true);
      try {
        const [tariffRes, currencyRes] = await Promise.all([
          API.get("/api/impact-analysis/tariff"),
          API.get("/api/impact-analysis/currency"),
        ]);

        const rows = tariffRes.data?.data || [];
        console.log("✅ Loaded", rows.length, "tariff rows");
        setTariffRows(rows);

        const categories = Array.from(new Set(rows.map(r => r["Product Category"]))).filter(Boolean);
        setIndustryOptions(categories.map(pc => ({ productCategory: pc })));

        if (categories.length > 0) {
          const firstPC = categories[0];
          const firstSubcats = Array.from(new Set(
            rows.filter(r => r["Product Category"] === firstPC).map(r => r["Subcategory"])
          )).filter(Boolean);
          setSubIndustryOptions(firstSubcats.map(sc => ({ subcategory: sc })));
          
          setFilters(prev => ({
            ...prev,
            productCategoryId: firstPC,
            subcategoryId: firstSubcats[0] || "",
          }));
        }

        const currencies = (currencyRes.data?.data || []).map((r, idx) => ({
          id: idx,
          code: r["ISO 4217 Code"],
          label: `${r["ISO 4217 Code"]} - ${r["Currency"] || ""}`,
        }));
        setCurrencyOptions(currencies);
        if (currencies[0]) setFilters(prev => ({ ...prev, currencyCode: currencies[0].code }));

        setFilters(prev => ({ ...prev, modelType: "Advanced" }));

      } catch (e) {
        console.error("Load error:", e);
        setError("Failed to load data");
      } finally {
        setLoadingDropdowns(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const loadCountries = async () => {
      try {
        const res = await API.get("/api/impact-analysis/duty-type");
        const rows = res.data?.data || [];
        const countries = Array.from(new Set(
          rows.slice(1).flatMap(r => 
            ["column 2 duty", "Genaral duty", "special duty"]
              .map(key => r[key])
              .filter(v => v && String(v).toLowerCase() !== "country")
              .map(v => String(v).trim())
          )
        )).sort().map((name, idx) => ({ id: idx, name }));
        setCountryOptions(countries);
      } catch (e) {
        console.error("Countries error:", e);
      }
    };
    loadCountries();
  }, []);

  useEffect(() => {
    if (!filters.productCategoryId || !tariffRows.length) return;
    
    const subs = Array.from(new Set(
      tariffRows
        .filter(r => r["Product Category"] === filters.productCategoryId)
        .map(r => r["Subcategory"])
        .filter(Boolean)
    )).map(sc => ({ subcategory: sc }));
    
    setSubIndustryOptions(subs);
    setFilters(prev => ({ ...prev, subcategoryId: subs[0]?.subcategory || "" }));
  }, [filters.productCategoryId, tariffRows]);

  // 🔥 CHARTS UPDATE ON ANY CHANGE
  useEffect(() => {
    if (tariffRows.length > 0 && !loadingDropdowns) {
      buildChartFromTariff();
    }
  }, [filters, tariffRows.length, viewImpactFor, buildChartFromTariff]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log("🔄 INPUT:", name, "=", value);
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleRunAnalysis = () => {
    console.log("🔥 REFRESH -", viewImpactFor);
    buildChartFromTariff();
  };

  return (
    <div className="tia-page">
      {error && <div className="error">{error}</div>}

      <div className="tia-card tia-card-filters">
        <div className="tia-filters-grid">
          <div className="tia-field">
            <label>Year</label>
            <select name="year" value={filters.year} onChange={handleChange}>
              <option value="">Any</option>
              {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>

          <div className="tia-field">
            <label>Product Category</label>
            <select name="productCategoryId" value={filters.productCategoryId} onChange={handleChange}>
              <option value="">Any</option>
              {industryOptions.map((i, idx) => (
                <option key={idx} value={i.productCategory}>{i.productCategory}</option>
              ))}
            </select>
          </div>

          <div className="tia-field">
            <label>Subcategory</label>
            <select name="subcategoryId" value={filters.subcategoryId} onChange={handleChange}>
              <option value="">Any</option>
              {subIndustryOptions.map((s, idx) => (
                <option key={idx} value={s.subcategory}>{s.subcategory}</option>
              ))}
            </select>
          </div>

          <div className="tia-field">
            <label>Period Selection</label>
            <select name="period" value={filters.period} onChange={handleChange}>
              {PERIODS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          <div className="tia-field">
            <label>Origin Country</label>
            <select name="originCountryCode" value={filters.originCountryCode} onChange={handleChange}>
              <option value="">Any</option>
              {countryOptions.map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="tia-field">
            <label>Destination Country</label>
            <select name="destinationCountryCode" value={filters.destinationCountryCode} onChange={handleChange}>
              <option value="">Any</option>
              {countryOptions.map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="tia-field">
            <label>Currency</label>
            <select name="currencyCode" value={filters.currencyCode} onChange={handleChange}>
              {currencyOptions.map(c => (
                <option key={c.id} value={c.code}>{c.label}</option>
              ))}
            </select>
          </div>

          <div className="tia-field">
            <label>Model Type</label>
            <select name="modelType" value={filters.modelType} onChange={handleChange}>
              {MODEL_TYPES.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          <div className="tia-field">
            <label>Min Tax Rate (%)</label>
            <input type="number" name="minTaxRate" min={0} max={100} value={filters.minTaxRate} onChange={handleChange} />
          </div>

          <div className="tia-field">
            <label>Max Tax Rate (%)</label>
            <input type="number" name="maxTaxRate" min={0} max={100} value={filters.maxTaxRate} onChange={handleChange} />
          </div>
        </div>

        <div className="tia-actions-row">
          <button className="primary-button" onClick={handleRunAnalysis} disabled={loadingDropdowns}>
            {loadingDropdowns ? "Loading..." : "🔄 Refresh Analysis"}
          </button>
        </div>
      </div>

      {/* 🔥 BUYER/SELLER - NOW FULLY FUNCTIONAL */}
      <div className="tia-card">
        <h3>Impact Configuration</h3>
        <div className="tia-toggle-row">
          <span>View Impact For:</span>
          <button 
            className={viewImpactFor === "Buyer" ? "toggle-button active" : "toggle-button"} 
            onClick={() => {
              console.log("🔄 → BUYER MODE");
              setViewImpactFor("Buyer");
              buildChartFromTariff(); // 🔥 IMMEDIATE RECALC
            }}
            style={{marginRight: '8px'}}
          >
            Buyer
          </button>
          <button 
            className={viewImpactFor === "Seller" ? "toggle-button active" : "toggle-button"} 
            onClick={() => {
              console.log("🔄 → SELLER MODE");  
              setViewImpactFor("Seller");
              buildChartFromTariff(); // 🔥 IMMEDIATE RECALC
            }}
          >
            Seller
          </button>
        </div>
        <div style={{fontSize: '12px', color: '#666', marginTop: '8px'}}>
          {viewImpactFor === "Buyer" 
            ? `📦 BUYER: ${filters.originCountryCode || '?'} → ${filters.destinationCountryCode || '?'}`
            : `📤 SELLER: ${filters.destinationCountryCode || '?'} → ${filters.originCountryCode || '?'}`}
        </div>
      </div>

      <div className="tia-card">
        <h3>Tariff Impact ({filters.productCategoryId || 'All'})</h3>
        {barData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <XAxis dataKey="period" />
              <YAxis yAxisId="left" orientation="left" stroke="#2563eb" tickFormatter={v => `${v.toFixed(1)}%`} />
              <YAxis yAxisId="right" orientation="right" stroke="#f97316" tickFormatter={v => `$${v.toLocaleString()}`} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Duty Rate" name="Duty Rate %" fill="#2563eb" yAxisId="left" />
              <Bar dataKey="Additional Cost" name="Additional Cost $" fill="#f97316" yAxisId="right" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="no-data" style={{padding: '40px', textAlign: 'center'}}>
            Loading charts...
          </div>
        )}
      </div>

      <div className="tia-card tia-chart-row">
        <div className="tia-chart-left">
          <h3>Duty Cost Breakdown</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={90} label>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="no-data">Waiting...</div>
          )}
        </div>

        <div className="tia-chart-right">
          <h3>Cost Summary ({summaryData?.shipmentValue} {summaryData?.currency})</h3>
          {summaryData ? (
            <ul className="tia-summary-list">
              <li><span>Duty Rate</span><span>{summaryData.dutyRate}%</span></li>
              <li><span>Base Tariff</span><span>${summaryData.baseTariff}</span></li>
              <li><span>Anti-Dumping</span><span>${summaryData.antiDumping}</span></li>
              <li><span>Countervailing</span><span>${summaryData.countervailing}</span></li>
              <li><span>Section 301</span><span>${summaryData.section301}</span></li>
              <li className="tia-summary-total">
                <span>Total Duty</span><span>${summaryData.totalDutyCost}</span>
              </li>
              <li><span>View:</span><span>{summaryData.viewImpactFor}</span></li>
              <li style={{fontSize: '11px', color: '#666'}}>
                <span>{summaryData.route}</span>
              </li>
            </ul>
          ) : (
            <div className="no-data">Summary loading...</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TariffImpactAnalysis;