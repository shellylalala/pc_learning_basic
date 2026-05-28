import { useReducer } from "react";
import {
  initialPublishState,
  publishReducer,
  statusConfigs,
} from "./stateMachine";
import "./state-demo.css";

function wait(duration: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, duration);
  });
}

export function StatePatternDemo() {
  const [state, dispatch] = useReducer(publishReducer, initialPublishState);
  const config = statusConfigs[state.status];

  async function handleSubmit() {
    if (!config.canSubmit) {
      return;
    }

    dispatch({ type: "startValidation" });
    await wait(500);
    dispatch({ type: "validationPassed" });
    await wait(900);

    const success =
      state.title.trim().length >= 6 && !state.title.includes("失败");

    dispatch({ type: success ? "publishSuccess" : "publishError" });
  }

  return (
    <div className="state-demo">
      <div className="state-hero">
        <div>
          <span className="state-eyebrow">Runnable Demo</span>
          <h2>内容发布流程状态机</h2>
          <p>
            这个 demo
            用状态模式模拟发布面板：不是用多个布尔值猜当前阶段，而是让明确状态决定按钮、提示和允许行为。
          </p>
        </div>
        <div className={`state-status-card is-${config.tone}`}>
          <span>{config.label}</span>
          <strong>{state.status}</strong>
          <small>{config.helperText}</small>
        </div>
      </div>

      <div className="state-grid">
        <section className="state-card">
          <span className="state-card-label">输入区</span>
          <label className="state-field">
            文章标题
            <input
              value={state.title}
              onChange={(event) =>
                dispatch({ type: "updateTitle", payload: event.target.value })
              }
              placeholder="输入不少于 6 个字的标题"
            />
          </label>
          <div className="state-actions">
            <button
              type="button"
              disabled={!config.canSubmit}
              onClick={handleSubmit}
            >
              {config.buttonText}
            </button>
            <button
              type="button"
              className="secondary"
              onClick={() => dispatch({ type: "reset" })}
            >
              重置流程
            </button>
          </div>
        </section>

        <section className="state-card">
          <span className="state-card-label">当前反馈</span>
          <p className="state-message">{state.message}</p>
          <ul className="state-tips">
            <li>标题长度少于 6 个字会进入失败状态</li>
            <li>标题里包含“失败”两个字，也会模拟服务端报错</li>
            <li>成功和失败都会回到明确状态，而不是残留多个布尔值</li>
          </ul>
        </section>

        <section className="state-card">
          <span className="state-card-label">状态时间线</span>
          <ol className="state-timeline">
            {Object.entries(statusConfigs).map(([status, item]) => (
              <li
                key={status}
                className={status === state.status ? "is-active" : undefined}
              >
                <strong>{status}</strong>
                <span>{item.helperText}</span>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}
