import type {
  PricingInput,
  PricingResult,
  PricingStrategy,
  PricingStrategyType,
} from "./types";

function createResult(
  subtotal: number,
  discount: number,
  shippingFee: number,
  badge: string,
  description: string,
): PricingResult {
  return {
    subtotal,
    discount,
    shippingFee,
    payable: Math.max(subtotal - discount + shippingFee, 0),
    badge,
    description,
  };
}

export const pricingStrategies: Record<PricingStrategyType, PricingStrategy> = {
  standard: {
    type: "standard",
    label: "普通用户价",
    summary: "没有额外优惠，作为所有规则的默认回退。",
    calculate(input: PricingInput) {
      const subtotal = input.unitPrice * input.quantity;
      const shippingFee = subtotal >= 199 ? 0 : 12;

      return createResult(
        subtotal,
        0,
        shippingFee,
        "默认规则",
        "普通用户按原价结算，满 199 包邮。",
      );
    },
  },
  member: {
    type: "member",
    label: "会员折扣",
    summary: "会员统一九折，适合稳定长期权益。",
    calculate(input: PricingInput) {
      const subtotal = input.unitPrice * input.quantity;
      const discount = Number((subtotal * 0.1).toFixed(2));

      return createResult(
        subtotal,
        discount,
        0,
        "会员专享",
        "会员享受九折，并直接免邮。",
      );
    },
  },
  newUser: {
    type: "newUser",
    label: "新用户首单",
    summary: "首单立减适合拉新，不满足首单条件时自动降级。",
    calculate(input: PricingInput) {
      const subtotal = input.unitPrice * input.quantity;

      if (!input.isFirstOrder) {
        const shippingFee = subtotal >= 199 ? 0 : 12;
        return createResult(
          subtotal,
          0,
          shippingFee,
          "自动降级",
          "当前不是首单，策略自动回退到普通结算。",
        );
      }

      return createResult(
        subtotal,
        40,
        0,
        "拉新优惠",
        "首单立减 40 元，并赠送免邮。",
      );
    },
  },
  campaign: {
    type: "campaign",
    label: "活动满减",
    summary: "大促场景按阶梯门槛计算，不同门槛对应不同优惠。",
    calculate(input: PricingInput) {
      const subtotal = input.unitPrice * input.quantity;

      if (subtotal >= 300) {
        return createResult(
          subtotal,
          60,
          0,
          "大促满减",
          "活动满 300 减 60，并叠加免邮。",
        );
      }

      if (subtotal >= 200) {
        return createResult(
          subtotal,
          30,
          12,
          "大促满减",
          "活动满 200 减 30，未达包邮线。",
        );
      }

      return createResult(
        subtotal,
        0,
        12,
        "等待凑单",
        "还未达到活动门槛，建议继续加购。",
      );
    },
  },
};

export const strategyList = Object.values(pricingStrategies);
