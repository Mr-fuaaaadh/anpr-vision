export type CameraStatus = "online" | "offline" | "recording";
export type CameraType = "RTSP" | "ONVIF" | "Hikvision";
export type AlertSeverity = "critical" | "high" | "medium" | "low";
export type AlertType = "blacklist" | "whitelist" | "overspeed" | "loitering";
export type UserRole = "Admin" | "Operator" | "Viewer";
export type VehicleType = "Car" | "Truck" | "Motorcycle" | "Van" | "Bus";
export type PlanType = "Free" | "Pro" | "Enterprise";

export interface Camera {
  id: string;
  name: string;
  location: string;
  type: CameraType;
  status: CameraStatus;
  ip: string;
  port: number;
  latency: number; // ms
  fps: number;
  bitrate: number; // Mbps
  lat: number;
  lng: number;
  streamUrl: string;
  groupColor: string;
}

export interface ANPRLog {
  id: string;
  plate: string;
  timestamp: Date;
  cameraId: string;
  cameraName: string;
  location: string;
  confidence: number;
  vehicleType: VehicleType;
  status: "normal" | "blacklisted" | "whitelisted" | "overspeed";
  thumbnailColor: string;
}

export interface Alert {
  id: string;
  severity: AlertSeverity;
  type: AlertType;
  plate: string;
  cameraId: string;
  cameraName: string;
  message: string;
  timestamp: Date;
  acknowledged: boolean;
  location: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  lastActive: Date;
  status: "active" | "inactive";
}

export interface Organization {
  id: string;
  name: string;
  plan: PlanType;
  cameraCount: number;
  cameraLimit: number;
  apiCalls: number;
  apiLimit: number;
  members: number;
}

export interface Permission {
  feature: string;
  admin: boolean;
  operator: boolean;
  viewer: boolean;
}
