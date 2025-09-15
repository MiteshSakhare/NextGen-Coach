import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Briefcase, X, ChevronDown, RotateCcw, Trash2 } from 'lucide-react';
import { JobCard } from './JobCard';
import { SkillsInput } from './SkillsInput';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { geminiService } from '../../utils/geminiApi';
import { storageService } from '../../utils/localStorage';
import { useApp } from '../../hooks/useApp';

export function JobMatcher() {
  const { setJobMatches, user } = useApp();
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [lastSearchCriteria, setLastSearchCriteria] = useState(null);
  const [searchCriteria, setSearchCriteria] = useState({
    skills: user?.skills || [],
    experience: user?.experience || 'entry',
    location: '',
    salaryMin: 0,
    salaryMax: 150000,
    jobType: 'full-time',
    remote: false
  });
  const [filters, setFilters] = useState({
    sortBy: 'match',
    industries: [],
    companySize: 'any'
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({
    industries: [],
    companySize: 'any',
    workType: 'any',
    experienceRequired: 'any',
    benefits: []
  });

  // Clear results when skills change significantly
  useEffect(() => {
    if (lastSearchCriteria && hasSearched) {
      const skillsChanged = JSON.stringify(searchCriteria.skills.sort()) !== JSON.stringify(lastSearchCriteria.skills.sort());
      const experienceChanged = searchCriteria.experience !== lastSearchCriteria.experience;

      if (skillsChanged || experienceChanged) {
        clearAllResults();
      }
    }
  }, [searchCriteria.skills, searchCriteria.experience, lastSearchCriteria, hasSearched]);

  const handleSearch = async () => {
    if (searchCriteria.skills.length === 0) {
      alert('Please add at least one skill to search for jobs');
      return;
    }

    // Clear previous results before starting new search
    setJobs([]);
    setJobMatches([]);
    setIsLoading(true);
    setHasSearched(true);

    // Store current search criteria
    setLastSearchCriteria({...searchCriteria});

    try {
      const preferences = {
        location: searchCriteria.location,
        salaryRange: {
          min: searchCriteria.salaryMin,
          max: searchCriteria.salaryMax
        },
        jobType: searchCriteria.jobType,
        remote: searchCriteria.remote,
        industries: advancedFilters.industries,
        companySize: advancedFilters.companySize,
        workType: advancedFilters.workType,
        experienceRequired: advancedFilters.experienceRequired
      };

      const matchedJobs = await geminiService.matchJobs(
        searchCriteria.skills,
        searchCriteria.experience,
        preferences
      );

      if (matchedJobs && Array.isArray(matchedJobs)) {
        const processedJobs = matchedJobs.map((job, index) => ({
          id: Date.now() + index,
          title: job.jobTitle || `${searchCriteria.skills[0]} Developer`,
          company: job.company || `Tech Company ${index + 1}`,
          location: job.location || searchCriteria.location || 'Remote',
          salary: job.salaryRange || `$${Math.max(60, searchCriteria.salaryMin/1000)}k - $${Math.max(90, searchCriteria.salaryMax/1000)}k`,
          matchPercentage: job.matchPercentage || Math.floor(Math.random() * 30) + 70,
          requiredSkills: job.requiredSkills || searchCriteria.skills.slice(0, 5),
          description: job.description || `Exciting opportunity for a ${job.jobTitle || searchCriteria.skills[0] + ' Developer'} with strong skills in ${searchCriteria.skills.slice(0, 3).join(', ')}.`,
          growthPotential: job.growthPotential || 'High',
          whyMatch: job.whyMatch || `Strong match based on your ${searchCriteria.skills[0]} skills and ${searchCriteria.experience} experience level.`,
          type: job.type || searchCriteria.jobType,
          remote: job.remote !== undefined ? job.remote : searchCriteria.remote,
          postedDays: Math.floor(Math.random() * 7) + 1
        }));

        // Apply advanced filters
        let filteredJobs = processedJobs;

        if (advancedFilters.workType !== 'any') {
          filteredJobs = filteredJobs.filter(job => {
            if (advancedFilters.workType === 'remote') return job.remote;
            if (advancedFilters.workType === 'onsite') return !job.remote;
            return true; // hybrid - show all for now
          });
        }

        const sortedJobs = sortJobs(filteredJobs, filters.sortBy);
        setJobs(sortedJobs);
        setJobMatches(sortedJobs);

        // Save to storage safely
        try {
          if (storageService && typeof storageService.saveJobMatches === 'function') {
            storageService.saveJobMatches(sortedJobs);
          }
        } catch (storageError) {
          console.warn('Could not save job matches to storage:', storageError);
        }
      } else {
        generateFallbackJobs();
      }
    } catch (error) {
      console.error('Job matching error:', error);
      generateFallbackJobs();
    } finally {
      setIsLoading(false);
    }
  };

  const generateFallbackJobs = () => {
    const fallbackJobs = [
      {
        id: 1,
        title: `${searchCriteria.skills[0] || 'Software'} Developer`,
        company: 'TechCorp Inc.',
        location: searchCriteria.location || 'San Francisco, CA',
        salary: '$80k - $120k',
        matchPercentage: 92,
        requiredSkills: searchCriteria.skills.slice(0, 5),
        description: 'Join our innovative team building next-generation applications with cutting-edge technology.',
        growthPotential: 'High',
        whyMatch: 'Perfect match for your skill set and experience level.',
        type: 'full-time',
        remote: searchCriteria.remote,
        postedDays: 2
      },
      {
        id: 2,
        title: `Senior ${searchCriteria.skills[0] || 'Frontend'} Engineer`,
        company: 'StartupXYZ',
        location: 'New York, NY',
        salary: '$100k - $140k',
        matchPercentage: 87,
        requiredSkills: [...searchCriteria.skills.slice(0, 3), 'Leadership'],
        description: 'Lead development of cutting-edge web applications in a fast-paced startup environment.',
        growthPotential: 'Very High',
        whyMatch: 'Great opportunity to advance your career with leadership responsibilities.',
        type: 'full-time',
        remote: false,
        postedDays: 1
      },
      {
        id: 3,
        title: `${searchCriteria.skills[0] || 'Full-Stack'} Developer`,
        company: 'Digital Solutions Ltd.',
        location: 'Remote',
        salary: '$70k - $100k',
        matchPercentage: 83,
        requiredSkills: searchCriteria.skills.slice(0, 4),
        description: 'Work remotely with a global team on exciting projects that impact millions of users.',
        growthPotential: 'High',
        whyMatch: 'Remote flexibility matches your preferences.',
        type: 'full-time',
        remote: true,
        postedDays: 3
      },
      {
        id: 4,
        title: `${searchCriteria.skills[0] || 'Software'} Engineer`,
        company: 'CloudTech Solutions',
        location: searchCriteria.location || 'Austin, TX',
        salary: '$85k - $125k',
        matchPercentage: 79,
        requiredSkills: searchCriteria.skills.slice(0, 4),
        description: 'Build scalable cloud solutions and microservices architecture.',
        growthPotential: 'High',
        whyMatch: 'Strong technical match with growth opportunities.',
        type: 'full-time',
        remote: Math.random() > 0.5,
        postedDays: 4
      },
      {
        id: 5,
        title: `Junior ${searchCriteria.skills[0] || 'Developer'}`,
        company: 'Growth Company',
        location: 'Seattle, WA',
        salary: '$60k - $85k',
        matchPercentage: 75,
        requiredSkills: searchCriteria.skills.slice(0, 3),
        description: 'Perfect entry-level position with excellent mentorship and learning opportunities.',
        growthPotential: 'Very High',
        whyMatch: 'Ideal for growing your skills with experienced mentors.',
        type: 'full-time',
        remote: false,
        postedDays: 5
      }
    ];

    setJobs(fallbackJobs);
    setJobMatches(fallbackJobs);
  };

  const sortJobs = (jobList, sortBy) => {
    return [...jobList].sort((a, b) => {
      switch (sortBy) {
        case 'match':
          return b.matchPercentage - a.matchPercentage;
        case 'salary': {
          const salaryA = parseInt(a.salary.match(/\d+/)?.[0] || '0');
          const salaryB = parseInt(b.salary.match(/\d+/)?.[0] || '0');
          return salaryB - salaryA;
        }
        case 'date':
          return a.postedDays - b.postedDays;
        default:
          return 0;
      }
    });
  };

  const handleSortChange = (sortBy) => {
    setFilters({ ...filters, sortBy });
    setJobs(sortJobs(jobs, sortBy));
  };

  const clearAllFilters = () => {
    setAdvancedFilters({
      industries: [],
      companySize: 'any',
      workType: 'any',
      experienceRequired: 'any',
      benefits: []
    });
    setSearchCriteria({
      skills: [],
      experience: 'entry',
      location: '',
      salaryMin: 0,
      salaryMax: 150000,
      jobType: 'full-time',
      remote: false
    });
    clearAllResults();
  };

  const clearAllResults = () => {
    setJobs([]);
    setJobMatches([]);
    setHasSearched(false);
    setLastSearchCriteria(null);

    // Safe method call with fallback
    try {
      if (storageService && typeof storageService.clearJobMatches === 'function') {
        storageService.clearJobMatches();
      } else {
        // Fallback: manually clear from localStorage
        localStorage.removeItem('ai-career-coach-job-matches');
      }
    } catch (error) {
      console.warn('Error clearing job matches from storage:', error);
    }
  };

  const startNewSearch = () => {
    clearAllResults();
    setShowAdvancedFilters(false);
    
    // Scroll to top to focus on search form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (advancedFilters.industries.length > 0) count++;
    if (advancedFilters.companySize !== 'any') count++;
    if (advancedFilters.workType !== 'any') count++;
    if (advancedFilters.experienceRequired !== 'any') count++;
    if (searchCriteria.location) count++;
    if (searchCriteria.salaryMin > 0 || searchCriteria.salaryMax < 150000) count++;
    if (searchCriteria.remote) count++;
    return count;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4 sm:p-6">
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-8 sm:p-12 max-w-md w-full text-center">
          <LoadingSpinner size="lg" />
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mt-6 mb-2">Finding Perfect Matches</h3>
          <p className="text-gray-600 text-sm sm:text-base">
            Analyzing opportunities that align with your skills and career goals...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header - Responsive */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center mb-4 sm:mb-6 space-y-4 sm:space-y-0 sm:space-x-4">
            <motion.div
              className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl flex items-center justify-center"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <Briefcase className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </motion.div>
            <div className="text-center sm:text-left">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black bg-gradient-to-r from-gray-900 via-orange-700 to-red-700 bg-clip-text text-transparent">
                Job Matcher
              </h1>
              <p className="text-sm sm:text-lg text-gray-500 font-semibold">
                Discover opportunities that match your skills and career goals
              </p>
            </div>
          </div>
        </motion.div>

        {/* Search Form - Responsive */}
        <motion.div
          className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="space-y-6">
            {/* Skills Input - Responsive */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Your Skills *
              </label>
              <SkillsInput
                skills={searchCriteria.skills}
                onChange={(skills) => setSearchCriteria({ ...searchCriteria, skills })}
                placeholder="Add skills like React, Python, Data Analysis..."
              />
            </div>

            {/* Basic Filters - Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Experience Level
                </label>
                <select
                  value={searchCriteria.experience}
                  onChange={(e) => setSearchCriteria({ ...searchCriteria, experience: e.target.value })}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                >
                  <option value="entry">Entry Level</option>
                  <option value="mid">Mid Level</option>
                  <option value="senior">Senior Level</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={searchCriteria.location}
                  onChange={(e) => setSearchCriteria({ ...searchCriteria, location: e.target.value })}
                  placeholder="City, State or Remote"
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Job Type
                </label>
                <select
                  value={searchCriteria.jobType}
                  onChange={(e) => setSearchCriteria({ ...searchCriteria, jobType: e.target.value })}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                >
                  <option value="full-time">Full Time</option>
                  <option value="part-time">Part Time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                </select>
              </div>

              <div className="flex items-center pt-6">
                <label className="flex items-center text-sm font-semibold text-gray-700">
                  <input
                    type="checkbox"
                    checked={searchCriteria.remote}
                    onChange={(e) => setSearchCriteria({ ...searchCriteria, remote: e.target.checked })}
                    className="mr-2 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  Remote Only
                </label>
              </div>
            </div>

            {/* Advanced Filters Toggle - Responsive */}
            <div className="border-t pt-4">
              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                <Filter className="h-4 w-4 mr-2" />
                Advanced Filters {getActiveFiltersCount() > 0 && `(${getActiveFiltersCount()})`}
                <ChevronDown className={`h-4 w-4 ml-2 transform transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`} />
              </button>

              {/* Advanced Filters Panel - Responsive */}
              <AnimatePresence>
                {showAdvancedFilters && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 space-y-4 overflow-hidden"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Work Type
                        </label>
                        <select
                          value={advancedFilters.workType}
                          onChange={(e) => setAdvancedFilters({ ...advancedFilters, workType: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                        >
                          <option value="any">Any</option>
                          <option value="remote">Remote</option>
                          <option value="onsite">On-site</option>
                          <option value="hybrid">Hybrid</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Company Size
                        </label>
                        <select
                          value={advancedFilters.companySize}
                          onChange={(e) => setAdvancedFilters({ ...advancedFilters, companySize: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                        >
                          <option value="any">Any Size</option>
                          <option value="startup">Startup (1-50)</option>
                          <option value="small">Small (51-200)</option>
                          <option value="medium">Medium (201-1000)</option>
                          <option value="large">Large (1000+)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Salary Range
                        </label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            value={searchCriteria.salaryMin}
                            onChange={(e) => setSearchCriteria({ ...searchCriteria, salaryMin: parseInt(e.target.value) || 0 })}
                            placeholder="Min"
                            className="w-full px-2 py-2 border border-gray-300 rounded-lg text-sm"
                          />
                          <span className="text-gray-500">-</span>
                          <input
                            type="number"
                            value={searchCriteria.salaryMax}
                            onChange={(e) => setSearchCriteria({ ...searchCriteria, salaryMax: parseInt(e.target.value) || 150000 })}
                            placeholder="Max"
                            className="w-full px-2 py-2 border border-gray-300 rounded-lg text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Search Buttons - Responsive */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <motion.button
                onClick={handleSearch}
                disabled={isLoading || searchCriteria.skills.length === 0}
                className="flex-1 sm:flex-none flex items-center justify-center px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg sm:rounded-xl font-bold text-sm sm:text-base hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                whileHover={{ scale: searchCriteria.skills.length > 0 ? 1.02 : 1 }}
                whileTap={{ scale: searchCriteria.skills.length > 0 ? 0.98 : 1 }}
              >
                <Search className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Find Jobs
              </motion.button>

              {getActiveFiltersCount() > 0 && (
                <motion.button
                  onClick={clearAllFilters}
                  className="flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-700 rounded-lg sm:rounded-xl hover:bg-gray-50 transition-all text-sm sm:text-base"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear Filters
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Results Section - Responsive */}
        {hasSearched && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {jobs.length > 0 ? (
              <div className="space-y-6">
                {/* Results Header - Responsive */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
                      Found {jobs.length} matching jobs
                    </h3>
                    <p className="text-sm text-gray-600">
                      Showing opportunities for {searchCriteria.skills.slice(0, 3).join(', ')}
                      {searchCriteria.skills.length > 3 && ` +${searchCriteria.skills.length - 3} more`}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <select
                      value={filters.sortBy}
                      onChange={(e) => handleSortChange(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="match">Best Match</option>
                      <option value="salary">Highest Salary</option>
                      <option value="date">Most Recent</option>
                    </select>

                    <motion.button
                      onClick={startNewSearch}
                      className="flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all text-sm"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      New Search
                    </motion.button>
                  </div>
                </div>

                {/* Job Cards - Responsive Grid */}
                <div className="grid gap-6">
                  {jobs.map((job, index) => (
                    <JobCard key={job.id} job={job} index={index} />
                  ))}
                </div>
              </div>
            ) : (
              <motion.div
                className="text-center py-12 sm:py-16 bg-white rounded-xl sm:rounded-2xl shadow-lg"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="mb-6">
                  <Search className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4" />
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
                  No matching jobs found
                </h3>
                <p className="text-gray-600 max-w-md mx-auto px-4 mb-6">
                  {hasSearched ? 'Try adjusting your search criteria or skills to find more opportunities.' : 'Add your skills and search preferences to discover amazing job opportunities tailored for you.'}
                </p>
                <motion.button
                  onClick={startNewSearch}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Start New Search
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Empty State - Responsive */}
        {!hasSearched && (
          <motion.div
            className="text-center py-12 sm:py-16 bg-white rounded-xl sm:rounded-2xl shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="mb-6">
              <Briefcase className="h-12 w-12 sm:h-16 sm:w-16 text-blue-500 mx-auto mb-4" />
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
              Ready to find your dream job?
            </h3>
            <p className="text-gray-600 max-w-lg mx-auto px-4">
              Add your skills and preferences above to discover personalized job opportunities that match your career goals.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
