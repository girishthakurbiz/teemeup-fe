import SendIcon from "../assets/sendButton";

const ChatInput = ({
  showIntro,
  input,
  setInput,
  sendMessage,
  generatePrompt,
  skipQuestion,
  resetPrompt,
  loading,
  makeChanges,
  onMakeChanges,
  onConfirmFinalPrompt,
  messages,
}) => {
  const finalPrompt = messages.find((msg) => msg.finalPrompt);
  const isTyping = input.trim().length > 0;
  const hasBotResponded = messages.some((msg) => msg.sender === "bot");
  const allQuestionsCompleted = messages.some((msg) => msg.allSet);

  const showSendButton = isTyping || showIntro;
  const showInputArea = (!allQuestionsCompleted && !finalPrompt) || makeChanges;
  const showFinalizeAndSkip = hasBotResponded && !showIntro && !finalPrompt;

  const placeholderText = showIntro
    ? "Enter your idea here (Ex. - Astronaut with a boom box)"
    : makeChanges
    ? "Add your changes here"
    : "Describe the design you want on your product";

  return (
    <>
      {showInputArea ? (
        <div className="chat-input">
          <input
            type="text"
            placeholder={placeholderText}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />

          {showSendButton && (
            <button
              disabled={loading}
              onClick={sendMessage}
              className="send-button"
            >
              <SendIcon />
            </button>
          )}

          {showFinalizeAndSkip && (
            <>
              <button
                className="generate-btn"
                onClick={()=> generatePrompt()}
                disabled={loading}
              >
                FINALISE PROMPT
              </button>

              {!allQuestionsCompleted && (
                <button
                  className="generate-btn"
                  onClick={skipQuestion}
                  disabled={loading}
                >
                  SKIP
                </button>
              )}
            </>
          )}
        </div>
      ) : (
        <div className="footer-buttons">
          {!finalPrompt ? (
            <button
              className="generate-btn"
              onClick={generatePrompt}
              disabled={loading}
            >
              FINALISE PROMPT
            </button>
          ) : (
            <button
              onClick={onConfirmFinalPrompt}
              className="generate-btn"
              disabled={loading}
            >
              CONFIRM
            </button>
          )}

          <button
            onClick={onMakeChanges}
            className="generate-btn"
            disabled={loading}
          >
            MAKE CHANGES
          </button>

          <button
            onClick={resetPrompt}
            className="generate-btn"
            disabled={loading}
          >
            RESET
          </button>
        </div>
      )}
    </>
  );
};

export default ChatInput;
