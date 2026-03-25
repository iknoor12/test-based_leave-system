import { useState, useEffect, useCallback } from 'react';
import Button from '../common/Button';

const MCQTest = ({ onSubmit, subject, questions: externalQuestions }) => {
  // State Management
  const [questions, setQuestions] = useState(externalQuestions || []);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(null);
  // If external questions provided, use the subject directly, otherwise allow selection
  const [selectedSubject, setSelectedSubject] = useState(externalQuestions ? subject : null);
  const [showCheatingWarning, setShowCheatingWarning] = useState(false);
  const [cheatingWarningType, setCheatingWarningType] = useState(''); // 'tab' or 'copy'
  const [cheatingCount, setCheatingCount] = useState(0);
  const [showTimeUpMessage, setShowTimeUpMessage] = useState(false);

  // Subject configurations
  const SUBJECTS = {
    mathematics: {
      name: 'Mathematics',
      url: 'https://opentdb.com/api.php?amount=5&category=19&difficulty=medium&type=multiple',
      icon: '📐',
    },
    computers: {
      name: 'Computers',
      url: 'https://opentdb.com/api.php?amount=5&category=18&difficulty=medium&type=multiple',
      icon: '💻',
    },
  };

  // Helper: Decode HTML entities from API
  const decodeHTML = (html) => {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  };

  // Helper: Shuffle array
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Helper: Process and format questions from API
  const processQuestions = (apiQuestions) => {
    return apiQuestions.map((q) => {
      const allOptions = [q.correct_answer, ...q.incorrect_answers];
      const shuffledOptions = shuffleArray(allOptions);
      const correctAnswerIndex = shuffledOptions.indexOf(q.correct_answer);

      return {
        question: decodeHTML(q.question),
        options: shuffledOptions.map((opt) => decodeHTML(opt)),
        correctAnswer: correctAnswerIndex,
        category: q.category,
        difficulty: q.difficulty,
      };
    });
  };

  // Fetch questions from API based on subject selection
  useEffect(() => {
    if (!selectedSubject) return;

    const fetchQuestions = async () => {
      try {
        setLoading(true);
        setError(null);
        const subjectConfig = SUBJECTS[selectedSubject];
        const response = await fetch(subjectConfig.url);
        
        if (!response.ok) {
          throw new Error('Failed to fetch questions');
        }
        
        const data = await response.json();
        
        if (data.results.length === 0) {
          throw new Error('No questions found for this subject');
        }

        const processedQuestions = processQuestions(data.results);
        setQuestions(processedQuestions);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Error fetching questions. Please try again.');
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [selectedSubject]);

  // Handle auto-move when time runs out
  const handleAutoMove = useCallback(() => {
    if (currentQuestion < questions.length - 1) {
      setShowTimeUpMessage(true);
      // Show message for 2 seconds then move to next question
      setTimeout(() => {
        moveToNextQuestion();
        setShowTimeUpMessage(false);
      }, 2000);
    } else {
      // Last question - complete quiz
      setShowTimeUpMessage(true);
      setTimeout(() => {
        setQuizCompleted(true);
        setShowTimeUpMessage(false);
      }, 2000);
    }
  }, [currentQuestion, questions.length]);

  // Timer effect - 120 seconds (2 minutes) per question
  useEffect(() => {
    if (!quizStarted || quizCompleted || !questions.length || showTimeUpMessage) return;

    if (timeLeft === 0) {
      handleAutoMove();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, quizStarted, quizCompleted, questions.length, handleAutoMove, showTimeUpMessage]);

  // Fullscreen and cheating detection when quiz starts
  useEffect(() => {
    if (!quizStarted || quizCompleted) return;

    // Request fullscreen
    const requestFullscreen = async () => {
      try {
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
          await elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) {
          await elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) {
          await elem.msRequestFullscreen();
        }
      } catch (err) {
        console.log('Fullscreen request failed (may be restricted in this environment)');
      }
    };

    requestFullscreen();

    // Tab visibility detection - detect when user switches tabs
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // User switched away from tab
        setShowCheatingWarning(true);
        setCheatingWarningType('tab');
        setCheatingCount((prev) => {
          const newCount = prev + 1;
          if (newCount >= 3) {
            setQuizCompleted(true);
          }
          return newCount;
        });

        // Auto-hide warning after 3 seconds
        setTimeout(() => setShowCheatingWarning(false), 3000);
      }
    };

    // Copy/paste prevention
    const handleCopy = (e) => {
      e.preventDefault();
      setShowCheatingWarning(true);
      setCheatingWarningType('copy');
      setCheatingCount((prev) => {
        const newCount = prev + 1;
        if (newCount >= 3) {
          setQuizCompleted(true);
        }
        return newCount;
      });

      setTimeout(() => setShowCheatingWarning(false), 3000);
    };

    const handlePaste = (e) => {
      e.preventDefault();
      setShowCheatingWarning(true);
      setCheatingWarningType('copy');
      setCheatingCount((prev) => {
        const newCount = prev + 1;
        if (newCount >= 3) {
          setQuizCompleted(true);
        }
        return newCount;
      });

      setTimeout(() => setShowCheatingWarning(false), 3000);
    };

    // Right-click prevention
    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    // Detect keyboard shortcuts for tab switching (Alt+Tab, Ctrl+Tab, Cmd+Tab)
    const handleKeyDown = (e) => {
      // Alt+Tab, Ctrl+Tab, or Cmd+Tab - all tab switching shortcuts
      if (e.key === 'Tab' && (e.altKey || e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setShowCheatingWarning(true);
        setCheatingWarningType('tab');
        setCheatingCount((prev) => {
          const newCount = prev + 1;
          if (newCount >= 3) {
            setQuizCompleted(true);
          }
          return newCount;
        });

        setTimeout(() => setShowCheatingWarning(false), 3000);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('paste', handlePaste);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('paste', handlePaste);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [quizStarted, quizCompleted]);

  // Exit fullscreen when quiz is completed
  useEffect(() => {
    if (!quizCompleted) return;

    const exitFullscreen = async () => {
      try {
        if (document.fullscreenElement) {
          await document.exitFullscreen();
        } else if (document.webkitFullscreenElement) {
          await document.webkitCancelFullScreen();
        } else if (document.msFullscreenElement) {
          await document.msExitFullscreen();
        }
      } catch (err) {
        console.log('Exit fullscreen failed:', err);
      }
    };

    exitFullscreen();
  }, [quizCompleted]);

  // Select subject and load questions
  const selectSubject = (subject) => {
    setSelectedSubject(subject);
  };

  // Start quiz
  const startQuiz = () => {
    setQuizStarted(true);
    setTimeLeft(120);
  };

  // Handle answer selection
  const handleSelectAnswer = (index) => {
    if (showFeedback || selectedAnswer !== null) return;

    const isCorrect = index === questions[currentQuestion].correctAnswer;
    setSelectedAnswer(index);
    setIsAnswerCorrect(isCorrect);
    setShowFeedback(true);

    // Update score if correct
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    // Update answered questions
    setAnsweredQuestions((prev) => ({
      ...prev,
      [currentQuestion]: index,
    }));

    // Auto move after feedback delay
    const timeout = setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        moveToNextQuestion();
      } else {
        finishQuiz();
      }
    }, 1500);

    return () => clearTimeout(timeout);
  };

  // Move to next question
  const moveToNextQuestion = useCallback(() => {
    setCurrentQuestion((prev) => prev + 1);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setIsAnswerCorrect(null);
    setTimeLeft(120);
  }, []);

  // Finish quiz
  const finishQuiz = useCallback(() => {
    setQuizCompleted(true);
  }, []);

  // Reset quiz
  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setAnsweredQuestions({});
    setQuizStarted(false);
    setQuizCompleted(false);
    setSelectedSubject(null);
    setTimeLeft(120);
    setShowFeedback(false);
    setIsAnswerCorrect(null);
  };

  // Subject selection screen - MUST come before any quiz screens
  if (!selectedSubject) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Select a Subject</h1>
            <p className="text-gray-600">Choose a subject to start the MCQ test</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(SUBJECTS).map(([key, subject]) => (
              <button
                key={key}
                onClick={() => selectSubject(key)}
                className="bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-lg p-8 text-center transition-all duration-200 border-2 border-blue-200 hover:border-blue-400"
              >
                <div className="text-5xl mb-4">{subject.icon}</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{subject.name}</h2>
                <p className="text-gray-600 text-sm">5 Questions • Medium Difficulty</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading questions...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <div className="text-center">
            <div className="text-red-600 text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Quiz</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={resetQuiz} variant="primary">
              Try Another Subject
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Pre-quiz screen
  if (!quizStarted) {
    const subjectConfig = SUBJECTS[selectedSubject] || { name: subject, icon: '📚' };
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {subjectConfig.icon} {subjectConfig.name}
            </h1>
            <div className="bg-blue-50 rounded-lg p-6 mb-6">
              <p className="text-2xl font-bold text-blue-600 mb-2">
                {questions.length} Questions
              </p>
              <p className="text-gray-600 text-sm">2 minutes per question</p>
            </div>
            <div className="space-y-3 text-left mb-6">
              <div className="flex items-start gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <p className="text-gray-600 text-sm">
                  Multiple choice questions on {subjectConfig.name}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <p className="text-gray-600 text-sm">Auto-advance to next question</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <p className="text-gray-600 text-sm">Track your score in real-time</p>
              </div>
            </div>
            <div className="space-y-2">
              <Button onClick={startQuiz} variant="primary" className="w-full">
                Start Quiz
              </Button>
              <Button onClick={resetQuiz} variant="secondary" className="w-full">
                Change Subject
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Quiz completed screen
  if (quizCompleted) {
    const percentage = Math.round((score / questions.length) * 100);
    const passingScore = 4; // Need at least 4 out of 5 correct
    const hasPassed = score >= passingScore;
    
    const performanceMessage =
      percentage >= 80
        ? '🎉 Excellent Performance!'
        : percentage >= 60
          ? '👍 Good Job!'
          : '💪 Keep Practicing!';

    // If passed, notify parent and move to coding test
    if (hasPassed && onSubmit) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-3xl font-bold text-green-600 mb-2">You Passed!</h2>
            <p className="text-gray-600 mb-6">Great job! You've qualified for the coding test.</p>

            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-8 mb-6">
              <p className="text-5xl font-bold text-green-600 mb-2">
                {score}/{questions.length}
              </p>
              <p className="text-2xl font-semibold text-gray-800 mb-2">{percentage}%</p>
              <p className="text-lg text-gray-600">{performanceMessage}</p>
            </div>

            <div className="space-y-2 mb-6 text-left bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Correct Answers:</span>
                <span className="font-bold text-green-600">{score}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Wrong Answers:</span>
                <span className="font-bold text-red-600">
                  {questions.length - score}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Required Score:</span>
                <span className="font-bold text-blue-600">{passingScore}/5</span>
              </div>
            </div>

            <Button 
              onClick={() => onSubmit({ score, totalQuestions: questions.length })} 
              variant="primary" 
              className="w-full"
            >
              Proceed to Coding Test
            </Button>
          </div>
        </div>
      );
    }

    // If failed, show failure message and allow retake
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-5xl mb-4">❌</div>
          <h2 className="text-3xl font-bold text-red-600 mb-2">Quiz Not Passed</h2>
          <p className="text-gray-600 mb-6">You need at least 4 correct answers to proceed.</p>

          <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-lg p-8 mb-6">
            <p className="text-5xl font-bold text-red-600 mb-2">
              {score}/{questions.length}
            </p>
            <p className="text-2xl font-semibold text-gray-800 mb-2">{percentage}%</p>
          </div>

          <div className="space-y-2 mb-6 text-left bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Correct Answers:</span>
              <span className="font-bold text-green-600">{score}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Wrong Answers:</span>
              <span className="font-bold text-red-600">
                {questions.length - score}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Required Score:</span>
              <span className="font-bold text-blue-600">{passingScore}/5</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Score Needed:</span>
              <span className="font-bold text-orange-600">{Math.max(0, passingScore - score)} more</span>
            </div>
          </div>

          <Button onClick={resetQuiz} variant="primary" className="w-full">
            Retake Quiz
          </Button>
        </div>
      </div>
    );
  }

  // Active quiz screen
  if (!questions.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No questions available</p>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const isTimerWarning = timeLeft <= 10;
  const subjectConfig = SUBJECTS[selectedSubject] || { name: subject, icon: '📚' };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-900">
              {subjectConfig.icon} {subjectConfig.name}
            </h1>
            <div
              className={`text-center p-3 rounded-lg font-bold text-xl ${
                isTimerWarning
                  ? 'bg-red-100 text-red-600'
                  : 'bg-blue-100 text-blue-600'
              }`}
            >
              {timeLeft}s
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <span className="text-gray-600">
                Completed: {Object.keys(answeredQuestions).length}/{questions.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${(Object.keys(answeredQuestions).length / questions.length) * 100}%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          {/* Question Text */}
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {question.question}
          </h2>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {question.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrectAnswer = index === question.correctAnswer;

              let buttonStyles = 'border-gray-200 hover:border-blue-300';

              if (showFeedback) {
                if (isCorrectAnswer) {
                  buttonStyles = 'border-green-500 bg-green-50';
                } else if (isSelected) {
                  buttonStyles = 'border-red-500 bg-red-50';
                }
              } else if (isSelected) {
                buttonStyles = 'border-blue-500 bg-blue-50';
              }

              return (
                <button
                  key={index}
                  onClick={() => handleSelectAnswer(index)}
                  disabled={showFeedback || selectedAnswer !== null}
                  className={`w-full text-left p-4 border-2 rounded-lg transition-all ${buttonStyles} ${
                    (showFeedback || selectedAnswer !== null) && !isSelected
                      ? 'opacity-60'
                      : ''
                  }`}
                >
                  <div className="flex items-center">
                    <div
                      className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                        showFeedback
                          ? isCorrectAnswer
                            ? 'border-green-500 bg-green-500 text-white'
                            : isSelected
                              ? 'border-red-500 bg-red-500 text-white'
                              : 'border-gray-300'
                          : isSelected
                            ? 'border-blue-500 bg-blue-500 text-white'
                            : 'border-gray-300'
                      }`}
                    >
                      {showFeedback ? (
                        isCorrectAnswer ? (
                          '✓'
                        ) : isSelected ? (
                          '✗'
                        ) : null
                      ) : isSelected ? (
                        '✓'
                      ) : null}
                    </div>
                    <span className="text-gray-800">{option}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Feedback Message */}
          {showFeedback && (
            <div
              className={`p-4 rounded-lg border-2 text-center font-semibold ${
                isAnswerCorrect
                  ? 'bg-green-50 border-green-500 text-green-700'
                  : 'bg-red-50 border-red-500 text-red-700'
              }`}
            >
              {isAnswerCorrect
                ? '✓ Correct Answer!'
                : '✗ Incorrect. Moving to next question...'}
            </div>
          )}
        </div>

        {/* Navigation and Status Messages */}
        {showFeedback && (
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Moving to next question in a moment...
            </p>
          </div>
        )}

        {/* Time's Up Message */}
        {showTimeUpMessage && (
          <div className="text-center">
            <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-6 inline-block">
              <p className="text-lg font-bold text-yellow-700">⏱️ Time's Up!</p>
              <p className="text-sm text-yellow-600 mt-2">Moving to next question...</p>
            </div>
          </div>
        )}

        {/* Cheating Warning Modal */}
        {showCheatingWarning && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
              <div className="text-center">
                <div className="text-red-600 text-5xl mb-4">⚠️</div>
                <h2 className="text-2xl font-bold text-red-700 mb-2">
                  {cheatingWarningType === 'tab' ? 'Tab Switch Detected!' : 'Copy/Paste Not Allowed!'}
                </h2>
                <p className="text-gray-700 mb-4 font-semibold">
                  {cheatingWarningType === 'tab'
                    ? "You switched away from the quiz. This is not allowed during the test."
                    : "Copying or pasting content is not permitted during the test."}
                </p>
                <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 mb-6">
                  <p className="text-sm text-yellow-800">
                    <strong>Warning {cheatingCount} of 3:</strong> One more violation will result in automatic test submission.
                  </p>
                </div>
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    ✓ Stay focused on the test window
                  </p>
                  <p className="text-sm text-gray-600">
                    ✓ Do not switch tabs or minimize the window
                  </p>
                  <p className="text-sm text-gray-600">
                    ✓ Do not copy or paste any content
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MCQTest;
