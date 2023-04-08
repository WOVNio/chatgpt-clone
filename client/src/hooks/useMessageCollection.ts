import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

export type Message = {
  id: number;
  createdAt: number;
  text: string;
  ai: boolean;
  token: number;
};

/**
 * A custom hook for managing the conversation between the user and the AI.
 *
 */
export const useMessageCollection = (): [
  Message[],
  string,
  (message: Message) => void,
  () => void
] => {
  const initialMsg = {
    id: 1,
    createdAt: Date.now(),
    text: "**Hello!** *How can I help you today?*",
    ai: true,
    token: 0,
  };
  const [conversationId, setConversationId] = useState(uuidv4());
  const [messages, setMessages] = useState<Message[]>([initialMsg]);

  const addMessage = (message: Message) => {
    setMessages((prev) => [...prev, message]);
  };

  const clearMessages = () => {
    setConversationId(uuidv4());
    setMessages([initialMsg]);
  };

  return [messages, conversationId, addMessage, clearMessages];
};

export default { useMessageCollection };
