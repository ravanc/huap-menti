import { useState, useEffect } from "react";
import logo from "./assets/huap-logo.png";
import Button from "./components/Button";
import QuestionContainer from "./components/QuestionContainer";
import AskQuestionModal from "./components/AskQuestionModal";

function App() {
  const [socket, setSocket] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const ws = new WebSocket("https://huap-menti.onrender.com"); // Use your WebSocket server URL
    setSocket(ws);

    ws.onopen = () => console.log("WebSocket Connected");
    ws.onerror = (err) => console.error("WebSocket Error:", err);
    ws.onclose = () => console.log("WebSocket Disconnected");

    return () => {
      ws.close();
    };
  }, []);

  const handleSubmitQuestion = (questionText) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ text: questionText }));
    }
  };

  const noChatGptQuestion = (questionText) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ text: questionText, noChatGpt: true }));
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col">
      <div className="bg-[#912927] p-4 pl-6 flex items-center w-full">
        <img src={logo} alt="HUAP Logo" className="h-12 w-auto mr-3" />
        <div className="text-[#F1E9D8] text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold">
          Panel 2: Disrupting the Status Quo: Technology’s Role in an Uncertain
          Future
        </div>
        <Button
          text={"Ask a Question!"}
          onClick={() => setIsModalOpen(true)}
          invertColors={true}
          style={"ml-auto mr-2 sm:mr-5 max-md:rounded-sm"}
        />
      </div>
      <QuestionContainer socket={socket} />
      {isModalOpen && (
        <AskQuestionModal
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmitQuestion}
        />
      )}
    </div>
  );
}

export default App;
