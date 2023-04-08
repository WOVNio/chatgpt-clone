import { FC, ReactNode, useState } from "react";
import { useMessageCollection } from "../hooks/useMessageCollection";
import ChatContext, { ChatContextType } from "./chatContext";

type Props = {
  children: ReactNode;
};

/**
 * ChatContextProvider is a functional component that serves as a provider for the ChatContext.
 * It provides the ChatContext to the components within its subtree.
 */
const ChatContextProvider: FC<Props> = (props) => {
  const { children } = props;
  const [ messages, conversationId, addMessage, clearMessages ] = useMessageCollection();
  const [limit, setLimit] = useState(-1);

  const contextValue: ChatContextType = {
    conversationId,
    messages,
    addMessage,
    clearMessages,
    limit,
    setLimit,
  };

  return (
    <ChatContext.Provider value = { contextValue } >
      { children }
    </ChatContext.Provider>
  )
};

export { ChatContextProvider };
