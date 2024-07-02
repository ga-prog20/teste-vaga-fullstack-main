export function validateInstallment(
  installments: number,
  totalValue: number,
  installmentValue: number
): boolean {
  const calculatedValue = totalValue / installments;

  if (calculatedValue !== installmentValue) {
    return false;
  }

  return true;
}
