import { useState, startTransition } from "react";
import { initializeDashboard } from "./dashboardFacade";
import type { DashboardSnapshot, UserRole } from "./types";
import "./facade-demo.css";

export function FacadePatternDemo() {
  const [role, setRole] = useState<UserRole>("editor");
  const [loading, setLoading] = useState(false);
  const [snapshot, setSnapshot] = useState<DashboardSnapshot | null>(null);
  const [error, setError] = useState("");

  async function handleInitialize() {
    setLoading(true);
    setError("");

    try {
      const nextSnapshot = await initializeDashboard(role);
      startTransition(() => {
        setSnapshot(nextSnapshot);
      });
    } catch (caughtError) {
      setSnapshot(null);
      setError(
        caughtError instanceof Error ? caughtError.message : "初始化失败",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="facade-demo">
      <div className="facade-hero">
        <div>
          <span className="facade-eyebrow">Runnable Demo</span>
          <h2>控制台初始化外观</h2>
          <p>
            页面不再自己编排多个子系统，而是统一调用一个 facade
            入口，直接拿到控制台所需的聚合结果。
          </p>
        </div>
        <div className="facade-status-card">
          <span>初始化入口</span>
          <strong>initializeDashboard()</strong>
          <small>
            {loading ? "Facade 正在协调各子系统..." : "等待发起控制台初始化"}
          </small>
        </div>
      </div>

      <div className="facade-grid">
        <section className="facade-card">
          <span className="facade-card-label">角色切换</span>
          <div className="facade-role-list">
            {(["guest", "editor", "admin"] as UserRole[]).map((item) => (
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
          <div className="facade-actions">
            <button type="button" disabled={loading} onClick={handleInitialize}>
              {loading ? "初始化中..." : "初始化控制台"}
            </button>
          </div>
        </section>

        <section className="facade-card facade-result-card">
          <span className="facade-card-label">聚合结果</span>
          {error ? <div className="facade-error">{error}</div> : null}
          {snapshot ? (
            <div className="facade-result">
              <strong>{snapshot.userName}</strong>
              <p>角色：{snapshot.role}</p>
              <p>未读消息：{snapshot.unreadCount}</p>
              <p>{snapshot.notice}</p>
            </div>
          ) : (
            <p className="facade-empty">
              点击初始化后，这里会展示 facade 汇总后的控制台快照。
            </p>
          )}
        </section>

        <section className="facade-card">
          <span className="facade-card-label">子系统结果</span>
          {snapshot ? (
            <>
              <div className="facade-tags">
                {snapshot.permissions.map((permission) => (
                  <span key={permission} className="facade-tag permission">
                    {permission}
                  </span>
                ))}
              </div>
              <div className="facade-tags second-row">
                {snapshot.featureFlags.map((flag) => (
                  <span key={flag} className="facade-tag flag">
                    {flag}
                  </span>
                ))}
              </div>
            </>
          ) : (
            <p className="facade-empty">
              权限、开关和消息数会由 facade 统一汇总到这里。
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
