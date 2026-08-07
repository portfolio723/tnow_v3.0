import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SectionHeader } from "@/components/StepNav";
import { INDUSTRIES } from "@/lib/experience-data";
import Casestudies from "@/components/ui/case-studies";

export const Route = createFileRoute("/experience/secops/stories")({
  head: () => ({ meta: [{ title: "Customer Stories — SecOps Experience" }] }),
  component: StoriesPage,
});

function StoriesPage() {
  const [industry, setIndustry] = useState<string | null>(null);

  return (
    <div className="lg:h-full lg:flex lg:flex-col lg:justify-between space-y-4">
      <div>
        <SectionHeader
          eyebrow="Step 4 · Customer Stories"
          title="Enterprise SAP teams already running on SecOps"
          description="Real outcomes from Global 2000 organizations across manufacturing, pharma, banking, and utilities."
        />

        <div className="mt-4 lg:mt-3 flex flex-wrap gap-1.5 items-center">
          <FilterChip
            active={industry === null}
            onClick={() => setIndustry(null)}
            label="All Industries"
          />
          {INDUSTRIES.map((i) => (
            <FilterChip key={i} active={industry === i} onClick={() => setIndustry(i)} label={i} />
          ))}
        </div>
      </div>

      <div className="mt-2 flex-1">
        <Casestudies activeCategory={industry} />
      </div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-200 cursor-pointer ${
        active
          ? "border-primary bg-primary text-primary-foreground shadow-sm"
          : "border-white/60 bg-white/70 text-muted-foreground hover:text-foreground hover:bg-white"
      }`}
    >
      {label}
    </button>
  );
}
