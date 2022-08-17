export const truncateAddress = (address) => {
  if (!address) return "No Account";
  const match = address.match(
    /^(0x[a-zA-Z0-9]{4})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/
  );
  if (!match) return address;
  return `${match[1]}…${match[2]}`;
};
  
export const toHex = (num) => {
  const val = Number(num);
  return "0x" + val.toString(16);
};

export const formatAsPercent = (num) => {
  return new Intl.NumberFormat('default', {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
};

export const formatAsUsd = (amount, digits) => {
  let format = {
    style: 'currency',
    currency: 'USD',
  }
  
  if (digits) {
    format['minimumFractionDigits'] = digits;
    format['maximumFractionDigits'] = digits;
  }

  return new Intl.NumberFormat('en-US', format).format(amount);
};
  