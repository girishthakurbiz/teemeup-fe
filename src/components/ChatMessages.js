import botIcon from "../assets/botIcon.png";

const ChatMessages = ({ messages, messagesEndRef }) => {
  const lastFinalPromptMsg = [...messages]
    .reverse()
    .find((msg) => msg.finalPrompt);

    return(
 <div className="chat-messages">
    {[...messages].reverse().map((msg, idx) => (
      <div
        key={idx}
        className={`chat-message-row ${
          msg.sender === "user"
            ? "chat-message-row-user"
            : "chat-message-row-bot"
        } ${msg.loading ? "loading-message" : ""}`}
      >
        {msg.sender === "bot" && (
          <img src={botIcon} className="bot-icon" alt="bot" />
        )}

        {/* wrap the bubble and the confirm text so the confirm sits under the bubble (not under the icon) */}
        <div
          className={`message-wrapper ${
            msg.sender === "user"
              ? "message-wrapper-user"
              : "message-wrapper-bot"
          }`}
        >
          <div
            className={`chat-message ${
              msg.sender === "user" ? "chat-message-user" : "chat-message-bot"
            }`}
          >
            {msg.finalPrompt && (
              <div className="final-prompt">Final proposed Prompt:</div>
            )}
            <div>{msg.content}</div>
            {msg.example && (
              <div className="example-prompt">e.g. {msg.example}</div>
            )}
          </div>

          {/* moved outside the .chat-message so it renders below the bubble */}
          {msg.sender === "bot" &&
            msg.finalPrompt &&
            msg ===
              lastFinalPromptMsg && 
                <div className="confirm-prompt">
                  click “confirm” to proceed with the prompt
                </div>
              }
        </div>
      </div>
    ))}
    <div ref={messagesEndRef} />
  </div>
    )
 
};

export default ChatMessages;
