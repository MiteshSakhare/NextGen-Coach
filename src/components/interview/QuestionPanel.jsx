import React from 'react';
import { motion } from 'framer-motion'; // ✅ ADDED: Missing import
import { CheckCircle, Circle, Clock, Brain, User, Briefcase } from 'lucide-react';

export function QuestionPanel({ questions, currentIndex, responses }) {
  const getQuestionIcon = (type) => {
    switch (type) {
      case 'technical':
        return Brain;
      case 'behavioral':
        return User;
      case 'situational':
        return Briefcase;
      default:
        return Circle;
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'hard':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getCompletionStats = () => {
    const answered = responses.length;
    const total = questions.length;
    const avgScore = responses.length > 0 
      ? responses.reduce((acc, r) => acc + (r.feedback?.score || 0), 0) / responses.length
      : 0;

    return { answered, total, avgScore };
  };

  const stats = getCompletionStats();

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress Overview</h3>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Questions Completed</span>
            <span className="font-semibold text-gray-900">
              {stats.answered}/{stats.total}
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(stats.answered / stats.total) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          
          {stats.answered > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Average Score</span>
              <span className="font-semibold text-gray-900">
                {Math.round(stats.avgScore)}/10
              </span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Question List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden"
      >
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
          <h3 className="text-lg font-semibold text-gray-900">Interview Questions</h3>
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {questions.map((question, index) => {
            const Icon = getQuestionIcon(question.type);
            const isCompleted = index < responses.length;
            const isCurrent = index === currentIndex;
            const response = responses.find((r, i) => i === index);

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 border-b border-gray-100 last:border-b-0 transition-all duration-200 ${
                  isCurrent ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {isCompleted ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </motion.div>
                    ) : isCurrent ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      >
                        <Clock className="h-5 w-5 text-blue-600" />
                      </motion.div>
                    ) : (
                      <Circle className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <Icon className="h-4 w-4 text-gray-500" />
                      <span className="text-xs font-medium text-gray-500 uppercase">
                        {question.type}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                        getDifficultyColor(question.difficulty)
                      }`}>
                        {question.difficulty}
                      </span>
                    </div>
                    
                    <p className={`text-sm leading-relaxed ${
                      isCurrent ? 'text-blue-900 font-medium' : 'text-gray-700'
                    }`}>
                      {question.question}
                    </p>
                    
                    {response?.feedback && (
                      <motion.div 
                        className="mt-3 p-3 bg-white rounded-lg border border-gray-200 shadow-sm"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-gray-600 font-medium">AI Feedback</span>
                          <div className="flex items-center space-x-1">
                            <span className="text-xs font-bold text-gray-900">
                              {response.feedback.score}/10
                            </span>
                            <div className={`w-2 h-2 rounded-full ${
                              response.feedback.score >= 8 ? 'bg-green-500' :
                              response.feedback.score >= 6 ? 'bg-yellow-500' : 'bg-red-500'
                            }`} />
                          </div>
                        </div>
                        <p className="text-xs text-gray-700 leading-relaxed">
                          {response.feedback.feedback || "Good response!"}
                        </p>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Tips Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 rounded-2xl border border-purple-200 p-6 shadow-lg"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <span className="text-2xl mr-2">💡</span>
          Interview Tips
        </h3>
        
        <div className="space-y-3 text-sm text-gray-700">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
            <span>Use the STAR method (Situation, Task, Action, Result) for behavioral questions</span>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
            <span>Provide specific examples with quantifiable results when possible</span>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0" />
            <span>Take your time to think before answering - it's okay to pause</span>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0" />
            <span>Ask clarifying questions if you need more context</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
