import { useCallback, useEffect, useRef } from "react";
import { parseGameMessage } from "../game/gameProtocol";

export default function GodotGameFrame({ startMessage, onMessage, onError }) {
  const frameRef = useRef(null);
  const startSentRef = useRef(false);

  const sendStart = useCallback(() => {
    const frameWindow = frameRef.current?.contentWindow;
    if (!frameWindow || startSentRef.current) return;

    frameWindow.postMessage(
      JSON.stringify(startMessage),
      window.location.origin,
    );
    startSentRef.current = true;
  }, [startMessage]);

  useEffect(() => {
    const handleMessage = (event) => {
      if (
        event.origin !== window.location.origin ||
        event.source !== frameRef.current?.contentWindow
      ) {
        return;
      }

      const message = parseGameMessage(event.data);
      if (!message) return;
      if (message.type === "game.ready") sendStart();
      onMessage(message);
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onMessage, sendStart]);

  return (
    <iframe
      ref={frameRef}
      className="godot-game-frame"
      src="/game/index.html"
      title="HubNotes study game"
      allowFullScreen
      onError={() => onError?.("The game could not be loaded.")}
    />
  );
}
