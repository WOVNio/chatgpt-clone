import React from "react";
import { Message } from "../hooks/useMessageCollection";

/**
 * ChatContext is a context object that is used to share collection of messages
 * between components
 */
export type ChatContextType = {
  messages: Message[];
  addMessage: (message: Message) => void;
  clearMessages: () => void;
  limit: number;
  setLimit: (newwLimit: number) => void;
};

const ChatContext = React.createContext<ChatContextType>({
  messages: [],
  addMessage: (message: Message) => {},
  clearMessages: () => {},
  limit: -1,
  setLimit: () => {},
});

export default ChatContext;
