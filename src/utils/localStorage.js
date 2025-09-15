class StorageService {
  constructor() {
    this.keys = {
      USER_PREFERENCES: 'ai-career-coach-user-preferences',
      RESUME_ANALYSIS: 'ai-career-coach-resume-analysis',
      INTERVIEW_SESSIONS: 'ai-career-coach-interview-sessions',
      JOB_MATCHES: 'ai-career-coach-job-matches'
    };
  }

  // ============================================================================
  // JOB MATCHES METHODS
  // ============================================================================

  saveJobMatches(matches) {
    try {
      const timestamp = new Date().toISOString();
      const jobData = {
        matches,
        savedAt: timestamp,
        searchId: Date.now().toString()
      };
      localStorage.setItem(this.keys.JOB_MATCHES, JSON.stringify(jobData));
      console.log('Job matches saved successfully');
    } catch (error) {
      console.error('Error saving job matches:', error);
    }
  }

  getJobMatches() {
    try {
      const jobData = localStorage.getItem(this.keys.JOB_MATCHES);
      if (!jobData) return null;
      const parsed = JSON.parse(jobData);
      return parsed.matches || null;
    } catch (error) {
      console.error('Error retrieving job matches:', error);
      return null;
    }
  }

  clearJobMatches() {
    try {
      localStorage.removeItem(this.keys.JOB_MATCHES);
      console.log('Job matches cleared successfully');
    } catch (error) {
      console.error('Error clearing job matches:', error);
    }
  }

  // ============================================================================
  // RESUME ANALYSIS METHODS
  // ============================================================================

  saveResumeAnalysis(analysisId, analysis) {
    try {
      const timestamp = new Date().toISOString();
      const analysisData = {
        id: analysisId,
        ...analysis,
        savedAt: timestamp
      };
      
      const existingAnalyses = this.getAllResumeAnalyses();
      existingAnalyses.unshift(analysisData);
      const limitedAnalyses = existingAnalyses.slice(0, 5);
      
      localStorage.setItem(this.keys.RESUME_ANALYSIS, JSON.stringify(limitedAnalyses));
      console.log('Resume analysis saved successfully');
    } catch (error) {
      console.error('Error saving resume analysis:', error);
    }
  }

  getLatestResumeAnalysis() {
    try {
      const analyses = this.getAllResumeAnalyses();
      return analyses.length > 0 ? analyses[0] : null;
    } catch (error) {
      console.error('Error retrieving latest resume analysis:', error);
      return null;
    }
  }

  getAllResumeAnalyses() {
    try {
      const analyses = localStorage.getItem(this.keys.RESUME_ANALYSIS);
      return analyses ? JSON.parse(analyses) : [];
    } catch (error) {
      console.error('Error retrieving resume analyses:', error);
      return [];
    }
  }

  // ============================================================================
  // INTERVIEW SESSIONS METHODS
  // ============================================================================

  saveInterviewSession(sessionId, session) {
    try {
      const timestamp = new Date().toISOString();
      const sessionData = {
        id: sessionId,
        ...session,
        savedAt: timestamp
      };
      
      const existingSessions = this.getAllInterviewSessions();
      existingSessions.unshift(sessionData);
      const limitedSessions = existingSessions.slice(0, 10);
      
      localStorage.setItem(this.keys.INTERVIEW_SESSIONS, JSON.stringify(limitedSessions));
      console.log('Interview session saved successfully');
    } catch (error) {
      console.error('Error saving interview session:', error);
    }
  }

  getLatestInterviewSession() {
    try {
      const sessions = this.getAllInterviewSessions();
      return sessions.length > 0 ? sessions[0] : null;
    } catch (error) {
      console.error('Error retrieving latest interview session:', error);
      return null;
    }
  }

  getAllInterviewSessions() {
    try {
      const sessions = localStorage.getItem(this.keys.INTERVIEW_SESSIONS);
      return sessions ? JSON.parse(sessions) : [];
    } catch (error) {
      console.error('Error retrieving interview sessions:', error);
      return [];
    }
  }

  // ============================================================================
  // USER PREFERENCES METHODS
  // ============================================================================

  getUserPreferences() {
    try {
      const preferences = localStorage.getItem(this.keys.USER_PREFERENCES);
      return preferences ? JSON.parse(preferences) : {
        name: '',
        email: '',
        skills: [],
        experience: 'entry',
        location: ''
      };
    } catch (error) {
      console.error('Error retrieving user preferences:', error);
      return {
        name: '',
        email: '',
        skills: [],
        experience: 'entry',
        location: ''
      };
    }
  }

  saveUserPreferences(preferences) {
    try {
      const timestamp = new Date().toISOString();
      const dataToSave = {
        ...preferences,
        lastUpdated: timestamp
      };
      localStorage.setItem(this.keys.USER_PREFERENCES, JSON.stringify(dataToSave));
      console.log('User preferences saved successfully');
    } catch (error) {
      console.error('Error saving user preferences:', error);
    }
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  clearAllData() {
    try {
      Object.values(this.keys).forEach(key => {
        localStorage.removeItem(key);
      });
      console.log('All user data cleared');
    } catch (error) {
      console.error('Error clearing all data:', error);
    }
  }

  isAvailable() {
    try {
      const testKey = '__localStorage_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch (error) {
      console.warn('localStorage is not available:', error);
      return false;
    }
  }

  // Get storage info
  getStorageInfo() {
    try {
      let totalSize = 0;
      const info = {};
      
      Object.entries(this.keys).forEach(([name, key]) => {
        const item = localStorage.getItem(key);
        const size = item ? new Blob([item]).size : 0;
        info[name.toLowerCase()] = size;
        totalSize += size;
      });
      
      return {
        ...info,
        total: totalSize,
        totalFormatted: this.formatBytes(totalSize)
      };
    } catch (error) {
      console.error('Error getting storage info:', error);
      return null;
    }
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

export const storageService = new StorageService();
