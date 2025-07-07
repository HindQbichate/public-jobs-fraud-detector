import { useEffect, useState } from "react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import PredictionsTable from "../components/tables/PredictionsTable";
import axios from "../utils/axiosConfig";

interface Prediction {
  id: number;
  application_id: number;
  user_id: number;
  prediction: boolean;
  result: string;
  createdAt: string;
  updatedAt: string;
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
  User: {
    id: number;
    fullName: string;
    email: string;
    role: string;
  };
}

export default function Predictions() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const response = await axios.get('/api/predictions');
        setPredictions(response.data);
      } catch (err) {
        setError('Failed to fetch predictions');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPredictions();
  }, []);

  const handleView = (prediction: Prediction) => {
    console.log('View prediction:', prediction);
  };

  const handleDelete = async (prediction: Prediction) => {
    if (window.confirm('Are you sure you want to delete this prediction?')) {
      try {
        await axios.delete(`/api/predictions/${prediction.id}`);
        setPredictions(predictions.filter(p => p.id !== prediction.id));
      } catch (err) {
        console.error('Failed to delete prediction:', err);
      }
    }
  };

  return (
    <div>
      <PageMeta title="Predictions - Fraud Detection System" description={""} />
      <PageBreadcrumb pageTitle="Predictions" />
      
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p>Loading predictions...</p>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-10">{error}</div>
        ) : (
          <PredictionsTable 
            predictions={predictions}
            onView={handleView}
            onDelete={handleDelete}
            onEdit={() => {}}
          />
        )}
      </div>
    </div>
  );
}
