import { useEffect, useState } from "react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import ApplicationsTable from "../components/tables/ApplicationsTable";
import axios from "../utils/axiosConfig"; // your custom instance with token

export default function Applications() {
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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

    fetchApplications();
  }, []);

  return (
    <>
      <div className="mx-auto max-w-screen-xl px-4 py-8">
        <PageBreadcrumb
          pageName="Applications"
          breadcrumbs={[{ label: "Dashboard", path: "/" }, { label: "Applications" }]}
        />

        {loading && <div className="text-center text-gray-500">Loading applications...</div>}
        {error && <div className="text-center text-red-500">{error}</div>}
        {!loading && !error && <ApplicationsTable tenders={tenders} />}
      </div>
    </>
  );
}
