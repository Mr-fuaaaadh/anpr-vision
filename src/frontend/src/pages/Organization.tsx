import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Check } from "lucide-react";
import { StatusBadge } from "../components/StatusBadge";
import { organizations } from "../mockData";
import { peakHoursData } from "../mockData";

const plans = [
  {
    name: "Free",
    price: "$0",
    features: [
      "Up to 10 cameras",
      "7 day log retention",
      "Email alerts",
      "Basic reports",
    ],
    missing: ["Live monitoring", "API access", "Multi-user"],
    cta: "Current Plan",
    ctaVariant: "outline" as const,
  },
  {
    name: "Pro",
    price: "$199",
    features: [
      "Up to 100 cameras",
      "30 day retention",
      "All alert types",
      "Advanced reports",
      "API access",
      "5 users",
    ],
    missing: ["Unlimited cameras"],
    cta: "Upgrade to Pro",
    ctaVariant: "default" as const,
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    features: [
      "Unlimited cameras",
      "Unlimited retention",
      "All features",
      "Dedicated support",
      "SLA guarantee",
      "Custom integrations",
      "Unlimited users",
    ],
    missing: [],
    cta: "Contact Sales",
    ctaVariant: "default" as const,
  },
];

function UsageBarChart() {
  const data = [
    10, 18, 45, 80, 120, 200, 180, 160, 200, 247, 240, 230, 220, 210, 190, 180,
    210, 247, 230, 200, 160, 120, 80, 40,
  ];
  const dMax = Math.max(...data);
  return (
    <div className="flex items-end gap-1 h-24 w-full">
      {data.map((v, i) => (
        <div
          key={String(v) + String(i)}
          className="flex-1 rounded-t-sm transition-all"
          style={{
            height: `${(v / dMax) * 100}%`,
            background: `oklch(${0.35 + (v / dMax) * 0.27} 0.19 260)`,
          }}
          title={`${v} cameras`}
        />
      ))}
    </div>
  );
}

export function Organization() {
  const org = organizations[0];

  return (
    <div className="space-y-6">
      {/* Current org */}
      <div
        className="glass-card-solid rounded-2xl p-6"
        data-ocid="org.overview.card"
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white"
                style={{ background: "oklch(var(--primary))" }}
              >
                {org.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">
                  {org.name}
                </h1>
                <StatusBadge status={org.plan} />
              </div>
            </div>
          </div>
          <Button
            data-ocid="org.settings.button"
            variant="outline"
            size="sm"
            className="rounded-xl"
          >
            Settings
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">
                Cameras Used
              </span>
              <span className="text-xs font-semibold text-foreground">
                {org.cameraCount} / {org.cameraLimit}
              </span>
            </div>
            <Progress
              data-ocid="org.cameras.progress"
              value={(org.cameraCount / org.cameraLimit) * 100}
              className="h-2"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">
                API Calls (this month)
              </span>
              <span className="text-xs font-semibold text-foreground">
                {(org.apiCalls / 1000).toFixed(0)}K /{" "}
                {(org.apiLimit / 1000).toFixed(0)}K
              </span>
            </div>
            <Progress
              data-ocid="org.api.progress"
              value={(org.apiCalls / org.apiLimit) * 100}
              className="h-2"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">
                Team Members
              </span>
              <span className="text-xs font-semibold text-foreground">
                {org.members}
              </span>
            </div>
            <Progress value={(org.members / 30) * 100} className="h-2" />
          </div>
        </div>
      </div>

      {/* Camera usage over time */}
      <div className="glass-card-solid rounded-2xl p-5">
        <h2 className="text-sm font-semibold text-foreground mb-4">
          Camera Usage Over Time (Today)
        </h2>
        <UsageBarChart />
        <div className="flex items-center justify-between mt-2">
          <span className="text-[10px] text-muted-foreground">00:00</span>
          <span className="text-[10px] text-muted-foreground">12:00</span>
          <span className="text-[10px] text-muted-foreground">23:59</span>
        </div>
      </div>

      {/* Plan comparison */}
      <div>
        <h2 className="text-sm font-semibold text-foreground mb-4">
          Plan Comparison
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <div
              key={plan.name}
              data-ocid={`org.plan_${plan.name.toLowerCase()}.card`}
              className={`glass-card-solid rounded-2xl p-5 relative ${
                plan.highlight ? "ring-2 ring-primary/40" : ""
              }`}
            >
              {plan.highlight && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-bold text-white"
                  style={{ background: "oklch(var(--primary))" }}
                >
                  POPULAR
                </div>
              )}
              <div className="mb-4">
                <StatusBadge status={plan.name} />
                <p className="text-2xl font-bold text-foreground mt-2">
                  {plan.price}
                </p>
                <p className="text-xs text-muted-foreground">
                  {plan.name !== "Free" ? "/ month" : "forever"}
                </p>
              </div>
              <ul className="space-y-2 mb-4">
                {plan.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2 text-sm text-foreground"
                  >
                    <Check className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                    {f}
                  </li>
                ))}
                {plan.missing.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2 text-sm text-muted-foreground line-through"
                  >
                    <span className="w-3.5 h-3.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                data-ocid={`org.plan_${plan.name.toLowerCase()}.button`}
                variant={plan.ctaVariant}
                className="w-full rounded-xl"
                disabled={plan.name === org.plan}
              >
                {plan.name === org.plan ? "Current Plan" : plan.cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
