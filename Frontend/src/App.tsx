import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/dashboard/Dashboard";
import NoPage from "./pages/NoPage";
import AuthPage from "./pages/auth/AuthPage";
import Inventory from "./pages/dashboard/inventory/Inventory";
import AddItem from "./pages/dashboard/inventory/AddItem";
import Report from "./pages/dashboard/reports/Report";
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import Layout from "./pages/landing/Layout";
import Home from "./pages/landing/Home";
import Order from "./pages/dashboard/orders/Order";
import AddSalesOrders from "./pages/dashboard/orders/AddSalesOrder";
import Suppliers from "./pages/dashboard/suppliers/Suppliers";
import AddSuppliers from "./pages/dashboard/suppliers/AddSuppliers";
import ReportLayout from "./pages/dashboard/reports/components/ReportLayout";
import GenericReportDisplay from "./pages/dashboard/reports/components/GenericReportDisplay";
import About from "./pages/landing/About";
import Services from "./pages/landing/Services";
import AuthLayout from "./layouts/AuthLayout";
import SettingsLayout from "./pages/dashboard/settings/SettingsLayout";
import Profile from "./pages/dashboard/settings/Profile";
import { CustomFieldsList } from "./pages/dashboard/settings/components/CustomFieldList";
import AddCustomField from "./pages/dashboard/settings/components/AddCustomField";
import EditItem from "./pages/dashboard/inventory/components/EditItem";
import { ItemDetails } from "./pages/dashboard/inventory/ItemDetails";
import { Toaster } from "./components/ui/toaster";
import { OrderDetails } from "./pages/dashboard/orders/components/OrderDetails";
import { SupplierDetails } from "./pages/dashboard/suppliers/components/SupplierDetails";
import Users from "./pages/dashboard/settings/Users";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SupplierDashboard from "./pages/supplier/SupplierDashboard";
import SupplierDashboardLayout from "./pages/supplier/SupplierDashboardLayout";
import { AuthProvider } from "./utils/AuthProvider";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import EditOrder from "./pages/dashboard/orders/EditOrder";

const ErrorFallback = () => {
  return (
    <div className="p-4 text-center">
      <h1 className="text-2xl font-bold text-red-500">Something went wrong!</h1>
      <p>
        Please try refreshing the page or contact support if the issue persists.
      </p>
    </div>
  );
};

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Main Layout Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute
                  allowedRoles={["ROLE_ADMIN", "ROLE_SUPER_ADMIN"]}
                >
                  <DashboardLayout />
                </ProtectedRoute>
              }
              errorElement={<ErrorFallback />} // Add fallback error handling
            >
              <Route index element={<Dashboard />} />

              <Route path="inventory">
                <Route index element={<Inventory />} />
                <Route path="add-item" element={<AddItem />} />
                <Route path="item/:id" element={<ItemDetails />} />
                <Route path="edit/:id" element={<EditItem />} />
              </Route>

              <Route path="orders">
                <Route index element={<Order />} />
                <Route path="add-order" element={<AddSalesOrders />} />
                <Route path="details/:id" element={<OrderDetails />} />
              </Route>

              <Route path="suppliers">
                <Route index element={<Suppliers />} />
                <Route path="add-suppliers" element={<AddSuppliers />} />
                <Route path="profile/:id" element={<SupplierDetails />} />
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

              <Route path="settings" element={<SettingsLayout />}>
                <Route path="orgprofile" element={<Profile />} />
                <Route path="preferences">
                  <Route path="users" element={<Users />} />
                  <Route
                    path="inventory"
                    element={
                      <CustomFieldsList
                        formName="inventoryCustomField"
                        entityType="inventory"
                      />
                    }
                  />
                  <Route
                    path="inventory/add"
                    element={
                      <AddCustomField
                        formName="inventoryCustomField"
                        entityType="inventory"
                      />
                    }
                  />

                  <Route
                    path="suppliers"
                    element={<CustomFieldsList entityType="suppliers" />}
                  />
                  <Route
                    path="suppliers/add"
                    element={
                      <AddCustomField
                        formName="suppliersCustomField"
                        entityType="suppliers"
                      />
                    }
                  />
                  <Route
                    path="orders"
                    element={<CustomFieldsList entityType="order" />}
                  />
                  <Route
                    path="orders/add"
                    element={
                      <AddCustomField
                        formName="ordersCustomField"
                        entityType="orders"
                      />
                    }
                  />
                </Route>
                <Route path="preferences/suppliers" element={<Profile />} />
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

            {/* Public routes */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="services" element={<Services />} />

              <Route path="*" element={<NoPage />} />
            </Route>

            <Route
              path="/supplier"
              element={
                <ProtectedRoute
                  allowedRoles={["SUPPLIER", "ROLE_ADMIN", "ROLE_SUPER_ADMIN"]}
                >
                  <SupplierDashboardLayout />
                </ProtectedRoute>
              }
            >
              {/* <Route index element={<SupplierDashboardLayout />} /> */}
              <Route index element={<SupplierDashboard />} />
              <Route path="orders/details/:id" element={<OrderDetails />} />
              <Route path="profile/:id" element={<SupplierDetails />} />
            </Route>

            {/* Auth routes */}
            <Route
              path="/login"
              element={<AuthLayout />}
              errorElement={<ErrorFallback />} // Add fallback error handling
            >
              {/* <Route index element={<AuthPage />} /> */}
            </Route>
          </Routes>
          <Toaster />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
