import React, { useState } from "react";
import { Info, BarChart2, Trash2 } from "lucide-react";

interface Prediction {
  id: number;
  application_id: number;
  result: string;
  Application: {
    offered_budget_MAD: number;
    estimated_budget_MAD: number;
    Company: {
      name: string;
    };
    ImportedTender: {
      region: string;
      category: string;
    };
  };
}

interface PredictionsTableProps {
  predictions: Prediction[];
  onView: (prediction: Prediction) => void;
  onDelete: (prediction: Prediction) => void;
  onEdit: (prediction: Prediction) => void;
}

const PredictionsTable: React.FC<PredictionsTableProps> = ({
  predictions,
  onView,
  onDelete,
}) => {
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const toggleRow = (id: number) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const formatCurrency = (amount: number) => {
    if (!amount || isNaN(amount)) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "MAD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proposed Budget</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estimated Budget</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Result</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Region</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {predictions.map((prediction) => (
            <React.Fragment key={prediction.id}>
              <tr
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => toggleRow(prediction.id)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  {prediction.Application?.Company?.name || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {formatCurrency(prediction.Application?.offered_budget_MAD || 0)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {formatCurrency(prediction.Application?.estimated_budget_MAD || 0)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      prediction.result === "Fraudulent"
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {prediction.result || "Pending"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {prediction.Application?.ImportedTender?.region || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {prediction.Application?.ImportedTender?.category || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap flex space-x-2">
                  <button
                    className="text-blue-600 hover:text-blue-900"
                    onClick={(e) => {
                      e.stopPropagation();
                      onView(prediction);
                    }}
                    title="View"
                  >
                    <BarChart2 size={16} />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-900"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm(`Are you sure you want to delete prediction ID ${prediction.id}?`)) {
                        onDelete(prediction);
                      }
                    }}
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
              {expandedRow === prediction.id && (
                <tr className="bg-gray-50">
                  <td colSpan={7} className="px-6 py-4">
                    <div className="flex items-center space-x-4">
                      <Info size={16} className="text-gray-400" />
                      <span className="text-sm text-gray-500">
                        Application ID: {prediction.application_id}
                      </span>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PredictionsTable;
