import { useState, startTransition } from "react";
import { reportServiceProxy } from "./reportService";
import type { ReportData, UserRole } from "./types";
import "./proxy-demo.css";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency: "CNY",
    maximumFractionDigits: 0,
  }).format(value);
}

export function ProxyPatternDemo() {
  const [role, setRole] = useState<UserRole>("analyst");
  const [report, setReport] = useState<ReportData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [version, setVersion] = useState(0);

  async function loadReport(forceRefresh = false) {
    setLoading(true);
    setError("");

    try {
      const nextReport = await reportServiceProxy.getWeeklyReport(
        role,
        forceRefresh,
      );
      setReport(nextReport);
      startTransition(() => {
        setVersion((current) => current + 1);
      });
    } catch (caughtError) {
      setReport(null);
      setError(caughtError instanceof Error ? caughtError.message : "读取失败");
      startTransition(() => {
        setVersion((current) => current + 1);
      });
    } finally {
      setLoading(false);
    }
  }

  const logs = reportServiceProxy.getLogs();

  return (
    <div className="proxy-demo">
      <div className="proxy-hero">
        <div>
          <span className="proxy-eyebrow">Runnable Demo</span>
          <h2>报表访问代理</h2>
          <p>
            组件并不直接请求真实报表服务，而是统一经过代理层。代理负责权限判断、缓存命中和访问日志。
          </p>
        </div>
        <div className="proxy-status-card">
          <span>当前角色</span>
          <strong>{role}</strong>
          <small>{loading ? "代理处理中..." : "可以发起报表访问"}</small>
        </div>
      </div>

      <div className="proxy-grid">
        <section className="proxy-card">
          <span className="proxy-card-label">角色切换</span>
          <div className="proxy-role-list">
            {(["guest", "analyst", "admin"] as UserRole[]).map((item) => (
              <button
                key={item}
                type="button"
                className={item === role ? "is-active" : undefined}
                onClick={() => setRole(item)}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="proxy-actions">
            <button
              type="button"
              disabled={loading}
              onClick={() => loadReport(false)}
            >
              {loading ? "读取中..." : "读取报表"}
            </button>
            <button
              type="button"
              className="secondary"
              disabled={loading}
              onClick={() => loadReport(true)}
            >
              强制刷新
            </button>
          </div>
        </section>

        <section className="proxy-card proxy-report-card">
          <span className="proxy-card-label">报表结果</span>
          {error ? (
            <div className="proxy-error">{error}</div>
          ) : report ? (
            <div className="proxy-report-content">
              <strong>{report.title}</strong>
              <p>营收：{formatCurrency(report.revenue)}</p>
              <p>转化率：{(report.conversionRate * 100).toFixed(1)}%</p>
              <p>生成时间：{report.generatedAt}</p>
              <span
                className={
                  report.fromCache ? "proxy-tag cache" : "proxy-tag live"
                }
              >
                {report.fromCache ? "来自代理缓存" : "真实服务结果"}
              </span>
            </div>
          ) : (
            <p className="proxy-empty">点击按钮后，通过代理层读取报表。</p>
          )}
        </section>

        <section className="proxy-card">
          <span className="proxy-card-label">访问日志</span>
          <ul className="proxy-log-list" key={version}>
            {logs.length === 0 ? (
              <li>代理日志还为空，先执行一次访问。</li>
            ) : (
              logs.map((log) => <li key={log.id}>{log.message}</li>)
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}
