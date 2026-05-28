import { useState } from "react";
import { pricingStrategies, strategyList } from "./pricingStrategies";
import type { PricingStrategyType } from "./types";
import "./strategy-demo.css";

function formatPrice(value: number) {
  return new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency: "CNY",
    minimumFractionDigits: 2,
  }).format(value);
}

export function StrategyPatternDemo() {
  const [unitPrice, setUnitPrice] = useState(128);
  const [quantity, setQuantity] = useState(2);
  const [strategyType, setStrategyType] =
    useState<PricingStrategyType>("standard");
  const [isFirstOrder, setIsFirstOrder] = useState(true);

  const activeStrategy = pricingStrategies[strategyType];
  const result = activeStrategy.calculate({
    unitPrice,
    quantity,
    isFirstOrder,
  });

  return (
    <div className="strategy-demo">
      <div className="strategy-hero">
        <div>
          <span className="strategy-eyebrow">Runnable Demo</span>
          <h2>结算页优惠策略切换</h2>
          <p>
            同一个结算流程，不同优惠规则由不同策略负责。组件只负责收集输入、选择策略和展示结果。
          </p>
        </div>
        <div className="strategy-result-card">
          <span className="strategy-badge">{result.badge}</span>
          <strong>{formatPrice(result.payable)}</strong>
          <small>{result.description}</small>
        </div>
      </div>

      <div className="strategy-grid">
        <section className="strategy-card">
          <span className="strategy-card-label">输入条件</span>
          <div className="strategy-field-grid">
            <label>
              单价
              <input
                type="number"
                min={1}
                value={unitPrice}
                onChange={(event) =>
                  setUnitPrice(Number(event.target.value) || 1)
                }
              />
            </label>
            <label>
              数量
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(event) =>
                  setQuantity(Number(event.target.value) || 1)
                }
              />
            </label>
          </div>
          <label className="strategy-checkbox">
            <input
              type="checkbox"
              checked={isFirstOrder}
              onChange={(event) => setIsFirstOrder(event.target.checked)}
            />
            这是用户首单
          </label>
        </section>

        <section className="strategy-card">
          <span className="strategy-card-label">策略选择</span>
          <div className="strategy-options">
            {strategyList.map((strategy) => (
              <button
                key={strategy.type}
                type="button"
                className={
                  strategy.type === strategyType ? "is-active" : undefined
                }
                onClick={() => setStrategyType(strategy.type)}
              >
                <strong>{strategy.label}</strong>
                <span>{strategy.summary}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="strategy-card strategy-summary-card">
          <span className="strategy-card-label">结算结果</span>
          <ul className="strategy-summary-list">
            <li>
              <span>商品小计</span>
              <strong>{formatPrice(result.subtotal)}</strong>
            </li>
            <li>
              <span>优惠金额</span>
              <strong>- {formatPrice(result.discount)}</strong>
            </li>
            <li>
              <span>运费</span>
              <strong>{formatPrice(result.shippingFee)}</strong>
            </li>
            <li className="strategy-total-row">
              <span>应付金额</span>
              <strong>{formatPrice(result.payable)}</strong>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
