// src/components/IndustryExplorerPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import "./IndustryExplorerPage.css";
import api from "../api";
import Select from "react-select";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  Brush,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const CURRENT_YEAR = 2024;
const YEARS = [2022, 2023, 2024, 2025];

const COLORS = [
  "#2563eb",
  "#10b981",
  "#f97316",
  "#e11d48",
  "#6366f1",
  "#14b8a6",
  "#facc15",
  "#ec4899",
];

const formatPercent = (v) => `${v}%`;
const formatNumber = (v) =>
  typeof v === "number"
    ? v.toLocaleString(undefined, { maximumFractionDigits: 0 })
    : v;

function getShortLabel(text = "") {
  if (!text) return "";
  const cleaned = text.replace(/<[^>]+>/g, "").trim();
  const byColon = cleaned.split(":");
  const firstPart = byColon[0];
  const main = firstPart.split(/[;,]/)[0];
  return main.trim();
}

// shorter label only for chart X-axis
function getVeryShortLabel(text = "") {
  const short = getShortLabel(text);
  if (short.length <= 18) return short;
  return short.slice(0, 15) + "…";
}

function IndustryExplorerPage() {
  const [filters, setFilters] = useState({
    country: "",
    year: CURRENT_YEAR,
    currency: "",
    industry: "",
    subIndustry: "",
    htsCode: "",
  });

  const [countries, setCountries] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [subIndustries, setSubIndustries] = useState([]);
  const [htsCodes, setHtsCodes] = useState([]);

  const [trendRaw, setTrendRaw] = useState([]);
  const [distributionRaw, setDistributionRaw] = useState([]);
  const [subIndustryDutyRaw, setSubIndustryDutyRaw] = useState([]);
  const [htsRows, setHtsRows] = useState([]);

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [menuPortalTarget, setMenuPortalTarget] = useState(null);
  useEffect(() => {
    if (typeof document !== "undefined") {
      setMenuPortalTarget(document.body);
    }
  }, []);

  const [selectedTreeSubIndustry, setSelectedTreeSubIndustry] = useState("");

  // initial dropdown data
  useEffect(() => {
    const loadInitial = async () => {
      try {
        setError("");
        const [countriesRes, currenciesRes, industriesRes] = await Promise.all([
          api.get("/countries-list"),
          api.get("/currencies"),
          api.get("/industries-list"),
        ]);

        const countriesData = countriesRes.data || [];
        const currenciesData = currenciesRes.data || [];
        const industriesData = industriesRes.data || [];

        setCountries(countriesData);
        setCurrencies(currenciesData);
        setIndustries(industriesData);

        const defaultIndustry = industriesData[0]?.industry || "";

        setFilters((prev) => ({
          ...prev,
          country: countriesData[0]?.country || "",
          currency: currenciesData[0]?.code || "",
          industry: defaultIndustry,
        }));
      } catch (err) {
        console.error("Initial dropdown load error", err);
        setError("Failed to load initial dropdown data.");
      }
    };

    loadInitial();
  }, []);

  // dependent dropdowns
  useEffect(() => {
    if (!filters.industry) return;

    const loadSubs = async () => {
      try {
        setError("");
        const res = await api.get("/sub-industries-list", {
          params: { industry: filters.industry },
        });
        const subs = res.data || [];
        setSubIndustries(subs);
        const defaultSub = subs[0]?.sub_industry || "";
        setFilters((prev) => ({
          ...prev,
          subIndustry: defaultSub,
          htsCode: "",
        }));
        setSelectedTreeSubIndustry(defaultSub);
      } catch (err) {
        console.error("Sub-industries load error", err);
        setError("Failed to load sub-industries.");
      }
    };

    loadSubs();
  }, [filters.industry]);

  useEffect(() => {
    if (!filters.industry || !filters.subIndustry) return;

    const loadHtsCodes = async () => {
      try {
        setError("");
        const res = await api.get("/hts-codes-list", {
          params: {
            industry: filters.industry,
            subIndustry: filters.subIndustry,
          },
        });
        setHtsCodes(res.data || []);
      } catch (err) {
        console.error("HTS codes load error", err);
        setError("Failed to load HTS codes.");
      }
    };

    loadHtsCodes();
  }, [filters.industry, filters.subIndustry]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    const defaultIndustry = industries[0]?.industry || "";
    setFilters((prev) => ({
      ...prev,
      year: CURRENT_YEAR,
      country: countries[0]?.country || "",
      currency: currencies[0]?.code || "",
      industry: defaultIndustry,
      subIndustry: "",
      htsCode: "",
    }));
    setTrendRaw([]);
    setDistributionRaw([]);
    setSubIndustryDutyRaw([]);
    setHtsRows([]);
    setError("");
    setSelectedTreeSubIndustry("");
  };

  const runAnalysis = async () => {
    const { year, industry, subIndustry, htsCode } = filters;

    try {
      setIsLoading(true);
      setError("");

      const [trendRes, distRes, subDutyRes, htsRes] = await Promise.all([
        api.get("/industry/trend", { params: { industry, subIndustry } }),
        api.get("/industry/distribution", { params: { year, industry } }),
        api.get("/industry/sub-industry-duties", {
          params: { year, industry },
        }),
        api.get("/industry/hts-codes", {
          params: { industry, subIndustry, htsCode },
        }),
      ]);

      setTrendRaw(trendRes.data || []);
      setDistributionRaw(distRes.data || []);
      setSubIndustryDutyRaw(subDutyRes.data || []);
      setHtsRows(htsRes.data || []);
    } catch (err) {
      console.error("runAnalysis error", err);
      if (err.response) {
        setError(
          `Analysis failed: ${err.response.status} ${
            err.response.data?.message || ""
          }`.trim()
        );
      } else {
        setError(`Analysis failed: ${err.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const shortIndustry = getShortLabel(filters.industry);
  const shortSubIndustry = getShortLabel(filters.subIndustry);

  const trend = useMemo(() => {
    const byYear = new Map();
    (trendRaw || []).forEach((row) => {
      if (row.year != null) byYear.set(Number(row.year), row);
    });

    return YEARS.map((y) => {
      const row = byYear.get(y) || {};
      return {
        year: y,
        avgDuty: Number(row.avgDuty ?? 0),
        tradeVolume: Number(row.tradeVolume ?? 0),
      };
    });
  }, [trendRaw]);

  const distributionTop = useMemo(() => {
    const shaped = (distributionRaw || []).map((row, idx) => ({
      industry: row.industry || "",
      shortIndustry: getShortLabel(row.industry || ""),
      tradeVolume: Number(row.tradeVolume ?? 0),
      avgDuty: Number(row.avgDuty ?? 0),
      color: COLORS[idx % COLORS.length],
    }));

    return shaped.sort((a, b) => (b.tradeVolume || 0) - (a.tradeVolume || 0));
  }, [distributionRaw]);

  const topSubIndustryDuties = useMemo(
    () =>
      (subIndustryDutyRaw || [])
        .map((row) => ({
          subIndustry: row.sub_industry || "",
          shortSubIndustry: getVeryShortLabel(row.sub_industry || ""),
          avgDuty: Number(row.avgDuty ?? 0),
        }))
        .sort((a, b) => (b.avgDuty || 0) - (a.avgDuty || 0))
        .slice(0, 5),
    [subIndustryDutyRaw]
  );

  const treeRootNode = useMemo(
    () =>
      filters.industry
        ? {
            label: shortIndustry || "Industry",
            full: filters.industry,
          }
        : null,
    [filters.industry, shortIndustry]
  );

  const treeChildren = useMemo(
    () =>
      (subIndustryDutyRaw || []).map((row) => ({
        label: getShortLabel(row.sub_industry || ""),
        full: row.sub_industry || "",
      })),
    [subIndustryDutyRaw]
  );

  return (
    <div className="industry-page">
      <div className="content-wrapper">
        {/* Control Panel */}
        <div className="card panel-card">
          <div className="panel-header">
            <div>
              <h2 className="panel-title">Industry Analysis Control Panel</h2>
              <p className="panel-subtitle">
                Select parameters to analyze tariff data dynamically
              </p>
            </div>
            <div className="panel-actions">
              <button className="btn ghost" onClick={resetFilters}>
                Reset
              </button>
              <button
                className="btn primary"
                onClick={runAnalysis}
                disabled={isLoading}
              >
                {isLoading ? "Running..." : "Run Analysis"}
              </button>
            </div>
          </div>

          <div className="panel-grid">
            <div className="panel-field">
              <label>Country</label>
              <select
                name="country"
                value={filters.country}
                onChange={handleChange}
              >
                {countries.map((c) => (
                  <option key={c.country} value={c.country}>
                    {c.country}
                  </option>
                ))}
              </select>
            </div>

            <div className="panel-field">
              <label>Year</label>
              <select name="year" value={filters.year} onChange={handleChange}>
                {YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <div className="panel-field">
              <label>Currency</label>
              <select
                name="currency"
                value={filters.currency}
                onChange={handleChange}
              >
                {currencies.map((c) => (
                  <option key={c.id} value={c.code}>
                    {c.code} - {c.currency}
                  </option>
                ))}
              </select>
            </div>

            <div className="panel-field">
              <label>Industry</label>
              <Select
                className="rs-select"
                classNamePrefix="rs"
                value={
                  filters.industry
                    ? { value: filters.industry, label: shortIndustry }
                    : null
                }
                onChange={(opt) =>
                  setFilters((prev) => ({
                    ...prev,
                    industry: opt?.value || "",
                  }))
                }
                options={industries.map((i) => ({
                  value: i.industry,
                  label: getShortLabel(i.industry),
                }))}
                isClearable={false}
                menuPortalTarget={menuPortalTarget}
                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
              />
            </div>

            <div className="panel-field">
              <label>Sub-Industry</label>
              <Select
                className="rs-select"
                classNamePrefix="rs"
                value={
                  filters.subIndustry
                    ? { value: filters.subIndustry, label: shortSubIndustry }
                    : null
                }
                onChange={(opt) =>
                  setFilters((prev) => ({
                    ...prev,
                    subIndustry: opt?.value || "",
                  }))
                }
                options={subIndustries.map((s) => ({
                  value: s.sub_industry,
                  label: getShortLabel(s.sub_industry),
                }))}
                placeholder="Select sub-industry"
                isClearable={false}
                menuPortalTarget={menuPortalTarget}
                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
              />
            </div>

            <div className="panel-field">
              <label>HTS Code</label>
              <Select
                className="rs-select"
                classNamePrefix="rs"
                value={
                  filters.htsCode
                    ? { value: filters.htsCode, label: filters.htsCode }
                    : { value: "", label: "All codes" }
                }
                onChange={(opt) =>
                  setFilters((prev) => ({ ...prev, htsCode: opt?.value || "" }))
                }
                options={[
                  { value: "", label: "All codes" },
                  ...htsCodes.map((h) => ({
                    value: h.hts_code,
                    label: h.hts_code,
                  })),
                ]}
                isClearable={false}
                menuPortalTarget={menuPortalTarget}
                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
              />
            </div>
          </div>

          {error && <div className="error-banner">{error}</div>}
        </div>

        {/* Row 1 */}
        <div className="charts-row equal">
          {/* Tariff Rate Trend */}
          <div className="card chart-card tall">
            <div className="panel-header no-bottom">
              <div>
                <h3 className="card-title">Tariff Rate Trend</h3>
                <p className="card-subtitle">
                  Historical tariff trends for {shortIndustry || "industry"}
                </p>
              </div>
            </div>
            <div className="chart-body tall-body">
              {trend.every((p) => !p.avgDuty && !p.tradeVolume) ? (
                <span className="empty-state">Run Analysis to view data.</span>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={trend}
                    margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis
                      yAxisId="left"
                      tickFormatter={formatPercent}
                      domain={[0, (max) => (max || 0) + 2]}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      domain={[0, (max) => (max || 0) * 1.1 + 1]}
                      tickFormatter={formatNumber}
                    />
                    <Tooltip
                      cursor={{ stroke: "#93c5fd", strokeWidth: 1 }}
                      labelFormatter={(label) => `${label}`}
                      formatter={(value, name) =>
                        name === "Tariff Rate (%)"
                          ? [`${value}%`, name]
                          : [formatNumber(value), name]
                      }
                    />
                    <Legend verticalAlign="bottom" height={24} />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="avgDuty"
                      name="Tariff Rate (%)"
                      stroke="#2563eb"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="tradeVolume"
                      name="Trade Volume"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Top Sub‑Industries */}
<div className="card chart-card tall">
  <div className="panel-header no-bottom">
    <div>
      <h3 className="card-title">Top Sub‑Industries by Tariff</h3>
      <p className="card-subtitle">
        Highest average general duty for {shortIndustry || "industry"}
      </p>
    </div>
  </div>
  <div className="chart-body tall-body">
    {topSubIndustryDuties.length === 0 ? (
      <span className="empty-state">Run Analysis to view data.</span>
       ) : topSubIndustryDuties.every(
      (d) => d.avgDuty == null || d.avgDuty === 0
    ) ? (
    <span className="empty-state">
      There is no duty for the selected industry and sub‑industry.
    </span>
    ) : (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip
            formatter={(value, name, props) => [
              `${value}%`,
              props.payload.subIndustry || "Average Duty",
            ]}
          />
          <Legend
            verticalAlign="bottom"
            align="center"
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ paddingTop: 8 }}
          />
          <Pie
  data={topSubIndustryDuties}
  dataKey="avgDuty"
  nameKey="shortSubIndustry"
  cx="50%"
  cy="45%"
  innerRadius={50}
  outerRadius={80}
  paddingAngle={3}
  label={(props) => {
    const { shortSubIndustry, percent } = props;
    // hide labels smaller than 5%
    if (!percent || percent * 100 < 5) return null;
    return `${shortSubIndustry} ${(percent * 100).toFixed(1)}%`;
  }}
>
  {topSubIndustryDuties.map((entry, index) => (
    <Cell
      key={`cell-${index}`}
      fill={COLORS[index % COLORS.length]}
    />
  ))}
</Pie>

        </PieChart>
      </ResponsiveContainer>
    )}
  </div>
</div>

        </div>

        {/* Row 2: tree + Trade Volume chart */}
        <div className="card hts-card">
          <div className="panel-header no-bottom">
            <div>
              <h3 className="card-title">Industry And Sub-Industry Analysis</h3>
              
            </div>
          </div>

          <div className="charts-row equal">
            {/* Horizontal tree */}
            <div className="chart-card no-shadow tall">
              <h4 className="small-title">Industry → Sub‑Industry Tree</h4>
              <div className="decomp-tree horizontal">
                {treeRootNode ? (
                  <div className="tree-horizontal-container">
                    <div className="tree-root-col">
                      <div className="tree-node tree-node-root">
                        <span className="tree-node-title">
                          {treeRootNode.label}
                        </span>
                      </div>
                    </div>

                    {/* Curved SVG connectors */}
                    <div className="tree-connector-col curved">
                      <svg
                        className="tree-connector-svg"
                        viewBox="0 0 120 100"
                        preserveAspectRatio="none"
                      >
                        {treeChildren.map((_, idx) => {
                          const count = treeChildren.length || 1;
                          const yStep = count > 1 ? 100 / (count + 1) : 50;
                          const y = yStep * (idx + 1);
                          return (
                            <path
                              key={idx}
                              className="tree-branch-path"
                              d={`M 0 50 C 40 50, 60 ${y}, 120 ${y}`}
                            />
                          );
                        })}
                      </svg>
                    </div>

                    <div className="tree-children-col">
  {treeChildren.length === 0 ? (
    <span className="empty-state small">
      Run Analysis to fetch sub‑industries.
    </span>
  ) : (
    <div className="tree-children-stack">
      {treeChildren.map((child) => (
        <button
          key={child.full}
          type="button"
          className={
            "tree-node tree-node-child" +
            (selectedTreeSubIndustry === child.full
              ? " tree-node-selected"
              : "")
          }
          onClick={() => setSelectedTreeSubIndustry(child.full)}
        >
          <span className="tree-node-title">{child.label}</span>
        </button>
      ))}
    </div>
  )}
</div>
</div>
) : (
<span className="empty-state">
 Run Analysis to view the tree. </span> )} </div></div>
 {/* Trade Volume by Industry – line + column */}
            <div className="chart-card no-shadow tall">
            
              <h4 className="small-title">Trade Volume And Trend by Industry</h4>
              <div className="chart-body tall-body">
                {distributionTop.length === 0 ? (
                  <span className="empty-state">Run Analysis to view data.</span>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={distributionTop}
                      margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
                    >
                      <CartesianGrid
                        stroke="#e5e7eb"
                        strokeDasharray="3 3"
                      />
                      <XAxis
                        dataKey="shortIndustry"
                        interval={0}
                        tick={{ fontSize: 11 }}
                      />
                      <YAxis
                        domain={[0, (max) => (max || 0) * 1.1]}
                        tickFormatter={formatNumber}
                      />
                      <Tooltip
                        labelFormatter={(label, payload) =>
                          payload?.[0]?.payload?.shortIndustry || label
                        }
                        formatter={(value, name) => [
                          formatNumber(value),
                          name,
                        ]}
                      />
                      <Legend verticalAlign="top" height={24} />

                      <Bar
                        dataKey="tradeVolume"
                        name="Trade Volume (rows)"
                        fill="#10b981"
                        barSize={60}
                        radius={[2, 2, 0, 0]}
                      />

                      <Line
                        type="monotone"
                        dataKey="tradeVolume"
                        name="Trend"
                        stroke="#1d4ed8"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 4 }}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* HTS list */}
        <div className="card hts-card hts-list-card">
          <h3 className="card-title">
            Available HTS Codes - {shortSubIndustry || "All"}
          </h3>
          <p className="card-subtitle">
            Detailed tariff information for selected sub-industry
          </p>

          {htsRows.length === 0 && (
            <div className="hts-empty">Run Analysis to view HTS codes.</div>
          )}

          <div className="hts-list">
            {htsRows.map((row) => {
              const cleanIndustry = String(row.industry || "").replace(
                /<[^>]+>/g,
                ""
              );
              const cleanSub = String(row.sub_industry || "").replace(
                /<[^>]+>/g,
                ""
              );

              return (
                <div className="hts-item" key={row.id}>
                  <div className="hts-main">
                    <div className="hts-code">{row.hts_code}</div>
                    <div className="hts-desc">
                      <div className="hts-industry">{cleanIndustry}</div>
                      <div className="hts-sub">{cleanSub}</div>
                    </div>
                  </div>

                  <div className="hts-meta">
                    <div className="meta-block">
                      <span className="meta-label">General Duty:</span>
                      <span className="meta-value highlight">
                        {row.general_duty || "—"}
                      </span>
                    </div>
                    <div className="meta-block">
                      <span className="meta-label">Special Duty:</span>
                      <span className="meta-value highlight">
                        {row.special_duty || "—"}
                      </span>
                    </div>
                    <div className="meta-block">
                      <span className="meta-label">Column 2:</span>
                      <span className="meta-value highlight">
                        {row.column2_duty || "—"}
                      </span>
                    </div>
                    <div className="meta-block">
                      <span className="meta-label">Year:</span>
                      <span className="meta-value highlight">
                        {row.year || "—"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default IndustryExplorerPage;
