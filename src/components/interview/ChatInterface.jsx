import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, MicOff, User, Bot, Clock } from 'lucide-react';

export function ChatInterface({ question, isActive, onAnswerSubmit, responses }) {
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCurrentQuestion, setShowCurrentQuestion] = useState(true);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end'
      });
    }
  }, [responses, showCurrentQuestion]);

  // Show current question when it changes
  useEffect(() => {
    if (question) {
      setShowCurrentQuestion(true);
      setCurrentAnswer('');
    }
  }, [question]);

  // Auto-focus and scroll when question changes
  useEffect(() => {
    if (isActive && question && showCurrentQuestion) {
      const timer = setTimeout(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [question, isActive, showCurrentQuestion]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentAnswer.trim() || !isActive || isSubmitting) return;
    
    setIsSubmitting(true);
    setShowCurrentQuestion(false); // Hide current question after answering
    
    try {
      await onAnswerSubmit(currentAnswer.trim());
      setCurrentAnswer('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVoiceToggle = () => {
    setIsRecording(!isRecording);
    // Add voice recording functionality here if needed
  };

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 6) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getScoreEmoji = (score) => {
    if (score >= 8) return '🟢';
    if (score >= 6) return '🟡';
    return '🔴';
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden h-[600px] flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg shadow-lg">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">AI Interview Coach</h3>
              <p className="text-sm text-gray-600">Interactive Interview Practice</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${
              isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
            }`} />
            <span className="text-sm font-medium text-gray-600">
              {isActive ? 'Recording' : 'Paused'}
            </span>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth bg-gradient-to-b from-gray-50 to-white"
        style={{ maxHeight: '400px' }}
      >
        <AnimatePresence mode="popLayout">
          {/* Previous Q&A Pairs */}
          {responses.map((response, index) => (
            <div key={`qa-pair-${index}`} className="space-y-4">
              {/* Previous Question */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-start space-x-3"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 max-w-[85%]">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl rounded-tl-none p-4 border border-blue-200 shadow-sm">
                    <div className="flex items-center mb-2">
                      <span className="text-xs font-semibold text-blue-700">Question {index + 1}</span>
                    </div>
                    <p className="text-gray-800 leading-relaxed font-medium">
                      {response.question}
                    </p>
                    <div className="flex items-center mt-3 space-x-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium border border-blue-200">
                        {response.questionType}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* User's Previous Answer */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-start space-x-3 justify-end"
              >
                <div className="flex-1 max-w-[85%] text-right">
                  <div className="inline-block bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-2xl rounded-tr-none p-4 shadow-lg">
                    <p className="leading-relaxed text-left">{response.answer}</p>
                    <div className="mt-2 text-right">
                      <span className="text-xs text-gray-300">
                        {response.answer.split(' ').length} words
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full flex items-center justify-center shadow-lg">
                  <User className="h-5 w-5 text-white" />
                </div>
              </motion.div>

              {/* AI Feedback for Previous Answer */}
              {response.feedback && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-start space-x-3"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white text-sm font-bold">AI</span>
                  </div>
                  <div className="flex-1 max-w-[85%]">
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl rounded-tl-none p-4 border border-green-200 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-semibold text-green-900">Feedback</span>
                          <span className="text-xl">{getScoreEmoji(response.feedback.score)}</span>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-bold border ${getScoreColor(response.feedback.score)}`}>
                          {response.feedback.score}/10
                        </div>
                      </div>
                      <p className="text-green-800 leading-relaxed text-sm mb-3">
                        {response.feedback.feedback}
                      </p>
                      {response.feedback.tips && response.feedback.tips.length > 0 && (
                        <div className="mt-3 p-3 bg-white rounded-lg border border-green-100">
                          <p className="text-xs font-semibold text-green-900 mb-2">💡 Quick Tips:</p>
                          <ul className="text-xs text-green-800 space-y-1">
                            {response.feedback.tips.slice(0, 2).map((tip, tipIndex) => (
                              <li key={tipIndex} className="flex items-start">
                                <span className="w-1 h-1 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                                {tip}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Divider between Q&A pairs */}
              {index < responses.length - 1 && (
                <div className="flex justify-center py-2">
                  <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                </div>
              )}
            </div>
          ))}

          {/* Current Active Question (only show if not answered yet) */}
          {question && showCurrentQuestion && (
            <motion.div
              key={`current-question-${question.question}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start space-x-3"
            >
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 max-w-[85%]">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl rounded-tl-none p-4 border-2 border-blue-300 shadow-lg">
                  <div className="flex items-center mb-2">
                    <span className="text-xs font-semibold text-blue-700">
                      Current Question
                    </span>
                    <Clock className="h-3 w-3 text-blue-500 ml-2" />
                  </div>
                  <p className="text-gray-800 leading-relaxed font-medium text-lg">
                    {question.question}
                  </p>
                  <div className="flex items-center mt-3 space-x-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium border border-blue-200">
                      {question.type}
                    </span>
                    <span className={`px-3 py-1 text-xs rounded-full font-medium border ${
                      question.difficulty === 'easy' ? 'bg-green-100 text-green-700 border-green-200' :
                      question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                      'bg-red-100 text-red-700 border-red-200'
                    }`}>
                      {question.difficulty}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Loading indicator when processing answer */}
          {isSubmitting && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-start space-x-3"
            >
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
              <div className="flex-1 max-w-[85%]">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl rounded-tl-none p-4 border border-green-200 shadow-sm">
                  <p className="text-green-800 text-sm animate-pulse">
                    Analyzing your answer and preparing feedback...
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="p-6 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        <form onSubmit={handleSubmit} className="flex space-x-3">
          <div className="flex-1 relative">
            <textarea
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              placeholder={
                !isActive 
                  ? "Start the interview to begin answering" 
                  : !showCurrentQuestion
                  ? "Processing your answer..."
                  : "Type your answer here..."
              }
              disabled={!isActive || isSubmitting || !showCurrentQuestion}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed resize-none transition-all shadow-sm"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                  handleSubmit(e);
                }
              }}
            />
            <div className="absolute bottom-2 right-2 text-xs text-gray-400">
              {currentAnswer.split(' ').filter(Boolean).length} words • Ctrl+Enter to send
            </div>
          </div>
          
          <div className="flex flex-col space-y-2">
            <motion.button
              type="button"
              onClick={handleVoiceToggle}
              className={`p-3 rounded-xl transition-all shadow-lg ${
                isRecording 
                  ? 'bg-red-500 text-white' 
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-300'
              }`}
              whileTap={{ scale: 0.95 }}
              disabled={!isActive || !showCurrentQuestion}
            >
              {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </motion.button>
            
            <motion.button
              type="submit"
              disabled={!currentAnswer.trim() || !isActive || isSubmitting || !showCurrentQuestion}
              className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all shadow-lg"
              whileTap={{ scale: 0.95 }}
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </motion.button>
          </div>
        </form>
        
        {/* Status indicator */}
        <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
          <span>
            {!isActive 
              ? "Interview is paused" 
              : !showCurrentQuestion
              ? "Processing your answer..."
              : isSubmitting
              ? "Submitting answer..."
              : "Ready for your answer"
            }
          </span>
          {showCurrentQuestion && isActive && (
            <span className="text-blue-600 font-medium animate-pulse">
              • Waiting for response
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
