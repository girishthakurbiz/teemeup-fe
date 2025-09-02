import sendButton from "../assets/sendButton.png";

const ChatInput = ({
  showIntro,
  input,
  setInput,
  sendMessage,
  questions,
  generatePrompt,
}) => (
  <div className="chat-input">
    <input
      type="text"
      placeholder="Describe the design you want on your t-shirt"
      value={input}
      onChange={(e) => setInput(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && sendMessage()}
    />

    {showIntro ? (
      <button onClick={sendMessage} className="send-button">
        <img src={sendButton} alt="send" />
      </button>
    ) : (
      <>
        <button className="generate-btn" onClick={generatePrompt}>
          Generate
        </button>
        {questions && (
          <>
            {" "}
            <button className="generate-btn" onClick={sendMessage}>
              Next
            </button>{" "}
            <button className="generate-btn" onClick={generatePrompt}>
              Finalize prompt
            </button>
          </>
        )}
      </>
    )}
  </div>
);

export default ChatInput;
