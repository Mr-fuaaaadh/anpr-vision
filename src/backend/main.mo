import Text "mo:core/Text";
import Time "mo:core/Time";
import Array "mo:core/Array";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Principal "mo:core/Principal";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Initialize the prefabricated authorization system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  //------------------- TYPES -------------------
  type CameraType = {
    #rtsp;
    #onvif;
    #hikvision;
  };

  type CameraStatus = {
    #online;
    #offline;
    #recording;
  };

  type Camera = {
    name : Text;
    location : Text;
    cameraType : CameraType;
    status : CameraStatus;
    latencyMs : Nat;
    fps : Nat;
    bitrate : Nat;
    addedAt : Time.Time;
    organizationId : Nat;
  };

  type ANPRLogStatus = {
    #identified;
    #alert;
    #whitelisted;
  };

  type VehicleType = {
    #car;
    #truck;
    #motorcycle;
    #bus;
    #other;
  };

  type ANPRLog = {
    plateNumber : Text;
    timestamp : Time.Time;
    locationName : Text;
    cameraId : Nat;
    confidenceScore : Nat;
    vehicleType : VehicleType;
    status : ANPRLogStatus;
    organizationId : Nat;
  };

  type AlertType = {
    #blacklist;
    #whitelist;
    #overspeed;
  };

  type AlertSeverity = {
    #critical;
    #high;
    #medium;
    #low;
  };

  type Alert = {
    alertType : AlertType;
    severity : AlertSeverity;
    plateNumber : Text;
    cameraId : Nat;
    message : Text;
    triggeredAt : Time.Time;
    acknowledged : Bool;
    organizationId : Nat;
  };

  type OrganizationPlan = {
    #free;
    #pro;
    #enterprise;
  };

  type Organization = {
    name : Text;
    plan : OrganizationPlan;
    cameraLimit : Nat;
    apiCallsUsed : Nat;
    apiCallsLimit : Nat;
    createdAt : Time.Time;
  };

  type UserRoleType = {
    #admin;
    #operator;
    #viewer;
  };

  type UserRole = {
    userId : Principal;
    organizationId : Nat;
    role : UserRoleType;
    permissions : [Text];
  };

  public type UserProfile = {
    name : Text;
    organizationId : ?Nat;
  };

  //------------------- STATE -------------------
  let cameras = Map.empty<Nat, Camera>();
  let anprLogs = Map.empty<Nat, ANPRLog>();
  let alerts = Map.empty<Nat, Alert>();
  let organizations = Map.empty<Nat, Organization>();
  let userRoles = Map.empty<Principal, UserRole>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  var cameraIdCounter = 1;
  var anprLogIdCounter = 1;
  var alertIdCounter = 1;
  var organizationIdCounter = 1;

  //------------------- HELPER FUNCTIONS -------------------
  func getUserOrganizationId(caller : Principal) : ?Nat {
    switch (userRoles.get(caller)) {
      case (?role) { ?role.organizationId };
      case null { null };
    };
  };

  func hasOrganizationAccess(caller : Principal, organizationId : Nat) : Bool {
    // System admins have access to all organizations
    if (AccessControl.isAdmin(accessControlState, caller)) {
      return true;
    };
    
    // Check if user belongs to the organization
    switch (userRoles.get(caller)) {
      case (?role) { role.organizationId == organizationId };
      case null { false };
    };
  };

  func canModifyInOrganization(caller : Principal, organizationId : Nat) : Bool {
    // System admins can modify anything
    if (AccessControl.isAdmin(accessControlState, caller)) {
      return true;
    };
    
    // Check if user has admin or operator role in the organization
    switch (userRoles.get(caller)) {
      case (?role) {
        role.organizationId == organizationId and (
          switch (role.role) {
            case (#admin) { true };
            case (#operator) { true };
            case (#viewer) { false };
          }
        );
      };
      case null { false };
    };
  };

  func isOrganizationAdmin(caller : Principal, organizationId : Nat) : Bool {
    // System admins are admins everywhere
    if (AccessControl.isAdmin(accessControlState, caller)) {
      return true;
    };
    
    switch (userRoles.get(caller)) {
      case (?role) {
        role.organizationId == organizationId and (
          switch (role.role) {
            case (#admin) { true };
            case _ { false };
          }
        );
      };
      case null { false };
    };
  };

  //------------------- USER PROFILE MANAGEMENT -------------------
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  //------------------- CAMERA MANAGEMENT -------------------
  public shared ({ caller }) func addCamera(camera : Camera) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add cameras");
    };
    
    if (not canModifyInOrganization(caller, camera.organizationId)) {
      Runtime.trap("Unauthorized: Cannot add cameras to this organization");
    };
    
    let id = cameraIdCounter;
    cameraIdCounter += 1;
    let newCamera : Camera = {
      camera with
      addedAt = Time.now();
    };
    cameras.add(id, newCamera);
    id;
  };

  public shared ({ caller }) func updateCamera(id : Nat, camera : Camera) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update cameras");
    };
    
    switch (cameras.get(id)) {
      case (null) { Runtime.trap("Camera not found") };
      case (?existingCamera) {
        if (not canModifyInOrganization(caller, existingCamera.organizationId)) {
          Runtime.trap("Unauthorized: Cannot modify cameras in this organization");
        };
        
        // Prevent changing organizationId
        if (camera.organizationId != existingCamera.organizationId) {
          Runtime.trap("Cannot change camera organization");
        };
        
        cameras.add(id, camera);
      };
    };
  };

  public shared ({ caller }) func removeCamera(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can remove cameras");
    };
    
    switch (cameras.get(id)) {
      case (null) { Runtime.trap("Camera not found") };
      case (?camera) {
        if (not canModifyInOrganization(caller, camera.organizationId)) {
          Runtime.trap("Unauthorized: Cannot remove cameras from this organization");
        };
        cameras.remove(id);
      };
    };
  };

  public query ({ caller }) func getCamerasByOrganization(organizationId : Nat) : async [Camera] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view cameras");
    };
    
    if (not hasOrganizationAccess(caller, organizationId)) {
      Runtime.trap("Unauthorized: Cannot access this organization's cameras");
    };
    
    cameras.values().toArray().filter(
      func(camera : Camera) : Bool {
        camera.organizationId == organizationId;
      }
    );
  };

  //------------------- ANPR LOG MANAGEMENT -------------------
  public shared ({ caller }) func addANPRLog(log : ANPRLog) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add ANPR logs");
    };
    
    if (not canModifyInOrganization(caller, log.organizationId)) {
      Runtime.trap("Unauthorized: Cannot add logs to this organization");
    };
    
    let id = anprLogIdCounter;
    anprLogIdCounter += 1;
    let newLog : ANPRLog = {
      log with timestamp = Time.now();
    };
    anprLogs.add(id, newLog);
    id;
  };

  public query ({ caller }) func getANPRLogsByOrganization(organizationId : Nat) : async [ANPRLog] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view ANPR logs");
    };
    
    if (not hasOrganizationAccess(caller, organizationId)) {
      Runtime.trap("Unauthorized: Cannot access this organization's logs");
    };
    
    anprLogs.values().toArray().filter(
      func(log : ANPRLog) : Bool {
        log.organizationId == organizationId;
      }
    );
  };

  //------------------- ALERT MANAGEMENT -------------------
  public shared ({ caller }) func addAlert(alert : Alert) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add alerts");
    };
    
    if (not canModifyInOrganization(caller, alert.organizationId)) {
      Runtime.trap("Unauthorized: Cannot add alerts to this organization");
    };
    
    let id = alertIdCounter;
    alertIdCounter += 1;
    let newAlert : Alert = {
      alert with triggeredAt = Time.now();
    };
    alerts.add(id, newAlert);
    id;
  };

  public shared ({ caller }) func acknowledgeAlert(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can acknowledge alerts");
    };
    
    switch (alerts.get(id)) {
      case (null) { Runtime.trap("Alert not found") };
      case (?alert) {
        if (not canModifyInOrganization(caller, alert.organizationId)) {
          Runtime.trap("Unauthorized: Cannot acknowledge alerts in this organization");
        };
        
        let updatedAlert : Alert = {
          alert with acknowledged = true;
        };
        alerts.add(id, updatedAlert);
      };
    };
  };

  public query ({ caller }) func getAlertsByOrganization(organizationId : Nat) : async [Alert] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view alerts");
    };
    
    if (not hasOrganizationAccess(caller, organizationId)) {
      Runtime.trap("Unauthorized: Cannot access this organization's alerts");
    };
    
    alerts.values().toArray().filter(
      func(alert : Alert) : Bool {
        alert.organizationId == organizationId;
      }
    );
  };

  //------------------- ORGANIZATION MANAGEMENT -------------------
  public shared ({ caller }) func createOrganization(org : Organization) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create organizations");
    };
    
    let id = organizationIdCounter;
    organizationIdCounter += 1;
    let newOrg : Organization = {
      org with createdAt = Time.now();
    };
    organizations.add(id, newOrg);
    id;
  };

  public query ({ caller }) func getOrganization(id : Nat) : async Organization {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view organizations");
    };
    
    if (not hasOrganizationAccess(caller, id)) {
      Runtime.trap("Unauthorized: Cannot access this organization");
    };
    
    switch (organizations.get(id)) {
      case (null) { Runtime.trap("Organization not found") };
      case (?org) { org };
    };
  };

  public shared ({ caller }) func updateOrganizationPlan(id : Nat, plan : OrganizationPlan) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update organization plans");
    };
    
    switch (organizations.get(id)) {
      case (null) { Runtime.trap("Organization not found") };
      case (?org) {
        let updatedOrg : Organization = {
          org with plan;
        };
        organizations.add(id, updatedOrg);
      };
    };
  };

  //------------------- USER ROLE MANAGEMENT -------------------
  public shared ({ caller }) func assignUserRole(userRole : UserRole) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can assign roles");
    };
    
    // Only organization admins or system admins can assign roles
    if (not isOrganizationAdmin(caller, userRole.organizationId)) {
      Runtime.trap("Unauthorized: Only organization admins can assign roles");
    };
    
    userRoles.add(userRole.userId, userRole);
  };

  public query ({ caller }) func getUserRole(userId : Principal) : async ?UserRole {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view roles");
    };
    
    // Users can view their own role, or admins can view any role
    if (caller != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      switch (userRoles.get(caller)) {
        case (?callerRole) {
          switch (userRoles.get(userId)) {
            case (?targetRole) {
              // Can view if in same organization and caller is admin
              if (callerRole.organizationId != targetRole.organizationId) {
                Runtime.trap("Unauthorized: Cannot view roles from other organizations");
              };
              switch (callerRole.role) {
                case (#admin) { /* allowed */ };
                case _ { Runtime.trap("Unauthorized: Only organization admins can view other users' roles") };
              };
            };
            case null { /* target user has no role, return null */ };
          };
        };
        case null { Runtime.trap("Unauthorized: You must have a role to view other users' roles") };
      };
    };
    
    userRoles.get(userId);
  };

  //------------------- DEMO DATA SEEDING -------------------
  public shared ({ caller }) func seedDemoData() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can seed demo data");
    };

    // Seed Organizations
    let org1 : Organization = {
      name = "Demo Org 1";
      plan = #pro;
      cameraLimit = 10;
      apiCallsUsed = 0;
      apiCallsLimit = 10000;
      createdAt = Time.now();
    };
    let org2 : Organization = {
      name = "Demo Org 2";
      plan = #enterprise;
      cameraLimit = 50;
      apiCallsUsed = 0;
      apiCallsLimit = 50000;
      createdAt = Time.now();
    };
    organizations.add(1, org1);
    organizations.add(2, org2);
    organizationIdCounter := 3;

    // Seed Cameras
    let cam1 : Camera = {
      name = "Entrance Camera";
      location = "Main Entrance";
      cameraType = #rtsp;
      status = #online;
      latencyMs = 50;
      fps = 30;
      bitrate = 2000;
      addedAt = Time.now();
      organizationId = 1;
    };
    let cam2 : Camera = {
      name = "Parking Lot Camera";
      location = "Parking Area";
      cameraType = #onvif;
      status = #offline;
      latencyMs = 70;
      fps = 25;
      bitrate = 1800;
      addedAt = Time.now();
      organizationId = 1;
    };
    cameras.add(1, cam1);
    cameras.add(2, cam2);
    cameraIdCounter := 3;

    // Seed ANPR Logs
    let log1 : ANPRLog = {
      plateNumber = "AB123CD";
      timestamp = Time.now();
      locationName = "Main Entrance";
      cameraId = 1;
      confidenceScore = 95;
      vehicleType = #car;
      status = #identified;
      organizationId = 1;
    };
    let log2 : ANPRLog = {
      plateNumber = "EF456GH";
      timestamp = Time.now();
      locationName = "Parking Area";
      cameraId = 2;
      confidenceScore = 88;
      vehicleType = #truck;
      status = #alert;
      organizationId = 1;
    };
    anprLogs.add(1, log1);
    anprLogs.add(2, log2);
    anprLogIdCounter := 3;

    // Seed Alerts
    let alert1 : Alert = {
      alertType = #blacklist;
      severity = #critical;
      plateNumber = "EF456GH";
      cameraId = 2;
      message = "Blacklisted vehicle detected";
      triggeredAt = Time.now();
      acknowledged = false;
      organizationId = 1;
    };
    alerts.add(1, alert1);
    alertIdCounter := 2;

    // Seed User Roles
    let adminRole : UserRole = {
      userId = caller;
      organizationId = 1;
      role = #admin;
      permissions = ["manage_cameras", "view_logs", "manage_alerts", "manage_users"];
    };
    userRoles.add(caller, adminRole);
  };
};
