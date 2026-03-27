# ANPR Vision

## Current State
Full-featured enterprise ANPR dashboard with 8 modules (Dashboard, Cameras, Live Monitoring, ANPR Logs, Alerts, Organization, Users, Reports). The app uses a left sidebar + topbar layout with mostly desktop-only responsive classes. Key issues on mobile:
- Sidebar is fixed-width with no mobile drawer/overlay behavior
- TopBar has hidden sm/md/lg elements but no mobile menu button
- Dashboard grids are `xl:grid-cols-4` with no sm-level breakpoints for KPIs
- Camera feed grid is 3-col fixed
- Tables (Camera Management, ANPR Logs) have no card-fallback on mobile
- Live Monitoring layout controls and grid have no mobile stack
- Most `p-6` page padding not reduced on mobile

## Requested Changes (Diff)

### Add
- Mobile bottom navigation bar (8 nav items, icon + label, active highlight) shown on `md:` breakpoint and below, hidden on desktop
- Mobile sidebar drawer (overlay, slide-in from left) triggered by hamburger in TopBar on mobile
- Hamburger menu button in TopBar visible only on mobile

### Modify
- **Sidebar**: Hide entirely on mobile (`hidden md:flex`). The bottom nav handles mobile navigation.
- **TopBar**: Add hamburger button on mobile (left side) to open drawer. Reduce padding on mobile.
- **App.tsx**: Add `mobileDrawerOpen` state; pass to Sidebar as overlay drawer mode on mobile
- **Dashboard**:
  - KPI grid: `grid-cols-2 xl:grid-cols-4` (already done, keep)
  - Camera feeds: `grid-cols-2 sm:grid-cols-3` 
  - Right panel (detections + map): Stack below on mobile, side-by-side on xl
  - Timeline: Already `lg:grid-cols-2`, ensure 1-col on mobile
  - Reduce page padding: `p-4 md:p-6`
- **Camera Management**: 
  - On mobile (`< md`), hide table view entirely and show card grid always
  - Toolbar: stack search + actions vertically on mobile
  - Table: horizontal scroll wrapper for table on tablet
- **ANPR Logs**: 
  - On mobile, replace table rows with stacked cards (plate, camera, time, confidence badge, status)
  - Filters: wrap/scroll horizontally on mobile
  - Pagination: compact on mobile
- **Live Monitoring**: 
  - Layout selector buttons: show icon-only on mobile
  - Camera grid: force 1-col on mobile regardless of selected layout; 2-col on sm; follow selected layout on md+
- **Alerts**: 
  - Tab list: horizontal scroll on mobile
  - Alert cards: already card-based, reduce padding
- **Organization**: 
  - Plan cards: stack to 1-col on mobile
  - Usage section: stack metrics
- **User Management**: 
  - Permission matrix: horizontal scroll
  - User list: card layout on mobile
- **Reports**:
  - Chart cards: full-width stack on mobile
  - Heatmap: horizontal scroll
- **Live alert popup**: Position `bottom-16` on mobile (above bottom nav), `bottom-6` on md+
- **Page padding**: `p-4 md:p-6` everywhere

### Remove
- Nothing removed

## Implementation Plan
1. Update `App.tsx`: add drawer state, pass to Sidebar, add bottom nav component, adjust alert popup position
2. Update `Sidebar.tsx`: support overlay drawer mode on mobile; add close button in drawer
3. Update `TopBar.tsx`: add hamburger button on mobile
4. Create `BottomNav.tsx`: mobile-only bottom navigation bar with 8 items
5. Update `Dashboard.tsx`: responsive camera grid, stacked panels
6. Update `CameraManagement.tsx`: card-only on mobile, scrollable table on tablet+
7. Update `ANPRLogs.tsx`: card layout on mobile for log rows
8. Update `LiveMonitoring.tsx`: responsive grid, icon-only layout buttons on mobile
9. Update `Alerts.tsx`, `Organization.tsx`, `UserManagement.tsx`, `Reports.tsx`: responsive stacking and scroll
10. Reduce `p-6` to `p-4 md:p-6` across all pages
