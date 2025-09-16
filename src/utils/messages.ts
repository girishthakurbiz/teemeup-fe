import { Message } from "../types";

export const getUpdatedMessages = (oldMessages: Message[], newMessages: Message[]) => {
  const updated = [...oldMessages];
  const loadingIndex = updated?.findIndex((msg) => msg.loading);
  if (loadingIndex !== -1) {
    updated.splice(loadingIndex, 1, ...newMessages);
  } else {
    updated.push(...newMessages);
  }
  return updated;
};
