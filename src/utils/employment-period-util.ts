const MONTH_PATTERN = /^(\d{4})\.(0[1-9]|1[0-2])$/;

const toMonthIndex = (month: string) => {
  const match = MONTH_PATTERN.exec(month);
  if (!match) return null;

  const [, year, monthNumber] = match;
  return Number(year) * 12 + Number(monthNumber) - 1;
};

const formatDuration = (months: number) => {
  if (months < 12) return `${months}개월`;

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  return remainingMonths === 0 ? `${years}년` : `${years}년 ${remainingMonths}개월`;
};

export interface EmploymentPeriodLabels {
  period: string;
  duration: string | null;
}

export const getEmploymentPeriodLabels = (
  startMonth: string,
  endMonth: string | null,
  referenceDate = new Date()
): EmploymentPeriodLabels => {
  const period = `${startMonth} - ${endMonth ?? '현재'}`;
  const startIndex = toMonthIndex(startMonth);
  const endIndex = endMonth
    ? toMonthIndex(endMonth)
    : referenceDate.getFullYear() * 12 + referenceDate.getMonth();

  if (startIndex === null || endIndex === null) return { period, duration: null };

  const durationMonths = Math.max(0, endIndex - startIndex + 1);
  return { period, duration: formatDuration(durationMonths) };
};
