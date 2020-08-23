export const centsToDollars = (cents: number) => {
  const dollars = `$${(cents / 100).toFixed(2)}`;

  return dollars;
};
