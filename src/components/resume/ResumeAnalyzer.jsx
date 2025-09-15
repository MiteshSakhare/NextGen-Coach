import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  FileText, 
  AlertCircle, 
  Download, 
  RotateCcw,
  Sparkles,
  Brain,
  Cpu,
  Zap,
  CheckCircle2,
  Stars,
  Rocket,
  Shield,
  Target,
  Lightbulb
} from 'lucide-react';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ConfettiEffect } from '../common/ConfettiEffect';
import { ScoreDisplay } from './ScoreDisplay';
import { FeedbackPanel } from './FeedbackPanel';
import { pdfParser } from '../../utils/pdfParser';
import { geminiService } from '../../utils/geminiApi';
import { storageService } from '../../utils/localStorage';
import { useApp } from '../../hooks/useApp';

// Enhanced AI Loading Animation - Responsive
const AILoadingAnimation = () => (
  <div className="flex flex-col items-center justify-center py-6 sm:py-8">
    <div className="relative">
      {/* Main Brain Icon - Responsive sizes */}
      <motion.div
        className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl flex items-center justify-center"
        animate={{
          scale: [1, 1.1, 1],
          rotateY: [0, 180, 360]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Brain className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
      </motion.div>
      
      {/* Orbiting Elements - Responsive positioning */}
      {[0, 120, 240].map((rotation, index) => (
        <motion.div
          key={index}
          className="absolute top-1/2 left-1/2 w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full shadow-lg"
          style={{
            transformOrigin: '0 0'
          }}
          animate={{
            rotate: [rotation, rotation + 360],
            x: [0, 30, 0, -30, 0],
            y: [0, -30, 0, 30, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear",
            delay: index * 0.5
          }}
        />
      ))}
    </div>
    
    <motion.div
      className="mt-4 sm:mt-6 text-center px-4"
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
        🚀 NextGen AI is Analyzing Your Resume
      </h3>
      <p className="text-sm sm:text-base text-gray-600 max-w-xs sm:max-w-sm mx-auto">
        Processing content, evaluating structure, and generating insights...
      </p>
    </motion.div>
  </div>
);

// Modern Upload Area Component - Fully Responsive
const ModernUploadArea = ({ dragActive, onDragHandlers, onFileClick, error, fileInputRef }) => (
  <motion.div
    className="relative overflow-hidden bg-white rounded-2xl sm:rounded-3xl border-2 border-dashed border-gray-300 shadow-lg sm:shadow-xl mx-4 sm:mx-0"
    {...onDragHandlers}
    whileHover={{ scale: 1.01 }}
    transition={{ type: "spring", stiffness: 300 }}
    style={{
      borderColor: dragActive ? '#3B82F6' : '#D1D5DB',
      backgroundColor: dragActive ? '#EFF6FF' : '#FFFFFF'
    }}
  >
    {/* Background Pattern */}
    <div className="absolute inset-0 opacity-5">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        <defs>
          <pattern id="uploadGrid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#uploadGrid)" />
      </svg>
    </div>
    
    <div className="relative p-6 sm:p-12 lg:p-16">
      <div className="text-center">
        {/* Animated Upload Icon - Responsive sizes */}
        <motion.div
          className="relative inline-block mb-6 sm:mb-8"
          animate={{
            y: dragActive ? -10 : 0,
            scale: dragActive ? 1.1 : 1
          }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {/* Main Upload Container - Responsive */}
          <motion.div
            className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xl sm:shadow-2xl ${
              dragActive 
                ? 'bg-gradient-to-br from-blue-500 to-purple-600' 
                : 'bg-gradient-to-br from-gray-100 to-gray-200'
            }`}
            whileHover={{ 
              boxShadow: "0 15px 30px rgba(0,0,0,0.15)",
              y: -5 
            }}
          >
            <Upload className={`h-8 w-8 sm:h-10 sm:w-10 ${
              dragActive ? 'text-white' : 'text-gray-400'
            }`} />
          </motion.div>
          
          {/* Floating Icons - Responsive positioning */}
          <motion.div
            className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg"
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
          </motion.div>
          
          <motion.div
            className="absolute -bottom-1 -left-1 sm:-bottom-2 sm:-left-2 w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-purple-400 to-pink-500 rounded-md sm:rounded-lg flex items-center justify-center shadow-lg"
            animate={{ 
              scale: [1, 1.3, 1],
              rotate: [0, -360]
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          >
            <Zap className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-white" />
          </motion.div>
        </motion.div>
        
        {/* Title and Description - Responsive text */}
        <motion.h3 
          className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 px-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {dragActive ? '🎯 Drop Your Resume Here!' : '📄 Upload Your Resume'}
        </motion.h3>
        
        <motion.p 
          className="text-gray-600 mb-6 sm:mb-8 max-w-sm sm:max-w-lg mx-auto text-base sm:text-lg leading-relaxed px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Upload your PDF resume for comprehensive NextGen analysis with actionable insights 
          to boost your career prospects and land your dream job.
        </motion.p>
        
        {/* Upload Button - Responsive */}
        <motion.button
          onClick={onFileClick}
          className="inline-flex items-center px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-bold rounded-xl sm:rounded-2xl text-white bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 shadow-xl hover:shadow-2xl transition-all duration-300"
          whileHover={{ 
            scale: 1.05,
            boxShadow: "0 20px 40px rgba(0,0,0,0.25)"
          }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="mr-2 sm:mr-3"
          >
            <FileText className="h-5 w-5 sm:h-6 sm:w-6" />
          </motion.div>
          Choose PDF File
          <motion.div
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="ml-2 sm:ml-3"
          >
            <Rocket className="h-4 w-4 sm:h-5 sm:w-5" />
          </motion.div>
        </motion.button>
        
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          className="hidden"
        />
        
        {/* Feature Badges - Responsive grid */}
        <motion.div 
          className="mt-6 sm:mt-10 grid grid-cols-2 sm:flex sm:items-center sm:justify-center sm:space-x-8 gap-4 sm:gap-0 text-xs sm:text-sm px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {[
            { icon: Shield, label: 'PDF Only', color: 'green' },
            { icon: Target, label: 'Max 10MB', color: 'blue' },
            { icon: Brain, label: 'AI Powered', color: 'purple' },
            { icon: Zap, label: 'Instant Analysis', color: 'orange' }
          ].map(({ icon: Icon, label, color }, index) => (
            <motion.div
              key={label}
              className="flex items-center justify-center sm:justify-start space-x-2"
              whileHover={{ scale: 1.1 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: 0.9 + (0.1 * index),
                type: "spring", 
                stiffness: 400 
              }}
            >
              <div className={`w-2 h-2 sm:w-3 sm:h-3 bg-${color}-500 rounded-full shadow-lg`} />
              <span className="text-gray-600 font-medium">{label}</span>
              <Icon className={`h-3 w-3 sm:h-4 sm:w-4 text-${color}-500`} />
            </motion.div>
          ))}
        </motion.div>
        
        {/* Error Display - Responsive */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.9 }}
              className="mt-6 sm:mt-8 mx-auto max-w-sm sm:max-w-md px-4"
            >
              <div className="p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg sm:rounded-xl shadow-lg">
                <div className="flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 mr-2 sm:mr-3 flex-shrink-0" />
                  </motion.div>
                  <p className="text-sm sm:text-base text-red-700 font-semibold text-center">{error}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  </motion.div>
);

// Enhanced Header Component - Fully Responsive
const AnalyzerHeader = () => (
  <motion.div
    initial={{ opacity: 0, y: -30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    className="text-center mb-8 sm:mb-12 px-4"
  >
    {/* Logo and Title - Responsive layout */}
    <div className="flex flex-col sm:flex-row items-center justify-center mb-4 sm:mb-6 space-y-4 sm:space-y-0 sm:space-x-4">
      <motion.div
        className="relative"
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl flex items-center justify-center">
          <Brain className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
          
          {/* Pulsing Effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-400 rounded-xl sm:rounded-2xl opacity-20"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
        
        {/* Status Indicator - Responsive size */}
        <motion.div
          className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-400 rounded-full border-2 border-white shadow-lg"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <CheckCircle2 className="h-1.5 w-1.5 sm:h-2 sm:w-2 text-white" />
        </motion.div>
      </motion.div>
      
      <div className="text-center sm:text-left">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent leading-tight">
          NextGen Resume Analyzer
        </h1>
        <p className="text-sm sm:text-lg text-gray-500 font-semibold tracking-wide mt-1">
          Powered by Advanced Machine Learning
        </p>
      </div>
    </div>
    
    {/* Feature Icons - Responsive grid */}
    <motion.div
      className="grid grid-cols-2 sm:flex sm:items-center sm:justify-center sm:space-x-6 lg:space-x-8 gap-4 sm:gap-0 mt-6 sm:mt-8 max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
    >
      {[
        { icon: Stars, label: 'AI Analysis' },
        { icon: Target, label: 'ATS Check' },
        { icon: Lightbulb, label: 'Smart Tips' },
        { icon: Rocket, label: 'Career Boost' }
      ].map(({ icon: Icon, label }, index) => (
        <motion.div
          key={label}
          className="flex flex-col items-center"
          whileHover={{ scale: 1.1, y: -5 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            delay: 0.8 + (0.1 * index),
            type: "spring", 
            stiffness: 400 
          }}
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg sm:rounded-xl flex items-center justify-center mb-2 shadow-lg">
            <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
          </div>
          <span className="text-xs sm:text-sm font-semibold text-gray-700 text-center">{label}</span>
        </motion.div>
      ))}
    </motion.div>
  </motion.div>
);

export function ResumeAnalyzer() {
  const { setResumeAnalysis, setLoading, isLoading } = useApp();
  const [dragActive, setDragActive] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFile = async (file) => {
    console.log('🔍 Processing file:', file.name);
    
    if (!file.type.includes('pdf')) {
      setError('Please upload a PDF file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      console.log('📄 Extracting text from PDF...');
      const resumeText = await pdfParser.extractTextFromPDF(file);
      console.log('✅ Text extracted, length:', resumeText.length);
      
      if (!resumeText || resumeText.length < 50) {
        throw new Error('PDF appears to have insufficient text content. Please ensure your resume has readable text.');
      }
      
      console.log('🤖 Starting AI analysis...');
      const analysisResult = await geminiService.analyzeResume(resumeText);
      console.log('✅ Analysis complete:', analysisResult);
      
      if (analysisResult.error) {
        throw new Error(analysisResult.error);
      }

      const processedAnalysis = {
        overallScore: Math.round(analysisResult.overallScore || 45),
        scores: {
          quality: Math.round(analysisResult.scores?.quality || 40),
          skills: Math.round(analysisResult.scores?.skills || 35),
          experience: Math.round(analysisResult.scores?.experience || 50),
          education: Math.round(analysisResult.scores?.education || 60),
          format: Math.round(analysisResult.scores?.format || 55)
        },
        atsScore: Math.round(analysisResult.atsScore || 70),
        strengths: analysisResult.strengths || ["Resume contains professional information"],
        improvements: analysisResult.improvements || ["Add more quantified achievements"],
        recommendations: analysisResult.recommendations || ["Use action verbs", "Include metrics"],
        filename: file.name,
        analyzedAt: new Date().toISOString(),
        textStats: analysisResult.textStats || {
          wordCount: resumeText.split(' ').length,
          lineCount: resumeText.split('\n').length
        }
      };

      console.log('🎯 Final processed analysis:', processedAnalysis);

      setAnalysis(processedAnalysis);
      setResumeAnalysis(processedAnalysis);
      
      const analysisId = Date.now().toString();
      storageService.saveResumeAnalysis(analysisId, processedAnalysis);
      
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
      
    } catch (error) {
      console.error('❌ Resume analysis error:', error);
      setError(error.message || 'Failed to analyze resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = () => {
    if (!analysis) {
      alert('No analysis data available to download');
      return;
    }

    try {
      const reportContent = generateReportContent(analysis);
      const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `nextgen-resume-analysis-${new Date().toISOString().split('T')[0]}.txt`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      console.log('✅ Report downloaded successfully');
    } catch (error) {
      console.error('❌ Download error:', error);
      alert('Error downloading report. Please try again.');
    }
  };

  const generateReportContent = (analysisData) => {
    const date = new Date().toLocaleDateString();
    const time = new Date().toLocaleTimeString();
    
    return `
🚀 NEXTGEN COACH - RESUME ANALYSIS REPORT
Generated: ${date} at ${time}

=====================================
OVERALL PERFORMANCE
=====================================
Overall Score: ${analysisData.overallScore}%
ATS Compatibility: ${analysisData.atsScore}%
Resume File: ${analysisData.filename}

=====================================
DETAILED SCORES
=====================================
Content Quality: ${analysisData.scores.quality}%
Skills Presentation: ${analysisData.scores.skills}%
Experience Showcase: ${analysisData.scores.experience}%
Education & Credentials: ${analysisData.scores.education}%
Structure & Format: ${analysisData.scores.format}%

=====================================
DOCUMENT STATISTICS
=====================================
Word Count: ${analysisData.textStats.wordCount}
Line Count: ${analysisData.textStats.lineCount}
Sections Found: ${analysisData.textStats.sectionsFound}
Skills Identified: ${analysisData.textStats.skillsFound}

=====================================
🌟 KEY STRENGTHS
=====================================
${analysisData.strengths.map((strength, index) => `${index + 1}. ${strength}`).join('\n')}

=====================================
🎯 AREAS FOR IMPROVEMENT
=====================================
${analysisData.improvements.map((improvement, index) => `${index + 1}. ${improvement}`).join('\n')}

=====================================
💡 NEXTGEN RECOMMENDATIONS
=====================================
${analysisData.recommendations.map((rec, index) => `${index + 1}. ${rec}`).join('\n')}

=====================================
✅ ACTION ITEMS
=====================================
☐ Implement top 3 improvement suggestions
☐ Add quantified achievements with metrics
☐ Optimize keywords for ATS systems
☐ Review and update formatting
☐ Proofread for consistency and clarity

=====================================
🚀 NEXT STEPS FOR SUCCESS
=====================================
1. Focus on the highest-impact improvements first
2. Use action verbs and quantified results
3. Tailor your resume for each job application
4. Test with ATS-friendly resume scanners
5. Get feedback from industry professionals

Generated by NextGen Coach v3.0 | Powered by Advanced AI
    `.trim();
  };

  const resetAnalyzer = () => {
    setAnalysis(null);
    setError(null);
    setShowConfetti(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4 sm:p-6">
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl p-8 sm:p-12 max-w-sm sm:max-w-lg w-full">
          <AILoadingAnimation />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <ConfettiEffect trigger={showConfetti} />
        
        <AnalyzerHeader />

        {!analysis ? (
          <ModernUploadArea
            dragActive={dragActive}
            onDragHandlers={{
              onDragEnter: handleDrag,
              onDragLeave: handleDrag,
              onDragOver: handleDrag,
              onDrop: handleDrop
            }}
            onFileClick={() => fileInputRef.current?.click()}
            error={error}
            fileInputRef={fileInputRef}
          />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6 sm:space-y-8"
          >
            {/* Results Header - Responsive */}
            <motion.div
              className="bg-white rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-gray-100 p-6 sm:p-8 mx-4 sm:mx-0"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 sm:gap-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center w-full lg:w-auto">
                  <motion.div
                    className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg sm:shadow-xl mb-4 sm:mb-0 sm:mr-4 lg:mr-6 mx-auto sm:mx-0"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <CheckCircle2 className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                  </motion.div>
                  <div className="text-center sm:text-left w-full sm:w-auto">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                      🎉 Analysis Complete!
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600">
                      <span className="font-semibold block sm:inline">{analysis.filename}</span>
                      <span className="text-xs sm:text-sm block sm:inline sm:ml-2">
                        {analysis.textStats?.wordCount || 0} words analyzed
                      </span>
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <motion.button
                    onClick={handleDownloadReport}
                    className="flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg sm:rounded-xl hover:from-green-600 hover:to-emerald-600 shadow-lg font-semibold text-sm sm:text-base"
                    whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(0,0,0,0.15)" }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Download className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    Download Report
                  </motion.button>
                  
                  <motion.button
                    onClick={resetAnalyzer}
                    className="flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 border-2 border-gray-300 text-gray-700 bg-white rounded-lg sm:rounded-xl hover:border-gray-400 hover:bg-gray-50 shadow-lg font-semibold text-sm sm:text-base"
                    whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <RotateCcw className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    New Analysis
                  </motion.button>
                </div>
              </div>
            </motion.div>
            
            <div className="px-4 sm:px-0">
              <ScoreDisplay analysis={analysis} />
              <div className="mt-6 sm:mt-8">
                <FeedbackPanel analysis={analysis} />
              </div>
            </div>
          </motion.div>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileInput}
          className="hidden"
        />
      </div>
    </div>
  );
}
