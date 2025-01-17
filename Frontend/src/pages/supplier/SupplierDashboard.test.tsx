import { render, screen } from "@testing-library/react";
import { SupplierDashboard } from "./SupplierDashboard";
import { useOrders } from "@/services/OrderAPI";
import { waitFor } from "@testing-library/react";

jest.mock("@/services/OrderAPI", () => ({
  useOrders: () => ({
    data: [
      { id: 1, status: "ACCEPTED" },
      { id: 2, status: "REJECTED" },
      { id: 3, status: "PENDING" },
      { id: 4, status: "ACCEPTED" },
    ],
    isLoading: false,
  }),
  usePendingOrders: () => ({
    data: { data: [] },
    isLoading: false,
  }),
  useUpdateOrderStatus: () => ({
    mutateAsync: jest.fn(),
  }),
}));

test("displays the correct total number of orders", async () => {
  render(<SupplierDashboard />);

  await waitFor(() => {
    expect(screen.getByText(/Total Orders/i)).toBeInTheDocument();
    expect(screen.getByText(/4/i)).toBeInTheDocument();
  });
});
import { render, waitFor } from "@testing-library/react";
import { usePendingOrders } from "@/services/OrderAPI";
import { SupplierDashboard } from "./SupplierDashboard";

jest.mock("@/services/OrderAPI", () => ({
  usePendingOrders: jest.fn(() => ({
    data: null,
    isLoading: true,
    isError: false,
  })),
}));

test("should display a loading state when fetching pending orders", async () => {
  const { getByText } = render(<SupplierDashboard />);

  expect(getByText("Loading pending orders...")).toBeInTheDocument();

  await waitFor(() => {
    expect(getByText("Loading pending orders...")).toBeInTheDocument();
  });
});
