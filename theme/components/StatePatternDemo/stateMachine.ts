import type {
  PublishAction,
  PublishState,
  PublishStatus,
  StatusConfig,
} from "./types";

export const initialPublishState: PublishState = {
  status: "idle",
  title: "React 组件设计原则",
  message: "等待开始发布",
};

export const statusConfigs: Record<PublishStatus, StatusConfig> = {
  idle: {
    label: "待提交",
    buttonText: "开始发布",
    helperText: "当前可以编辑标题并发起发布。",
    tone: "neutral",
    canSubmit: true,
  },
  validating: {
    label: "校验中",
    buttonText: "校验中...",
    helperText: "系统正在检查标题是否合法。",
    tone: "warning",
    canSubmit: false,
  },
  submitting: {
    label: "发布中",
    buttonText: "发布中...",
    helperText: "请求已经发出，等待服务端返回结果。",
    tone: "warning",
    canSubmit: false,
  },
  success: {
    label: "发布成功",
    buttonText: "再次发布",
    helperText: "内容已经成功发布，可以继续发起新一次流程。",
    tone: "success",
    canSubmit: true,
  },
  error: {
    label: "发布失败",
    buttonText: "重试发布",
    helperText: "请求失败后允许重试，但仍然保持在同一个流程模型里。",
    tone: "danger",
    canSubmit: true,
  },
};

export function publishReducer(
  state: PublishState,
  action: PublishAction,
): PublishState {
  switch (action.type) {
    case "updateTitle":
      return {
        ...state,
        title: action.payload,
      };
    case "startValidation":
      return {
        ...state,
        status: "validating",
        message: "正在检查标题长度和敏感词...",
      };
    case "validationPassed":
      return {
        ...state,
        status: "submitting",
        message: "校验通过，开始向服务端提交...",
      };
    case "publishSuccess":
      return {
        ...state,
        status: "success",
        message: `《${state.title}》已发布成功`,
      };
    case "publishError":
      return {
        ...state,
        status: "error",
        message: "网络抖动，发布失败，请重试。",
      };
    case "reset":
      return {
        ...state,
        status: "idle",
        message: "流程已重置，可以重新提交。",
      };
    default:
      return state;
  }
}
