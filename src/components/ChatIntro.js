import icon from "../assets/gptIcon.png";
import { DEVICES } from "../hooks/useScreenSize";

const ChatIntro = ({ screenSize }) => {
  return (
    <>
      <div className="chat-box">
        {screenSize !== DEVICES.MOBILE && (
          <div className="chat-gpt-icon">
            <img
              src={icon}
              alt="icon"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </div>
        )}
        <div className="chat-gpt-content">
          <div className="chat-gpt-heading">Describe it. We’ll design it.</div>
          {screenSize !== DEVICES.MOBILE && (
            <div className="chat-gpt-subcontent">
              "From quick sketches to polished visuals, our AI takes your
              descriptions and turns them into stunning designs. Fast, Easy, and
              Effortless."
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ChatIntro;
