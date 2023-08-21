import React, { useEffect, useState } from 'react';
import { generateResponse } from '../../../ai/generateResponse';
import SheetViewOutline from '../../StyleLibary/SheetViewOutline';
import TypingAnimation from '../../TypingAnimation';
import {
  IoArrowDown,
  IoArrowDownOutline,
  IoArrowUp,
  IoClipboard,
  IoClipboardOutline,
  IoFlash,
  IoPerson,
  IoSparkles,
} from 'react-icons/io5';
import { delay } from '../../Delay';
import Loader from '../../Loader';

type row = {
  question: string;
  answer: string | null;
};

interface ChatBoxProps {
  input: string;
  isVisible: boolean;
  toggleISVisible: () => void;
  history: row[];
  setHistory: React.Dispatch<React.SetStateAction<row[]>>;
}
const KIChatBox: React.FC<ChatBoxProps> = ({ isVisible, toggleISVisible, history, setHistory }) => {
  const [canStartTyping, setCanStartTyping] = useState(false);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleClick = async () => {
    let updatedHistory = [...history];
    setInput('');
    updatedHistory.push({ question: input, answer: null });
    setHistory(updatedHistory);
    setIsGenerating(true);
    let answer = await generateResponse(input);
    setIsGenerating(false);
    if (typeof answer == 'string') {
      updatedHistory[updatedHistory.length - 1].answer = answer;
    }
    setHistory(updatedHistory);
  };

  const activateStartTyping = async () => {
    await delay(400);
    setCanStartTyping(true);
  };

  useEffect(() => {
    if (!isVisible) {
      setCanStartTyping(false);
    } else {
      activateStartTyping();
    }
  }, [isVisible]);

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    isVisible && (
      <SheetViewOutline
        backfunc={toggleISVisible}
        content={
          <>
            <div className="pb-20 pr-5 ">
              {history.map((row) => {
                let typingstate = 0;

                return (
                  <div className="px-4 md:px-6  ">
                    <div className="mt-8">
                      <div className="flex ">
                        <div className="text-white p-1 rounded-full mr-2 text-xs bg-[#1C8493]">
                          <IoPerson />
                        </div>
                        <p className="text-sm font-semibold  text-text2">BENUTZER</p>
                      </div>
                      <p className="mt-1 ml-7">{row.question}</p>
                    </div>

                    {row.answer !== null && (
                      <div className="mt-5">
                        <div className="flex ">
                          <div className="text-white p-1 rounded-full mr-2 text-xs bg-[#608AFF]">
                            <IoFlash />
                          </div>
                          <div className="flex text-text2  justify-between  w-full">
                            <p className="text-sm font-semibold  text-text2">BLOCK AI</p>
                            <div className="mr-4 space-x-2 ml-5 text-sm mt-0.5 flex">
                              {/* <IoArrowDownOutline className=" hover:opacity-50 transition-all" /> */}
                              <IoClipboardOutline
                                onClick={() => {
                                  if (typeof row.answer == 'string') {
                                    copyText(row.answer);
                                  }
                                }}
                                className=" hover:opacity-50 transition-all"
                              />
                            </div>
                          </div>
                        </div>
                        <p className="mt-1 ml-7">
                          {canStartTyping && <TypingAnimation s={row.answer} />}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="flex bg-main-bg justify-center absolute  bottom-0  pt-3 md:bottom-28 w-full md:w-7/12">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Frage mich etwas..."
                className="md:w-8/12 w-9/12 h-8 rounded-lg flex bg-[rgb(233,233,239)] outline-none px-3 placeholder:text-[rgb(122,122,128)]"
              />
              {isGenerating ? (
                <div className=" ml-5 mt-3">
                  <Loader />
                </div>
              ) : (
                <div
                  onClick={handleClick}
                  className=" bg-blue-light ml-4  h-7 mt-1  hover:opacity-50 transition-all text-blue p-1 text-xl rounded-full"
                >
                  <IoArrowUp />
                </div>
              )}
            </div>
          </>
        }
      />
    )
  );
};

export default KIChatBox;
