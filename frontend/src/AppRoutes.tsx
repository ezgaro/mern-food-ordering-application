import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./layouts/layout";
import HomePage from "./pages/HomePage.js";
import AuthCallbackPage from "./pages/AuthCallbackPage.js";
import UserProfilePage from "./pages/UserProfilePage.js";
import ProtectedRoute from "./auth/ProtectedRoute.js";

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout showHero={true}>
            <HomePage />
          </Layout>
        }
      ></Route>
      <Route path="/auth-callback" element={<AuthCallbackPage />} />
      <Route element={<ProtectedRoute />}>
        <Route
          path="/user-profile"
          element={
            <Layout>
              <UserProfilePage />
            </Layout>
          }
        ></Route>
      </Route>
      <Route path="*" element={<Navigate to="/" />}></Route>
    </Routes>
  );
};

export default AppRoutes;
