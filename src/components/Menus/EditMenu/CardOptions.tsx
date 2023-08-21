import React from 'react';
import { motion } from 'framer-motion';
import { IoFlower, IoSettings } from 'react-icons/io5';

interface CardOption {
  isVisible: boolean;
}

const CardOptions: React.FC<CardOption> = ({ isVisible }) => {
  return (
    <>
      <motion.div
        transition={{ type: 'Tween' }}
        animate={{ y: !isVisible ? 200 : 0 }}
        initial={{ y: 200 }}
        className="bg-white h-20 overflow-y-clip  rounded-lg pr-1 flex over md:overflow-hidden right-6  w-32 fixed bottom-6 shadow-[0_0px_40px_1px_rgba(0,0,0,0.12)]"
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
      >
        <div
          className={`w-full hover:opacity-80 transition-all text-[#001539] bg-[#001539]  min-w-[4rem] p-2 bg-opacity-10 h-18 text-whitee rounded-lg mr-0 m-1 `}
   
          onClick={() => {
           
          }}
        >
          <div className="text-2xl flex justify-center mt-2"> <IoSettings/></div>
          <p className="text-xs mt-1 opacity-60 w-full text-center font-light">Karte</p>
        </div>
      </motion.div>
    </>
  );
};

export default CardOptions;
