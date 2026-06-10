import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import DashboardPage from "./pages/DashboardPage";
import SearchPage from "./pages/SearchPage";
//import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route element={<MainLayout />}>        
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/search-scores" element={<SearchPage />} />
          <Route path="/reports" element={<DashboardPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
