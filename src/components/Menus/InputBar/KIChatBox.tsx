import React, { useContext, useEffect, useState } from 'react';
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
import { ECSContext, Entity, useEntities } from '@leanscope/ecs-engine';
import {
  IdFacet,
  ParentFacet,
  TextFacet,
  TextTypeFacet,
  TypeFacet,
} from '../../../app/BlockFacets';
import { v4 as uuid } from 'uuid';
import { BlockTypes, Tags, TextTypes } from '../../../base/Constants';

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
  const [pressedBlockEntities] = useEntities((e) => e.hasTag(Tags.PRESSED));

  const ecs = useContext(ECSContext);

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

  const handleAddBlockbyRow = async (row: row) => {
    setIsGenerating(true);

    const parentBlockName = await generateResponse(
      `Wie lautet ein passender kurzer, Titel dazu: ${row.answer} `,
    );

    console.log('prompt', parentBlockName);
    // const parentIdParentBlock = pressedBlockEntities[0].get(ParentFacet)?.props.parentId;
    const parentIdBlocks = uuid();

    const newParentBlockEntity = new Entity();
    ecs.engine.addEntity(newParentBlockEntity);
    newParentBlockEntity.addComponent(new TypeFacet({ type: BlockTypes.PAGE }));
    newParentBlockEntity.addComponent(new TextFacet({ text: parentBlockName }));
    newParentBlockEntity.addComponent(new IdFacet({ id: parentIdBlocks }));
    newParentBlockEntity.addComponent(new ParentFacet({ parentId: '1' }));

    console.log('prompt', parentBlockName);
    const prompt = `
    Teile den folgenden Text in 2 - 3 Blöcke auf und schreibe sie dann in der entity schreibweise, so dass man sie anschließend im Code benutzen kann:

    "${row.answer}".
    
    Hier ist, wie du jeden Block erstellst:

    1. Erstelle eine neue Entität:
       const blockEntity1 = new Entity();
       ecs.engine.addEntity(blockEntity1);

    2. Füge die Standardkomponenten hinzu, die immer gleich sind:
       blockEntity1.addComponent(new TypeFacet({ type: BlockTypes.TEXT }));
       blockEntity1.addComponent(new IdFacet({ id: uuid() }));
       blockEntity1.addComponent(new ParentFacet({ parentId: parentIdBlocks })); 
   
    3. Füge die variable Komponente hinzu, je nachdem, was in ** ** steht:
       blockEntity1.addComponent(new TextFacet({ text: '**der Dazugehörige Text**' }));
       blockEntity1.addComponent(new TextTypeFacet({ type: **einer der folgenden TextTypen: TextTypes.HEADING / TextTypes.BOLD / TextTypes.TEXT /  TextTypes.CAPTION ** }));
 
    Wiederhole diese Schritte für jeden Block, beginnend mit blockEntity1, dann blockEntity2, und so weiter.
    Ich möchte, dass du nicht Block 1: ... Bock 2: ... schreibstt sondern nur den Code

    Achte darauf:
     - Wenn du eine Leerzeile machen möchtest, erstelle einfach einen neuen Block. 
     - Ordne die Blöcke und den Text so an, dass du ab und zu unterschiedliche TextTypes verwenden kannst.
     - Wenn der Text sehr kurz ist, reicht auch ein Block.



`;

    // Hier ist ein Beispiel:

    //     const blockEntity1 = new Entity();
    //     ecs.engine.addEntity(blockEntity1);
    //     blockEntity1.addComponent(new TypeFacet({ type: BlockTypes.TEXT }));
    //     blockEntity1.addComponent(new IdFacet({ id: uuid() }));
    //     blockEntity1.addComponent(new ParentFacet({ parentId: 1 }));
    //     blockEntity1.addComponent(new TextFacet({ text: '...' }));
    //     blockEntity1.addComponent(new TextTypeFacet({ type: TextTypes.HEADING }));

    //     const blockEntity2 = new Entity();
    //     ecs.engine.addEntity(blockEntity2);
    //     blockEntity2.addComponent(new TypeFacet({ type: BlockTypes.TEXT }));
    //     blockEntity2.addComponent(new IdFacet({ id: uuid() }));
    //     blockEntity2.addComponent(new ParentFacet({ parentId: 1 }));
    //     blockEntity2.addComponent(new TextFacet({ text: '...' }));
    //     blockEntity2.addComponent(new TextTypeFacet({ type: TextTypes.TEXT }));

    // const blockEntity3 = new Entity();
    // ecs.engine.addEntity(blockEntity3);
    // blockEntity3.addComponent(new TypeFacet({ type: BlockTypes.TEXT }));
    // blockEntity3.addComponent(new IdFacet({ id: uuid() }));
    // blockEntity3.addComponent(new ParentFacet({ parentId: 1 }));
    // blockEntity3.addComponent(new TextFacet({ text: '*Text*',}),);
    // blockEntity3.addComponent(new TextTypeFacet({ type: TextTypes.HEADING }));

    // const blockEntity4 = new Entity();
    // ecs.engine.addEntity(blockEntity4);
    // blockEntity4.addComponent(new TypeFacet({ type: BlockTypes.TEXT }));
    // blockEntity4.addComponent(new IdFacet({ id: uuid() }));
    // blockEntity4.addComponent(new ParentFacet({ parentId: parentIdBlocks }));
    // blockEntity4.addComponent(new TextFacet({ text: '*Text*',}),);
    // blockEntity4.addComponent(new TextTypeFacet({ type: TextTypes.TEXT }));

    console.log('prompt', prompt);

    const addBlocks = await generateResponse(prompt);
    console.log('prompt answer', addBlocks);
    try {
      // Dynamischen Code in einer Funktion ausführen
      // In diesem Fall wird die "eval" Funktion verwendet, aber sie sollte vorsichtig verwendet werden.
      // In der Praxis sollten sicherere Alternativen wie "new Function" erwogen werden.
      // eval(addBlocks);
    } catch (error) {
      console.error('Error executing code:', error);
    }


    // const newBlock = new Entity();
    // ecs.engine.addEntity(newBlock);
    // newBlock.addComponent(new TypeFacet({ type: BlockTypes.TEXT }));
    // newBlock.addComponent(new TextFacet({ text: row.answer ? row.answer : "" }));
    // newBlock.addComponent(new IdFacet({ id: uuid() }));
    // newBlock.addComponent(new ParentFacet({ parentId: parentIdBlocks }));
    // newBlock.addComponent(new TextTypeFacet({ type: TextTypes.TEXT }));


    setIsGenerating(false);
    toggleISVisible();
  };

  return (
    isVisible && (
      <SheetViewOutline
        backfunc={toggleISVisible}
        content={
          <>
            <div className="pb-20 pr-5 ">
              {history.map((row, idx) => {
                let typingstate = 0;

                return (
                  <div className="px-4 md:px-6  ">
                    <div className="mt-8">
                      <div className="flex ">
                        <div className="text-white p-1 rounded-full mr-2 text-xs bg-[#1C8493]">
                          <IoPerson />
                        </div>
                        <p className="text-sm font-semibold  text-text2">DU</p>
                      </div>
                      <p className="mt-1 ml-7">{row.question}</p>
                    </div>

                    {row.answer !== null && (
                      <div className="mt-5">
                        <div className="flex ">
                          <div className="text-white p-1 rounded-full mr-2 text-xs bg-[#797AFF]">
                            <IoFlash />
                          </div>
                          <div className="flex text-text2  justify-between  w-full">
                            <p className="text-sm font-semibold  text-text2">BLOCK AI</p>
                            <div className="mr-4 space-x-2 ml-5 text-sm mt-0.5 flex">
                              <IoArrowDownOutline
                                onClick={() => {
                                  handleAddBlockbyRow(row);
                                }}
                                className=" hover:opacity-50 transition-all"
                              />
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
                          {canStartTyping && idx == history.length - 1 && (
                            <TypingAnimation s={row.answer} />
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="flex bg-bg justify-center absolute  bottom-0  pt-3 md:bottom-28 w-full md:w-7/12">
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
