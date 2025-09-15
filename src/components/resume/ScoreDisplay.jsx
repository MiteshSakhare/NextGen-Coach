import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';
import { 
  Trophy, 
  Target, 
  CheckCircle, 
  AlertCircle, 
  Star,
  Award,
  Zap,
  Brain,
  TrendingUp,
  Shield,
  Sparkles,
  Crown,
  Gem,
  Lightbulb,
  Cpu,
  Briefcase,
  GraduationCap,
  FileText
} from 'lucide-react';

// Modern Score Icon Component
const ScoreIcon = ({ score, size = 'lg' }) => {
  const getIcon = () => {
    if (score >= 90) return Crown;
    if (score >= 80) return Trophy;
    if (score >= 70) return Award;
    if (score >= 60) return Star;
    if (score >= 50) return Target;
    return Lightbulb;
  };
  
  const Icon = getIcon();
  const sizeClass = size === 'lg' ? 'h-8 w-8' : size === 'md' ? 'h-6 w-6' : 'h-4 w-4';
  
  return (
    <motion.div
      className={`inline-flex items-center justify-center ${
        score >= 80 ? 'text-yellow-500' : 
        score >= 60 ? 'text-blue-500' : 
        score >= 40 ? 'text-orange-500' : 'text-red-500'
      }`}
      whileHover={{ scale: 1.2, rotate: 15 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Icon className={sizeClass} />
    </motion.div>
  );
};

// Enhanced Progress Ring Component
const ProgressRing = ({ score, size = 120, strokeWidth = 8 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  
  const getColor = () => {
    if (score >= 80) return '#10B981';
    if (score >= 60) return '#F59E0B';
    if (score >= 40) return '#F97316';
    return '#EF4444';
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getColor()}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 2, ease: "easeInOut" }}
          style={{ filter: `drop-shadow(0 0 8px ${getColor()}30)` }}
        />
      </svg>
      
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            className={`text-3xl font-bold ${
              score >= 80 ? 'text-green-600' : 
              score >= 60 ? 'text-yellow-600' : 
              score >= 40 ? 'text-orange-600' : 'text-red-600'
            }`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, type: "spring", stiffness: 200 }}
          >
            {Math.round(score)}%
          </motion.div>
          <div className="text-xs text-gray-500 font-medium">Score</div>
        </div>
      </div>
    </div>
  );
};

