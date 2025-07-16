import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
import StatisticsChart from "../../components/ecommerce/StatisticsChart";
import MonthlyTarget from "../../components/ecommerce/MonthlyTarget";
import RecentOrders from "../../components/ecommerce/RecentOrders";
import DemographicCard from "../../components/ecommerce/DemographicCard";
import PageMeta from "../../components/common/PageMeta";
import { useEffect, useState } from "react";
import axios from "../../utils/axiosConfig";
import AnalyticsSidebar from "../../components/AnalyticsSidebar";
import { prepareLegacyRegionFraudStats } from "../../utils/prepareMapData";


export default function Home() {

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

<div className="grid grid-cols-12 gap-4 md:gap-6">
  <div className="col-span-12 lg:col-span-4 p-4 rounded-xl border bg-white dark:bg-gray-900 shadow-sm">
    <p className="text-center text-lg font-bold mb-4">Statistiques globales</p>
    <AnalyticsSidebar />
  </div>
</div>

    </>
  );
}
