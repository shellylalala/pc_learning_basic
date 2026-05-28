import type {
  DecoratorType,
  PublishInput,
  PublishResult,
  Publisher,
  PushLog,
} from "./types";

function wait(duration: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
}

function createBasePublisher(pushLog: PushLog): Publisher {
  return {
    name: "BasePublisher",
    async publish(input: PublishInput): Promise<PublishResult> {
      pushLog(`核心发布服务开始处理《${input.title}》`);
      await wait(700);

      return {
        status: "success",
        articleId: `article-${input.title.length}-${input.contentLength}`,
        message: `《${input.title}》发布成功`,
      };
    },
  };
}

export function withValidation(
  publisher: Publisher,
  pushLog: PushLog,
): Publisher {
  return {
    ...publisher,
    name: `${publisher.name} + Validation`,
    async publish(input) {
      pushLog("装饰器：开始校验标题和封面信息");

      if (input.title.trim().length < 6) {
        throw new Error("标题至少需要 6 个字");
      }

      if (!input.hasCover) {
        throw new Error("发布文章前需要上传封面");
      }

      return publisher.publish(input);
    },
  };
}

export function withDraftBackup(
  publisher: Publisher,
  pushLog: PushLog,
): Publisher {
  return {
    ...publisher,
    name: `${publisher.name} + DraftBackup`,
    async publish(input) {
      pushLog(`装饰器：已为《${input.title}》备份草稿`);
      return publisher.publish(input);
    },
  };
}

export function withAnalytics(
  publisher: Publisher,
  pushLog: PushLog,
): Publisher {
  return {
    ...publisher,
    name: `${publisher.name} + Analytics`,
    async publish(input) {
      pushLog(`装饰器：记录埋点 role=${input.role}`);
      const result = await publisher.publish(input);
      pushLog(`装饰器：发布成功埋点 articleId=${result.articleId}`);
      return result;
    },
  };
}

export function composePublisher(
  selected: DecoratorType[],
  pushLog: PushLog,
): Publisher {
  return selected.reduce<Publisher>((publisher, decorator) => {
    switch (decorator) {
      case "validation":
        return withValidation(publisher, pushLog);
      case "draftBackup":
        return withDraftBackup(publisher, pushLog);
      case "analytics":
        return withAnalytics(publisher, pushLog);
      default:
        return publisher;
    }
  }, createBasePublisher(pushLog));
}
