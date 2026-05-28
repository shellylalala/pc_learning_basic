import { useMemo, useState } from "react";
import { composePublisher } from "./decorators";
import type { DecoratorType, PublishResult, UserRole } from "./types";
import "./decorator-demo.css";

const decoratorOptions: Array<{
  type: DecoratorType;
  label: string;
  description: string;
}> = [
  {
    type: "validation",
    label: "校验装饰器",
    description: "发布前校验标题长度和封面是否完整。",
  },
  {
    type: "draftBackup",
    label: "草稿备份装饰器",
    description: "发布前自动备份当前草稿。",
  },
  {
    type: "analytics",
    label: "埋点装饰器",
    description: "记录发布前后埋点日志。",
  },
];

export function DecoratorPatternDemo() {
  const [title, setTitle] = useState("React 架构设计实践");
  const [contentLength, setContentLength] = useState(1200);
  const [hasCover, setHasCover] = useState(true);
  const [role, setRole] = useState<UserRole>("editor");
  const [selectedDecorators, setSelectedDecorators] = useState<DecoratorType[]>(
    ["validation", "draftBackup", "analytics"],
  );
  const [logs, setLogs] = useState<string[]>([]);
  const [result, setResult] = useState<PublishResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const chainPreview = useMemo(() => {
    if (selectedDecorators.length === 0) {
      return "BasePublisher";
    }

    return [...selectedDecorators, "BasePublisher"].join(" -> ");
  }, [selectedDecorators]);

  function pushLog(message: string) {
    setLogs((current) => [message, ...current].slice(0, 8));
  }

  async function handlePublish() {
    setLoading(true);
    setError("");
    setResult(null);
    setLogs([]);

    try {
      const decoratedPublisher = composePublisher(selectedDecorators, pushLog);
      const publishResult = await decoratedPublisher.publish({
        title,
        contentLength,
        hasCover,
        role,
      });
      setResult(publishResult);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "发布失败");
    } finally {
      setLoading(false);
    }
  }

  function toggleDecorator(type: DecoratorType) {
    setSelectedDecorators((current) =>
      current.includes(type)
        ? current.filter((item) => item !== type)
        : [...current, type],
    );
  }

  return (
    <div className="decorator-demo">
      <div className="decorator-hero">
        <div>
          <span className="decorator-eyebrow">Runnable Demo</span>
          <h2>内容发布服务增强链</h2>
          <p>
            你可以自由勾选增强项，观察基础发布服务如何在不被修改的情况下，被一层层装饰出新能力。
          </p>
        </div>
        <div className="decorator-chain-card">
          <span>当前装饰链</span>
          <strong>{chainPreview}</strong>
          <small>装饰顺序不同，执行顺序也会不同。</small>
        </div>
      </div>

      <div className="decorator-grid">
        <section className="decorator-card">
          <span className="decorator-card-label">发布输入</span>
          <label className="decorator-field">
            标题
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </label>
          <label className="decorator-field">
            内容字数
            <input
              type="number"
              min={100}
              value={contentLength}
              onChange={(event) =>
                setContentLength(Number(event.target.value) || 100)
              }
            />
          </label>
          <label className="decorator-field">
            发布角色
            <select
              value={role}
              onChange={(event) => setRole(event.target.value as UserRole)}
            >
              <option value="guest">guest</option>
              <option value="editor">editor</option>
              <option value="admin">admin</option>
            </select>
          </label>
          <label className="decorator-checkbox">
            <input
              type="checkbox"
              checked={hasCover}
              onChange={(event) => setHasCover(event.target.checked)}
            />
            已上传封面
          </label>
        </section>

        <section className="decorator-card">
          <span className="decorator-card-label">装饰器选择</span>
          <div className="decorator-options">
            {decoratorOptions.map((item) => (
              <label key={item.type} className="decorator-option">
                <input
                  type="checkbox"
                  checked={selectedDecorators.includes(item.type)}
                  onChange={() => toggleDecorator(item.type)}
                />
                <div>
                  <strong>{item.label}</strong>
                  <span>{item.description}</span>
                </div>
              </label>
            ))}
          </div>
          <div className="decorator-actions">
            <button type="button" disabled={loading} onClick={handlePublish}>
              {loading ? "发布中..." : "执行发布"}
            </button>
          </div>
        </section>

        <section className="decorator-card">
          <span className="decorator-card-label">执行结果</span>
          {error ? <div className="decorator-error">{error}</div> : null}
          {result ? (
            <div className="decorator-result">
              <strong>{result.message}</strong>
              <p>articleId: {result.articleId}</p>
            </div>
          ) : (
            <p className="decorator-empty">执行发布后，这里会展示结果。</p>
          )}
          <ul className="decorator-log-list">
            {logs.length === 0 ? (
              <li>日志为空，先执行一次发布。</li>
            ) : (
              logs.map((log) => <li key={log}>{log}</li>)
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}
