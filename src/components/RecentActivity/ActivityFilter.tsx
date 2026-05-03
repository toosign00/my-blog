type FilterType = 'all' | 'push' | 'branch' | 'pr' | 'star';

const FILTER_OPTIONS: { label: string; value: FilterType }[] = [
  { label: 'All', value: 'all' },
  { label: 'Push', value: 'push' },
  { label: 'Branch', value: 'branch' },
  { label: 'PR', value: 'pr' },
  { label: 'Star', value: 'star' },
];

interface ActivityFilterProps {
  value: FilterType;
  onChange: (value: FilterType) => void;
}

export type { FilterType };

export const ActivityFilter = ({ value, onChange }: ActivityFilterProps) => (
  <div className='row-between shrink-0 px-5 pt-4 pb-2'>
    <p className='h6 font-medium text-gray-light'>Recent Activity</p>
    <select
      className='h6 rounded-sm border border-border bg-background px-2 py-1 text-gray-mid focus:outline-none'
      onChange={(e) => onChange(e.target.value as FilterType)}
      value={value}
    >
      {FILTER_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);
