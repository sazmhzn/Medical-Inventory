export const calculateItemAmount = (
  qty: number,
  rate: number,
  tax: number = 0
) => {
  const subtotal = qty * rate;
  const taxAmount = (subtotal * tax) / 100;
  return subtotal + taxAmount;
};

export const calculateTotal = (items: OrderItem[]) => {
  return items.reduce(
    (total, item) => total + calculateItemAmount(item.qty, item.rate, item.tax),
    0
  );
};
