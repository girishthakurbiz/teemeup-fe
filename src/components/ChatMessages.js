import botIcon from "../assets/botIcon.png";

const ChatMessages = ({ messages, messagesEndRef }) => (
  <div className="chat-messages">
    {[...messages].reverse().map((msg, idx) => (
      <div
        key={idx}
        className={`chat-message-row ${
          msg.sender === "user" ? "chat-message-row-user" : "chat-message-row-bot"
        }`}
      >
        {msg.sender === "bot" && (
          <img src={botIcon} className="bot-icon" alt="bot" />
        )}
        <div
          className={`chat-message ${
            msg.sender === "user" ? "chat-message-user" : "chat-message-bot"
          }`}
        >
          {msg.content}
        </div>
      </div>
    ))}
    <div ref={messagesEndRef} />
  </div>
);

export default ChatMessages;
