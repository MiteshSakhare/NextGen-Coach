import React, { useReducer, useEffect } from 'react';
import { AppContext, initialState, appReducer } from '../../context/AppContext';
import { storageService } from '../../utils/localStorage';

// ✅ FIXED: Pure component file - only exports React component
export default function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const preferences = storageService.getUserPreferences();
    dispatch({ type: 'UPDATE_USER', payload: preferences });
  }, []);

  const value = {
    ...state,
    dispatch,
    setTab: (tab) => dispatch({ type: 'SET_TAB', payload: tab }),
    setLoading: (loading) => dispatch({ type: 'SET_LOADING', payload: loading }),
    setResumeAnalysis: (analysis) => dispatch({ type: 'SET_RESUME_ANALYSIS', payload: analysis }),
    setInterviewSession: (session) => dispatch({ type: 'SET_INTERVIEW_SESSION', payload: session }),
    setJobMatches: (matches) => dispatch({ type: 'SET_JOB_MATCHES', payload: matches }),
    updateUser: (userData) => dispatch({ type: 'UPDATE_USER', payload: userData }),
    toggleSidebar: () => dispatch({ type: 'TOGGLE_SIDEBAR' }),
    setSidebar: (open) => dispatch({ type: 'SET_SIDEBAR', payload: open })
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
