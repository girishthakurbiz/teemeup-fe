import icon from "../assets/gptIcon.png";
import gptIcon from "../assets/gptPoweredIcon.png";

const ChatIntro = () => (
  <>
    <div className="chat-box">
      <div className="chat-gpt-icon">
        <img
          src={icon}
          alt="icon"
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      </div>
      <div className="chat-gpt-content">
        <div>Creative Engine</div>
        <div>
          "Powered by Creative AI — we turn your words into stunning T-shirt
          designs in seconds."
        </div>
      </div>
    </div>
    <div className="chat-subtitle2">
      <div className="chat-gpt-icon2">
        <img
          src={gptIcon}
          alt="icon"
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      </div>
      <div>Powered by ChatGPT</div>
    </div>
  </>
);

export default ChatIntro;
