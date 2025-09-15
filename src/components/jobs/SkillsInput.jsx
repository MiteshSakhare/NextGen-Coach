import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // ✅ FIXED: Added AnimatePresence
import { X, Plus } from 'lucide-react';

export function SkillsInput({ skills, onChange }) {
  const [inputValue, setInputValue] = useState('');
  const [suggestions] = useState([
    'JavaScript', 'React', 'Node.js', 'Python', 'Java', 'TypeScript',
    'HTML/CSS', 'Vue.js', 'Angular', 'PHP', 'C++', 'C#', 'Ruby',
    'Swift', 'Kotlin', 'Go', 'Rust', 'SQL', 'MongoDB', 'PostgreSQL',
    'AWS', 'Docker', 'Kubernetes', 'Git', 'Linux', 'DevOps',
    'Machine Learning', 'Data Science', 'UI/UX Design', 'Project Management'
  ]);

  const addSkill = (skill) => {
    const trimmedSkill = skill.trim();
    if (trimmedSkill && !skills.includes(trimmedSkill)) {
      onChange([...skills, trimmedSkill]);
    }
    setInputValue('');
  };

  const removeSkill = (skillToRemove) => {
    onChange(skills.filter(skill => skill !== skillToRemove));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill(inputValue);
    }
  };

  const filteredSuggestions = suggestions.filter(
    suggestion => 
      suggestion.toLowerCase().includes(inputValue.toLowerCase()) &&
      !skills.includes(suggestion)
  ).slice(0, 6);

  return (
    <div className="relative">
      <div className="min-h-[42px] w-full px-3 py-2 border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
        <div className="flex flex-wrap items-center gap-2">
          <AnimatePresence>
            {skills.map((skill, index) => (
              <motion.span
                key={skill}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="ml-2 hover:text-blue-600 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </motion.span>
            ))}
          </AnimatePresence>
          
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={skills.length === 0 ? "Add skills (press Enter or comma to add)" : "Add more skills..."}
            className="flex-1 min-w-[200px] outline-none bg-transparent"
          />
        </div>
      </div>

      {/* Suggestions */}
      {inputValue && filteredSuggestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg"
        >
          {filteredSuggestions.map((suggestion, index) => (
            <motion.button
              key={suggestion}
              type="button"
              onClick={() => addSkill(suggestion)}
              className="w-full px-3 py-2 text-left hover:bg-gray-50 first:rounded-t-md last:rounded-b-md transition-colors"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center">
                <Plus className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-sm text-gray-700">{suggestion}</span>
              </div>
            </motion.button>
          ))}
        </motion.div>
      )}
    </div>
  );
}
