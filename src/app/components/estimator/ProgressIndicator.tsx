import { FONT } from "../../theme";
import { themeVars } from "../../theme";

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  serviceColor?: string;
}

export function ProgressIndicator({
  currentStep,
  totalSteps,
  serviceColor = "var(--mv-primary)",
}: ProgressIndicatorProps) {
  const c = themeVars;
  const pct = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span
          className="text-xs font-semibold tracking-widest uppercase"
          style={{ fontFamily: FONT, color: c.muted }}
        >
          Step {String(currentStep).padStart(2, "0")} /{" "}
          {String(totalSteps).padStart(2, "0")}
        </span>
        <span
          className="text-xs font-bold"
          style={{ fontFamily: FONT, color: serviceColor }}
        >
          {pct}%
        </span>
      </div>
      {/* Track */}
      <div
        className="relative w-full h-1.5 rounded-full overflow-hidden"
        style={{ background: c.border }}
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        {/* Fill */}
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%`, background: serviceColor }}
        />
      </div>
    </div>
  );
}
