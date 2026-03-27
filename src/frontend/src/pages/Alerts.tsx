import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertTriangle,
  Check,
  Eye,
  Plus,
  ShieldAlert,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { StatusBadge } from "../components/StatusBadge";
import { alerts as initialAlerts } from "../mockData";
import type { Alert, AlertSeverity, AlertType } from "../types";

const severityIcon: Record<AlertSeverity, React.ReactNode> = {
  critical: <AlertTriangle className="w-4 h-4 text-red-400" />,
  high: <ShieldAlert className="w-4 h-4 text-orange-400" />,
  medium: <Zap className="w-4 h-4 text-yellow-400" />,
  low: <Eye className="w-4 h-4 text-blue-400" />,
};

const severityBg: Record<AlertSeverity, string> = {
  critical: "border-l-red-500",
  high: "border-l-orange-400",
  medium: "border-l-yellow-400",
  low: "border-l-blue-400",
};

const ruleAlerts: Alert[] = [
  {
    id: "rule-001",
    severity: "critical",
    type: "blacklist",
    plate: "XYZ 5678",
    cameraId: "cam-001",
    cameraName: "CAM-001",
    message: "Blacklist rule active — known offender vehicle",
    timestamp: new Date(),
    acknowledged: false,
    location: "Main Entrance Gate",
  },
  {
    id: "rule-002",
    severity: "medium",
    type: "overspeed",
    plate: "ABC 1234",
    cameraId: "cam-005",
    cameraName: "CAM-005",
    message: "Speed limit: 60km/h — trigger: above 80km/h",
    timestamp: new Date(),
    acknowledged: false,
    location: "South Highway Entry",
  },
];

const emptyRule = {
  type: "blacklist" as AlertType,
  plate: "",
  condition: "",
  action: "notify",
};

