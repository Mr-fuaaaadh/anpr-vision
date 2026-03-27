import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { Switch } from "@/components/ui/switch";
import { ShieldCheck, Trash2, UserPlus } from "lucide-react";
import { useState } from "react";
import { StatusBadge } from "../components/StatusBadge";
import {
  permissions as initialPermissions,
  users as initialUsers,
} from "../mockData";
import type { User, UserRole } from "../types";

export function UserManagement() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [permissions, setPermissions] = useState(initialPermissions);
  const [showInvite, setShowInvite] = useState(false);
  const [deleteUser, setDeleteUser] = useState<User | null>(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<UserRole>("Viewer");

  const handleInvite = () => {
    if (!inviteEmail) return;
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: inviteEmail.split("@")[0],
      email: inviteEmail,
      role: inviteRole,
      avatar: inviteEmail.slice(0, 2).toUpperCase(),
      lastActive: new Date(),
      status: "active",
    };
    setUsers((p) => [...p, newUser]);
    setShowInvite(false);
    setInviteEmail("");
  };

  const handleDelete = (user: User) => {
    setUsers((p) => p.filter((u) => u.id !== user.id));
    setDeleteUser(null);
  };

  const togglePermission = (
    feature: string,
    role: "admin" | "operator" | "viewer",
  ) => {
    setPermissions((prev) =>
      prev.map((p) => (p.feature === feature ? { ...p, [role]: !p[role] } : p)),
    );
  };

  const roleColors: Record<UserRole, string> = {
    Admin: "from-blue-800 to-blue-600",
    Operator: "from-green-800 to-green-600",
    Viewer: "from-slate-700 to-slate-600",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-foreground">
            Users &amp; Roles
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {users.length} members · Role-based access control
          </p>
        </div>
        <Button
          data-ocid="users.invite.open_modal_button"
          onClick={() => setShowInvite(true)}
          className="rounded-xl gap-2"
        >
          <UserPlus className="w-4 h-4" /> Invite User
        </Button>
      </div>

      {/* Users table */}
      <div className="glass-card-solid rounded-2xl overflow-hidden">
        <table className="w-full" data-ocid="users.table">
          <thead>
            <tr style={{ borderBottom: "1px solid oklch(var(--border))" }}>
              {[
                "User",
                "Email",
                "Role",
                "Last Active",
                "Status",
                "Actions",
              ].map((h) => (
                <th
                  key={h}
                  className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((user, i) => (
              <tr
                key={user.id}
                data-ocid={`users.table.row.${i + 1}`}
                className="hover:bg-accent/30 transition-colors"
                style={{ borderBottom: "1px solid oklch(var(--border))" }}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full bg-gradient-to-br ${roleColors[user.role]} flex items-center justify-center text-xs font-bold text-white`}
                    >
                      {user.avatar}
                    </div>
                    <span className="text-sm font-semibold text-foreground">
                      {user.name}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  {user.email}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={user.role} />
                </td>
                <td className="px-4 py-3 text-xs font-mono text-muted-foreground">
                  {user.lastActive.toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={user.status} />
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    data-ocid={`users.delete_button.${i + 1}`}
                    onClick={() => setDeleteUser(user)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Permission matrix */}
      <div className="glass-card-solid rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <ShieldCheck className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">
            Permission Matrix
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full" data-ocid="users.permissions.table">
            <thead>
              <tr style={{ borderBottom: "1px solid oklch(var(--border))" }}>
                <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Feature
                </th>
                {(["Admin", "Operator", "Viewer"] as UserRole[]).map((r) => (
                  <th
                    key={r}
                    className="text-center px-3 py-2 text-xs font-semibold uppercase tracking-wider"
                  >
                    <StatusBadge status={r} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {permissions.map((p, i) => (
                <tr
                  key={p.feature}
                  data-ocid={`users.permissions.row.${i + 1}`}
                  className="hover:bg-accent/30 transition-colors"
                  style={{ borderBottom: "1px solid oklch(var(--border))" }}
                >
                  <td className="px-3 py-3 text-sm text-foreground">
                    {p.feature}
                  </td>
                  {(["admin", "operator", "viewer"] as const).map((role) => (
                    <td key={role} className="px-3 py-3 text-center">
                      <Switch
                        data-ocid={`users.permission.${p.feature.toLowerCase().replace(/ /g, "_")}.${role}.switch`}
                        checked={p[role]}
                        onCheckedChange={() =>
                          togglePermission(p.feature, role)
                        }
                        disabled={role === "admin"}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite modal */}
      <Dialog open={showInvite} onOpenChange={setShowInvite}>
        <DialogContent
          className="sm:max-w-sm rounded-2xl"
          data-ocid="users.invite.dialog"
        >
          <DialogHeader>
            <DialogTitle>Invite User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Email Address</Label>
              <Input
                data-ocid="users.invite.email.input"
                type="email"
                placeholder="user@company.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Role</Label>
              <Select
                value={inviteRole}
                onValueChange={(v) => setInviteRole(v as UserRole)}
              >
                <SelectTrigger data-ocid="users.invite.role.select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(["Admin", "Operator", "Viewer"] as UserRole[]).map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              data-ocid="users.invite.cancel_button"
              variant="outline"
              onClick={() => setShowInvite(false)}
            >
              Cancel
            </Button>
            <Button
              data-ocid="users.invite.submit_button"
              onClick={handleInvite}
            >
              Send Invite
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteUser} onOpenChange={() => setDeleteUser(null)}>
        <AlertDialogContent data-ocid="users.delete.dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Remove User</AlertDialogTitle>
            <AlertDialogDescription>
              Remove {deleteUser?.name} from the organization? They will lose
              all access.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="users.delete.cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              data-ocid="users.delete.confirm_button"
              onClick={() => deleteUser && handleDelete(deleteUser)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
