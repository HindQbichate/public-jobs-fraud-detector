import { useEffect, useState } from "react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import ApplicationsTable from "../components/tables/ApplicationsTable";
import axios from "../utils/axiosConfig"; // your custom instance with token

export default function Applications() {
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const [importMessage, setImportMessage] = useState<string | null>(null);

  const fetchApplications = async () => {
    try {
      const response = await axios.get("/api/applications");
      setTenders(response.data);
    } catch (err) {
      console.error("Error fetching applications:", err);
      setError("Failed to load applications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleImport = async () => {
    setImporting(true);
    setImportMessage(null);
    try {
      const response = await axios.post("/api/applications/seed-applications");
      setImportMessage("✅ Import completed.");
      await fetchApplications(); // Refresh the table
    } catch (err) {
      console.error("Error importing:", err);
      setImportMessage("❌ Import failed.");
    } finally { 
      setImporting(false);
    }
  };

  return (
    <>
      <div className="mx-auto max-w-screen-xl px-4 py-8">
        <PageBreadcrumb
          pageName="Applications"
          breadcrumbs={[{ label: "Dashboard", path: "/" }, { label: "Applications" }]}
        />

        <div className="mb-4 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">Liste des candidatures</h1>
          <button
            onClick={handleImport}
            disabled={importing}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
          >
            {importing ? "Import en cours..." : "Importer les candidatures"}
          </button>
        </div>

        {importMessage && (
          <div className="mb-4 text-center text-sm text-blue-700">{importMessage}</div>
        )}

        {loading && <div className="text-center text-gray-500">Loading applications...</div>}
        {error && <div className="text-center text-red-500">{error}</div>}
        {!loading && !error && <ApplicationsTable tenders={tenders} />}
      </div>
    </>
  );
}
