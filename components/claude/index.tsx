import Chat, { Bubble, useMessages } from "@chatui/core";
import "@chatui/core/dist/index.css";
import { useEffect, useState } from "react";
import { marked } from "marked";

export const HISTORY = "claude_history";
export const CONVER = "claude_conversationId";

const App = () => {
  const { messages, appendMsg, setTyping } = useMessages([]);
  const [conversationId, setConversationId] = useState(undefined);

  useEffect(() => {
    const msgs = JSON.parse(localStorage.getItem(HISTORY) || "[]");
    const id = localStorage.getItem(CONVER) || undefined;
    setConversationId(id);
    for (const msg of msgs) {
      appendMsg(msg);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(HISTORY, JSON.stringify(messages));
  }, [messages]);

  async function handleSend(type, val) {
    if (type === "text" && val.trim()) {
      appendMsg({
        type: "text",
        content: { text: val },
        position: "right",
      });

      setTyping(true);

      const response = await fetch(
        `https://wziv5c.laf.run/claude?` +
          new URLSearchParams(
            conversationId
              ? { question: val, conversationId }
              : { question: val }
          ),
        {
          method: "get",
        }
      );
      const { msg, conversationId: newId } = await response.json();
      appendMsg({
        type: "md",
        content: { text: msg },
      });
      setConversationId(newId);
      localStorage.setItem(CONVER, newId);
    }
  }

  function renderMessageContent(msg) {
    const { type, content } = msg;
    if (type === "md") {
      return (
        <div className="bg-orange-200 rounded-lg p-2">
          <div
            dangerouslySetInnerHTML={{
              __html: marked.parse(content.text),
            }}
          />
        </div>
      );
    }

    return <Bubble content={content.text} />;
  }

  return (
    <Chat
      navbar={{ title: "流子" }}
      messages={messages}
      renderMessageContent={renderMessageContent}
      onSend={handleSend}
    />
  );
};

// export default dynamic(() => Promise.resolve(App), { ssr: false });
export default App;
