import currency from "currency.js";

const formatMoney = (amount, currencyCode) => {
  const symbol = currencyCode === "GBP" ? "£" : "$";

  return currency(amount, {
    symbol,
    precision: 2,
    separator: ",",
    decimal: ".",
  }).format();
};

export default formatMoney;
