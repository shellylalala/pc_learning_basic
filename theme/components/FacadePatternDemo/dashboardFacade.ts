import type { DashboardSnapshot, UserRole } from "./types";

function wait(duration: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
}

async function fetchProfile(role: UserRole) {
  await wait(180);

  return {
    name:
      role === "admin"
        ? "平台管理员"
        : role === "editor"
          ? "内容运营"
          : "访客用户",
  };
}

async function fetchPermissions(role: UserRole) {
  await wait(160);

  if (role === "admin") {
    return ["dashboard:view", "report:export", "user:manage"];
  }

  if (role === "editor") {
    return ["dashboard:view", "article:publish"];
  }

  return ["dashboard:view"];
}

async function fetchFeatureFlags(role: UserRole) {
  await wait(140);

  if (role === "admin") {
    return ["ai-summary", "advanced-panel", "heatmap"];
  }

  if (role === "editor") {
    return ["ai-summary", "draft-insight"];
  }

  return ["basic-home"];
}

async function fetchUnreadCount(role: UserRole) {
  await wait(120);

  if (role === "admin") {
    return 12;
  }

  if (role === "editor") {
    return 5;
  }

  return 1;
}

export async function initializeDashboard(
  role: UserRole,
): Promise<DashboardSnapshot> {
  const profile = await fetchProfile(role);
  const permissions = await fetchPermissions(role);
  const featureFlags = await fetchFeatureFlags(role);
  const unreadCount = await fetchUnreadCount(role);

  return {
    userName: profile.name,
    role,
    permissions,
    featureFlags,
    unreadCount,
    notice: `控制台初始化完成，已聚合 ${permissions.length} 项权限与 ${featureFlags.length} 个开关。`,
  };
}
