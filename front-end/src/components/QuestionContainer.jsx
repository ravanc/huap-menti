import { useState, useEffect } from "react";
import Card from "./Card";
const QuestionContainer = ({ socket }) => {
  const [questions, setQuestions] = useState([]);
  const apiUrl = "http://localhost:8080/questions"; // Backend API for past questions

  useEffect(() => {
    // Fetch initial questions for persistence
    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => setQuestions(data))
      .catch((err) => console.error("Failed to fetch questions:", err));

    if (!socket) return; // Wait until WebSocket is initialized

    // Handle incoming messages
    socket.onmessage = (event) => {
      try {
        const newQuestion = JSON.parse(event.data);
        setQuestions((prev) => [...prev, newQuestion]);
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };
  }, [socket]);

  return (
    <div className="h-full flex">
      <div className="flex flex-col md:flex-wrap p-8 max-md:items-center">
        {questions.map((q, index) => (
          <Card
            key={index}
            text={q.text}
            response={q.response}
            onDelete={() =>
              setQuestions(questions.filter((_, i) => i !== index))
            }
          />
        ))}
      </div>
    </div>
  );
};

export default QuestionContainer;
