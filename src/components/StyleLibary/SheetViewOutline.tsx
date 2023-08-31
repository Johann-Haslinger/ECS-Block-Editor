import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

import { useStateContext } from '../../contexts/ContextProvider';
import { useWindowDimensions } from '../Size';
import { delay } from '../Delay';

interface SheetViewProps {
  title?: string;
  hasNoBackbutton?: boolean;
  content: React.ReactNode;
  backfunc: () => void;
  isNotVisible?: boolean;
  small?: boolean;
  clickOutside?: boolean;
  save?: boolean;
  saveFunc?: () => void;
  isWhite?: boolean;
  noBack?: boolean;
  done?: boolean;
  hasBackButton?: boolean;
  noButton?: boolean;
  isGoingBack?: boolean;
}

const SheetViewOutline: React.FC<SheetViewProps> = ({
  hasBackButton,
  content,
  backfunc,
  isNotVisible,
  small,
  clickOutside,
  isWhite,
  noButton,
  isGoingBack,
}) => {
  const [back, setBack] = useState<boolean>(false);
  const { setTheme } = useStateContext();
  const refOne = useRef<HTMLDivElement>(null);
  const { width } = useWindowDimensions();

  useEffect(() => {
    if (isGoingBack == true) {
      handleBackClick();
    }
  }, [isGoingBack]);

  useEffect(() => {
    setTheme('rgb(202, 202, 207)');
  }, []);

  useEffect(() => {
    if (isNotVisible === true) {
      setBack(true);
    }
  }, [isNotVisible]);

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  const  handleClickOutside = (e: MouseEvent) =>{
    if (refOne.current && !refOne.current.contains(e.target as Node) && !clickOutside) {
      handleBackClick();
    }
  }

  const handleBackClick = async () => {
    setBack(true);
    if (!isWhite || width < 550) setTheme('rgb(243, 243, 248)');
    await delay(100);

    backfunc();
  };

  return (
    <motion.div
      draggable={false}
      animate={{ background: back ? '#ffffff00' : '#00000029' }}
      initial={{ background: '#ffffff00' }}
      className="w-screen z-50 items-end md:items-center h-screen flex justify-center fixed top-0 left-0 text-[#ffffff00]  "
    >
      <motion.div
        ref={refOne}
        transition={{ type: 'Tween' }}
        animate={{ y: back ? 1110 : 0 }}
        initial={{ y: 1110 }}
        className={
          small
            ? 'h-3/6  w-full md:w-8/12 text-black bg-bg md:rounded-xl rounded-t-2xl  '
            : 'h-5/6  w-full md:w-8/12 text-black bg-bg md:rounded-xl rounded-t-2xl  '
        }
      >
      
          <div className="flex justify-between text-blue p-4 px-6">
            <div onClick={handleBackClick}>{hasBackButton && 'Zurück'}</div>
            <div onClick={handleBackClick} className=" font-semibold">
            {!noButton && ( "Fertig" )}
            </div>
          </div>
       

        <div className="md:px-4 h-full md:h-5/6 pb-10 overflow-y-scroll">{content}</div>
      </motion.div>
    </motion.div>
  );
};

export default SheetViewOutline;
