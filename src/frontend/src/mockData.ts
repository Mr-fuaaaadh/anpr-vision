import type {
  ANPRLog,
  Alert,
  Camera,
  Organization,
  Permission,
  User,
} from "./types";

const cameraLocations = [
  "Main Entrance Gate",
  "North Perimeter",
  "South Highway Entry",
  "East Junction",
  "West Boulevard",
  "City Center Plaza",
  "Industrial Zone A",
  "Port Terminal Gate 1",
  "Airport Access Road",
  "University Campus",
  "Shopping District",
  "Residential Block C",
  "Bridge Checkpoint",
  "Tunnel Entrance",
  "Stadium Parking",
  "Government Building",
  "Hospital Zone",
  "Railway Station",
  "Harbor Gate",
  "Logistics Hub",
];

const groupColors = [
  "from-blue-900 to-blue-700",
  "from-indigo-900 to-indigo-700",
  "from-slate-800 to-slate-600",
  "from-violet-900 to-violet-700",
  "from-cyan-900 to-cyan-700",
  "from-teal-900 to-teal-700",
];

export const cameras: Camera[] = cameraLocations.map((loc, i) => ({
  id: `cam-${String(i + 1).padStart(3, "0")}`,
  name: `CAM-${String(i + 1).padStart(3, "0")}`,
  location: loc,
  type: (["RTSP", "ONVIF", "Hikvision"] as const)[i % 3],
  status: i % 7 === 0 ? "offline" : i % 5 === 0 ? "recording" : "online",
  ip: `192.168.${Math.floor(i / 10) + 1}.${(i % 10) * 10 + 10}`,
  port: 554 + i,
  latency: Math.floor(Math.random() * 60) + 5,
  fps: [15, 20, 25, 30][i % 4],
  bitrate: Number.parseFloat((Math.random() * 4 + 1).toFixed(1)),
  lat: 25.2 + i * 0.03,
  lng: 55.3 + i * 0.025,
  streamUrl: `rtsp://192.168.${Math.floor(i / 10) + 1}.${(i % 10) * 10 + 10}:${554 + i}/stream`,
  groupColor: groupColors[i % groupColors.length],
}));

const plates = [
  "ABC 1234",
  "XYZ 5678",
  "DEF 9012",
  "GHI 3456",
  "JKL 7890",
  "MNO 2345",
  "PQR 6789",
  "STU 0123",
  "VWX 4567",
  "YZA 8901",
  "BCD 2468",
  "EFG 1357",
  "HIJ 3691",
  "KLM 2580",
  "NOP 7413",
  "QRS 8520",
  "TUV 9630",
  "WXY 1470",
  "ZAB 2581",
  "CDE 3692",
  "FGH 4703",
  "IJK 5814",
  "LMN 6925",
  "OPQ 7036",
  "RST 8147",
];

const vehicleTypes = ["Car", "Truck", "Motorcycle", "Van", "Bus"] as const;
const statusTypes = [
  "normal",
  "normal",
  "normal",
  "blacklisted",
  "whitelisted",
  "overspeed",
] as const;
const thumbnailColors = [
  "from-blue-800 to-blue-600",
  "from-purple-800 to-purple-600",
  "from-indigo-800 to-indigo-600",
  "from-cyan-800 to-cyan-600",
  "from-teal-800 to-teal-600",
];

function randomDate(daysBack: number): Date {
  const now = new Date();
  now.setMinutes(
    now.getMinutes() - Math.floor(Math.random() * daysBack * 24 * 60),
  );
  return now;
}

export const anprLogs: ANPRLog[] = Array.from({ length: 120 }, (_, i) => ({
  id: `log-${String(i + 1).padStart(4, "0")}`,
  plate: plates[i % plates.length],
  timestamp: randomDate(7),
  cameraId: cameras[i % cameras.length].id,
  cameraName: cameras[i % cameras.length].name,
  location: cameras[i % cameras.length].location,
  confidence: Math.floor(Math.random() * 30) + 70,
  vehicleType: vehicleTypes[i % vehicleTypes.length],
  status: statusTypes[i % statusTypes.length],
  thumbnailColor: thumbnailColors[i % thumbnailColors.length],
})).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

const alertMessages: Record<string, string[]> = {
  blacklist: [
    "Blacklisted vehicle detected at entry point",
    "Flagged plate attempting to access restricted zone",
    "Known offender vehicle identified",
  ],
  whitelist: [
    "VIP vehicle entered premises",
    "Authorized government vehicle detected",
  ],
  overspeed: [
    "Vehicle exceeded 80km/h speed limit",
    "Speeding detected in school zone",
    "Speed violation: 120km/h in 60km/h zone",
  ],
  loitering: [
    "Suspicious vehicle loitering for 45+ minutes",
    "Unregistered vehicle parked in no-parking zone",
  ],
};

export const alerts: Alert[] = Array.from({ length: 35 }, (_, i) => {
  const type = (
    ["blacklist", "overspeed", "blacklist", "loitering", "whitelist"] as const
  )[i % 5];
  const severity = (["critical", "high", "high", "medium", "low"] as const)[
    i % 5
  ];
  const msgs = alertMessages[type];
  return {
    id: `alert-${String(i + 1).padStart(3, "0")}`,
    severity,
    type,
    plate: plates[i % plates.length],
    cameraId: cameras[i % cameras.length].id,
    cameraName: cameras[i % cameras.length].name,
    message: msgs[i % msgs.length],
    timestamp: randomDate(3),
    acknowledged: i > 20,
    location: cameras[i % cameras.length].location,
  };
}).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

