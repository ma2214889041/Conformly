/**
 * Conformly UI atoms — shared across every product page.
 *
 * Faithful port of the design's atoms.jsx, converted from dark theme to the
 * light surface palette. shadcn-styled but rolled inline so we don't need
 * a separate component library install.
 */

import clsx from "clsx";

export const cx = (...args: Array<string | undefined | false | null>) =>
  args.filter(Boolean).join(" ");

// ---------------------------------------------------------------------------
// Button
// ---------------------------------------------------------------------------

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "primary" | "secondary" | "ghost" | "outline" | "danger";
  size?: "xs" | "sm" | "md" | "lg";
};

export function Button({
  variant = "default",
  size = "md",
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={clsx(
        size === "xs" && "btn-xs",
        size === "sm" && "btn-sm",
        size === "md" && "btn-md",
        size === "lg" && "btn-lg",
        variant === "default"   && "btn-default",
        variant === "primary"   && "btn-primary",
        variant === "secondary" && "btn-secondary",
        variant === "ghost"     && "btn-ghost",
        variant === "outline"   && "btn-outline",
        variant === "danger"    && "bg-danger text-white hover:bg-danger/90",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Badge
// ---------------------------------------------------------------------------

export function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: "neutral" | "sky" | "amber" | "red" | "green" | "outline" | "solid";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span className={clsx(`badge-${tone}`, className)}>{children}</span>
  );
}

// ---------------------------------------------------------------------------
// Card
// ---------------------------------------------------------------------------

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={clsx("card", className)}>{children}</div>;
}
export function CardHeader({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={clsx("px-5 pt-5 pb-3", className)}>{children}</div>;
}
export function CardBody({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={clsx("px-5 pb-5", className)}>{children}</div>;
}
export function CardTitle({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <h3 className={clsx("text-[12px] font-medium tracking-[0.18em] uppercase text-ink-500", className)}>
      {children}
    </h3>
  );
}

// ---------------------------------------------------------------------------
// Progress bar
// ---------------------------------------------------------------------------

export function ProgressBar({
  value,
  max = 100,
  color = "sky",
  className,
}: {
  value: number;
  max?: number;
  color?: "sky" | "amber" | "green" | "red" | "ink";
  className?: string;
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const fill =
    color === "sky"   ? "bg-accent" :
    color === "amber" ? "bg-warning" :
    color === "green" ? "bg-success" :
    color === "red"   ? "bg-danger" :
    "bg-ink-700";
  return (
    <div className={clsx("h-1.5 w-full rounded-full bg-surface-sunken overflow-hidden", className)}>
      <div
        className={clsx("h-full rounded-full transition-all", fill)}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Score ring (SVG donut)
// ---------------------------------------------------------------------------

export function ScoreRing({
  value,
  size = 110,
  stroke = 9,
  color = "#0EA5E9",
  label,
  sublabel,
}: {
  value: number;
  size?: number;
  stroke?: number;
  color?: string;
  label?: string | number;
  sublabel?: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const v = Math.max(0, Math.min(100, value));
  const offset = c - (v / 100) * c;
  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(15,17,21,0.08)" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 600ms ease" }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center leading-none">
        <div>
          <div className="text-[26px] font-semibold tracking-tight text-ink-900">{label ?? v}</div>
          {sublabel && (
            <div className="text-[10px] tracking-[0.18em] uppercase text-ink-400 mt-1.5">
              {sublabel}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Severity chip — dot + label, sized for inline use
// ---------------------------------------------------------------------------

export function SeverityChip({ kind }: { kind: string }) {
  const map: Record<string, { dot: string; text: string; label: string }> = {
    urgent:    { dot: "bg-danger",  text: "text-danger",  label: "Urgent" },
    critical:  { dot: "bg-danger",  text: "text-danger",  label: "Critical" },
    high:      { dot: "bg-danger",  text: "text-danger",  label: "High" },
    attention: { dot: "bg-warning", text: "text-warning", label: "Attention" },
    major:     { dot: "bg-warning", text: "text-warning", label: "Major" },
    medium:    { dot: "bg-warning", text: "text-warning", label: "Medium" },
    routine:   { dot: "bg-success", text: "text-success", label: "Routine" },
    minor:     { dot: "bg-success", text: "text-success", label: "Minor" },
    low:       { dot: "bg-success", text: "text-success", label: "Low" },
    important: { dot: "bg-warning", text: "text-warning", label: "Important" },
  };
  const m = map[kind] || map.routine;
  return (
    <span className={clsx(
      "inline-flex items-center gap-1.5 text-[11px] tracking-[0.16em] uppercase font-medium",
      m.text,
    )}>
      <span className={clsx("h-1.5 w-1.5 rounded-full", m.dot)} />
      {m.label}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Citation pill
// ---------------------------------------------------------------------------

export function Citation({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button type="button" onClick={onClick} className="citation">
      <span className="opacity-60">§</span>
      {children}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Page header
// ---------------------------------------------------------------------------

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  right,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-6 mb-7">
      <div>
        {eyebrow && <div className="eyebrow mb-2">{eyebrow}</div>}
        <h1 className="text-[28px] font-semibold tracking-tight text-ink-900 leading-tight font-display">
          {title}
        </h1>
        {subtitle && <p className="text-[14px] text-ink-500 mt-1.5 max-w-2xl">{subtitle}</p>}
      </div>
      {right && <div className="flex items-center gap-2 shrink-0">{right}</div>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Section label (small uppercase header)
// ---------------------------------------------------------------------------

export function SectionLabel({
  children,
  right,
}: {
  children: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="text-[11px] tracking-[0.22em] uppercase text-ink-500 font-medium">{children}</div>
      {right}
    </div>
  );
}
