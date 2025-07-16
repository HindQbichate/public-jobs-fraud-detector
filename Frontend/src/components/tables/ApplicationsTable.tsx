import React, { useState } from "react";
import { Info, BarChart2 } from "lucide-react";
import axios from "../../utils/axiosConfig";

type Company = { id: number; name: string };

type TenderInfo = {
  region: string;
  province: string;
  category: string;
  total_length_km: number;
  road_width_m: number;
  lanes: number;
  road_class: string;
  terrain_type: string;
  soil_type: string;
  slope: string;
};

type Prediction = {
  result: "Fraudulent" | "Legitimate" | null;
};

type Application = {
  id: number;
  tender_id: number;
  company_id: number;
  company_experience_years: number;
  previous_similar_projects: number;
  total_employees: number;
  engineers_count: number;
  machinery_count: number;
  offered_budget_MAD: number;
  estimated_budget_MAD: number;
  budget_difference_ratio: number;
  proposed_duration_days: number;
  status: string;
  technical_score: number;
  financial_score: number;
  compliance_issues_count: number;
  is_fraud: boolean | null;
  Company: Company;
  ImportedTender: TenderInfo;
  Prediction: Prediction;
};

type TenderGroup = {
  tender_id: number;
  tender_info: TenderInfo;
  applications: Application[];
};

interface ApplicationsTableProps {
  tenders: TenderGroup[];
}

