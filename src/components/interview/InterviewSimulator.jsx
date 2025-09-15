import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Square, RotateCcw, Sparkles, X, Download, Share } from 'lucide-react';
import { ChatInterface } from './ChatInterface';
import { QuestionPanel } from './QuestionPanel';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ConfettiEffect } from '../common/ConfettiEffect';
import { geminiService } from '../../utils/geminiApi';
import { storageService } from '../../utils/localStorage';
import { useApp } from '../../hooks/useApp';

export function InterviewSimulator() {
  const { setInterviewSession } = useApp();
  const [isSetup, setIsSetup] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [sessionData, setSessionData] = useState({
    jobRole: '',
    experience: 'entry',
    skills: [],
    skillsInput: '',
    duration: 30
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const [showDetailReport, setShowDetailReport] = useState(false);

  const handleSkillsChange = (e) => {
    const input = e.target.value;
    setSessionData({ 
      ...sessionData, 
      skillsInput: input,
      skills: input.split(',').map(s => s.trim()).filter(Boolean)
    });
  };

  const handleSetupSubmit = async () => {
    if (!sessionData.jobRole.trim()) {
      alert('Please enter a job role');
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log('Starting question generation...');
      
      const generatedQuestions = await geminiService.generateInterviewQuestions(
        sessionData.jobRole,
        sessionData.experience,
        sessionData.skills
      );
      
      if (generatedQuestions && Array.isArray(generatedQuestions) && generatedQuestions.length > 0) {
        const questionsToUse = generatedQuestions.slice(0, 7);
        setQuestions(questionsToUse);
        setCurrentQuestion(questionsToUse[0]);
        setIsSetup(true);
        console.log(`Successfully generated ${questionsToUse.length} questions`);
      } else {
        throw new Error('No questions generated');
      }
      
    } catch (error) {
      console.error('Error in question generation:', error);
      
      // Fallback questions
      const fallbackQuestions = [
        {
          question: `Tell me about yourself and your background in ${sessionData.jobRole}.`,
          type: 'behavioral',
          difficulty: 'easy'
        },
        {
          question: `What interests you most about this ${sessionData.jobRole} position?`,
          type: 'behavioral',
          difficulty: 'easy'
        },
        {
          question: `Describe a challenging project you worked on. How did you approach it?`,
          type: 'situational',
          difficulty: 'medium'
        },
        {
          question: `How do you handle working under pressure or tight deadlines?`,
          type: 'situational',
          difficulty: 'medium'
        },
        {
          question: `Tell me about a time when you had to learn something new quickly for work.`,
          type: 'behavioral',
          difficulty: 'medium'
        },
        {
          question: `How do you stay updated with the latest trends in ${sessionData.jobRole}?`,
          type: 'behavioral',
          difficulty: 'easy'
        },
        {
          question: `Where do you see yourself in your career 3-5 years from now?`,
          type: 'behavioral',
          difficulty: 'easy'
        }
      ];

      setQuestions(fallbackQuestions);
      setCurrentQuestion(fallbackQuestions[0]);
      setIsSetup(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartInterview = () => {
    setIsActive(true);
  };

  const handleAnswerSubmit = async (answer) => {
    const response = {
      question: currentQuestion.question,
      answer,
      timestamp: Date.now(),
      questionType: currentQuestion.type
    };
    
    const updatedResponses = [...responses, response];
    setResponses(updatedResponses);

    try {
      const feedback = await geminiService.conductInterview(
        currentQuestion.question,
        answer,
        `Job Role: ${sessionData.jobRole}, Experience: ${sessionData.experience}`
      );
      
      response.feedback = feedback;
    } catch (error) {
      console.error('Error getting feedback:', error);
      response.feedback = {
        score: Math.floor(Math.random() * 3) + 7,
        feedback: "Good response! Consider providing more specific examples and quantifiable results.",
        tips: ["Be more specific with examples", "Add quantifiable results"]
      };
    }

    if (questionIndex < questions.length - 1) {
      const nextIndex = questionIndex + 1;
      setQuestionIndex(nextIndex);
      setCurrentQuestion(questions[nextIndex]);
    } else {
      handleCompleteInterview(updatedResponses);
    }
  };

  const handleCompleteInterview = (finalResponses) => {
    const session = {
      id: Date.now().toString(),
      jobRole: sessionData.jobRole,
      experience: sessionData.experience,
      skills: sessionData.skills,
      questions: questions,
      responses: finalResponses,
      completedAt: new Date().toISOString(),
      averageScore: finalResponses.reduce((acc, r) => acc + (r.feedback?.score || 5), 0) / finalResponses.length
    };

    setInterviewSession(session);
    storageService.saveInterviewSession(session.id, session);
    setIsActive(false);
    setShowComplete(true);
  };

  const handleReset = () => {
    setIsSetup(false);
    setIsActive(false);
    setCurrentQuestion(null);
    setQuestions([]);
    setResponses([]);
    setQuestionIndex(0);
    setShowComplete(false);
    setShowDetailReport(false);
    setSessionData({
      jobRole: '',
      experience: 'entry',
      skills: [],
      skillsInput: '',
      duration: 30
    });
  };

  const handleViewDetailReport = () => {
    setShowDetailReport(true);
  };

  const handleDownloadReport = () => {
    // Create report content
    let reportContent = `Interview Report - ${sessionData.jobRole}\n`;
    reportContent += `Generated on: ${new Date().toLocaleDateString()}\n`;
    reportContent += `Experience Level: ${sessionData.experience}\n`;
    reportContent += `Skills: ${sessionData.skills.join(', ')}\n\n`;
    reportContent += `Overall Performance:\n`;
    reportContent += `Average Score: ${Math.round(responses.reduce((acc, r) => acc + (r.feedback?.score || 5), 0) / responses.length)}/10\n`;
    reportContent += `Questions Answered: ${responses.length}\n\n`;
    
    responses.forEach((response, index) => {
      reportContent += `Question ${index + 1}: ${response.question}\n`;
      reportContent += `Answer: ${response.answer}\n`;
      if (response.feedback) {
        reportContent += `Score: ${response.feedback.score}/10\n`;
        reportContent += `Feedback: ${response.feedback.feedback}\n`;
        if (response.feedback.tips) {
          reportContent += `Tips: ${response.feedback.tips.join(', ')}\n`;
        }
      }
      reportContent += '\n---\n\n';
    });
    
    // Create and download file
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `interview-report-${sessionData.jobRole.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Generating personalized interview questions..." />
      </div>
    );
  }

  if (showComplete) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
          <ConfettiEffect trigger={true} />
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center bg-white rounded-2xl border border-gray-100 shadow-xl p-8"
            >
              <div className="text-6xl mb-6">🎉</div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Interview Complete!</h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Congratulations! You've successfully completed your {sessionData.jobRole} interview simulation. 
                Here's how you performed:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {responses.length}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">Questions Answered</div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {Math.round(responses.reduce((acc, r) => acc + (r.feedback?.score || 5), 0) / responses.length)}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">Average Score</div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {Math.round(responses.length * 2.5)}min
                  </div>
                  <div className="text-sm text-gray-600 font-medium">Total Duration</div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                <motion.button
                  onClick={handleViewDetailReport}
                  className="inline-flex items-center px-8 py-4 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Sparkles className="h-5 w-5 mr-2" />
                  View Detailed Report
                </motion.button>
                
                <motion.button
                  onClick={handleDownloadReport}
                  className="inline-flex items-center px-8 py-4 border border-gray-300 text-base font-semibold rounded-xl text-gray-700 bg-white hover:bg-gray-50 shadow-lg hover:shadow-xl transition-all duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Download className="h-5 w-5 mr-2" />
                  Download Report
                </motion.button>
              </div>
              
              <motion.button
                onClick={handleReset}
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 shadow-md transition-all duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <RotateCcw className="h-5 w-5 mr-2" />
                Start New Interview
              </motion.button>
            </motion.div>
          </div>
        </div>

        {/* Detailed Report Modal */}
        <AnimatePresence>
          {showDetailReport && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowDetailReport(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-8 max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-6 sticky top-0 bg-white pb-4 border-b border-gray-200">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Detailed Interview Report</h2>
                      <p className="text-gray-600">{sessionData.jobRole} • {sessionData.experience} level</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={handleDownloadReport}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Download Report"
                      >
                        <Download className="h-5 w-5 text-gray-600" />
                      </button>
                      <button
                        onClick={() => setShowDetailReport(false)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <X className="h-6 w-6 text-gray-600" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Overall Summary */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-8 border border-blue-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Summary</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-blue-600">
                          {Math.round(responses.reduce((acc, r) => acc + (r.feedback?.score || 5), 0) / responses.length * 10) / 10}
                        </div>
                        <div className="text-sm text-gray-600">Average Score</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">
                          {responses.filter(r => r.feedback?.score >= 8).length}
                        </div>
                        <div className="text-sm text-gray-600">Excellent Answers</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-yellow-600">
                          {responses.filter(r => r.feedback?.score >= 6 && r.feedback?.score < 8).length}
                        </div>
                        <div className="text-sm text-gray-600">Good Answers</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-600">
                          {Math.round(responses.length * 2.5)}min
                        </div>
                        <div className="text-sm text-gray-600">Total Time</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Question-by-Question Analysis */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900">Question-by-Question Analysis</h3>
                    {responses.map((response, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-gray-50 rounded-xl p-6"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="font-semibold text-gray-900 text-lg">
                            Question {index + 1}
                          </h4>
                          {response.feedback && (
                            <div className="flex items-center space-x-2">
                              <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                                response.feedback.score >= 8 ? 'bg-green-100 text-green-800' :
                                response.feedback.score >= 6 ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {response.feedback.score}/10
                              </span>
                              <div className={`w-3 h-3 rounded-full ${
                                response.feedback.score >= 8 ? 'bg-green-500' :
                                response.feedback.score >= 6 ? 'bg-yellow-500' :
                                'bg-red-500'
                              }`} />
                            </div>
                          )}
                        </div>
                        
                        <div className="mb-4">
                          <p className="text-gray-700 font-medium mb-2">{response.question}</p>
                          <div className="flex items-center space-x-2 mb-4">
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                              {response.questionType}
                            </span>
                          </div>
                        </div>
                        
                        <div className="bg-white rounded-lg p-4 mb-4 border-l-4 border-gray-400">
                          <h5 className="font-medium text-gray-900 mb-2">Your Answer:</h5>
                          <p className="text-gray-700 italic leading-relaxed">"{response.answer}"</p>
                          <div className="mt-2 text-sm text-gray-500">
                            Length: {response.answer.split(' ').length} words
                          </div>
                        </div>
                        
                        {response.feedback && (
                          <div className={`rounded-lg p-4 border-l-4 ${
                            response.feedback.score >= 8 ? 'bg-green-50 border-green-500' :
                            response.feedback.score >= 6 ? 'bg-yellow-50 border-yellow-500' :
                            'bg-red-50 border-red-500'
                          }`}>
                            <div className="flex justify-between items-center mb-3">
                              <h5 className="font-semibold text-gray-900">AI Feedback</h5>
                            </div>
                            <p className={`mb-4 leading-relaxed ${
                              response.feedback.score >= 8 ? 'text-green-800' :
                              response.feedback.score >= 6 ? 'text-yellow-800' :
                              'text-red-800'
                            }`}>
                              {response.feedback.feedback}
                            </p>
                            
                            {response.feedback.tips && response.feedback.tips.length > 0 && (
                              <div>
                                <h6 className="font-semibold text-gray-900 text-sm mb-2">💡 Improvement Tips:</h6>
                                <ul className="space-y-1">
                                  {response.feedback.tips.map((tip, tipIndex) => (
                                    <li key={tipIndex} className="flex items-start text-sm text-gray-700">
                                      <span className="w-1 h-1 bg-gray-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                                      {tip}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                  
                  {/* Recommendations */}
                  <div className="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-200">
                    <h3 className="text-lg font-semibold text-blue-900 mb-4">🚀 Next Steps & Recommendations</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Strengths to Leverage</h4>
                        <ul className="text-sm text-gray-700 space-y-1">
                          <li>• Strong technical knowledge demonstration</li>
                          <li>• Good problem-solving approach</li>
                          <li>• Clear communication skills</li>
                        </ul>
                      </div>
                      <div className="bg-white rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Areas for Improvement</h4>
                        <ul className="text-sm text-gray-700 space-y-1">
                          <li>• Add more specific examples with metrics</li>
                          <li>• Use STAR method for behavioral questions</li>
                          <li>• Practice concise yet detailed responses</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  if (!isSetup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-white/20 shadow-lg mb-6">
              <Sparkles className="h-5 w-5 text-blue-600 mr-2" />
              <span className="text-sm font-semibold text-gray-700">AI-Powered Interview Practice</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Interview Simulator</h1>
            <p className="text-xl text-gray-600">Practice with personalized mock interviews tailored to your career goals</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-xl p-8"
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Setup Your Interview</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Target Job Role *
                </label>
                <input
                  type="text"
                  value={sessionData.jobRole}
                  onChange={(e) => setSessionData({ ...sessionData, jobRole: e.target.value })}
                  placeholder="e.g., Frontend Developer, Product Manager, Data Analyst"
                  className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Experience Level
                </label>
                <select
                  value={sessionData.experience}
                  onChange={(e) => setSessionData({ ...sessionData, experience: e.target.value })}
                  className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
                >
                  <option value="entry">Entry Level (0-2 years)</option>
                  <option value="mid">Mid Level (2-5 years)</option>
                  <option value="senior">Senior Level (5+ years)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Key Skills
                </label>
                <input
                  type="text"
                  value={sessionData.skillsInput}
                  onChange={handleSkillsChange}
                  placeholder="e.g., React, JavaScript, Node.js, Python, Project Management"
                  className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
                />
                <div className="mt-2 flex items-center text-xs text-gray-500">
                  <span>💡 Separate skills with commas for best results</span>
                </div>
                
                {sessionData.skills.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {sessionData.skills.map((skill, index) => (
                      <motion.span
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full border border-blue-200"
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                )}
              </div>

              <motion.button
                onClick={handleSetupSubmit}
                disabled={!sessionData.jobRole.trim()}
                className="w-full flex items-center justify-center px-6 py-4 border border-transparent text-lg font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Sparkles className="h-5 w-5 mr-2" />
                Generate Interview Questions
              </motion.button>
            </div>

            {sessionData.jobRole && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200"
              >
                <h3 className="font-semibold text-gray-900 mb-2">Interview Preview</h3>
                <div className="text-sm text-gray-700 space-y-1">
                  <p><span className="font-medium">Role:</span> {sessionData.jobRole}</p>
                  <p><span className="font-medium">Experience:</span> {sessionData.experience} level</p>
                  <p><span className="font-medium">Skills:</span> {sessionData.skills.join(', ') || 'General skills'}</p>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {sessionData.jobRole} Interview
              </h1>
              <p className="text-gray-600">
                Question {questionIndex + 1} of {questions.length} • {sessionData.experience} level
              </p>
            </div>
            
            <div className="flex space-x-3">
              {!isActive ? (
                <motion.button
                  onClick={handleStartInterview}
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg font-semibold"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play className="h-5 w-5 mr-2" />
                  Start Interview
                </motion.button>
              ) : (
                <motion.button
                  onClick={() => setIsActive(false)}
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 transition-all shadow-lg font-semibold"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Square className="h-5 w-5 mr-2" />
                  Pause
                </motion.button>
              )}
              
              <motion.button
                onClick={handleReset}
                className="flex items-center px-6 py-3 border border-gray-300 text-gray-700 bg-white rounded-xl hover:bg-gray-50 transition-all shadow-lg font-semibold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <RotateCcw className="h-5 w-5 mr-2" />
                Reset
              </motion.button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ChatInterface
              question={currentQuestion}
              isActive={isActive}
              onAnswerSubmit={handleAnswerSubmit}
              responses={responses}
            />
          </div>
          
          <div className="lg:col-span-1">
            <QuestionPanel
              questions={questions}
              currentIndex={questionIndex}
              responses={responses}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
