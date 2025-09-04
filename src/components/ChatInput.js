import SendIcon from "../assets/sendButton";

const ChatInput = ({
  showIntro,
  input,
  setInput,
  sendMessage,
  finalPrompt,
  generatePrompt,
  skipQuestion,
  resetPrompt,
  hasBotResponded,
  loading,
}) => {
  const isTyping = input.trim().length > 0;

  return (
    <div className="chat-input">
      <input
        type="text"
        placeholder={
          showIntro
            ? "Enter your idea here  (Ex. - Astronaut with a boom box)"
            : "Describe the design you want on your t-shirt"
        }
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
      />

      {/* FINAL PROMPT STATE */}
      {finalPrompt ? (
        <>
          <button
            onClick={sendMessage}
            className="generate-btn"
            disabled={loading}
          >
            CONFIRM
          </button>
          <button
            onClick={generatePrompt}
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
        </>
      ) : (
        <>
          {(isTyping || showIntro) && (
            <button
              disabled={loading}
              onClick={sendMessage}
              className="send-button"
            >
              <SendIcon />
            </button>
          )}

          {/* Show Skip and Finalise only after bot has responded */}
          {hasBotResponded && !showIntro && (
            <>
              <button
                className="generate-btn"
                onClick={generatePrompt}
                disabled={loading}
              >
                FINALISE PROMPT
              </button>

              <button
                className="generate-btn"
                onClick={skipQuestion}
                disabled={loading}
              >
                SKIP
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ChatInput;
