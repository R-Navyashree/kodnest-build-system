import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

interface ProofItem {
  id: string;
  label: string;
}

const proofItems: ProofItem[] = [
  { id: "ui-built", label: "UI Built" },
  { id: "logic-working", label: "Logic Working" },
  { id: "test-passed", label: "Test Passed" },
  { id: "deployed", label: "Deployed" },
];

export function ProofFooter() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="flex items-center gap-sp-4">
      {proofItems.map((item) => (
        <label
          key={item.id}
          className="flex items-center gap-sp-1 text-sm text-foreground cursor-pointer select-none font-body"
        >
          <Checkbox
            checked={!!checked[item.id]}
            onCheckedChange={() => toggle(item.id)}
          />
          {item.label}
        </label>
      ))}
    </div>
  );
}
