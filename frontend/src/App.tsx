import "leaflet/dist/leaflet.css";
import { Route, Routes } from "react-router-dom";
import AdminHome from "./page/home";
import CreateTrafficLightForm from "./page/create-form";
import TrafficMapView from "./page/map";
import AuthPage from "@/auth/login";
import { ProtectedRoute } from "@/provider/ProtectedRoute.tsx";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute roles={["admin", "user"]}>
            <AdminHome />
          </ProtectedRoute>
        }
      />

      <Route
        path="/create-light"
        element={
          <ProtectedRoute roles={["admin"]}>
            <CreateTrafficLightForm />
          </ProtectedRoute>
        }
      />

      <Route
        path="/lights"
        element={
          <ProtectedRoute roles={["admin", "user"]}>
            <TrafficMapView />
          </ProtectedRoute>
        }
      />

      <Route
        path="/map"
        element={
          <ProtectedRoute roles={["admin", "user"]}>
            <TrafficMapView />
          </ProtectedRoute>
        }
      />

      <Route path="/login" element={<AuthPage />} />
    </Routes>
  );
}

export default App;
