import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { delay } from '../Delay';
import { IoArrowUp, IoChevronUp } from 'react-icons/io5';
import KIChatBox from './InputBar/KIChatBox';
import { generateResponse } from '../../ai/generateResponse';
import { act } from 'react-dom/test-utils';
import Loader from '../Loader';
import { Entity } from '@leanscope/ecs-engine';
import { Tags } from '../../base/Constants';

interface InputMenuProps {
  isVisible: boolean;
  toggleIsVisible: () => void;
  blockEntities: readonly Entity[]
}

type row = {
  question: string;
  answer: string | null;
};

const InputBar: React.FC<InputMenuProps> = ({ isVisible, toggleIsVisible, blockEntities}) => {
  const refOne = useRef<HTMLDivElement>(null);
  const [back, setBack] = useState(false);
  const [input, setInput] = useState('');
  const [isChatBoxVisible, setIsChatBoxVisible] = useState(false);
  const [history, setHistory] = useState<row[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
 


  const checkIsWriting = () => {
    let updatedIsWriting = false;

    blockEntities.map((block) => {
      if (block.hasTag(Tags.FOCUSED)) {
        updatedIsWriting = true;
      }
    });
    return updatedIsWriting;
  };


  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  useEffect(() => {
    setInput('');
  }, [isChatBoxVisible]);

  // useEffect(() => {
  //   if (!isChatBoxVisible) {
  //     setHistory([]);
  //   }
  // }, [isChatBoxVisible]);

  const  handleClickOutside = async (e: MouseEvent) => {
    if (refOne.current && !refOne.current.contains(e.target as Node)) {
      setBack(true);
      toggleIsVisible();
      await delay(200);
      setIsChatBoxVisible(false);
    }
  }
  const handleClick = async () => {
    let updatedHistory = [...history];
    setIsGenerating(true);
    let answer = await generateResponse(input);
    setIsGenerating(false);
    if (typeof answer == 'string') {
      updatedHistory.push({ question: input, answer: answer });
    }
    setHistory(updatedHistory);
    setIsChatBoxVisible(true);
  };

  return (
    <div className="w-full fixed left-0 md:px-4 px-2 bottom-0 md:bottom-[1rem]">
      <motion.div
        transition={{ type: 'Tween' }}
        animate={{
          y: !isVisible ? 200 : 0,
        }}
        initial={{ y: 0 }}
        className="bg-white md:h-14 h-20 md:pb-0 pb-[1.2rem]  items-center rounded-b-lg w-full flex justify-center shadow-[0px_-30px_20px_0px_rgba(0,0,0,0.022)]"
      >
        <div className="md:w-7/12 w-9/12 h-8 rounded-lg flex bg-[#f2f2f4b6]">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Frage mich etwas..."
            className="w-full h-full rounded-lg bg-[#f2f2f4b6] outline-none px-3 placeholder:text-icon"
          />
        </div>
        {isGenerating ? (
          <div className=" ml-5">
            <Loader />
          </div>
        ) : input  ?  (
          <div
            onClick={handleClick}
            className=" bg-blue-light ml-4   hover:opacity-50 transition-all text-blue p-1 text-xl rounded-full"
          >
            <IoArrowUp />
          </div>
        ): (
          <div
            onClick={()=>{
              setIsChatBoxVisible(true);
            }}
            className=" bg-blue-light ml-4   hover:opacity-50 transition-all text-blue p-1 text-xl rounded-full"
          >
            <IoChevronUp />
          </div>
        )}
      </motion.div>

      <KIChatBox
        input={input}
        history={history}
        toggleISVisible={() => {
          setIsChatBoxVisible(false);
        }}
        isVisible={isChatBoxVisible}
        setHistory={setHistory}
      />
    </div>
  );
};  

export default InputBar;
