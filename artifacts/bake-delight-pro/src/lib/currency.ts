export function formatCurrency(amount: number | string): string {
  const num = Math.round(Number(amount));
  return `Rs. ${num.toLocaleString("en-US")}`;
}

export function formatCurrencyWithDecimal(amount: number | string): string {
  const num = Number(amount);
  if (num % 1 === 0) return `Rs. ${num.toLocaleString("en-US")}`;
  return `Rs. ${num.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}
