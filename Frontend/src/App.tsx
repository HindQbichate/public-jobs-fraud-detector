import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import Home from "./pages/Dashboard/Home";
import PrivateRoute from "./routes/PrivateRoute";
import Users from "./pages/Users"
import Applications from "./pages/Applications"
import Predictions from "./pages/Predictions";
import PageMeta from "./components/common/PageMeta";
import Analytics from "./pages/Analytics";


export default function App() {
  return (
    <>

      <PageMeta
        title="Budget Watch"
        description="This is React.js Blank Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <Routes>
        {/* Layout protégé */}
        <Route element={<PrivateRoute><AppLayout /></PrivateRoute>}>
          <Route index path="/" element={<Home />} />
     
          <Route path="/users" element={<Users />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/predictions" element={<Predictions />} />
          <Route path="/analytics" element={<Analytics />} />
        
        </Route>

        {/* Auth routes (public) */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
