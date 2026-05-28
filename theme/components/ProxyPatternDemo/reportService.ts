import type { AccessLog, ReportData, UserRole } from "./types";

function nowTime() {
  return new Intl.DateTimeFormat("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date());
}

function wait(duration: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
}

class ReportService {
  async getWeeklyReport(role: UserRole): Promise<ReportData> {
    await wait(700);

    const baseRevenue = role === "admin" ? 368000 : 214000;
    const conversionRate = role === "admin" ? 0.193 : 0.157;

    return {
      title: role === "admin" ? "全站周报" : "运营周报",
      revenue: baseRevenue,
      conversionRate,
      generatedAt: nowTime(),
      fromCache: false,
    };
  }
}

class ReportServiceProxy {
  private realService = new ReportService();
  private cache = new Map<UserRole, ReportData>();
  private logs: AccessLog[] = [];
  private sequence = 0;

  getLogs() {
    return this.logs;
  }

  async getWeeklyReport(
    role: UserRole,
    forceRefresh = false,
  ): Promise<ReportData> {
    this.pushLog(`角色 ${role} 发起了报表访问`);

    if (role === "guest") {
      this.pushLog("代理拦截：guest 没有报表权限");
      throw new Error("访客没有查看报表的权限");
    }

    if (!forceRefresh) {
      const cachedReport = this.cache.get(role);

      if (cachedReport) {
        this.pushLog(`代理命中缓存：直接返回 ${role} 的历史结果`);
        return {
          ...cachedReport,
          fromCache: true,
        };
      }
    }

    this.pushLog(`代理放行：调用真实 ReportService 获取 ${role} 报表`);
    const report = await this.realService.getWeeklyReport(role);
    this.cache.set(role, report);
    this.pushLog(`代理写入缓存：${role} 报表已缓存`);
    return report;
  }

  private pushLog(message: string) {
    this.sequence += 1;
    this.logs = [
      {
        id: this.sequence,
        message: `${nowTime()} · ${message}`,
      },
      ...this.logs,
    ].slice(0, 6);
  }
}

export const reportServiceProxy = new ReportServiceProxy();
