import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  DollarSign, 
  Clock, 
  TrendingUp, 
  Bookmark,
  Check,
  ExternalLink,
  Building,
  Star,
  Zap,
  Briefcase,
  X,
  Send,
  FileText,
  User
} from 'lucide-react';

export function JobCard({ job }) {
  const [isSaved, setIsSaved] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [applicationData, setApplicationData] = useState({
    coverLetter: '',
    experience: '',
    availability: 'immediate'
  });

  const getMatchColor = (percentage) => {
    if (percentage >= 90) return 'from-emerald-500 to-green-500';
    if (percentage >= 75) return 'from-blue-500 to-cyan-500';
    if (percentage >= 60) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  const getMatchBadgeStyle = (percentage) => {
    if (percentage >= 90) return 'bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 border-emerald-200';
    if (percentage >= 75) return 'bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 border-blue-200';
    if (percentage >= 60) return 'bg-gradient-to-r from-yellow-50 to-orange-50 text-orange-700 border-yellow-200';
    return 'bg-gradient-to-r from-red-50 to-pink-50 text-red-700 border-red-200';
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    // Add to saved jobs in localStorage
    try {
      const savedJobs = JSON.parse(localStorage.getItem('ai-career-coach-saved-jobs') || '[]');
      if (!isSaved) {
        savedJobs.push({
          ...job,
          savedAt: new Date().toISOString()
        });
        localStorage.setItem('ai-career-coach-saved-jobs', JSON.stringify(savedJobs));
      } else {
        const filteredJobs = savedJobs.filter(savedJob => savedJob.id !== job.id);
        localStorage.setItem('ai-career-coach-saved-jobs', JSON.stringify(filteredJobs));
      }
    } catch (error) {
      console.error('Error saving job:', error);
    }
  };

  const handleApplyClick = () => {
    if (isApplied) {
      // If already applied, show application status
      alert('You have already applied to this position. We will notify you when there are updates.');
      return;
    }
    
    // Show application modal
    setShowApplicationModal(true);
  };

  const handleSubmitApplication = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mark as applied
      setIsApplied(true);
      setShowApplicationModal(false);
      
      // Save application to localStorage
      const applications = JSON.parse(localStorage.getItem('ai-career-coach-applications') || '[]');
      applications.push({
        jobId: job.id,
        jobTitle: job.title,
        company: job.company,
        appliedAt: new Date().toISOString(),
        status: 'submitted',
        ...applicationData
      });
      localStorage.setItem('ai-career-coach-applications', JSON.stringify(applications));
      
      // Show success message
      alert('Application submitted successfully! We will notify you when the employer reviews your application.');
      
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('There was an error submitting your application. Please try again.');
    }
  };

  const handleQuickApply = () => {
    // Quick apply without modal (for demonstration)
    setIsApplied(true);
    
    // Save to applications
    const applications = JSON.parse(localStorage.getItem('ai-career-coach-applications') || '[]');
    applications.push({
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      appliedAt: new Date().toISOString(),
      status: 'submitted',
      quickApply: true
    });
    localStorage.setItem('ai-career-coach-applications', JSON.stringify(applications));
    
    alert('Quick application submitted! Your profile and resume have been sent to the employer.');
  };

  return (
    <>
      <motion.div
        className="group relative overflow-hidden bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -8 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-gray-50 opacity-50" />
        
        {/* Applied Badge */}
        {isApplied && (
          <div className="absolute top-4 right-4 z-10">
            <div className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full border border-green-200 flex items-center">
              <Check className="h-3 w-3 mr-1" />
              Applied
            </div>
          </div>
        )}
        
        <div className="relative p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1 pr-4">
              <div className="flex items-center justify-between mb-3">
                <motion.h3 
                  className="text-xl font-bold text-gray-900 group-hover:text-blue-600 cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                >
                  {job.title}
                </motion.h3>
                
                <div className="flex items-center space-x-2">
                  <div className={`px-3 py-1 rounded-full text-sm font-bold border ${getMatchBadgeStyle(job.matchPercentage)}`}>
                    {job.matchPercentage}% match
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-6 text-gray-600 mb-4">
                <div className="flex items-center">
                  <Building className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="text-sm font-medium">{job.company}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="text-sm">{job.location}</span>
                </div>
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="text-sm font-semibold text-green-600">{job.salary}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="text-sm">{job.postedDays}d ago</span>
                </div>
              </div>
            </div>
            
            <motion.button
              onClick={handleSave}
              className="p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors group"
              whileTap={{ scale: 0.9 }}
            >
              {isSaved ? (
                <motion.div 
                  className="flex items-center justify-center w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Check className="h-4 w-4" />
                </motion.div>
              ) : (
                <Bookmark className="h-6 w-6 text-gray-400 group-hover:text-gray-600" />
              )}
            </motion.button>
          </div>

          <p className="text-gray-700 mb-6 leading-relaxed">
            {job.description}
          </p>

          {/* Skills */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Required Skills</h4>
            <div className="flex flex-wrap gap-2">
              {job.requiredSkills.map((skill, index) => (
                <motion.span
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full border border-blue-200"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </div>

          {/* Why Match Section */}
          <motion.div 
            className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 mb-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center mb-2">
              <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg mr-3">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
              <h4 className="font-semibold text-green-900">Why this matches you</h4>
            </div>
            <p className="text-green-800 text-sm leading-relaxed">{job.whyMatch}</p>
          </motion.div>

          {/* Actions */}
          <div className="flex justify-between items-center">
            <motion.button
              onClick={() => setShowDetails(!showDetails)}
              className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
              whileHover={{ scale: 1.05 }}
            >
              {showDetails ? 'Hide Details' : 'View Details'}
            </motion.button>
            
            <div className="flex space-x-3">
              <motion.button 
                onClick={handleSave}
                className="px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-lg hover:bg-gray-50 transition-colors font-medium"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSaved ? (
                  <div className="flex items-center">
                    <Check className="h-4 w-4 mr-2" />
                    Saved
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Bookmark className="h-4 w-4 mr-2" />
                    Save
                  </div>
                )}
              </motion.button>
              
              <motion.button 
                onClick={handleApplyClick}
                disabled={isApplied}
                className={`px-6 py-2 rounded-lg transition-all font-medium ${
                  isApplied 
                    ? 'bg-green-100 text-green-800 border border-green-200 cursor-default'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                }`}
                whileHover={!isApplied ? { scale: 1.02 } : {}}
                whileTap={!isApplied ? { scale: 0.98 } : {}}
              >
                <div className="flex items-center">
                  {isApplied ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Applied
                    </>
                  ) : (
                    <>
                      <Star className="h-4 w-4 mr-2" />
                      Apply Now
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </>
                  )}
                </div>
              </motion.button>
            </div>
          </div>

          {/* Expandable Details */}
          <motion.div
            initial={false}
            animate={{
              height: showDetails ? 'auto' : 0,
              opacity: showDetails ? 1 : 0
            }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <motion.div 
              className="mt-6 pt-6 border-t border-gray-200"
              initial={{ y: -20 }}
              animate={{ y: showDetails ? 0 : -20 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { label: 'Job Type', value: job.type, icon: Briefcase },
                  { label: 'Growth Potential', value: job.growthPotential, icon: TrendingUp },
                  { label: 'Remote Work', value: job.remote ? 'Yes' : 'No', icon: Zap },
                  { label: 'Match Score', value: null, icon: Star }
                ].map((detail, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: showDetails ? 1 : 0 }}
                    transition={{ delay: showDetails ? 0.1 * index : 0 }}
                    className="flex items-center space-x-3"
                  >
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <detail.icon className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm">{detail.label}</h4>
                      {detail.value ? (
                        <p className="text-gray-600 text-sm capitalize">{detail.value}</p>
                      ) : (
                        <div className="mt-1">
                          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                            <motion.div
                              className={`h-full bg-gradient-to-r ${getMatchColor(job.matchPercentage)}`}
                              initial={{ width: 0 }}
                              animate={{ width: showDetails ? `${job.matchPercentage}%` : 0 }}
                              transition={{ duration: 1, delay: 0.5 }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Quick Apply in Details */}
              {showDetails && !isApplied && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200"
                >
                  <h4 className="font-semibold text-gray-900 mb-2">Quick Apply Available</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Apply instantly with your saved profile and resume.
                  </p>
                  <motion.button
                    onClick={handleQuickApply}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Quick Apply
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        </div>

        {/* Shine effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
      </motion.div>

      {/* Application Modal */}
      <AnimatePresence>
        {showApplicationModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowApplicationModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Apply for Position</h2>
                    <p className="text-gray-600">{job.title} at {job.company}</p>
                  </div>
                  <button
                    onClick={() => setShowApplicationModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="h-6 w-6 text-gray-600" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Why are you interested in this position?
                    </label>
                    <textarea
                      value={applicationData.coverLetter}
                      onChange={(e) => setApplicationData({
                        ...applicationData,
                        coverLetter: e.target.value
                      })}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="Explain why you're a great fit for this role..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Relevant Experience
                    </label>
                    <textarea
                      value={applicationData.experience}
                      onChange={(e) => setApplicationData({
                        ...applicationData,
                        experience: e.target.value
                      })}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="Briefly describe your relevant experience for this role..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Availability
                    </label>
                    <select
                      value={applicationData.availability}
                      onChange={(e) => setApplicationData({
                        ...applicationData,
                        availability: e.target.value
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="immediate">Available Immediately</option>
                      <option value="2weeks">2 Weeks Notice</option>
                      <option value="1month">1 Month Notice</option>
                      <option value="flexible">Flexible</option>
                    </select>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-start">
                      <FileText className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-blue-900 text-sm">Resume & Profile</h4>
                        <p className="text-blue-800 text-sm mt-1">
                          Your saved resume and profile information will be automatically included with this application.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-8">
                  <motion.button
                    onClick={() => setShowApplicationModal(false)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    onClick={handleSubmitApplication}
                    disabled={!applicationData.coverLetter.trim()}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center">
                      <Send className="h-4 w-4 mr-2" />
                      Submit Application
                    </div>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
