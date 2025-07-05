import React, { useState } from "react";
import { Info, BarChart2 } from "lucide-react"; // Added BarChart2 icon

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
  Company: Company;
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
  const [predictions, setPredictions] = useState<Record<number, string>>({});
  const [predictionDetails, setPredictionDetails] = useState<{
    appId: number;
    companyName: string;
    result: string;
    confidence: number;
    factors: string[];
  } | null>(null);

  const toggleTender = (id: number) => {
    setOpenTenderIds((prev) =>
      prev.includes(id) ? prev.filter((tid) => tid !== id) : [...prev, id]
    );
  };

  const openTenderDetails = (tenderInfo: TenderInfo) => {
    setSelectedTender(tenderInfo);
    setShowModal(true);
  };

  const runPrediction = (appId: number, companyName: string) => {
    // Simulate prediction logic - in real app this would be an API call
    const results = ["Faible risque", "Risque modéré", "Haut risque"];
    const randomResult = results[Math.floor(Math.random() * results.length)];
    const confidence = Math.floor(Math.random() * 40) + 60; // 60-99%
    
    const riskFactors = [
      "Expérience insuffisante",
      "Écart budgétaire important",
      "Délai trop court",
      "Capacité technique limitée",
      "Problèmes financiers antérieurs"
    ];
    
    // Select 1-3 random risk factors
    const selectedFactors = [];
    const factorCount = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < factorCount; i++) {
      const randomIndex = Math.floor(Math.random() * riskFactors.length);
      if (!selectedFactors.includes(riskFactors[randomIndex])) {
        selectedFactors.push(riskFactors[randomIndex]);
      }
    }

    setPredictions(prev => ({
      ...prev,
      [appId]: randomResult
    }));

    setPredictionDetails({
      appId,
      companyName,
      result: randomResult,
      confidence,
      factors: selectedFactors
    });
  };

  const closePredictionDetails = () => {
    setPredictionDetails(null);
  };

  return (
    <div className="p-4 overflow-x-auto">
      {tenders.map((tender) => {
        const isOpen = openTenderIds.includes(tender.tender_id);

        return (
          <div key={tender.tender_id} className="mb-6 bg-white shadow rounded-xl">
            <div className="p-4 bg-gray-100 border-b rounded-t-xl flex justify-between items-center">
              <div
                onClick={() => toggleTender(tender.tender_id)}
                className="cursor-pointer hover:underline flex-1"
              >
                <h2 className="text-lg font-semibold text-gray-700">
                  Tender #{tender.tender_id} – {tender.tender_info.category} in{" "}
                  {tender.tender_info.province}, {tender.tender_info.region}{" "}
                  <span className="text-sm text-blue-500 ml-2">
                    {isOpen ? "▲ Masquer" : "▼ Afficher"}
                  </span>
                </h2>
              </div>

              <button
                onClick={() => openTenderDetails(tender.tender_info)}
                className="text-gray-600 hover:text-blue-600 ml-4"
                title="Informations"
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
                      {/* Added Actions column */}
                      <th className="px-4 py-2">Actions</th>
                      {/* Added Prediction column */}
                      <th className="px-4 py-2">Prediction (Result)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tender.applications.map((app) => (
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
                        {/* Actions Column */}
                        <td className="px-4 py-2">
                          <button
                            onClick={() => runPrediction(app.id, app.Company.name)}
                            className="flex items-center text-xs bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded-md transition-colors"
                          >
                            <BarChart2 size={14} className="mr-1" />
                            Lancer prédiction
                          </button>
                        </td>
                        {/* Prediction Result Column */}
                        <td className="px-4 py-2">
                          {predictions[app.id] && (
                            <span 
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                predictions[app.id] === "Faible risque" 
                                  ? "bg-green-100 text-green-800" 
                                  : predictions[app.id] === "Risque modéré" 
                                    ? "bg-yellow-100 text-yellow-800" 
                                    : "bg-red-100 text-red-800"
                              }`}
                            >
                              {predictions[app.id]}
                            </span>
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
            <h3 className="text-lg font-bold mb-4">Détails du Marché</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li><strong>Catégorie :</strong> {selectedTender.category}</li>
              <li><strong>Classe de route :</strong> {selectedTender.road_class}</li>
              <li><strong>Longueur totale :</strong> {selectedTender.total_length_km} km</li>
              <li><strong>Largeur de route :</strong> {selectedTender.road_width_m} m</li>
              <li><strong>Nombre de voies :</strong> {selectedTender.lanes}</li>
              <li><strong>Type de terrain :</strong> {selectedTender.terrain_type}</li>
              <li><strong>Type de sol :</strong> {selectedTender.soil_type}</li>
              <li><strong>Pente :</strong> {selectedTender.slope}</li>
              <li><strong>Province :</strong> {selectedTender.province}</li>
              <li><strong>Région :</strong> {selectedTender.region}</li>
            </ul>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Prediction Details Modal */}
      {predictionDetails && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">
              Détails de la prédiction - {predictionDetails.companyName}
            </h3>
            
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <strong>Résultat:</strong>
                <span 
                  className={`px-2 py-1 rounded-full text-sm ${
                    predictionDetails.result === "Faible risque" 
                      ? "bg-green-100 text-green-800" 
                      : predictionDetails.result === "Risque modéré" 
                        ? "bg-yellow-100 text-yellow-800" 
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  {predictionDetails.result}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <strong>Confiance:</strong>
                <span>{predictionDetails.confidence}%</span>
              </div>
            </div>
            
            {predictionDetails.factors.length > 0 && (
              <div className="mb-4">
                <strong className="block mb-2">Facteurs de risque:</strong>
                <ul className="list-disc pl-5 text-sm">
                  {predictionDetails.factors.map((factor, index) => (
                    <li key={index} className="text-red-600">{factor}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="mt-4 flex justify-end">
              <button
                onClick={closePredictionDetails}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationsTable;