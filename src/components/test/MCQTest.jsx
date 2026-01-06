import { useState, useEffect } from 'react';
import Timer from '../common/Timer';
import Button from '../common/Button';

const MCQTest = ({ questions = [], onSubmit, subject = 'Mathematics' }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleSelectOption = (optionIndex) => {
    setAnswers({
      ...answers,
      [currentQuestion]: optionIndex,
    });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    const score = Object.entries(answers).filter(
      ([idx, answer]) => questions[parseInt(idx)]?.correctAnswer === answer
    ).length;
    setSubmitted(true);
    onSubmit?.({ answers, score, totalQuestions: questions.length });
  };

  const handleTimeUp = () => {
    handleSubmit();
  };

  if (!questions || questions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No questions available</p>
      </div>
    );
  }

  const question = questions[currentQuestion];

  if (submitted) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Test Submitted</h2>
        <p className="text-gray-600 mb-4">Your answers have been recorded.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">{subject} - MCQ Test</h2>
        <Timer duration={300} onTimeUp={handleTimeUp} />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-500">
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <div className="w-full bg-gray-200 rounded-full h-2 ml-4 max-w-xs">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-900">{question.question}</h3>

        <div className="space-y-3">
          {question.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectOption(idx)}
              className={`w-full text-left p-4 border-2 rounded-lg transition-all ${
                answers[currentQuestion] === idx
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <div
                  className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                    answers[currentQuestion] === idx ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                  }`}
                >
                  {answers[currentQuestion] === idx && <span className="text-white text-xs">✓</span>}
                </div>
                <span className="text-gray-700">{option}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between gap-4">
        <Button onClick={handlePrevious} variant="secondary" disabled={currentQuestion === 0}>
          Previous
        </Button>
        {currentQuestion === questions.length - 1 ? (
          <Button onClick={handleSubmit} variant="success">
            Submit Test
          </Button>
        ) : (
          <Button onClick={handleNext}>
            Next
          </Button>
        )}
      </div>
    </div>
  );
};

export default MCQTest;
