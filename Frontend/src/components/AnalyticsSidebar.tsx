import { useEffect, useState } from "react";
import axios from "../utils/axiosConfig";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, Legend
} from "recharts";

export default function AnalyticsSidebar() {
  const [totals, setTotals] = useState<any>(null);
  const [yearlyData, setYearlyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    // Total stats
    axios.get("/api/analytics/totals").then(res => setTotals(res.data));

    // Fraud per year
    axios.get("/api/analytics/fraud-per-year").then(res => setYearlyData(res.data));

    // Fraud per month (latest year)
    axios.get("/api/analytics/fraud-per-month/2025").then(res => setMonthlyData(res.data));
  }, []);

  return (
    <div className="space-y-6">
      {/* Global numbers */}
      {totals && (
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-xs text-gray-500">Tenders</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{totals.total}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Frauds</p>
            <p className="text-xl font-bold text-red-600">{totals.fraud}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Fraud %</p>
            <p className="text-xl font-bold text-yellow-600">{totals.fraudRate}%</p>
          </div>
        </div>
      )}

      {/* Yearly fraud % */}
      <div>
        <h4 className="text-sm font-semibold text-center mb-1">Fraud % by Year</h4>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={yearlyData}>
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Bar dataKey={(d: any) => ((d.fraud_count / (d.fraud_count + d.legit_count)) * 100)} fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Monthly frauds */}
      <div>
        <h4 className="text-sm font-semibold text-center mb-1">2025: Frauds per Month</h4>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="fraud_count" stroke="#dc2626" name="Frauds" />
            <Line type="monotone" dataKey="legit_count" stroke="#16a34a" name="Legit" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
