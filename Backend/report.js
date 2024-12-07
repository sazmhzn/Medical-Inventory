// Fetch data from the json-server
async function fetchData(endpoint) {
  const response = await fetch(`http://localhost:3001/${endpoint}`);
  if (!response.ok) {
    throw new Error(`Error fetching ${endpoint}: ${response.statusText}`);
  }
  return response.json();
}

// Utility to generate reports
async function generateReport(reportType) {
  switch (reportType) {
    case "low-stock": {
      const inventory = await fetchData("inventory");
      return inventory.filter((item) => item.stock <= item.reorder);
    }

    case "sales-summary": {
      const [sales, customers, inventory] = await Promise.all([
        fetchData("sales"),
        fetchData("customers"),
        fetchData("inventory"),
      ]);
      return sales.map((sale) => ({
        saleId: sale.saleId,
        date: sale.date,
        customerName:
          customers.find((c) => c.customerId === sale.customerId)?.name ||
          "Unknown",
        totalAmount: sale.totalAmount,
        items: sale.items.map((item) => ({
          itemName:
            inventory.find((i) => i.id === item.itemId)?.name || "Unknown",
          quantity: item.quantity,
          price: item.price,
        })),
      }));
    }

    case "pending-orders": {
      const [orders, suppliers, inventory] = await Promise.all([
        fetchData("orders"),
        fetchData("suppliers"),
        fetchData("inventory"),
      ]);
      return orders
        .filter((order) => order.status === "pending")
        .map((order) => ({
          orderId: order.orderId,
          supplierName:
            suppliers.find((s) => s.supplierId === order.supplierId)?.name ||
            "Unknown",
          date: order.date,
          totalAmount: order.totalAmount,
          items: order.items.map((item) => ({
            itemName:
              inventory.find((i) => i.id === item.itemId)?.name || "Unknown",
            quantity: item.quantity,
            price: item.price,
          })),
        }));
    }

    case "inventory-summary": {
      const inventory = await fetchData("inventory");
      return inventory.map((item) => ({
        id: item.id,
        name: item.name,
        stock: item.stock,
        reorderLevel: item.reorder,
        expiryDate: item.expiryDate || "N/A",
      }));
    }

    case "sales-by-category": {
      const [sales, inventory] = await Promise.all([
        fetchData("sales"),
        fetchData("inventory"),
      ]);
      const categorySales = {};
      sales.forEach((sale) => {
        sale.items.forEach((item) => {
          const inventoryItem = inventory.find((i) => i.id === item.itemId);
          if (inventoryItem) {
            const category = inventoryItem.category || "Uncategorized";
            if (!categorySales[category]) {
              categorySales[category] = {
                category,
                totalSales: 0,
                totalQuantity: 0,
              };
            }
            categorySales[category].totalSales += item.quantity * item.price;
            categorySales[category].totalQuantity += item.quantity;
          }
        });
      });
      return Object.values(categorySales);
    }

    default:
      throw new Error("Unknown report type");
  }
}

// Example Usage
(async () => {
  console.log("Low Stock Report:", await generateReport("low-stock"));
  console.log("Sales Summary Report:", await generateReport("sales-summary"));
  console.log("Pending Orders Report:", await generateReport("pending-orders"));
  console.log(
    "Inventory Summary Report:",
    await generateReport("inventory-summary")
  );
  console.log(
    "Sales by Category Report:",
    await generateReport("sales-by-category")
  );
})();
