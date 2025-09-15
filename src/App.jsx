import React, { useEffect } from 'react';
import { AppProvider, useApp } from './hooks/useApp';
import { Sidebar } from './components/layout/Sidebar';
import { Dashboard } from './components/dashboard/Dashboard';
import { ResumeAnalyzer } from './components/resume/ResumeAnalyzer';
import { InterviewSimulator } from './components/interview/InterviewSimulator';
import { JobMatcher } from './components/jobs/JobMatcher';
import { Settings } from './components/settings/Settings';

// Scroll to top button
const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = React.useState(false);
  const { scrollToTop } = useApp();

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.pageYOffset > 300);
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  if (!isVisible) return null;

  return (
    <button
      onClick={() => scrollToTop && scrollToTop(true)}
      className="fixed bottom-24 right-6 lg:bottom-8 lg:right-8 z-30 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all duration-300 hover:scale-110"
      aria-label="Scroll to top"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    </button>
  );
};

function AppContent() {
  const { currentTab, setTab, scrollToTop } = useApp();

  // Scroll reset on tab change
  useEffect(() => {
    // Immediate scroll to top
    window.scrollTo(0, 0);
    
    // Reset scrollable containers
    const scrollableElements = document.querySelectorAll('[data-scroll-reset], .overflow-auto, .overflow-y-auto, .overflow-x-auto');
    scrollableElements.forEach(element => {
      try {
        element.scrollTop = 0;
        element.scrollLeft = 0;
      } catch (error) {
        // Ignore
      }
    });

    // Smooth scroll after delay
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    }, 50);
  }, [currentTab]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      if (e.altKey) {
        switch (e.key) {
          case '1':
            e.preventDefault();
            setTab('dashboard');
            break;
          case '2':
            e.preventDefault();
            setTab('resume');
            break;
          case '3':
            e.preventDefault();
            setTab('interview');
            break;
          case '4':
            e.preventDefault();
            setTab('jobs');
            break;
          case '5':
            e.preventDefault();
            setTab('settings');
            break;
        }
      }

      if (e.key === 'Escape' && scrollToTop) {
        scrollToTop(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [setTab, scrollToTop]);

  const renderCurrentTab = () => {
    switch (currentTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'resume':
        return <ResumeAnalyzer />;
      case 'interview':
        return <InterviewSimulator />;
      case 'jobs':
        return <JobMatcher />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      
      <main 
        className="lg:ml-64 pt-20 pb-20 lg:pt-0 lg:pb-0 min-h-screen"
        data-scroll-reset
      >
        {renderCurrentTab()}
      </main>

      <ScrollToTopButton />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
