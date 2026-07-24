'use client';

import { useEffect, useState } from 'react';
import {
  type EmploymentPeriodLabels,
  getEmploymentPeriodLabels,
} from '@/utils/employment-period-util';

interface EmploymentPeriodProps {
  startMonth: string;
  endMonth: string | null;
  initialLabels: EmploymentPeriodLabels;
}

export const EmploymentPeriod = ({
  startMonth,
  endMonth,
  initialLabels,
}: EmploymentPeriodProps) => {
  const [labels, setLabels] = useState(initialLabels);

  useEffect(() => {
    setLabels(getEmploymentPeriodLabels(startMonth, endMonth));
  }, [startMonth, endMonth]);

  return (
    <span className='inline-flex items-center gap-3 whitespace-nowrap'>
      <span className='font-mono text-[13px] text-gray-light'>{labels.period}</span>
      {labels.duration && (
        <>
          <span aria-hidden='true' className='w-px h-3 bg-border' />
          <span className='font-mono text-[13px] text-gray-light'>{labels.duration}</span>
        </>
      )}
    </span>
  );
};
