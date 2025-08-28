import React, { useEffect, useRef, useState } from "react";
import ChatHeader from "./components/ChatHeader";
import ChatIntro from "./components/ChatIntro";
import ChatMessages from "./components/ChatMessages";
import ChatInput from "./components/ChatInput";
import { fetchBotResponse, generateEnhancedPrompt } from "./utils/api";
import "./App.css";

// Types
interface Message {
  sender: "user" | "bot";
  content: string;
  loading?: boolean;
  idea?: boolean;
}

interface Answer {
  topic: string;
  question: string;
  example: string;
  status: "unanswered" | "answered" | "skipped";
  answer: string | null;
}

interface ProductInfo {
  productType?: string | null;
  color?: string | null;
}

interface DataResponse {
  greeting?: string;
  question?: {
    topic: string;
    question: string;
    example: string;
  };
  topics?: string[];
  [key: string]: any;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [data, setData] = useState<DataResponse>({});
  const [productInfo, setProductInfo] = useState<ProductInfo>({});
  const [idea, setIdea] = useState<string | null>(null);
  const [questions, setQuestions] = useState<boolean>(true);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const showIntro = messages.length === 0;

  const generatePrompt = async () => {
    const updatedAnswers = [...answers];
    const topics = data?.topics || [];

    const loadingMessage: Message = {
      sender: "bot",
      content: "Generating your final prompt...",
      loading: true,
    };

    setMessages((prev) => [...prev, loadingMessage]);

    try {
      const response = await generateEnhancedPrompt(
        idea,
        updatedAnswers,
        topics,
        productInfo.productType || "",
        productInfo.color || ""
      );

      console.log("Generated prompt:", response);

      const finalPrompt = response?.data?.enhancedPrompt?.final_prompt;

      if (!finalPrompt) {
        updateMessages([
          { sender: "bot", content: "⚠️ Couldn't generate prompt. Please try again." },
        ]);
        return;
      }

      updateMessages([
        {
          sender: "bot",
          content: `🎨 Here's your final design prompt:\n\n${finalPrompt}`,
        },
      ]);
    } catch (error) {
      console.error("Error generating prompt:", error);
      updateMessages([
        { sender: "bot", content: "❌ Something went wrong while generating the prompt." },
      ]);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const productType = params.get("product");
    const color = params.get("color");

    console.log("productType", productType, color);
    setProductInfo({ productType, color });
  }, []);

  const sendMessage = async () => {
    const userInput = input.trim();
    setInput("");

    if (!userInput) return;

    const isFirstMessage = messages.length === 0;
    if (isFirstMessage) {
      setIdea(userInput);
    }

    const userMessage: Message = {
      sender: "user",
      content: userInput,
      ...(isFirstMessage ? { idea: true } : {}),
    };

    const loadingMessage: Message = {
      sender: "bot",
      content: "Analyzing...",
      loading: true,
    };

    setMessages((prev) => [...prev, userMessage, loadingMessage]);

    const updatedAnswers = [...answers];
    const lastUnansweredIndex = [...updatedAnswers]
      .reverse()
      .findIndex((a) => a.status === "unanswered");

    if (lastUnansweredIndex !== -1) {
      const actualIndex = updatedAnswers.length - 1 - lastUnansweredIndex;
      updatedAnswers[actualIndex] = {
        ...updatedAnswers[actualIndex],
        status: userInput ? "answered" : "skipped",
        answer: userInput || null,
      };
    }

    setAnswers(updatedAnswers);

    const topics = data?.topics || [];

    try {
      const response: DataResponse = await fetchBotResponse(
        isFirstMessage ? userInput : idea,
        updatedAnswers,
        topics,
        productInfo.productType || "",
        productInfo.color || ""
      );

      if (!response) {
        updateMessages([
          { sender: "bot", content: "Something went wrong. Please try again." },
        ]);
        return;
      }

      setData(response);

      const newMessages: Message[] = [];
      const hasPreviousBotMessage = messages.some((msg) => msg.sender === "bot");

      if (!hasPreviousBotMessage && response.greeting) {
        newMessages.push({ sender: "bot", content: response.greeting });
      }

      const questionObj = response.question || {} as any;

      if (Object.keys(questionObj).length > 0) {
        newMessages.push({
          sender: "bot",
          content: questionObj?.question || "Here's the next question.",
        });

        setAnswers((prev) => [
          ...updatedAnswers,
          {
            topic: questionObj.topic || "",
            question: questionObj.question || "",
            example: questionObj.example || "",
            status: "unanswered",
            answer: "",
          },
        ]);
      } else {
        setQuestions(false);
        newMessages.push({
          sender: "bot",
          content:
            "✅ All set! Thanks for your responses. We’re ready to generate your awesome T-shirt design.",
        });
      }

      updateMessages(newMessages);
    } catch (err) {
      console.error("Error in sendMessage:", err);
      updateMessages([
        { sender: "bot", content: "❌ Failed to process your message. Try again." },
      ]);
    }
  };

  const updateMessages = (newMessages: Message[]) => {
    setMessages((prev) => {
      const updated = [...prev];
      const loadingIndex = updated.findIndex((msg) => msg.loading);
      if (loadingIndex !== -1) {
        updated.splice(loadingIndex, 1, ...newMessages);
      } else {
        updated.push(...newMessages);
      }
      return updated;
    });
  };

  return (
    <div className="chat-popup-overlay">
      <div className="chat-widget">
        <ChatHeader />
        {showIntro && <ChatIntro />}
        <ChatMessages messages={messages} messagesEndRef={messagesEndRef} />
        <ChatInput
          showIntro={showIntro}
          input={input}
          setInput={setInput}
          sendMessage={sendMessage}
          questions={questions}
          generatePrompt={generatePrompt}
        />
      </div>
    </div>
  );
}

export default App;
