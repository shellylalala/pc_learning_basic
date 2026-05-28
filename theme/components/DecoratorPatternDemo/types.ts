export type UserRole = "guest" | "editor" | "admin";

export interface PublishInput {
  title: string;
  contentLength: number;
  hasCover: boolean;
  role: UserRole;
}

export interface PublishResult {
  status: "success";
  articleId: string;
  message: string;
}

export interface Publisher {
  name: string;
  publish: (input: PublishInput) => Promise<PublishResult>;
}

export type DecoratorType = "validation" | "draftBackup" | "analytics";

export type PushLog = (message: string) => void;
