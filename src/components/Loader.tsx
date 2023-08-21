import React from 'react';
import { motion } from 'framer-motion';

const Loader = () => {
  return (
    <div className="flex items-center justify-center">
    <motion.span
      className="h-1 w-1 bg-blue rounded-full mx-0.5"
      animate={{ scale: [1, 1.25, 1] }}
      transition={{
        duration: 0.6,
        repeat: Infinity,
        ease: 'easeInOut',
        repeatType: 'loop',
      }}
    />
    <motion.span
      className="h-1 w-1  bg-blue rounded-full mx-0.5"
      animate={{ scale: [1, 1.25, 1] }}
      transition={{
        duration: 0.6,
        delay: 0.2,
        repeat: Infinity,
        ease: 'easeInOut',
        repeatType: 'loop',
      }}
    />
    <motion.span
      className="h-1 w-1 bg-blue rounded-full mx-0.5"
      animate={{ scale: [1, 1.25, 1] }}
      transition={{
        duration: 0.6,
        delay: 0.4,
        repeat: Infinity,
        ease: 'easeInOut',
        repeatType: 'loop',
      }}
    />
  </div>
  );
};

export default Loader;
