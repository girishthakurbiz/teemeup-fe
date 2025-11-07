import React, {
  useCallback,
  useEffect,
  useRef,
  useReducer,
  useState,
} from "react";
import ChatHeader from "./components/ChatHeader";
import ChatIntro from "./components/ChatIntro";
import ChatMessages from "./components/ChatMessages";
import ChatInput from "./components/ChatInput";
import { fetchBotResponse, generateEnhancedPrompt } from "./utils/api";
import { getUpdatedMessages } from "./utils/messages";
import { initialChatState, chatReducer } from "./reducers/chatReducer";
import { Message } from "./types";
import "./App.css";
import useScreenSize, { DEVICES } from "./hooks/useScreenSize";

function App() {
  const [state, dispatch] = useReducer(chatReducer, initialChatState);
  const [ideaValidation, setIdeaValidation] = useState(null);
  const screenSize = useScreenSize();
  const {
    input,
    messages,
    answers,
    data,
    productInfo,
    idea,
    loading,
    makeChanges,
    users_input,
  } = state;

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const showIntro = messages.length === 0;

  const generatePrompt = useCallback(
    async (trimmedInput: string) => {
      const topics = data?.topics || [];
      const updatedUsersInput = trimmedInput
        ? [...users_input, trimmedInput]
        : [...users_input];
      const updatedAnswers = [...answers];
      const botLoadingMsg: Message = {
        sender: "bot",
        content: "Generating your final prompt...",
        loading: true,
      };
      const newMessagesState: any = [
        ...messages,
        ...(trimmedInput ? [{ sender: "user", content: trimmedInput }] : []),
        botLoadingMsg,
      ];

      // Dispatch initial updates
      if (trimmedInput) {
        dispatch({ type: "ADD_USER_INPUT", payload: trimmedInput });
        dispatch({
          type: "APPEND_MESSAGES",
          payload: [{ sender: "user", content: trimmedInput }],
        });
      }
      dispatch({
        type: "APPEND_MESSAGES",
        payload: [botLoadingMsg],
      });
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "MAKE_CHANGES", payload: false });

      try {
        const response = await generateEnhancedPrompt(
          idea,
          updatedAnswers,
          topics,
          updatedUsersInput,
          productInfo.productType ?? "",
          productInfo.color ?? ""
        );

        const finalPrompt = response?.data?.enhancedPrompt?.final_prompt;
        const finalMessages: Message[] = [
          {
            sender: "bot",
            content:
              finalPrompt || "⚠️ Couldn't generate prompt. Please try again.",
            finalPrompt: !!finalPrompt,
          },
        ];

        dispatch({
          type: "SET_MESSAGES",
          payload: getUpdatedMessages(newMessagesState, finalMessages),
        });
      } catch {
        dispatch({
          type: "SET_MESSAGES",
          payload: getUpdatedMessages(newMessagesState, [
            {
              sender: "bot",
              content: "❌ Something went wrong while generating the prompt.",
            },
          ]),
        });
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    },
    [answers, data, idea, productInfo, messages, users_input]
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const productType = params.get("product");
    const color = params.get("color");

    dispatch({ type: "SET_PRODUCT_INFO", payload: { productType, color } });
  }, []);

  const handleUserResponse = async (userInput: string | null) => {
    const trimmedInput = userInput?.trim() ?? "";
    const isFirstMessage = messages.length === 0;

    // Exit early if input is empty and not a skip
    if (!trimmedInput && userInput !== null) return;

    // Update idea if first message
    if (isFirstMessage && userInput) {
      dispatch({ type: "SET_IDEA", payload: trimmedInput });
    }
    const updatedAnswers = [...answers];

    // Update the last unanswered answer
    if (answers.length > 0) {
      const lastUnansweredIndex = [...updatedAnswers]
        .reverse()
        .findIndex((a) => a.status === "unanswered");

      if (lastUnansweredIndex !== -1) {
        const actualIndex = updatedAnswers.length - 1 - lastUnansweredIndex;
        updatedAnswers[actualIndex] = {
          ...updatedAnswers[actualIndex],
          status: userInput === null ? "skipped" : "answered",
          answer: userInput === null ? null : trimmedInput,
        };
        dispatch({ type: "SET_ANSWERS", payload: updatedAnswers });
      }
    }

    // Prepare messages
    const newMessages: Message[] = [];
    if (userInput !== null) {
      newMessages.push({
        sender: "user",
        content: trimmedInput,
        ...(isFirstMessage ? { idea: true } : {}),
      });
    }

    const loadingMessage: Message = {
      sender: "bot",
      content: "...",
      loading: true,
    };
    newMessages.push(loadingMessage);

    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "APPEND_MESSAGES", payload: newMessages });

    const newMessagesState = [...messages, ...newMessages];
    const topics = data?.topics || [];

    try {
      const isIdeaValid = ideaValidation === "valid";

      const data = {
        idea: isFirstMessage ? trimmedInput : idea,
        answers: [...updatedAnswers],
        topics,
        productType: productInfo.productType || "",
        color: productInfo.color || "",
        isFirstMessage,
        isIdeaValid,
      };
      const response = await fetchBotResponse(data);

      if (!response) throw new Error("No response");

      dispatch({ type: "SET_LOADING", payload: false });
      dispatch({ type: "SET_DATA", payload: response });

      const newBotMessages: Message[] = [];
      console.log("responseresponse", response);

      if (response?.idea_validation) {
        setIdeaValidation(response?.idea_validation);
        if (response?.idea_validation === "valid") {
          dispatch({ type: "SET_IDEA", payload: response.idea });
        }
      }

      // Greeting message if no previous bot message
      if (response.greeting) {
        newBotMessages.push({ sender: "bot", content: response.greeting });
      }

      const questionObj = response.question ?? {};

      if (Object.keys(questionObj).length > 0) {
        newBotMessages.push({
          sender: "bot",
          content: questionObj.question || "Here's the next question.",
          example: questionObj.example || null,
        });

        if (questionObj.status === "unanswered") {
          const lastQuestionIndex = updatedAnswers.findIndex(
            (ans) =>
              ans.topic === questionObj.topic && ans.status === "answered"
          );

          if (lastQuestionIndex !== -1) {
            updatedAnswers[lastQuestionIndex] = {
              ...updatedAnswers[lastQuestionIndex],
              status: "unanswered",
            };
          }
        }

        dispatch({
          type: "SET_ANSWERS",
          payload: [
            ...updatedAnswers,
            {
              topic: questionObj.topic ?? "",
              question: questionObj.question ?? "",
              example: questionObj.example ?? "",
              status: questionObj.status ?? "unanswered",
              answer: "",
            },
          ],
        });
      } else {
        dispatch({ type: "SET_QUESTIONS", payload: false });
        newBotMessages.push({
          sender: "bot",
          content: `✅ All set! Thanks for your responses. We’re ready to generate your awesome ${
            productInfo?.productType || "product"
          } design.`,
          allSet: true,
        });
      }

      dispatch({
        type: "SET_MESSAGES",
        payload: getUpdatedMessages(newMessagesState, newBotMessages),
      });
    } catch (err) {
      dispatch({
        type: "SET_LOADING",
        payload: false,
      });
      dispatch({
        type: "SET_MESSAGES",
        payload: getUpdatedMessages(newMessagesState, [
          {
            sender: "bot",
            content: "❌ Failed to process your message. Try again.",
          },
        ]),
      });
    }
  };

  function onConfirmFinalPrompt() {
    // Find the last message with finalPrompt: true
    const lastFinalPromptMsg = [...messages]
      .reverse()
      .find((msg) => msg.finalPrompt);

    if (!lastFinalPromptMsg) return null;

    // Extract prompt after the first colon, if needed
    const prompt = lastFinalPromptMsg.content;

    const dataToSend = {
      type: "WIDGET_CLOSED",
      payload: {
        productType: productInfo?.productType,
        color: productInfo?.color,
        final_prompt: prompt,
      },
    };
    console.log("Sending data to parent:", dataToSend);

    // Send message to parent (Shopify page)
    window.parent.postMessage(dataToSend, "*");

    return null;
  }

  const sendMessage = async () => {
    const trimmedInput = input.trim();
    dispatch({ type: "SET_INPUT", payload: "" });
    const finalPrompt = messages.find((msg) => msg.finalPrompt);
    if (finalPrompt) {
      generatePrompt(trimmedInput);
    } else {
      await handleUserResponse(trimmedInput);
    }
  };
  console.log("all answers", answers);
  return (
    <div className="chat-popup-overlay">
      <div className="chat-widget">
        {screenSize !== DEVICES.MOBILE && <ChatHeader />}
        {showIntro && <ChatIntro screenSize={screenSize} />}
        {showIntro && screenSize !== DEVICES.MOBILE && (
          <div
            style={{
              height: "70%",
              textAlign: "center",
              padding: "0 1rem",
              marginBottom: "1rem",
            }}
          />
        )}
        {!showIntro && (
          <ChatMessages messages={messages} messagesEndRef={messagesEndRef} />
        )}
        <ChatInput
          showIntro={showIntro}
          input={input}
          setInput={(value: any) =>
            dispatch({ type: "SET_INPUT", payload: value })
          }
          sendMessage={sendMessage}
          skipQuestion={() => handleUserResponse(null)}
          generatePrompt={generatePrompt}
          resetPrompt={() => {
            dispatch({ type: "RESET_ALL" });
          }}
          messages={messages}
          loading={loading}
          makeChanges={makeChanges}
          onMakeChanges={(makeChange: boolean) =>
            dispatch({ type: "MAKE_CHANGES", payload: makeChange })
          }
          onConfirmFinalPrompt={onConfirmFinalPrompt}
        />
      </div>
    </div>
  );
}

export default App;
