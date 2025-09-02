import React, { useCallback, useEffect, useRef, useReducer } from "react";
import ChatHeader from "./components/ChatHeader";
import ChatIntro from "./components/ChatIntro";
import ChatMessages from "./components/ChatMessages";
import ChatInput from "./components/ChatInput";
import { fetchBotResponse, generateEnhancedPrompt } from "./utils/api";
import "./App.css";
import { getUpdatedMessages } from "./utils/messages";
import { initialChatState, chatReducer } from "./reducers/chatReducer";
import { Message } from "./types";

function App() {
  const [state, dispatch] = useReducer(chatReducer, initialChatState);
  const { input, messages, answers, data, productInfo, idea, questions } =
    state;

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const showIntro = messages.length === 0;

  const generatePrompt = useCallback(async () => {
    const updatedAnswers = [...answers];
    const topics = data?.topics || [];

    const loadingMessage: Message = {
      sender: "bot",
      content: "Generating your final prompt...",
      loading: true,
    };

    const newMessagesState = [...messages, loadingMessage];
    dispatch({ type: "APPEND_MESSAGES", payload: [loadingMessage] });

    try {
      const response = await generateEnhancedPrompt(
        idea,
        updatedAnswers,
        topics,
        productInfo.productType || "",
        productInfo.color || ""
      );

      const finalPrompt = response?.data?.enhancedPrompt?.final_prompt;

      const finalMessages = finalPrompt
        ? [
            {
              sender: "bot",
              content: `🎨 Here's your final design prompt:\n\n${finalPrompt}`,
            },
          ]
        : [
            {
              sender: "bot",
              content: "⚠️ Couldn't generate prompt. Please try again.",
            },
          ] as any;

      const updatedMessages = getUpdatedMessages(newMessagesState, finalMessages);
      dispatch({ type: "SET_MESSAGES", payload: updatedMessages });
    } catch (error) {
      const updatedMessages = getUpdatedMessages(newMessagesState, [
        {
          sender: "bot",
          content: "❌ Something went wrong while generating the prompt.",
        },
      ]);
      dispatch({ type: "SET_MESSAGES", payload: updatedMessages });
    }
  }, [answers, data, idea, productInfo, messages]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const productType = params.get("product");
    const color = params.get("color");

    dispatch({ type: "SET_PRODUCT_INFO", payload: { productType, color } });
  }, []);

  const sendMessage = async () => {
    const userInput = input.trim();
    dispatch({ type: "SET_INPUT", payload: "" });

    if (!userInput) return;

    const isFirstMessage = messages.length === 0;
    if (isFirstMessage) {
      dispatch({ type: "SET_IDEA", payload: userInput });
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

    const newMessagesState = [...messages, userMessage, loadingMessage];
    dispatch({
      type: "APPEND_MESSAGES",
      payload: [userMessage, loadingMessage],
    });

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

    dispatch({ type: "SET_ANSWERS", payload: updatedAnswers });

    const topics = data?.topics || [];

    try {
      const response = await fetchBotResponse(
        isFirstMessage ? userInput : idea,
        updatedAnswers,
        topics,
        productInfo.productType || "",
        productInfo.color || ""
      );

      if (!response) {
        const updatedMessages = getUpdatedMessages(newMessagesState, [
          {
            sender: "bot",
            content: "Something went wrong. Please try again.",
          },
        ]);
        dispatch({ type: "SET_MESSAGES", payload: updatedMessages });
        return;
      }

      dispatch({ type: "SET_DATA", payload: response });

      const newBotMessages: Message[] = [];
      const hasPreviousBotMessage = messages.some(
        (msg) => msg.sender === "bot"
      );

      if (!hasPreviousBotMessage && response.greeting) {
        newBotMessages.push({ sender: "bot", content: response.greeting });
      }

      const questionObj = response.question || {};

      if (Object.keys(questionObj).length > 0) {
        newBotMessages.push({
          sender: "bot",
          content: questionObj?.question || "Here's the next question.",
        });

        dispatch({
          type: "SET_ANSWERS",
          payload: [
            ...updatedAnswers,
            {
              topic: questionObj.topic || "",
              question: questionObj.question || "",
              example: questionObj.example || "",
              status: "unanswered",
              answer: "",
            },
          ],
        });
      } else {
        dispatch({ type: "SET_QUESTIONS", payload: false });
        newBotMessages.push({
          sender: "bot",
          content:
            "✅ All set! Thanks for your responses. We’re ready to generate your awesome T-shirt design.",
        });
      }

      const updatedMessages = getUpdatedMessages(newMessagesState, newBotMessages);
      dispatch({ type: "SET_MESSAGES", payload: updatedMessages });
    } catch (err) {
      const updatedMessages = getUpdatedMessages(newMessagesState, [
        {
          sender: "bot",
          content: "❌ Failed to process your message. Try again.",
        },
      ]);
      dispatch({ type: "SET_MESSAGES", payload: updatedMessages });
    }
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
          setInput={(value: any) =>
            dispatch({ type: "SET_INPUT", payload: value })
          }
          sendMessage={sendMessage}
          questions={questions}
          generatePrompt={generatePrompt}
        />
      </div>
    </div>
  );
}

export default App;
