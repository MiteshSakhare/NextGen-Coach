import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [isLoading, setLoading] = useState(false);
  const [resumeAnalysis, setResumeAnalysis] = useState(null);
  const [jobMatches, setJobMatches] = useState([]);
  const [interviewSession, setInterviewSession] = useState(null);
  const [user, setUser] = useState({
    name: '',
    email: '',
    skills: [],
    experience: 'entry'
  });

  // Enhanced setTab with scroll reset
  const setTab = (tabId) => {
    if (tabId === currentTab) return;
    
    // Immediate scroll to top
    window.scrollTo(0, 0);
    
    // Reset scrollable containers
    const scrollableElements = document.querySelectorAll('[data-scroll-reset], .overflow-auto, .overflow-y-auto');
    scrollableElements.forEach(element => {
      try {
        element.scrollTop = 0;
        element.scrollLeft = 0;
      } catch (e) {
        // Ignore
      }
    });
    
    setCurrentTab(tabId);
  };

  // Scroll utility functions
  const scrollToTop = (smooth = true) => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: smooth ? 'smooth' : 'instant'
    });
  };

  const resetAllScrollPositions = () => {
    scrollToTop(false);
  };

  const value = {
    currentTab,
    setTab,
    isLoading,
    setLoading,
    resumeAnalysis,
    setResumeAnalysis,
    jobMatches,
    setJobMatches,
    interviewSession,
    setInterviewSession,
    user,
    setUser,
    scrollToTop,
    resetAllScrollPositions
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
