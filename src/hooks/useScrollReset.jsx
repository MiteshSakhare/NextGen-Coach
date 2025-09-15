import { useEffect, useRef } from 'react';

/**
 * Enhanced scroll reset hook for components
 * @param {*} dependency - Optional dependency to trigger scroll reset
 * @param {Object} options - Configuration options
 * @param {boolean} options.smooth - Use smooth scrolling (default: false)
 * @param {boolean} options.resetContainers - Reset scrollable containers (default: true)
 * @param {number} options.delay - Delay before scroll reset in ms (default: 0)
 * @param {boolean} options.preserveOnUnmount - Don't reset scroll on unmount (default: false)
 */
export const useScrollReset = (dependency = null, options = {}) => {
  const {
    smooth = false,
    resetContainers = true,
    delay = 0,
    preserveOnUnmount = false,
    onlyOnMount = true
  } = options;

  const isFirstMount = useRef(true);

  useEffect(() => {
    // Skip on first mount if onlyOnMount is false and we have a dependency
    if (dependency !== null && onlyOnMount && isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    isFirstMount.current = false;

    const executeScrollReset = () => {
      // Main window scroll reset
      const scrollToTop = () => {
        if (smooth) {
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
          });
        } else {
          window.scrollTo(0, 0);
        }
      };

      // Reset scrollable containers
      const resetScrollableContainers = () => {
        if (!resetContainers) return;
        
        const selectors = [
          '[data-scroll-reset]',
          '.overflow-auto',
          '.overflow-y-auto', 
          '.overflow-x-auto',
          '.overflow-scroll',
          '.scroll-smooth',
          '[class*="overflow"]'
        ];
        
        const scrollableElements = document.querySelectorAll(selectors.join(', '));
        scrollableElements.forEach(element => {
          try {
            element.scrollTop = 0;
            element.scrollLeft = 0;
          } catch (error) {
            // Ignore elements that can't be scrolled
          }
        });
      };

      // Execute scroll operations
      scrollToTop();
      resetScrollableContainers();

      // Reset any custom scroll positions stored in sessionStorage
      try {
        const scrollKeys = Object.keys(sessionStorage).filter(key => 
          key.startsWith('scroll-position-')
        );
        scrollKeys.forEach(key => sessionStorage.removeItem(key));
      } catch (error) {
        // Ignore sessionStorage errors
      }
    };

    if (delay > 0) {
      const timeoutId = setTimeout(executeScrollReset, delay);
      return () => clearTimeout(timeoutId);
    } else {
      executeScrollReset();
    }
  }, [dependency, smooth, resetContainers, delay, onlyOnMount]);

  // Optional cleanup on unmount
  useEffect(() => {
    return () => {
      if (!preserveOnUnmount) {
        window.scrollTo(0, 0);
      }
    };
  }, [preserveOnUnmount]);
};

/**
 * Hook for scroll position restoration
 * Saves and restores scroll position for a specific component
 * @param {string} key - Unique key for storing scroll position
 * @param {boolean} enabled - Whether to enable position restoration
 */
export const useScrollPosition = (key, enabled = true) => {
  const scrollPositionRef = useRef({ x: 0, y: 0 });

  // Save scroll position
  useEffect(() => {
    if (!enabled) return;

    const handleScroll = () => {
      scrollPositionRef.current = {
        x: window.pageXOffset,
        y: window.pageYOffset
      };
      
      try {
        sessionStorage.setItem(`scroll-position-${key}`, JSON.stringify(scrollPositionRef.current));
      } catch (error) {
        // Ignore storage errors
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [key, enabled]);

  // Restore scroll position
  useEffect(() => {
    if (!enabled) return;

    try {
      const savedPosition = sessionStorage.getItem(`scroll-position-${key}`);
      if (savedPosition) {
        const { x, y } = JSON.parse(savedPosition);
        window.scrollTo(x, y);
      }
    } catch (error) {
      // Ignore restore errors
    }
  }, [key, enabled]);

  // Manual scroll position control
  const savePosition = () => {
    if (!enabled) return;
    
    scrollPositionRef.current = {
      x: window.pageXOffset,
      y: window.pageYOffset
    };
    
    try {
      sessionStorage.setItem(`scroll-position-${key}`, JSON.stringify(scrollPositionRef.current));
    } catch (error) {
      // Ignore storage errors
    }
  };

  const restorePosition = () => {
    if (!enabled) return;
    
    try {
      const savedPosition = sessionStorage.getItem(`scroll-position-${key}`);
      if (savedPosition) {
        const { x, y } = JSON.parse(savedPosition);
        window.scrollTo(x, y);
      }
    } catch (error) {
      // Ignore restore errors
    }
  };

  const clearPosition = () => {
    try {
      sessionStorage.removeItem(`scroll-position-${key}`);
    } catch (error) {
      // Ignore storage errors
    }
  };

  return {
    savePosition,
    restorePosition,
    clearPosition
  };
};

/**
 * Hook for smooth scrolling to specific elements
 * @param {Object} options - Scroll behavior options
 */
export const useSmoothScroll = (options = {}) => {
  const {
    behavior = 'smooth',
    block = 'start',
    inline = 'nearest'
  } = options;

  const scrollToElement = (elementOrSelector, customOptions = {}) => {
    let element;
    
    if (typeof elementOrSelector === 'string') {
      element = document.querySelector(elementOrSelector);
    } else {
      element = elementOrSelector;
    }

    if (element) {
      element.scrollIntoView({
        behavior,
        block,
        inline,
        ...customOptions
      });
    }
  };

  const scrollToTop = (customOptions = {}) => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior,
      ...customOptions
    });
  };

  const scrollToBottom = (customOptions = {}) => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      left: 0,
      behavior,
      ...customOptions
    });
  };

  return {
    scrollToElement,
    scrollToTop,
    scrollToBottom
  };
};
