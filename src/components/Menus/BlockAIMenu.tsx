import React, { useEffect, useState } from 'react';
import { IoArrowUndo, IoArrowUp, IoEnter, IoReturnDownBack } from 'react-icons/io5';
import Loader from '../Loader';
import { generateResponse } from '../../ai/generateResponse';
import { useEntities } from '@leanscope/ecs-engine';
import { Tags } from '../../base/Constants';
import TypingAnimation from '../TypingAnimation';
import { TextFacet } from '@leanscope/ecs-models';

interface MenuProps {
  isVisible: boolean;
}
const BlockAIMenu: React.FC<MenuProps> = ({ isVisible }) => {
  const [input, setInput] = useState('');
  const [answer, setAnswer] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [pressedBlockEntities] = useEntities((e) => e.hasTag(Tags.PRESSED));

  const [questionOptions, setQuestionOptions] = useState([
    { "preview": 'Erklären', question: 'Erkläre mir das'},
    { "preview": 'Zusammenfassen', question: 'Fasse das Zusammen'},
    { "preview": 'Weiter schreiben', question: 'Schreibe diesen Text weiter' },
    { "preview": "Interpretieren", "question": "Bitte interpretiere das für mich." },
    { "preview": "Verdeutlichen", "question": "Mach das bitte deutlicher für mich." },
    { "preview": "Beschreiben", "question": "Beschreibe mir, worum es geht." },
    { "preview": "Ausführen", "question": "Führe das bitte genauer aus." },
    { "preview": "Zusammenhang erklären", "question": "Erkläre den Zusammenhang dahinter." },
    { "preview": "Hintergrundinformationen geben", "question": "Gib mir Hintergrundinformationen dazu." },

  ]);

  useEffect(() => {
    setAnswer('');
  }, [isVisible]);

  const handleClick = async () => {
    let pressedText = '';
    setIsGenerating(true);
    pressedBlockEntities.map((block) => {
      pressedText += block.get(TextFacet)?.props.text;
    });
  
    const prompt = input
    setAnswer(await generateResponse(prompt));
    setIsGenerating(false);
  };

  return (
    <div className=" pb-20 overflow-y-scroll">
      <div className="flex border-b border-b-[rgb(245,245,247)] ">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full  outline-none px-2 py-3 placeholder:text-text2"
          placeholder="Frage mich etwas oder wähle eine Option"
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
      <div className="pt-2 h-40 overflow-y-scroll">
        {answer ? (
          <div>
            <TypingAnimation s={answer} />
          </div>
        ) : (
          questionOptions.map((option) => (
            <div
              onClick={async () => {
                
                
                setInput(option.question);
                handleClick();
              }}
              className={false ? 'px-2 py-1 rounded-lg flex justify-between' : 'px-2 py-1'}
            >
              {option.preview}{' '}
            </div> //{option.pressed &&<IoReturnDownBack/>}
          ))
        )}
      </div>
    </div>
  );
};

export default BlockAIMenu;
