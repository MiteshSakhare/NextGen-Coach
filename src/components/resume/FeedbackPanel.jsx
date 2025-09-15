import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // ✅ ADDED: Missing imports
import { CheckCircle, AlertTriangle, Lightbulb, ChevronDown, ChevronUp, Download, Calendar } from 'lucide-react';

export function FeedbackPanel({ analysis }) {
  const [expandedSection, setExpandedSection] = useState('strengths');

  const sections = [
    {
      id: 'strengths',
      title: 'Key Strengths',
      icon: CheckCircle,
      color: 'green',
      items: analysis.strengths
    },
    {
      id: 'improvements',
      title: 'Areas for Improvement',
      icon: AlertTriangle,
      color: 'yellow',
      items: analysis.improvements
    },
    {
      id: 'recommendations',
      title: 'AI Recommendations',
      icon: Lightbulb,
      color: 'blue',
      items: analysis.recommendations
    }
  ];

  const colorClasses = {
    green: {
      bg: 'from-green-50 to-emerald-50',
      border: 'border-green-200',
      text: 'text-green-800',
      icon: 'text-green-600',
      button: 'bg-green-500'
    },
    yellow: {
      bg: 'from-yellow-50 to-orange-50',
      border: 'border-yellow-200',
      text: 'text-orange-800',
      icon: 'text-orange-600',
      button: 'bg-orange-500'
    },
    blue: {
      bg: 'from-blue-50 to-cyan-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      icon: 'text-blue-600',
      button: 'bg-blue-500'
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="space-y-6"
    >
      {sections.map((section, index) => {
        const Icon = section.icon;
        const colors = colorClasses[section.color];
        const isExpanded = expandedSection === section.id;

        return (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`rounded-2xl shadow-lg border ${colors.border} bg-gradient-to-br ${colors.bg} overflow-hidden`}
          >
            <motion.button
              onClick={() => setExpandedSection(isExpanded ? null : section.id)}
              className={`w-full px-8 py-6 text-left flex items-center justify-between hover:bg-white/50 transition-all duration-200`}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex items-center">
                <div className={`p-3 ${colors.button} rounded-xl shadow-lg mr-4`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className={`text-xl font-bold ${colors.text}`}>
                    {section.title}
                  </h3>
                  <p className={`text-sm ${colors.text} opacity-75 mt-1`}>
                    {section.items.length} items to review
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className={`px-3 py-1 rounded-full text-sm font-bold ${colors.text} bg-white/50`}>
                  {section.items.length}
                </div>
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className={`h-6 w-6 ${colors.icon}`} />
                </motion.div>
              </div>
            </motion.button>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-8 pb-8">
                    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/50">
                      <ul className="space-y-4">
                        {section.items.map((item, itemIndex) => (
                          <motion.li
                            key={itemIndex}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2, delay: itemIndex * 0.05 }}
                            className="flex items-start group"
                          >
                            <div className={`w-3 h-3 ${colors.button} rounded-full mt-2 mr-4 flex-shrink-0 shadow-sm`} />
                            <p className={`${colors.text} leading-relaxed font-medium group-hover:scale-[1.01] transition-transform`}>
                              {item}
                            </p>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}

      {/* Action Items */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8"
      >
        <h3 className="text-xl font-bold text-gray-900 mb-6">Next Steps</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.button 
            className="group p-6 text-left border border-gray-200 rounded-xl hover:shadow-lg hover:border-gray-300 transition-all duration-200 bg-gradient-to-br from-white to-gray-50"
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center mb-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg mr-3">
                <Download className="h-5 w-5 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900">Download Report</h4>
            </div>
            <p className="text-sm text-gray-600">Get a detailed PDF analysis with action items</p>
          </motion.button>
          
          <motion.button 
            className="group p-6 text-left border border-gray-200 rounded-xl hover:shadow-lg hover:border-gray-300 transition-all duration-200 bg-gradient-to-br from-white to-gray-50"
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center mb-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg mr-3">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900">Schedule Review</h4>
            </div>
            <p className="text-sm text-gray-600">Book a 1-on-1 consultation with career expert</p>
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
