type FilterType = "all" | "push" | "branch" | "pr" | "star";

const FILTER_OPTIONS: { label: string; value: FilterType }[] = [
  { label: "All", value: "all" },
  { label: "Push", value: "push" },
  { label: "Branch", value: "branch" },
  { label: "PR", value: "pr" },
  { label: "Star", value: "star" },
];

interface ActivityFilterProps {
  value: FilterType;
  onChange: (value: FilterType) => void;
}

export type { FilterType };

export const ActivityFilter = ({ value, onChange }: ActivityFilterProps) => (
  <div className="row-between shrink-0 px-[1.25rem] pt-[1rem] pb-[0.5rem]">
    <p className="h6 font-medium text-[var(--color-gray-light)]">
      Recent Activity
    </p>
    <select
      className="h6 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-background)] px-[0.5rem] py-[0.25rem] text-[var(--color-gray-mid)] focus:outline-none"
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