function AlertCard({
  alert,
  onAck,
}: { alert: Alert; onAck: (id: string) => void }) {
  return (
    <div
      data-ocid={`alerts.alert.item.${alert.id.slice(-3)}`}
      className={`glass-card-solid rounded-xl p-4 flex items-start gap-3 border-l-2 ${severityBg[alert.severity]} ${
        alert.acknowledged ? "opacity-50" : ""
      }`}
    >
      <div className="mt-0.5 flex-shrink-0">{severityIcon[alert.severity]}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-sm font-bold text-foreground tracking-wider">
                {alert.plate}
              </span>
              <StatusBadge status={alert.severity} />
              <span
                className="px-2 py-0.5 rounded-full text-[10px] font-medium"
                style={{
                  background: "oklch(var(--muted))",
                  color: "oklch(var(--muted-foreground))",
                }}
              >
                {alert.type}
              </span>
            </div>
            <p className="text-sm text-foreground">{alert.message}</p>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="text-[10px] font-mono text-blue-400">
                {alert.cameraName}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {alert.location}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {alert.timestamp.toLocaleTimeString()}
              </span>
            </div>
          </div>
          {!alert.acknowledged && (
            <button
              type="button"
              data-ocid={`alerts.ack.button.${alert.id.slice(-3)}`}
              onClick={() => onAck(alert.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-green-400 bg-green-500/10 hover:bg-green-500/20 transition-colors flex-shrink-0"
            >
              <Check className="w-3 h-3" /> Ack
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function Alerts() {
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const [showRuleModal, setShowRuleModal] = useState(false);
  const [ruleForm, setRuleForm] = useState(emptyRule);

  const handleAck = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a)),
    );
  };

  const unacked = alerts.filter((a) => !a.acknowledged);
  const critical = alerts.filter((a) => a.severity === "critical");
  const blacklistAlerts = alerts.filter((a) => a.type === "blacklist");
  const overspeedAlerts = alerts.filter((a) => a.type === "overspeed");

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-foreground">Alert System</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {unacked.length} unacknowledged · {critical.length} critical
          </p>
        </div>
        <Button
          data-ocid="alerts.add_rule.open_modal_button"
          onClick={() => setShowRuleModal(true)}
          className="rounded-xl gap-2"
        >
          <Plus className="w-4 h-4" /> Add Rule
        </Button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total", value: alerts.length, color: "text-foreground" },
          { label: "Critical", value: critical.length, color: "text-red-400" },
          { label: "Unacked", value: unacked.length, color: "text-orange-400" },
          {
            label: "Resolved",
            value: alerts.length - unacked.length,
            color: "text-green-400",
          },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className="glass-card-solid rounded-xl p-3 text-center"
          >
            <p className={`text-xl font-bold ${color}`}>{value}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <Tabs defaultValue="all" data-ocid="alerts.tabs">
        <TabsList
          className="rounded-xl overflow-x-auto flex-nowrap w-full justify-start"
          data-ocid="alerts.tab"
        >
          <TabsTrigger value="all" data-ocid="alerts.all.tab">
            All Alerts
          </TabsTrigger>
          <TabsTrigger value="blacklist" data-ocid="alerts.blacklist.tab">
            Blacklist
          </TabsTrigger>
          <TabsTrigger value="overspeed" data-ocid="alerts.overspeed.tab">
            Overspeed
          </TabsTrigger>
          <TabsTrigger value="rules" data-ocid="alerts.rules.tab">
            Rules
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="all"
          className="mt-4 space-y-2"
          data-ocid="alerts.all.panel"
        >
          {alerts.map((a) => (
            <AlertCard key={a.id} alert={a} onAck={handleAck} />
          ))}
        </TabsContent>

        <TabsContent
          value="blacklist"
          className="mt-4 space-y-2"
          data-ocid="alerts.blacklist.panel"
        >
          {blacklistAlerts.map((a) => (
            <AlertCard key={a.id} alert={a} onAck={handleAck} />
          ))}
        </TabsContent>

        <TabsContent
          value="overspeed"
          className="mt-4 space-y-2"
          data-ocid="alerts.overspeed.panel"
        >
          {overspeedAlerts.length === 0 ? (
            <div
              className="text-center py-10 text-muted-foreground"
              data-ocid="alerts.overspeed.empty_state"
            >
              No overspeed alerts
            </div>
          ) : (
            overspeedAlerts.map((a) => (
              <AlertCard key={a.id} alert={a} onAck={handleAck} />
            ))
          )}
        </TabsContent>

        <TabsContent
          value="rules"
          className="mt-4"
          data-ocid="alerts.rules.panel"
        >
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Active alert rules</p>
            {ruleAlerts.map((r, i) => (
              <div
                key={r.id}
                data-ocid={`alerts.rules.item.${i + 1}`}
                className={`glass-card-solid rounded-xl p-4 flex items-center gap-3 border-l-2 ${severityBg[r.severity]}`}
              >
                {severityIcon[r.severity]}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">
                    {r.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Plate: {r.plate} · Location: {r.location}
                  </p>
                </div>
                <StatusBadge status={r.severity} />
                <button
                  type="button"
                  data-ocid={`alerts.rules.delete_button.${i + 1}`}
                  className="text-muted-foreground hover:text-red-400 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Rule Modal */}
      <Dialog open={showRuleModal} onOpenChange={setShowRuleModal}>
        <DialogContent
          className="sm:max-w-md rounded-2xl"
          data-ocid="alerts.add_rule.dialog"
        >
          <DialogHeader>
            <DialogTitle>Add Alert Rule</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Rule Type</Label>
              <Select
                value={ruleForm.type}
                onValueChange={(v) =>
                  setRuleForm((p) => ({ ...p, type: v as AlertType }))
                }
              >
                <SelectTrigger data-ocid="alerts.add_rule.type.select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(
                    [
                      "blacklist",
                      "whitelist",
                      "overspeed",
                      "loitering",
                    ] as AlertType[]
                  ).map((t) => (
                    <SelectItem key={t} value={t}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Plate Pattern</Label>
              <Input
                data-ocid="alerts.add_rule.plate.input"
                placeholder="e.g. ABC 1234 or * for all"
                value={ruleForm.plate}
                onChange={(e) =>
                  setRuleForm((p) => ({ ...p, plate: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>Condition</Label>
              <Input
                data-ocid="alerts.add_rule.condition.input"
                placeholder="e.g. speed > 80 km/h"
                value={ruleForm.condition}
                onChange={(e) =>
                  setRuleForm((p) => ({ ...p, condition: e.target.value }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              data-ocid="alerts.add_rule.cancel_button"
              variant="outline"
              onClick={() => setShowRuleModal(false)}
            >
              Cancel
            </Button>
            <Button
              data-ocid="alerts.add_rule.submit_button"
              onClick={() => setShowRuleModal(false)}
            >
              Save Rule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
