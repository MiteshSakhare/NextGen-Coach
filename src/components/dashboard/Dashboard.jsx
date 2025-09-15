import React from 'react';
import { motion } from 'framer-motion';
import { FileText, MessageSquare, Briefcase, TrendingUp, Star, Award, Target, Zap } from 'lucide-react';
import { useApp } from '../../hooks/useApp';

export function Dashboard() {
  const { setTab, resumeAnalysis, interviewSession, jobMatches } = useApp();

  const stats = [
    {
      title: 'Resume Score',
      value: resumeAnalysis?.overallScore || '--',
      unit: '%',
      icon: FileText,
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50',
      action: () => setTab('resume'),
      description: 'AI-powered analysis'
    },
    {
      title: 'Interview Sessions',
      value: interviewSession ? '1' : '0',
      unit: '',
      icon: MessageSquare,
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-50 to-emerald-50',
      action: () => setTab('interview'),
      description: 'Practice completed'
    },
    {
      title: 'Job Matches',
      value: jobMatches.length || '0',
      unit: '',
      icon: Briefcase,
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50',
      action: () => setTab('jobs'),
      description: 'Opportunities found'
    },
    {
      title: 'Skill Growth',
      value: '85',
      unit: '%',
      icon: TrendingUp,
      gradient: 'from-orange-500 to-red-500',
      bgGradient: 'from-orange-50 to-red-50',
      action: () => setTab('settings'),
      description: 'Progress tracked'
    }
  ];

  const quickActions = [
    {
      title: 'Analyze Resume',
      description: 'Get AI-powered feedback on your resume',
      icon: FileText,
      gradient: 'from-blue-500 to-purple-500',
      action: () => setTab('resume')
    },
    {
      title: 'Practice Interview',
      description: 'Simulate real interview scenarios',
      icon: MessageSquare,
      gradient: 'from-green-500 to-blue-500',
      action: () => setTab('interview')
    },
    {
      title: 'Find Jobs',
      description: 'Discover AI-matched opportunities',
      icon: Briefcase,
      gradient: 'from-purple-500 to-pink-500',
      action: () => setTab('jobs')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pattern-dots">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-white/20 shadow-lg mb-6">
            <Star className="h-5 w-5 text-yellow-500 mr-2" />
            <span className="text-sm font-semibold text-gray-700">AI-Powered Career Coaching</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="gradient-text">Welcome back!</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Continue your journey to career success with our intelligent coaching platform
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${stat.bgGradient} p-6 cursor-pointer group hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl border border-white/50`}
                onClick={stat.action}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="absolute top-0 right-0 w-24 h-24 opacity-10">
                  <Icon className="w-full h-full" />
                </div>
                
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r ${stat.gradient} mb-4 shadow-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-3xl font-bold text-gray-900">
                      {stat.value}
                    </span>
                    <span className="text-lg text-gray-500">{stat.unit}</span>
                  </div>
                  <p className="text-xs text-gray-500">{stat.description}</p>
                </div>

                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              </motion.div>
            );
          })}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-2"
          >
            <div className="card card-gradient p-8">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg mr-4">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Quick Actions</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  
                  return (
                    <motion.button
                      key={index}
                      onClick={action.action}
                      className="group relative overflow-hidden bg-white p-6 rounded-2xl border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r ${action.gradient} mb-4 shadow-lg`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{action.description}</p>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="card card-gradient p-8">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl shadow-lg mr-4">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
              </div>
              
              <div className="space-y-4">
                {resumeAnalysis && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100"
                  >
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg mr-3">
                      <FileText className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Resume analyzed</p>
                      <p className="text-sm text-gray-600">Score: {resumeAnalysis.overallScore}%</p>
                    </div>
                  </motion.div>
                )}
                
                {interviewSession && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100"
                  >
                    <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg mr-3">
                      <MessageSquare className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Interview completed</p>
                      <p className="text-sm text-gray-600">
                        {interviewSession.responses?.length || 0} questions answered
                      </p>
                    </div>
                  </motion.div>
                )}
                
                {jobMatches.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100"
                  >
                    <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg mr-3">
                      <Briefcase className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Jobs matched</p>
                      <p className="text-sm text-gray-600">{jobMatches.length} opportunities found</p>
                    </div>
                  </motion.div>
                )}
                
                {!resumeAnalysis && !interviewSession && jobMatches.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8"
                  >
                    <div className="p-4 bg-gradient-to-r from-gray-100 to-gray-50 rounded-xl">
                      <Target className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600 text-sm">
                        No recent activity.<br />
                        Start by analyzing your resume!
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Progress Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12"
        >
          <div className="card card-gradient p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Career Journey</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white text-xl font-bold">1</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Analyze Resume</h3>
                <p className="text-sm text-gray-600">Get AI-powered insights and improvements</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white text-xl font-bold">2</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Practice Interviews</h3>
                <p className="text-sm text-gray-600">Build confidence with AI simulations</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white text-xl font-bold">3</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Find Opportunities</h3>
                <p className="text-sm text-gray-600">Discover perfectly matched job openings</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
