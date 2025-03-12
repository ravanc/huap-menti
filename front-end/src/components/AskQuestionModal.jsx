import { useState } from "react";

export default function AskQuestionModal({ onClose, onSubmit }) {
  const [question, setQuestion] = useState("");

  return (
    <div
      className="fixed inset-0 flex items-center justify-center px-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }} // Translucent background
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Ask a Question</h2>
          <button
            className="text-gray-500 hover:text-red-500"
            onClick={onClose}
          >
            ✖
          </button>
        </div>
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-md mb-4"
          placeholder="Type your question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <button
          className="w-full bg-[#912927] text-white p-2 rounded-md hover:bg-[#7b2222]"
          onClick={() => {
            if (question.trim() !== "") {
              onSubmit(question);
              setQuestion(""); // Clear input
              onClose(); // Close modal
            }
          }}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
