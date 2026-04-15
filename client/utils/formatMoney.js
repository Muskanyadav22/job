const formatMoney = (amount, currencyCode = "INR") => {
  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currencyCode,
  });

  return formatter.format(amount);
};

export default formatMoney;