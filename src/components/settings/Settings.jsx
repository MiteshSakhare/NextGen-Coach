import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Bell,
  Shield,
  Download,
  Trash2,
  Globe,
  HardDrive,
  RefreshCw,
  Save,
  Check,
  Eye,
  EyeOff,
  FileText,
  BarChart3,
  Briefcase,
  Settings as SettingsIcon,
  Heart
} from 'lucide-react';

export function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [settings, setSettings] = useState({
    notifications: true,
    autoSave: true,
    language: 'en',
    dataRetention: 30,
    theme: 'light'
  });
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    linkedIn: '',
    github: '',
    website: '',
    experience: 'entry',
    skills: []
  });
  const [showDataDetails, setShowDataDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    loadUserData();
    loadAppSettings();
  }, []);

  const loadUserData = () => {
    try {
      const saved = localStorage.getItem('ai-career-coach-user-preferences');
      if (saved) {
        const parsedData = JSON.parse(saved);
        setProfileData(prev => ({ ...prev, ...parsedData }));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const loadAppSettings = () => {
    try {
      const saved = localStorage.getItem('ai-career-coach-app-settings');
      if (saved) {
        const parsedSettings = JSON.parse(saved);
        setSettings(prev => ({ ...prev, ...parsedSettings }));
      }
    } catch (error) {
      console.error('Error loading app settings:', error);
    }
  };

  const saveSettings = () => {
    setIsLoading(true);
    try {
      // Save app settings
      localStorage.setItem('ai-career-coach-app-settings', JSON.stringify({
        ...settings,
        lastUpdated: new Date().toISOString()
      }));

      // Save user profile
      localStorage.setItem('ai-career-coach-user-preferences', JSON.stringify({
        ...profileData,
        lastUpdated: new Date().toISOString()
      }));

      setSuccessMessage('Settings saved successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = () => {
    try {
      // Gather all stored data
      const userData = {
        profile: profileData,
        settings: settings,
        resumeAnalyses: JSON.parse(localStorage.getItem('ai-career-coach-resume-analysis') || '[]'),
        interviewSessions: JSON.parse(localStorage.getItem('ai-career-coach-interview-sessions') || '[]'),
        exportedAt: new Date().toISOString(),
        version: '1.0.0'
      };

      const dataStr = JSON.stringify(userData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `ai-career-coach-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      alert('Your data has been exported successfully!');
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Error exporting data. Please try again.');
    }
  };

  const handleClearData = () => {
    const confirmMessage = 'Are you sure you want to clear all your data? This action cannot be undone.';
    if (window.confirm(confirmMessage)) {
      const doubleConfirm = 'This will permanently delete all your data including resume analyses and interview sessions. Type "DELETE" to confirm:';
      const userInput = prompt(doubleConfirm);
      
      if (userInput === 'DELETE') {
        try {
          // Clear all localStorage data
          const keysToRemove = [
            'ai-career-coach-user-preferences',
            'ai-career-coach-app-settings',
            'ai-career-coach-resume-analysis',
            'ai-career-coach-interview-sessions',
            'ai-career-coach-job-matches',
            'ai-career-coach-saved-jobs',
            'ai-career-coach-applications'
          ];

          keysToRemove.forEach(key => {
            localStorage.removeItem(key);
          });

          // Reset state
          setProfileData({
            name: '',
            email: '',
            phone: '',
            location: '',
            bio: '',
            linkedIn: '',
            github: '',
            website: '',
            experience: 'entry',
            skills: []
          });

          setSettings({
            notifications: true,
            autoSave: true,
            language: 'en',
            dataRetention: 30,
            theme: 'light'
          });

          alert('All data has been cleared successfully.');
          window.location.reload();
        } catch (error) {
          console.error('Error clearing data:', error);
          alert('Error clearing data. Please try again.');
        }
      } else if (userInput !== null) {
        alert('Data clearing cancelled. You must type "DELETE" exactly to confirm.');
      }
    }
  };

  const getStorageStats = () => {
    try {
      const stats = {
        resumeAnalyses: JSON.parse(localStorage.getItem('ai-career-coach-resume-analysis') || '[]').length,
        interviewSessions: JSON.parse(localStorage.getItem('ai-career-coach-interview-sessions') || '[]').length,
        savedJobs: JSON.parse(localStorage.getItem('ai-career-coach-saved-jobs') || '[]').length,
        applications: JSON.parse(localStorage.getItem('ai-career-coach-applications') || '[]').length
      };

      // Calculate approximate storage size
      let totalSize = 0;
      for (let key in localStorage) {
        if (key.startsWith('ai-career-coach-')) {
          totalSize += localStorage[key].length;
        }
      }

      return {
        ...stats,
        totalSize: totalSize,
        totalSizeFormatted: `${Math.round(totalSize / 1024)} KB`
      };
    } catch (error) {
      return {
        resumeAnalyses: 0,
        interviewSessions: 0,
        savedJobs: 0,
        applications: 0,
        totalSize: 0,
        totalSizeFormatted: '0 KB'
      };
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'preferences', label: 'Preferences', icon: SettingsIcon },
    { id: 'privacy', label: 'Privacy & Data', icon: Shield },
    { id: 'about', label: 'About', icon: FileText }
  ];

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
          <input
            type="text"
            value={profileData.name}
            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
            className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            placeholder="Enter your full name"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={profileData.email}
            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
            className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            placeholder="your.email@example.com"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
          <input
            type="tel"
            value={profileData.phone}
            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
            className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            placeholder="+91 1234567890"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
          <input
            type="text"
            value={profileData.location}
            onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
            className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            placeholder="City, State, Country"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Bio</label>
        <textarea
          value={profileData.bio}
          onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
          rows="4"
          className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
          placeholder="Tell us about your career goals and interests..."
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">LinkedIn</label>
          <input
            type="url"
            value={profileData.linkedIn}
            onChange={(e) => setProfileData({ ...profileData, linkedIn: e.target.value })}
            className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            placeholder="https://linkedin.com/in/username"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">GitHub</label>
          <input
            type="url"
            value={profileData.github}
            onChange={(e) => setProfileData({ ...profileData, github: e.target.value })}
            className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            placeholder="https://github.com/username"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Website</label>
          <input
            type="url"
            value={profileData.website}
            onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
            className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            placeholder="https://yourwebsite.com"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Experience Level</label>
        <select
          value={profileData.experience}
          onChange={(e) => setProfileData({ ...profileData, experience: e.target.value })}
          className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
        >
          <option value="entry">Entry Level (0-2 years)</option>
          <option value="mid">Mid Level (3-5 years)</option>
          <option value="senior">Senior Level (6+ years)</option>
        </select>
      </div>
    </div>
  );

  const renderPreferencesTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Bell className="h-5 w-5 mr-2 text-blue-600" />
            Notifications
          </h3>
          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Email notifications</span>
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) => setSettings({ ...settings, notifications: e.target.checked })}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
            </label>
            <p className="text-xs text-gray-600 -mt-2">
              Get notified about interview tips and career updates
            </p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Save className="h-5 w-5 mr-2 text-green-600" />
            Auto-Save
          </h3>
          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Enable auto-save</span>
              <input
                type="checkbox"
                checked={settings.autoSave}
                onChange={(e) => setSettings({ ...settings, autoSave: e.target.checked })}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
            </label>
            <p className="text-xs text-gray-600 -mt-2">
              Automatically save your progress and changes
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <Globe className="h-4 w-4 inline mr-2" />
            Language
          </label>
          <select
            value={settings.language}
            onChange={(e) => setSettings({ ...settings, language: e.target.value })}
            className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <HardDrive className="h-4 w-4 inline mr-2" />
            Data Retention (days)
          </label>
          <select
            value={settings.dataRetention}
            onChange={(e) => setSettings({ ...settings, dataRetention: parseInt(e.target.value) })}
            className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
          >
            <option value={7}>7 days</option>
            <option value={30}>30 days</option>
            <option value={90}>90 days</option>
            <option value={365}>1 year</option>
          </select>
          <p className="text-xs text-gray-600 mt-1">
            How long to keep your data
          </p>
        </div>
      </div>
    </div>
  );

  const renderPrivacyTab = () => {
    const stats = getStorageStats();
    
    return (
      <div className="space-y-6">
        <div className="bg-blue-50 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <HardDrive className="h-5 w-5 mr-2 text-blue-600" />
            Your Data Storage
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.resumeAnalyses}</div>
              <div className="text-xs text-gray-600">Resume Analyses</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.interviewSessions}</div>
              <div className="text-xs text-gray-600">Interview Sessions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.savedJobs}</div>
              <div className="text-xs text-gray-600">Saved Jobs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.totalSizeFormatted}</div>
              <div className="text-xs text-gray-600">Total Size</div>
            </div>
          </div>
          <p className="text-sm text-gray-700 mb-4">
            Total data stored locally in your browser
          </p>
          <button
            onClick={() => setShowDataDetails(!showDataDetails)}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
          >
            {showDataDetails ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
            {showDataDetails ? 'Hide' : 'Show'} Privacy Details
          </button>
        </div>

        {showDataDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-6"
          >
            <h4 className="font-semibold text-gray-900 mb-3">Privacy Information</h4>
            <p className="text-sm text-gray-700 leading-relaxed">
              All your data is stored locally in your browser. We never collect, store, or transmit your personal 
              information to external servers. Your resume analyses, interview sessions, and profile data remain 
              completely private and under your control.
            </p>
          </motion.div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <motion.button
            onClick={handleExportData}
            className="flex items-center justify-center px-4 py-3 sm:px-6 sm:py-4 bg-blue-600 text-white rounded-lg sm:rounded-xl hover:bg-blue-700 transition-all font-semibold text-sm sm:text-base shadow-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Download className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            Export All Data
          </motion.button>

          <motion.button
            onClick={handleClearData}
            className="flex items-center justify-center px-4 py-3 sm:px-6 sm:py-4 bg-red-600 text-white rounded-lg sm:rounded-xl hover:bg-red-700 transition-all font-semibold text-sm sm:text-base shadow-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Trash2 className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            Clear All Data
          </motion.button>
        </div>
      </div>
    );
  };

  const renderAboutTab = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
          <Briefcase className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">NextGen Coach</h3>
        <p className="text-gray-600 mb-4">Version 1.0.0</p>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
          Your personal AI-powered career development companion
        </p>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg sm:rounded-xl p-6 sm:p-8 border border-blue-200">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">About NextGen Coach</h4>
        <p className="text-gray-700 leading-relaxed mb-6">
          NextGen Coach is designed to help you advance your career through intelligent resume analysis, 
          realistic interview practice, and personalized job matching. Our AI-powered tools provide 
          actionable insights to help you stand out in today's competitive job market.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <h5 className="font-semibold text-gray-900 mb-2">Resume Analysis</h5>
            <p className="text-sm text-gray-600">
              Get AI-powered feedback on your resume with actionable improvement suggestions
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
            <h5 className="font-semibold text-gray-900 mb-2">Interview Practice</h5>
            <p className="text-sm text-gray-600">
              Practice with realistic mock interviews and receive detailed performance feedback
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
              <Briefcase className="h-6 w-6 text-green-600" />
            </div>
            <h5 className="font-semibold text-gray-900 mb-2">Job Matching</h5>
            <p className="text-sm text-gray-600">
              Discover opportunities that match your skills and career aspirations
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-6">
        <h4 className="font-semibold text-gray-900 mb-3">Technical Details</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <strong>Built with:</strong> React, Tailwind CSS, Framer Motion
          </div>
          <div>
            <strong>AI Integration:</strong> Google Gemini API
          </div>
          <div>
            <strong>Storage:</strong> Local browser storage
          </div>
          <div>
            <strong>Privacy:</strong> No data collection or tracking
          </div>
        </div>
      </div>

      <div className="text-center text-gray-600">
        <p className="flex items-center justify-center">
          Built with modern web technologies for optimal performance
        </p>
        <p className="mt-4 flex items-center justify-center">
          <Heart className="h-4 w-4 text-red-500 mr-1" />
          © 2025 NextGen Coach. Empowering careers through technology.
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header - Responsive */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 sm:mb-12"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center mb-4 sm:mb-6 space-y-4 sm:space-y-0 sm:space-x-4">
            <motion.div
              className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-gray-600 to-gray-700 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl flex items-center justify-center"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <SettingsIcon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </motion.div>
            <div className="text-center sm:text-left">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black bg-gradient-to-r from-gray-900 via-gray-700 to-gray-800 bg-clip-text text-transparent">
                Settings
              </h1>
              <p className="text-sm sm:text-lg text-gray-500 font-semibold">
                Manage your profile, preferences, and data privacy
              </p>
            </div>
          </div>
        </motion.div>

        {/* Success Message - Responsive */}
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 mx-4 sm:mx-0"
          >
            <div className="bg-green-50 border border-green-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
              <div className="flex items-center">
                <Check className="h-5 w-5 text-green-600 mr-3" />
                <p className="text-green-800 font-semibold text-sm sm:text-base">{successMessage}</p>
              </div>
            </div>
          </motion.div>
        )}

        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Tab Navigation - Responsive */}
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center px-4 py-3 sm:px-6 sm:py-4 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-blue-600 text-blue-600 bg-blue-50'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content - Responsive */}
          <div className="p-4 sm:p-6 lg:p-8">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'profile' && renderProfileTab()}
              {activeTab === 'preferences' && renderPreferencesTab()}
              {activeTab === 'privacy' && renderPrivacyTab()}
              {activeTab === 'about' && renderAboutTab()}
            </motion.div>
          </div>

          {/* Save Button - Responsive */}
          {activeTab !== 'about' && (
            <div className="border-t border-gray-200 p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row gap-3">
                <motion.button
                  onClick={saveSettings}
                  disabled={isLoading}
                  className="flex-1 sm:flex-none flex items-center justify-center px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg sm:rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all font-semibold disabled:opacity-50 shadow-lg text-sm sm:text-base"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoading ? (
                    <RefreshCw className="h-4 w-4 sm:h-5 sm:w-5 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  )}
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </motion.button>

                <motion.button
                  onClick={() => {
                    setActiveTab('profile');
                    loadUserData();
                    loadAppSettings();
                  }}
                  className="flex items-center justify-center px-4 py-3 sm:px-6 sm:py-4 border border-gray-300 text-gray-700 rounded-lg sm:rounded-xl hover:bg-gray-50 transition-all font-semibold text-sm sm:text-base"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <RefreshCw className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  Reset
                </motion.button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