const ApplicationsTable: React.FC<ApplicationsTableProps> = ({ tenders }) => {
  const [openTenderIds, setOpenTenderIds] = useState<number[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTender, setSelectedTender] = useState<TenderInfo | null>(null);
  const [loadingPredictions, setLoadingPredictions] = useState<Record<number, boolean>>({});
  const [predictions, setPredictions] = useState<Record<number, string>>({});

  const toggleTender = (id: number) => {
    setOpenTenderIds((prev) =>
      prev.includes(id) ? prev.filter((tid) => tid !== id) : [...prev, id]
    );
  };

  const openTenderDetails = (tenderInfo: TenderInfo) => {
    setSelectedTender(tenderInfo);
    setShowModal(true);
  };

  const runPrediction = async (application: Application) => {
    setLoadingPredictions(prev => ({ ...prev, [application.id]: true }));

    try {
      const response = await axios.post("/api/predictions/predict", {
        ...application,
        ...application.ImportedTender
      });

      // Update the predictions state with the new result
      setPredictions(prev => ({
        ...prev,
        [application.id]: response.data.result
      }));
    } catch (error) {
      console.error("Prediction failed:", error);
      setPredictions(prev => ({
        ...prev,
        [application.id]: "Error"
      }));
    } finally {
      setLoadingPredictions(prev => ({ ...prev, [application.id]: false }));
    }
  };

  return (
    <div className="p-4 overflow-x-auto">
      {[...tenders].reverse().map((tender) => {
        const isOpen = openTenderIds.includes(tender.tender_id);

        return (
          <div key={tender.tender_id} className="mb-6 bg-white shadow rounded-xl">
            <div className="p-4 bg-gray-100 border-b rounded-t-xl flex justify-between items-center">
              <div
                onClick={() => toggleTender(tender.tender_id)}
                className="cursor-pointer hover:underline flex-1"
              >
                <h2 className="text-lg font-semibold text-gray-700">
                  Tender #{tender.tender_id} – {tender.tender_info.category}{" "}
                  {tender.tender_info.province}, {tender.tender_info.region}{" "}
                  <span className="text-sm text-blue-500 ml-2">
                    {isOpen ? "▲ Hide" : "▼ Show"}
                  </span>
                </h2>
              </div>

              <button
                onClick={() => openTenderDetails(tender.tender_info)}
                className="text-gray-600 hover:text-blue-600 ml-4"
                title="Details"
              >
                <Info size={18} />
              </button>
            </div>

            {isOpen && (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                    <tr>
                      <th className="px-4 py-2">Company</th>
                      <th className="px-4 py-2">Experience</th>
                      <th className="px-4 py-2">Projects</th>
                      <th className="px-4 py-2">Employees</th>
                      <th className="px-4 py-2">Engineers</th>
                      <th className="px-4 py-2">Machines</th>
                      <th className="px-4 py-2">Offered Budget</th>
                      <th className="px-4 py-2">Estimated Budget</th>
                      <th className="px-4 py-2">Budget Diff</th>
                      <th className="px-4 py-2">Duration</th>
                      <th className="px-4 py-2">Tech Score</th>
                      <th className="px-4 py-2">Fin Score</th>
                      <th className="px-4 py-2">Status</th>
                      <th className="px-4 py-2">Actions</th>
                      <th className="px-4 py-2">Prediction</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...tender.applications].reverse().map((app) => (
                      <tr key={app.id} className="hover:bg-gray-50 border-t">
                        <td className="px-4 py-2">{app.Company.name}</td>
                        <td className="px-4 py-2">{app.company_experience_years}</td>
                        <td className="px-4 py-2">{app.previous_similar_projects}</td>
                        <td className="px-4 py-2">{app.total_employees}</td>
                        <td className="px-4 py-2">{app.engineers_count}</td>
                        <td className="px-4 py-2">{app.machinery_count}</td>
                        <td className="px-4 py-2">{app.offered_budget_MAD.toLocaleString()}</td>
                        <td className="px-4 py-2">{app.estimated_budget_MAD.toLocaleString()}</td>
                        <td className={`px-4 py-2 ${app.budget_difference_ratio > 0 ? "text-red-600" : "text-green-600"}`}>
                          {(app.budget_difference_ratio * 100).toFixed(1)}%
                        </td>
                        <td className="px-4 py-2">{app.proposed_duration_days}</td>
                        <td className="px-4 py-2">{app.technical_score}</td>
                        <td className="px-4 py-2">{app.financial_score}</td>
                        <td className={`px-4 py-2 capitalize ${app.status === "approved" ? "text-green-600" : app.status === "pending" ? "text-yellow-600" : "text-red-600"}`}>
                          {app.status}
                        </td>
                        <td className="px-4 py-2">
                          <button
                            onClick={() => runPrediction(app)}
                            disabled={loadingPredictions[app.id]}
                            className={`flex items-center text-xs ${loadingPredictions[app.id]
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-blue-500 hover:bg-blue-600"
                              } text-white px-2 py-1 rounded-md transition-colors`}
                          >
                            <BarChart2 size={14} className="mr-1" />
                            {loadingPredictions[app.id] ? "Processing..." : "Predict"}
                          </button>
                        </td>
                        <td className="px-4 py-2">
                          {loadingPredictions[app.id] ? (
                            <span className="text-gray-500">Loading...</span>
                          ) : predictions[app.id] ? (
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${predictions[app.id] === "Fraudulent"
                                ? "bg-red-100 text-red-800"
                                : "bg-green-100 text-green-800"
                                }`}
                            >
                              {predictions[app.id]}
                            </span>
                          ) : app.Prediction?.result ? (
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${app.Prediction.result === "Fraudulent"
                                ? "bg-red-100 text-red-800"
                                : "bg-green-100 text-green-800"
                                }`}
                            >
                              {app.Prediction.result}
                            </span>
                          ) : (
                            <span className="text-gray-400">Not predicted</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      })}

      {/* Modal Tender Info */}
      {showModal && selectedTender && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Tender Details</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li><strong>Category:</strong> {selectedTender.category}</li>
              <li><strong>Road Class:</strong> {selectedTender.road_class}</li>
              <li><strong>Total Length:</strong> {selectedTender.total_length_km} km</li>
              <li><strong>Road Width:</strong> {selectedTender.road_width_m} m</li>
              <li><strong>Lanes:</strong> {selectedTender.lanes}</li>
              <li><strong>Terrain Type:</strong> {selectedTender.terrain_type}</li>
              <li><strong>Soil Type:</strong> {selectedTender.soil_type}</li>
              <li><strong>Slope:</strong> {selectedTender.slope}</li>
              <li><strong>Province:</strong> {selectedTender.province}</li>
              <li><strong>Region:</strong> {selectedTender.region}</li>
            </ul>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationsTable;