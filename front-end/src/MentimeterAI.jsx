import React, { useState } from "react";

const MentimeterAI = () => {
  const [title, setTitle] = useState("My Interactive Event");
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Function to simulate AI processing (in a real app, this would call ChatGPT API)
  const processWithAI = async (question) => {
    setLoading(true);
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Simulate AI response (replace with actual API call)
    const aiResponses = [
      "This is an interesting question that relates to our topic in several ways...",
      "Great question! The data suggests that...",
      "I'd like to highlight a few key points in response to this question...",
      "This question touches on an important aspect of our discussion today...",
    ];

    const aiResponse =
      aiResponses[Math.floor(Math.random() * aiResponses.length)];
    setLoading(false);
    return aiResponse;
  };

  const handleSubmitQuestion = async () => {
    if (newQuestion.trim()) {
      const aiResponse = await processWithAI(newQuestion);

      setQuestions([
        {
          id: Date.now(),
          text: newQuestion,
          aiResponse,
          timestamp: new Date().toLocaleTimeString(),
        },
        ...questions,
      ]);

      setNewQuestion("");
      setShowModal(false);
    }
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header with title */}
      <header className="bg-purple-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            className="bg-purple-700 text-white text-xl font-bold px-4 py-2 rounded w-8/12 focus:outline-none focus:ring-2 focus:ring-white"
            placeholder="Event Title"
          />
          <button
            onClick={() => setShowModal(true)}
            className="bg-white text-purple-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Ask Question
          </button>
        </div>
      </header>

      {/* Main content area for questions */}
      <main className="container mx-auto flex-grow p-4">
        {questions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <p className="text-lg">No questions yet. Be the first to ask!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {questions.map((q) => (
              <div
                key={q.id}
                className="bg-white rounded-lg shadow-md p-6 transition-all"
              >
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {q.text}
                  </h3>
                  <span className="text-sm text-gray-500">{q.timestamp}</span>
                </div>
                <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-100">
                  <p className="text-gray-700 italic">AI Response:</p>
                  <p className="mt-1">{q.aiResponse}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Question submission modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">Submit Your Question</h3>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-lg h-32 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Type your question here..."
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
              ></textarea>
            </div>
            <div className="bg-gray-50 px-6 py-4 flex justify-end rounded-b-lg">
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-600 mr-4 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitQuestion}
                disabled={loading}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:bg-purple-300"
              >
                {loading ? "Processing..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentimeterAI;
