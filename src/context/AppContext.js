import { createContext } from 'react';

// ✅ FIXED: Pure context file - no components
export const AppContext = createContext();

export const initialState = {
  currentTab: 'dashboard',
  user: {
    name: '',
    email: '',
    skills: [],
    experience: 'entry'
  },
  resumeAnalysis: null,
  interviewSession: null,
  jobMatches: [],
  isLoading: false,
  sidebarOpen: false
};

export function appReducer(state, action) {
  switch (action.type) {
    case 'SET_TAB':
      return { ...state, currentTab: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_RESUME_ANALYSIS':
      return { ...state, resumeAnalysis: action.payload };
    case 'SET_INTERVIEW_SESSION':
      return { ...state, interviewSession: action.payload };
    case 'SET_JOB_MATCHES':
      return { ...state, jobMatches: action.payload };
    case 'UPDATE_USER':
      return { ...state, user: { ...state.user, ...action.payload } };
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen };
    case 'SET_SIDEBAR':
      return { ...state, sidebarOpen: action.payload };
    default:
      return state;
  }
}
