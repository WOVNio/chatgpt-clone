import { useState } from "react";

export type Message = {
  id: number;
  createdAt: number;
  text: string;
  ai: boolean;
};

/**
 * A custom hook for managing the conversation between the user and the AI.
 *
 */
export const useMessageCollection = (): [
  Message[],
  (message: Message) => void,
  () => void
] => {
  const initialMsg = {
    id: 1,
    createdAt: Date.now(),
    text: "**Hello!** *How can I help you today?*",
    ai: true,
  };
  const [messages, setMessages] = useState<Message[]>([initialMsg]);

  const addMessage = (message: Message) => {
    setMessages((prev) => [...prev, message]);
  };

  const clearMessages = () => setMessages([initialMsg]);

  return [messages, addMessage, clearMessages];
};

export default { useMessageCollection };
