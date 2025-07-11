import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import { useEffect, useState } from "react";
import MoroccoMap from "../components/MoroccoMap";
import { prepareLegacyRegionFraudStats } from "../utils/prepareMapData";
import axios from "../utils/axiosConfig";
import AnalyticsSidebar from "../components/AnalyticsSidebar";


export default function Analytics() {
  const [stats, setStats] = useState({});

  useEffect(() => {
    axios
      .get("/api/predictions")
      .then((res) => {
        setStats(prepareLegacyRegionFraudStats(res.data));
      })
      .catch((err) => {
        console.error("Error loading predictions:", err);
      });
  }, []);

  return (
    <>
      <PageMeta title="Analytics" />
      <PageBreadcrumb title="Analytics" />

      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="text-center mb-8">
          <h3 className="font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
            Analyse des fraudes par région
          </h3>
        </div>

        <div className="flex flex-wrap lg:flex-nowrap gap-6">
          <div className="w-full lg:w-2/3 p-4 rounded-xl border bg-white dark:bg-gray-900 shadow-sm">
            <p className="text-center text-lg font-bold mb-4">
              Pourcentage de fraude par région
            </p>
            <MoroccoMap stats={stats} />
          </div>

          <div className="w-full lg:w-1/3 p-4 rounded-xl border bg-white dark:bg-gray-900 shadow-sm">
            <p className="text-center text-lg font-bold mb-4">Statistiques globales</p>
            <AnalyticsSidebar />
          </div>
        </div>
      </div>
    </>
  );
}