export function ScoreDisplay({ analysis }) {
  console.log('🎯 ScoreDisplay received:', analysis);
  
  if (!analysis) {
    return (
      <div className="text-center py-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="inline-block"
        >
          <Cpu className="h-8 w-8 text-gray-400" />
        </motion.div>
        <p className="text-gray-500 mt-2">No analysis data available</p>
      </div>
    );
  }

  const { overallScore = 0, scores = {}, atsScore = 0 } = analysis;

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreGradient = (score) => {
    if (score >= 80) return 'from-green-500 to-emerald-500';
    if (score >= 60) return 'from-yellow-500 to-orange-500';
    if (score >= 40) return 'from-orange-500 to-red-500';
    return 'from-red-500 to-pink-500';
  };

  const getScoreLabel = (score) => {
    if (score >= 90) return 'Outstanding';
    if (score >= 80) return 'Excellent';
    if (score >= 70) return 'Very Good';
    if (score >= 60) return 'Good';
    if (score >= 50) return 'Average';
    if (score >= 40) return 'Fair';
    return 'Needs Improvement';
  };

  const formatScore = (score) => Math.round(score || 0);

  // FIXED: Properly count sections found
  const getSectionsCount = () => {
    if (!analysis.textStats?.sectionsFound) return 0;
    if (typeof analysis.textStats.sectionsFound === 'object') {
      return Object.values(analysis.textStats.sectionsFound).filter(Boolean).length;
    }
    return 0;
  };

  return (
    <div className="space-y-8">
      {/* Hero Score Section */}
      <motion.div
        className="text-center relative"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 rounded-3xl opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/40 rounded-3xl backdrop-blur-sm" />
        
        <div className="relative py-12 px-8">
          <motion.div
            className="inline-block mb-6"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
          >
            <ProgressRing score={formatScore(overallScore)} size={160} strokeWidth={12} />
          </motion.div>
          
          <motion.div
            className="mb-4"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, type: "spring", stiffness: 300 }}
          >
            <ScoreIcon score={formatScore(overallScore)} size="lg" />
          </motion.div>
          
          <motion.h3 
            className="text-3xl font-bold text-gray-900 mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            Resume Analysis Complete
          </motion.h3>
          
          <motion.p 
            className={`text-xl font-bold mb-2 ${getScoreColor(formatScore(overallScore))}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            {getScoreLabel(formatScore(overallScore))} Resume
          </motion.p>
          
          <motion.p 
            className="text-gray-600 max-w-md mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
          >
            Your resume shows {formatScore(overallScore) >= 70 ? 'strong' : formatScore(overallScore) >= 50 ? 'good' : 'developing'} potential with opportunities for strategic improvements
          </motion.p>
        </div>
      </motion.div>

      {/* Detailed Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center mb-6">
            <motion.div
              className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl shadow-lg mr-4"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Target className="h-6 w-6 text-white" />
            </motion.div>
            <h4 className="text-xl font-bold text-gray-900">Detailed Breakdown</h4>
          </div>
          
          <div className="space-y-4">
            {[
              { key: 'quality', label: 'Content Quality', emoji: '✨', description: 'Clarity, impact, and relevance' },
              { key: 'skills', label: 'Skills Presentation', emoji: '🚀', description: 'Technical and soft skills' },
              { key: 'experience', label: 'Experience Showcase', emoji: '💼', description: 'Career progression and achievements' },
              { key: 'education', label: 'Education & Credentials', emoji: '🎓', description: 'Academic background and certifications' },
              { key: 'format', label: 'Structure & Format', emoji: '📄', description: 'Organization and readability' }
            ].map(({ key, label, emoji, description }, index) => {
              const score = formatScore(scores[key] || 0);
              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="group p-4 bg-gray-50 rounded-xl hover:bg-white hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{emoji}</span>
                      <div>
                        <h5 className="font-semibold text-gray-800">{label}</h5>
                        <p className="text-xs text-gray-500">{description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <ScoreIcon score={score} size="sm" />
                      <span className={`font-bold text-lg ${getScoreColor(score)}`}>
                        {score}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <motion.div
                      className={`h-full bg-gradient-to-r ${getScoreGradient(score)} shadow-sm`}
                      initial={{ width: 0 }}
                      animate={{ width: `${score}%` }}
                      transition={{ duration: 1.5, delay: 0.3 + (0.1 * index) }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ATS Compatibility */}
        <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-2xl shadow-lg border border-green-200 p-6">
          <div className="text-center mb-6">
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl shadow-lg mb-4"
              whileHover={{ scale: 1.1, rotate: 10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Shield className="h-8 w-8 text-white" />
            </motion.div>
            <h4 className="text-xl font-bold text-gray-900 mb-2">ATS Compatibility</h4>
            <p className="text-sm text-gray-600">Applicant Tracking System Score</p>
          </div>
          
          <div className="flex justify-center mb-6">
            <ProgressRing score={formatScore(atsScore)} size={140} strokeWidth={10} />
          </div>
          
          <div className="text-center mb-6">
            <h5 className={`text-lg font-bold mb-2 ${getScoreColor(formatScore(atsScore))}`}>
              {getScoreLabel(formatScore(atsScore))} Compatibility
            </h5>
            <p className="text-sm text-gray-600 leading-relaxed">
              {formatScore(atsScore) >= 80 ? 
                'Excellent! Your resume is highly optimized for ATS systems and will pass most filters.' :
                formatScore(atsScore) >= 60 ? 
                'Good compatibility with room for optimization to improve visibility.' :
                'Consider improving ATS compatibility for better application success rates.'}
            </p>
          </div>

          <div className="space-y-3">
            <h6 className="font-semibold text-gray-800 text-sm mb-3">ATS Optimization Features:</h6>
            {[
              { label: 'Keywords Density', status: formatScore(atsScore) >= 70 },
              { label: 'Standard Formatting', status: formatScore(scores.format) >= 60 },
              { label: 'Section Headers', status: formatScore(scores.experience) >= 50 },
              { label: 'Text Readability', status: formatScore(atsScore) >= 60 }
            ].map(({ label, status }, index) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + (0.1 * index) }}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-gray-700">{label}</span>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  {status ? 
                    <CheckCircle className="h-4 w-4 text-green-500" /> :
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                  }
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* FIXED: Quick Stats Dashboard */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        {[
          {
            label: 'Words',
            value: analysis.textStats?.wordCount || 0,
            icon: FileText,
            color: 'blue',
            suffix: ''
          },
          {
            label: 'Skills Found',
            value: analysis.textStats?.skillsFound || 0,
            icon: Zap,
            color: 'purple',
            suffix: ''
          },
          {
            label: 'Sections',
            value: getSectionsCount(), // FIXED: Use function instead of object
            icon: Target,
            color: 'green',
            suffix: ''
          },
          {
            label: 'Grade',
            value: formatScore(overallScore) >= 90 ? 'A+' : 
                   formatScore(overallScore) >= 80 ? 'A' :
                   formatScore(overallScore) >= 70 ? 'B+' :
                   formatScore(overallScore) >= 60 ? 'B' :
                   formatScore(overallScore) >= 50 ? 'C+' :
                   formatScore(overallScore) >= 40 ? 'C' : 'D',
            icon: Award,
            color: 'orange',
            suffix: ''
          }
        ].map(({ label, value, icon: Icon, color, suffix }, index) => (
          <motion.div
            key={label}
            className="bg-white rounded-xl p-4 border border-gray-200 text-center hover:shadow-lg transition-all duration-300"
            whileHover={{ scale: 1.05, y: -2 }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              delay: 0.9 + (0.1 * index),
              type: "spring", 
              stiffness: 400 
            }}
          >
            <motion.div
              className="flex justify-center mb-2"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <Icon className={`h-6 w-6 text-${color}-600`} />
            </motion.div>
            <div className={`text-2xl font-bold text-${color}-700 mb-1`}>
              {value}{suffix}
            </div>
            <div className="text-xs text-gray-600 font-medium">{label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* FIXED: Show sections found properly */}
      {analysis.textStats?.sectionsFound && (
        <motion.div
          className="bg-gray-50 rounded-xl p-6 border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
        >
          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
            Resume Sections Detected
          </h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(analysis.textStats.sectionsFound).map(([section, found]) => 
              found && (
                <motion.span
                  key={section}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium capitalize border border-blue-200"
                >
                  {section}
                </motion.span>
              )
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
