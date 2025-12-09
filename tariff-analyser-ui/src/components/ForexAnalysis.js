// src/components/ForexAnalysis.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "../App.css";

const API_BASE = "http://localhost:5000";

function ForexAnalysis() {
  const [currencies, setCurrencies] = useState({});
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState(1000);
  const [year, setYear] = useState(2024);

  const [rate, setRate] = useState(null);
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [date, setDate] = useState(null);

  const [history, setHistory] = useState([]);
  const [volatilityPercent, setVolatilityPercent] = useState(null);
  const [volatilityLabel, setVolatilityLabel] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // load currency list from backend
  useEffect(() => {
    async function loadCurrencies() {
      try {
        const res = await axios.get(`${API_BASE}/api/forex/currencies`);
        const list = res.data.currencies || {};
        setCurrencies(list);

        if (!from && list.USD) setFrom("USD");
        if (!to && list.EUR) setTo("EUR");
      } catch (err) {
        console.error(err);
        setError("Failed to load currencies");
      }
    }
    loadCurrencies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // analyze forex via /api/forex/analyze
  const handleAnalyze = async () => {
    if (!from || !to) {
      setError("Please select base and target currencies");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await axios.post(`${API_BASE}/api/forex/analyze`, {
        base: from,
        target: to,
        amount,
        year,
      });

      const data = res.data;

      setRate(data.latestRate);
      setConvertedAmount(data.convertedAmount);

      const histArray = Array.isArray(data.history) ? data.history : [];

      // aggregate daily data into monthly averages and calculate volatility per month
      const byMonth = {}; // key: 0-11 (month index)
      histArray.forEach((h) => {
        const d = new Date(h.date);
        const m = d.getMonth(); // 0..11
        const monthName = d.toLocaleString("default", { month: "short" });
        if (!byMonth[m]) {
          byMonth[m] = { month: monthName, sum: 0, count: 0, rates: [] };
        }
        byMonth[m].sum += Number(h.rate);
        byMonth[m].count += 1;
        byMonth[m].rates.push(Number(h.rate));
      });

      // convert to array and sort by month, calculate monthly volatility
      const historyData = Object.keys(byMonth)
        .sort((a, b) => Number(a) - Number(b))
        .map((key) => {
          const m = byMonth[key];
          const avgRate = m.sum / m.count;

          // monthly volatility (std dev / mean * 100)
          let monthlyVol = 0;
          if (m.rates.length > 1) {
            const variance =
              m.rates.reduce((s, r) => s + Math.pow(r - avgRate, 2), 0) /
              m.rates.length;
            const stdDev = Math.sqrt(variance);
            monthlyVol = (stdDev / avgRate) * 100;
          }

          return {
            month: m.month,
            rate: avgRate,
            volatility: monthlyVol,
          };
        });

      setHistory(historyData);

      if (histArray.length) {
        setDate(histArray[histArray.length - 1].date);
      } else {
        setDate(null);
      }

      const vol =
        typeof data.volatilityIndex === "string"
          ? Number(data.volatilityIndex)
          : data.volatilityIndex;

      setVolatilityPercent(vol);
      setVolatilityLabel(
        vol != null && vol <= 5
          ? "Low volatility · Stable"
          : vol != null
          ? "High volatility"
          : ""
      );
    } catch (err) {
      console.error(err);
      setError("Failed to fetch forex data");
    } finally {
      setLoading(false);
    }
  };

  // Generate dynamic insights based on data
  const generateInsights = () => {
    if (!rate || !volatilityPercent || !history.length) return [];

    const avgRate =
      history.reduce((sum, h) => sum + h.rate, 0) / history.length;
    const rateDiff = ((rate - avgRate) / avgRate) * 100;

    const insights = [
      {
        icon: "📊",
        color: "insight-blue",
        text: `The ${from}/${to} pair has maintained average volatility of ${volatilityPercent.toFixed(1)}% over the year.`,
      },
      {
        icon: "📈",
        color: "insight-green",
        text: `Current rate is ${Math.abs(rateDiff).toFixed(1)}% ${rateDiff > 0 ? "above" : "below"} the yearly average - ${rateDiff > 0 ? "favorable for " + from : "favorable for " + to} holders`,
      },
      {
        icon: "🎯",
        color: "insight-orange",
        text: `Projected trend suggests ${volatilityPercent > 3 ? "moderate fluctuations" : "stability"} continuing into next quarter.`,
      },
    ];

    return insights;
  };

  // Generate trade impact metrics
  const generateTradeImpact = () => {
    const forexImpact = (Number(amount) * rate * 0.012).toFixed(0); // 1.2% impact
    const riskLevel =
      volatilityPercent != null && volatilityPercent > 3 ? "High" : "Low";
    const hedgingNeeded =
      volatilityPercent != null && volatilityPercent > 5
        ? "Recommended"
        : "Not Required";
    const bestTime =
      volatilityPercent != null && volatilityPercent < 2
        ? "Now - Optimal"
        : "Mid-month";

    return {
      forexImpact,
      riskLevel,
      hedgingNeeded,
      bestTime,
    };
  };

  const currencyOptions = [
    <option key="" value="">
      Select currency
    </option>,
    ...Object.entries(currencies).map(([code, name]) => (
      <option key={code} value={code}>
        {code} – {name}
      </option>
    )),
  ];

  const insights = generateInsights();
  const tradeImpact = generateTradeImpact();

  return (
    <div className="forex-main">
      <header className="forex-topbar">
        <h1>Forex Analysis</h1>
      </header>

      {/* Filters */}
      <section className="forex-filters-card">
        <h2 className="forex-filters-title">
          Currency Converter &amp; Analysis
        </h2>

        <div className="forex-filters-grid">
          <div className="filter-field">
            <label>Base Currency</label>
            <select value={from} onChange={(e) => setFrom(e.target.value)}>
              {currencyOptions}
            </select>
          </div>

          <div className="filter-field">
            <label>Target Currency</label>
            <select value={to} onChange={(e) => setTo(e.target.value)}>
              {currencyOptions}
            </select>
          </div>

          <div className="filter-field">
            <label>Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="filter-field">
            <label>Year</label>
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
            >
              {Array.from({ length: 10 }, (_, i) => 2016 + i).map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-actions">
            <button onClick={handleAnalyze} disabled={loading}>
              {loading ? "Analyzing..." : "Analyze"}
            </button>
          </div>
        </div>
      </section>

      {error && <div className="error-banner">{error}</div>}

      {/* Summary */}
      <section className="forex-summary-strip">
        <div className="forex-card forex-card-rate">
          <h3>Current Exchange Rate</h3>
          {rate != null ? (
            <>
              <p className="forex-main-value">
                1 {from} = {rate.toFixed(4)} {to}
              </p>
              {date && <p className="forex-subtext">Last updated: {date}</p>}
            </>
          ) : (
            <p className="forex-placeholder">Run an analysis to see rate</p>
          )}
        </div>

        <div className="forex-card forex-card-amount">
          <h3>Converted Amount</h3>
          {convertedAmount != null ? (
            <>
              <p className="forex-main-value">
                {convertedAmount.toFixed(2)} {to}
              </p>
              <p className="forex-subtext">
                From {amount} {from}
              </p>
            </>
          ) : (
            <p className="forex-placeholder">Run an analysis to convert</p>
          )}
        </div>

        <div className="forex-card forex-card-vol">
          <h3>Volatility Index</h3>
          {volatilityPercent != null ? (
            <>
              <p className="forex-main-value">
                {volatilityPercent.toFixed(1)}%
              </p>
              <p className="forex-subtext">{volatilityLabel}</p>
            </>
          ) : (
            <p className="forex-placeholder">
              Run an analysis to see volatility
            </p>
          )}
        </div>
      </section>

      {/* Historical Exchange Rate Chart */}
      <section className="forex-chart-card">
        <h2>Historical Exchange Rate Trend ({year})</h2>
        <div className="forex-chart-wrapper" style={{ height: "350px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={history}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="rate"
                stroke="#2563eb"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Volatility Chart */}
      <section className="forex-chart-card">
        <h2>Exchange Rate Volatility ({year})</h2>
        <div className="forex-chart-wrapper" style={{ height: "300px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={history}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis
                label={{
                  value: "Volatility %",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="volatility"
                fill="#f4a6b0"
                stroke="#e57373"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Key Insights & Impact on Trade Costs - Two Column Layout */}
      {history.length > 0 && (
        <section className="insights-impact-wrapper">
          <div className="insights-impact-grid">
            {/* Left: Key Insights */}
            <div className="insights-container">
              <h2>Key Insights</h2>
              <div className="insights-cards-stack">
                {insights.map((insight, idx) => (
                  <div key={idx} className={`insight-card-full ${insight.color}`}>
                    <span className="insight-icon">{insight.icon}</span>
                    <p>{insight.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Impact on Trade Costs */}
            <div className="impact-container">
              <h2>Impact on Trade Costs</h2>
              <div className="impact-metrics">
                <div className="impact-row">
                  <label>Monthly Forex Impact</label>
                  <span className="metric-value">
                    ±${tradeImpact.forexImpact} per $10K
                  </span>
                </div>
                <div className="impact-row">
                  <label>Hedging Recommendation</label>
                  <span
                    className={`metric-value ${
                      tradeImpact.hedgingNeeded === "Not Required"
                        ? "text-green"
                        : "text-orange"
                    }`}
                  >
                    {tradeImpact.hedgingNeeded}
                  </span>
                </div>
                <div className="impact-row">
                  <label>Best Time to Exchange</label>
                  <span className="metric-value">
                    {tradeImpact.bestTime}
                  </span>
                </div>
                <div className="impact-row">
                  <label>Risk Level</label>
                  <span
                    className={`metric-value ${
                      tradeImpact.riskLevel === "Low"
                        ? "text-green"
                        : "text-orange"
                    }`}
                  >
                    {tradeImpact.riskLevel}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default ForexAnalysis;
