import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface UserRole {
    organizationId: bigint;
    permissions: Array<string>;
    userId: Principal;
    role: UserRoleType;
}
export interface ANPRLog {
    status: ANPRLogStatus;
    organizationId: bigint;
    vehicleType: VehicleType;
    confidenceScore: bigint;
    plateNumber: string;
    timestamp: Time;
    locationName: string;
    cameraId: bigint;
}
export interface Camera {
    fps: bigint;
    status: CameraStatus;
    organizationId: bigint;
    name: string;
    latencyMs: bigint;
    addedAt: Time;
    cameraType: CameraType;
    location: string;
    bitrate: bigint;
}
export interface Alert {
    organizationId: bigint;
    alertType: AlertType;
    acknowledged: boolean;
    triggeredAt: Time;
    plateNumber: string;
    message: string;
    severity: AlertSeverity;
    cameraId: bigint;
}
export interface Organization {
    apiCallsUsed: bigint;
    name: string;
    createdAt: Time;
    plan: OrganizationPlan;
    cameraLimit: bigint;
    apiCallsLimit: bigint;
}
export interface UserProfile {
    organizationId?: bigint;
    name: string;
}
export enum ANPRLogStatus {
    alert = "alert",
    whitelisted = "whitelisted",
    identified = "identified"
}
export enum AlertSeverity {
    low = "low",
    high = "high",
    critical = "critical",
    medium = "medium"
}
export enum AlertType {
    blacklist = "blacklist",
    whitelist = "whitelist",
    overspeed = "overspeed"
}
export enum CameraStatus {
    offline = "offline",
    recording = "recording",
    online = "online"
}
export enum CameraType {
    onvif = "onvif",
    rtsp = "rtsp",
    hikvision = "hikvision"
}
export enum OrganizationPlan {
    pro = "pro",
    enterprise = "enterprise",
    free = "free"
}
export enum UserRoleType {
    admin = "admin",
    operator = "operator",
    viewer = "viewer"
}
export enum UserRole__1 {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum VehicleType {
    bus = "bus",
    car = "car",
    truck = "truck",
    motorcycle = "motorcycle",
    other = "other"
}
export interface backendInterface {
    acknowledgeAlert(id: bigint): Promise<void>;
    addANPRLog(log: ANPRLog): Promise<bigint>;
    addAlert(alert: Alert): Promise<bigint>;
    addCamera(camera: Camera): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole__1): Promise<void>;
    assignUserRole(userRole: UserRole): Promise<void>;
    createOrganization(org: Organization): Promise<bigint>;
    getANPRLogsByOrganization(organizationId: bigint): Promise<Array<ANPRLog>>;
    getAlertsByOrganization(organizationId: bigint): Promise<Array<Alert>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole__1>;
    getCamerasByOrganization(organizationId: bigint): Promise<Array<Camera>>;
    getOrganization(id: bigint): Promise<Organization>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUserRole(userId: Principal): Promise<UserRole | null>;
    isCallerAdmin(): Promise<boolean>;
    removeCamera(id: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    seedDemoData(): Promise<void>;
    updateCamera(id: bigint, camera: Camera): Promise<void>;
    updateOrganizationPlan(id: bigint, plan: OrganizationPlan): Promise<void>;
}