export const users: User[] = [
  {
    id: "usr-001",
    name: "Ethan Clarke",
    email: "ethan.clarke@smartcity.gov",
    role: "Admin",
    avatar: "EC",
    lastActive: randomDate(0.1),
    status: "active",
  },
  {
    id: "usr-002",
    name: "Priya Sharma",
    email: "priya.sharma@smartcity.gov",
    role: "Operator",
    avatar: "PS",
    lastActive: randomDate(0.5),
    status: "active",
  },
  {
    id: "usr-003",
    name: "Marcus Chen",
    email: "marcus.chen@smartcity.gov",
    role: "Operator",
    avatar: "MC",
    lastActive: randomDate(1),
    status: "active",
  },
  {
    id: "usr-004",
    name: "Sophie Laurent",
    email: "sophie.laurent@smartcity.gov",
    role: "Viewer",
    avatar: "SL",
    lastActive: randomDate(2),
    status: "inactive",
  },
  {
    id: "usr-005",
    name: "James Okafor",
    email: "james.okafor@smartcity.gov",
    role: "Viewer",
    avatar: "JO",
    lastActive: randomDate(0.2),
    status: "active",
  },
];

export const organizations: Organization[] = [
  {
    id: "org-001",
    name: "Smart City Authority",
    plan: "Enterprise",
    cameraCount: 247,
    cameraLimit: 500,
    apiCalls: 842000,
    apiLimit: 1000000,
    members: 24,
  },
  {
    id: "org-002",
    name: "Dubai Ports Security",
    plan: "Pro",
    cameraCount: 48,
    cameraLimit: 100,
    apiCalls: 120000,
    apiLimit: 250000,
    members: 8,
  },
  {
    id: "org-003",
    name: "Metro Transit Authority",
    plan: "Free",
    cameraCount: 5,
    cameraLimit: 10,
    apiCalls: 8000,
    apiLimit: 10000,
    members: 3,
  },
];

export const permissions: Permission[] = [
  { feature: "View Dashboard", admin: true, operator: true, viewer: true },
  { feature: "Manage Cameras", admin: true, operator: true, viewer: false },
  { feature: "Live Monitoring", admin: true, operator: true, viewer: true },
  { feature: "View ANPR Logs", admin: true, operator: true, viewer: true },
  { feature: "Export Reports", admin: true, operator: true, viewer: false },
  { feature: "Manage Alerts", admin: true, operator: true, viewer: false },
  { feature: "User Management", admin: true, operator: false, viewer: false },
  {
    feature: "Organization Settings",
    admin: true,
    operator: false,
    viewer: false,
  },
  { feature: "API Access", admin: true, operator: false, viewer: false },
  {
    feature: "System Configuration",
    admin: true,
    operator: false,
    viewer: false,
  },
];

export const recentDetections: ANPRLog[] = anprLogs.slice(0, 8);

export function generateFakeDetection(): ANPRLog {
  const idx = Math.floor(Math.random() * cameras.length);
  const cam = cameras[idx];
  return {
    id: `log-live-${Date.now()}`,
    plate: plates[Math.floor(Math.random() * plates.length)],
    timestamp: new Date(),
    cameraId: cam.id,
    cameraName: cam.name,
    location: cam.location,
    confidence: Math.floor(Math.random() * 25) + 75,
    vehicleType: vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)],
    status: Math.random() > 0.85 ? "blacklisted" : "normal",
    thumbnailColor:
      thumbnailColors[Math.floor(Math.random() * thumbnailColors.length)],
  };
}

export function generateFakeAlert(): Alert {
  const idx = Math.floor(Math.random() * cameras.length);
  const cam = cameras[idx];
  const type = (["blacklist", "overspeed", "loitering"] as const)[
    Math.floor(Math.random() * 3)
  ];
  const severity = (["critical", "high", "medium"] as const)[
    Math.floor(Math.random() * 3)
  ];
  return {
    id: `alert-live-${Date.now()}`,
    severity,
    type,
    plate: plates[Math.floor(Math.random() * plates.length)],
    cameraId: cam.id,
    cameraName: cam.name,
    message: alertMessages[type][0],
    timestamp: new Date(),
    acknowledged: false,
    location: cam.location,
  };
}

export const vehicleTrendData = [
  { day: "Mon", count: 28420 },
  { day: "Tue", count: 31250 },
  { day: "Wed", count: 29800 },
  { day: "Thu", count: 34180 },
  { day: "Fri", count: 38900 },
  { day: "Sat", count: 22100 },
  { day: "Sun", count: 18400 },
];

export const peakHoursData = Array.from({ length: 24 }, (_, h) => ({
  hour: h,
  count:
    h >= 7 && h <= 9
      ? Math.floor(Math.random() * 800 + 1200)
      : h >= 17 && h <= 19
        ? Math.floor(Math.random() * 900 + 1400)
        : h >= 22 || h <= 5
          ? Math.floor(Math.random() * 100 + 50)
          : Math.floor(Math.random() * 400 + 400),
}));
