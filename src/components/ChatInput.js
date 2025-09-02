import SendIcon from "../assets/sendButton";

const ChatInput = ({
  showIntro,
  input,
  setInput,
  sendMessage,
  questions,
  generatePrompt,
  skipQuestion
}) => (
  <div className="chat-input">
    <input
      type="text"
      placeholder="Enter your idea here  (Ex. - Astronaut with a boom box)"
      value={input}
      onChange={(e) => setInput(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && sendMessage()}
    />

    {showIntro ? (
      <button onClick={sendMessage} className="send-button">
        {/* <img src={sendButton} alt="send" /> */}
        <SendIcon/>
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
             <button className="generate-btn" onClick={skipQuestion}>
              Skip
            </button>
          </>
        )}
      </>
    )}
  </div>
);

export default ChatInput;
