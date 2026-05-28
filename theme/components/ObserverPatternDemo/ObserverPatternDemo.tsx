import { notificationCenter } from './notificationCenter';
import { useNotificationCenter } from './useNotificationCenter';
import type { NotificationLevel, PublishInput } from './types';
import './observer-demo.css';

const notificationPresets: PublishInput[] = [
  {
    title: '订单支付成功',
    content: '订单中心、Header 红点和通知列表都会收到同一次状态变化。',
    level: 'success',
  },
  {
    title: '接口异常告警',
    content: '监控模块发布告警，多个 UI 模块只需要订阅通知中心。',
    level: 'warning',
  },
  {
    title: '账号安全提醒',
    content: '安全模块不需要知道页面上有哪些组件正在展示通知。',
    level: 'error',
  },
];

const levelText: Record<NotificationLevel, string> = {
  info: '信息',
  success: '成功',
  warning: '警告',
  error: '风险',
};

function NotificationBadge() {
  const snapshot = useNotificationCenter();

  return (
    <section className="observer-card observer-badge-card">
      <span className="observer-card-label">Header 订阅者</span>
      <div className="observer-badge-row">
        <span className="observer-bell">🔔</span>
        <span className="observer-badge">{snapshot.unreadCount}</span>
      </div>
      <p>Header 不关心通知是谁发布的，只订阅 unreadCount。</p>
    </section>
  );
}

function NotificationActions() {
  return (
    <section className="observer-card observer-actions-card">
      <span className="observer-card-label">发布方</span>
      <h3>业务模块发布通知</h3>
      <div className="observer-actions">
        {notificationPresets.map((preset) => (
          <button
            key={preset.title}
            type="button"
            onClick={() => notificationCenter.publish(preset)}
          >
            发布：{preset.title}
          </button>
        ))}
      </div>
      <div className="observer-secondary-actions">
        <button type="button" onClick={() => notificationCenter.markAllRead()}>
          全部已读
        </button>
        <button type="button" onClick={() => notificationCenter.clear()}>
          清空通知
        </button>
      </div>
    </section>
  );
}

function NotificationList() {
  const snapshot = useNotificationCenter();

  return (
    <section className="observer-card observer-list-card">
      <span className="observer-card-label">通知列表订阅者</span>
      <h3>消息面板</h3>
      {snapshot.messages.length === 0 ? (
        <p className="observer-empty">还没有通知。点击左侧按钮发布一条业务消息。</p>
      ) : (
        <ul className="observer-list">
          {snapshot.messages.map((message) => (
            <li className="observer-message" data-level={message.level} key={message.id}>
              <div>
                <span className="observer-message-title">{message.title}</span>
                <span className="observer-message-level">{levelText[message.level]}</span>
              </div>
              <p>{message.content}</p>
              <small>
                {message.createdAt} · {message.read ? '已读' : '未读'}
              </small>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function NotificationStatus() {
  const snapshot = useNotificationCenter();

  return (
    <section className="observer-card observer-status-card">
      <span className="observer-card-label">状态快照</span>
      <p>{snapshot.lastEvent}</p>
      <code>
        messages: {snapshot.messages.length} / unread: {snapshot.unreadCount}
      </code>
    </section>
  );
}

export function ObserverPatternDemo() {
  return (
    <div className="observer-demo">
      <div className="observer-demo-header">
        <div>
          <span className="observer-eyebrow">Runnable Demo</span>
          <h2>通知中心：一个变化，多个组件自动响应</h2>
        </div>
        <p>
          这个 demo 用观察者模式模拟前端通知中心：业务模块只发布通知，Header、列表和状态面板通过订阅自动更新。
        </p>
      </div>

      <div className="observer-grid">
        <NotificationActions />
        <NotificationBadge />
        <NotificationList />
        <NotificationStatus />
      </div>
    </div>
  );
}