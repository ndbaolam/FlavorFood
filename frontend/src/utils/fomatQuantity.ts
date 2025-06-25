export const formatQuantity = (quantity: number) => {
    return new Intl.NumberFormat("vi-VN").format(quantity);
  };