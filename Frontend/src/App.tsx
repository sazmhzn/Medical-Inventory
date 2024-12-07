import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/dashboard/Dashboard";
import NoPage from "./pages/NoPage";
import AuthPage from "./pages/auth/AuthPage";
import AuthLayout from "./pages/auth/AuthLayout";
import Inventory from "./pages/dashboard/inventory/Inventory";
import AddItem from "./pages/dashboard/inventory/AddItem";
import Report from "./pages/dashboard/reports/Report";
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import Layout from "./pages/landing/Layout";
import Home from "./pages/landing/Home";
import ProtectedRoute from "./routes/ProtectedRoute";
import Order from "./pages/dashboard/orders/Order";
import AddSalesOrders from "./pages/dashboard/orders/AddSalesOrder";
import Suppliers from "./pages/dashboard/suppliers/Suppliers";
import AddSuppliers from "./pages/dashboard/suppliers/AddSuppliers";
import ReportLayout from "./pages/dashboard/reports/components/ReportLayout";
import GenericReportDisplay from "./pages/dashboard/reports/components/GenericReportDisplay";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main Layout Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />

          <Route path="inventory">
            <Route index element={<Inventory />} />
            <Route path="add-item" element={<AddItem />} />
          </Route>

          <Route path="orders">
            <Route index element={<Order />} />
            <Route path="add-order" element={<AddSalesOrders />} />
          </Route>

          <Route path="suppliers">
            <Route index element={<Suppliers />} />
            <Route path="add-suppliers" element={<AddSuppliers />} />
          </Route>

          <Route path="reports" element={<ReportLayout />}>
            <Route index element={<Report />} />

            <Route path=":reportType" element={<GenericReportDisplay />} />
            {/* <Route path="sales-by-item" element={<GenericReportDisplay />} />

            <Route
              path="sales-by-customer"
              element={<GenericReportDisplay />}
            /> */}
          </Route>

          {/* <Route path="" element={<ReportLayout />}>
            <Route path="sales-by-item" element={<SalesByItem />} />
            <Route
              path="sales-by-customer"
              element={<SalesByCustomerReport />}
            />
            <Route path="*" element={<NoPage />} />
          </Route> */}

          <Route path="*" element={<NoPage />} />
        </Route>

        <Route path="/landing" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="*" element={<NoPage />} />
        </Route>

        {/* Auth Routes */}
        <Route path="/login" element={<AuthLayout />}>
          <Route index element={<AuthPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
