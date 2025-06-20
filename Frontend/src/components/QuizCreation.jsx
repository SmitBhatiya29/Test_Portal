import { useState } from 'react';
import PropTypes from 'prop-types';
import axios from "axios";


const QuizCreation = ({ onSave }) => {
  const [questions, setQuestions] = useState([
    { id: 1, text: "", type: "MCQ", options: ["", "", "", ""], correct: [], marks: 1, negativeMarks: 0 }
  ]);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { id: questions.length + 1, text: "", type: "MCQ", options: ["", "", "", ""], correct: [], marks: 1, negativeMarks: 0 }
    ]);
  };

  const handleCreateTest = () => {
    // Validate questions
    const isValid = questions.every(q => 
      q.text.trim() !== "" && 
      (q.type === "NAT" ? q.correct.length > 0 : q.options.every(opt => opt.trim() !== ""))
    );

    if (!isValid) {
      alert("Please fill in all required fields for each question");
      return;
    }

    onSave(questions);
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    if (field === "type") {
      updatedQuestions[index].options = value === "MCQ" || value === "MSQ" ? ["", "", "", ""] : [];
      updatedQuestions[index].correct = [];
    }
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].options[oIndex] = value;
    setQuestions(updatedQuestions);
  };

  const handleCorrectAnswer = (qIndex, value, isMulti) => {
    const updatedQuestions = [...questions];
    if (isMulti) {
      updatedQuestions[qIndex].correct = updatedQuestions[qIndex].correct.includes(value)
        ? updatedQuestions[qIndex].correct.filter((v) => v !== value)
        : [...updatedQuestions[qIndex].correct, value];
    } else {
      updatedQuestions[qIndex].correct = [value];
    }
    setQuestions(updatedQuestions);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Create Questions</h2>
      <div className="space-y-8">
        {questions.map((q, qIndex) => (
          <div key={q.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Question {q.id}</h3>
              <select
                className="px-3 py-1.5 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                value={q.type}
                onChange={(e) => handleQuestionChange(qIndex, "type", e.target.value)}
              >
                <option value="MCQ">Multiple Choice</option>
                <option value="MSQ">Multiple Select</option>
                <option value="NAT">Numeric Answer</option>
                <option value="TrueFalse">True/False</option>
              </select>
            </div>

            <div className="space-y-4">
              <div>
                <textarea
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                  rows="3"
                  placeholder="Enter question text"
                  value={q.text}
                  onChange={(e) => handleQuestionChange(qIndex, "text", e.target.value)}
                />
              </div>

              {(q.type === "MCQ" || q.type === "MSQ") && (
                <div className="space-y-3">
                  {q.options.map((opt, oIndex) => (
                    <div key={oIndex} className="flex items-center gap-3">
                      <input
                        type={q.type === "MCQ" ? "radio" : "checkbox"}
                        name={`correct-${qIndex}`}
                        checked={q.correct.includes(opt)}
                        onChange={() => handleCorrectAnswer(qIndex, opt, q.type === "MSQ")}
                        className="text-emerald-500 focus:ring-emerald-500"
                      />
                      <input
                        type="text"
                        className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                        placeholder={`Option ${String.fromCharCode(65 + oIndex)}`}
                        value={opt}
                        onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              )}

              {q.type === "NAT" && (
                <input
                  type="number"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                  placeholder="Enter correct numeric answer"
                  value={q.correct[0] || ""}
                  onChange={(e) => handleCorrectAnswer(qIndex, e.target.value, false)}
                />
              )}

              {q.type === "TrueFalse" && (
                <div className="flex gap-4">
                  {["True", "False"].map((opt) => (
                    <label key={opt} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`correct-${qIndex}`}
                        value={opt}
                        checked={q.correct.includes(opt)}
                        onChange={() => handleCorrectAnswer(qIndex, opt, false)}
                        className="text-emerald-500 focus:ring-emerald-500"
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Marks
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                    value={q.marks}
                    onChange={(e) => handleQuestionChange(qIndex, "marks", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Negative Marks
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                    value={q.negativeMarks}
                    onChange={(e) => handleQuestionChange(qIndex, "negativeMarks", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex gap-4">
        <button
          className="flex-1 px-6 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200"
          onClick={handleAddQuestion}
        >
          Add Question
        </button>
        <button
          className="flex-1 px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
          onClick={handleCreateTest}
        >
          Create Test
        </button>
      </div>
    </div>
  );
};

QuizCreation.propTypes = {
  onSave: PropTypes.func.isRequired,
};

export default QuizCreation;