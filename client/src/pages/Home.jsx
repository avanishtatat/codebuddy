import { useState, useRef, useEffect } from "react";
import Navbar from "../components/Navbar";
import WelcomeCard from "../components/WelcomeCard";
import axiosInstance from "../api/axios";
import MessageBubble from "../components/MessageBubble";
import ChatInput from "../components/ChatInput";
import { Loader } from "lucide-react";

const Home = () => {
  const [isFetchingHistory, setIsFetchingHistory] = useState(true);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [messagesUsed, setMessagesUsed] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef(null);

  const onChipClick = (example) => {
    setInputValue(example);
  };

  // Fetch chat history on component mount
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const historyResponse = await axiosInstance.get("/chat/history");
        setMessages(historyResponse.data?.messages || []);
        setMessagesUsed(historyResponse.data?.messagesUsedToday || 0);
      } catch (error) {
        console.error("Error fetching chat history:", error);
      } finally {
        setIsFetchingHistory(false);
      }
    };
    fetchChatHistory();
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (bottomRef.current?.scrollIntoView) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;
    const userMessage = { role: "user", content: inputValue.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    try {
      const response = await axiosInstance.post("/chat", {
        message: userMessage.content,
      });
      const aiMessage = {
        role: "assistant",
        content:
          response.data?.message ||
          "Sorry, I had trouble generating a response.",
      };
      setMessages((prev) => [...prev, aiMessage]);
      setMessagesUsed(response.data?.messagesUsedToday || messagesUsed);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 h-screen w-full">
      <Navbar messagesUsed={messagesUsed} />
      <div className="h-[calc(100%-64px)] flex flex-col">
        <div className="flex-1 overflow-y-auto p-4">
          {isFetchingHistory ? (
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center gap-3 text-gray-400">
                <Loader className="animate-spin" size={28} />
                <p className="text-sm">Loading your conversations...</p>
              </div>
            </div>
          ) : (
            messages.length === 0 && <WelcomeCard onChipClick={onChipClick} />
          )}
          {/* Messages will be displayed here */}
          <div className="w-15/16 md:w-5/6 mx-auto mt-6 flex flex-col gap-6">
            {messages.map((msg, idx) => (
              <MessageBubble key={idx} role={msg.role} content={msg.content} />
            ))}
            {isLoading && (
              <MessageBubble role="assistant" content="" loading={true} />
            )}
          </div>
          <div ref={bottomRef} />
        </div>
        {/* Input will go here */}
        <ChatInput
          value={inputValue}
          onChange={setInputValue}
          onSend={handleSend}
          isLoading={isLoading}
          messagesUsed={messagesUsed}
        />
      </div>
    </div>
  );
};

export default Home;
