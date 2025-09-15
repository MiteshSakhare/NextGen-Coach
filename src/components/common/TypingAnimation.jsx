import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function TypingAnimation({ text, speed = 50, onComplete }) {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    if (!text) return;

    let index = 0;
    setDisplayText('');
    setIsTyping(true);

    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayText(prev => prev + text[index]);
        index++;
      } else {
        setIsTyping(false);
        clearInterval(timer);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed, onComplete]);

  return (
    <div className="relative">
      <span>{displayText}</span>
      {isTyping && (
        <motion.span
          className="inline-block w-2 h-5 bg-blue-600 ml-1"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />
      )}
    </div>
  );
}
