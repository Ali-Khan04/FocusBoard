export default function MessageDisplay({ flowMessage, messageType }) {
  if (!flowMessage) return null;
  return (
    <p
      className={messageType === "error" ? "error-message" : "success-message"}
      style={{ marginTop: "10px", textAlign: "center", fontSize: "14px" }}
    >
      {flowMessage}
    </p>
  );
}
