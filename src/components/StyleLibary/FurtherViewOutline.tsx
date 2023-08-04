import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useStateContext } from '../../contexts/ContextProvider';
import { useWindowDimensions } from '../Size';
import { delay } from '../Delay';
import { IoChevronBack } from 'react-icons/io5';

interface FurtherViewOutlineProps {
  content: React.ReactNode;
  backfunc: () => void;
}

const FurtherViewOutline: React.FC<FurtherViewOutlineProps> = ({ content, backfunc }) => {
  const { width } = useWindowDimensions();
  const { setTheme, theme } = useStateContext();
  const [back, setBack] = useState(false);

  useEffect(() => {
    if (width < 550) {
      setTheme('#ffffff');
    }
  }, []);

  const handleBackClick = async () => {
    setBack(true);
    if (width > 550) {
      setTheme('rgb(243, 243, 248)');
    }

    await delay(200);
    backfunc();
  };

  // Neue state variables und Ref für die Swipe-Gesten
  const swipeX = useMotionValue(0);
  const screenLeftEdgeX = useTransform(swipeX, (value) => value + width); // X-Position vom linken Bildschirmrand aus

  // Schwellenwert, um den Swipe als "am äußersten linken Rand" zu erkennen
  const swipeThreshold = 0;

  const handleSwipe = () => {
    if (screenLeftEdgeX.get() <= swipeThreshold) {
      handleBackClick();
    }
  };

  return (
    <motion.div
      animate={{ background: back ? '#ffffff00' : '#00000029' }}
      initial={{ background: '#ffffff00' }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        width: '100vw',
      }}
      className="z-50"
    >
      <motion.div
        // Füge onPanStart prop hinzu, um auf den Start des Swipes zu reagieren
        onPanStart={handleSwipe}
        // Füge onPan prop hinzu, um auf die Swipe-Gesten zu reagieren
        onPan={handleSwipe}
        transition={{ type: 'Tween' }}
        animate={{ x: back ? width < 550 ? 600 : 2000 : 0 }}
        initial={{ x: width < 550 ? 600 : 2000 }}
        className={
          'bg-white md:bg-bg z-50 overflow-y-scroll h-screen fixed top-0 left-0 right-0 w-screen md:flex md:justify-between'
        }
      >
        <div
          onClick={handleBackClick}
          className="py-6 md:py-4 z-40  md:bg-opacity-0 bg-white absolute top-0 left-0 flex"
        >
          <div className="  pl-4 md:pl-6 h-6 text-blue  text-3xl">
            <IoChevronBack />
          </div>
          <p className="text-blue  invisible md:visible mt-0.5 ml-2">BlockEditor</p>
        </div>

        {content}
      </motion.div>
    </motion.div>
  );
};

export default FurtherViewOutline;
