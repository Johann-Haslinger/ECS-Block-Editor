import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

import {
  IoBulbOutline,
  IoDocumentOutline,
  IoDocumentTextOutline,
  IoInformationCircleOutline,
  IoSearchCircleOutline,
  IoSearchOutline,
  IoSparklesOutline,
  IoTextOutline,
} from 'react-icons/io5';
import OptionRow from '../StyleLibary/OptionRow';
import { delay } from '../Delay';
import { EntityProps } from '@leanscope/ecs-engine/react-api/classes/EntityProps';
import { Tags } from '../../base/Constants';
import { useEntityHasTags } from '@leanscope/ecs-engine';

const PageOptionsMenu = (props: EntityProps) => {
  const refOne = useRef<HTMLDivElement | null>(null);
  const [visibleContent, setVisibleContent] = useState<string>('');
  const [isVisible] = useEntityHasTags(props.entity, Tags.IS_PageOptionsMenu_VISIBLE);

  const ContentStates = {
    SEITEN_STIL: 'Seiten Stil',
    SEITEN_INFO: 'Seiten Info',
    SUCHEN: 'Suchen',
    BLOCK_AI: 'Block AI',
    RECHTSCHREIBUNG: 'Rechtschreibung',
    TIPS_UND_TRICKS: 'Tips und Trick',
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);

    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  const  handleClickOutside = (e: MouseEvent)  => {
    if (refOne.current && !refOne.current.contains(e.target as Node) && visibleContent === '') {
      handleBackClick();
    }
  }

   const  handleBackClick = async () => {
    props.entity?.removeTag(Tags.IS_PageOptionsMenu_VISIBLE);
    await delay(100);
  }

  return (
    <>
      <div className={` ${isVisible && "h-screen w-screen fixed top-0 left-0"}`}>
        <motion.div
          ref={refOne}
          initial={{ opacity: 0, scale: 0.0 }}
          animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.0 }}
          transition={{ duration: 0.2 }}
          className="bg-[rgb(243,241,242)] text-black w-56 md:w-64 fixed top-14 shadow-[0px_0px_100px_0px_rgba(0,0,0,0.15)] right-3 backdrop-blur-lg bg-opacity-100 rounded-lg"
        >
          <div>
            <OptionRow
              func={() => {
                setVisibleContent(ContentStates.SEITEN_STIL);
              }}
              icon={<IoDocumentTextOutline />}
              first={true}
              further={true}
              s={ContentStates.SEITEN_STIL}
            />
            <OptionRow
              func={() => {
                setVisibleContent(ContentStates.SEITEN_INFO);
              }}
              icon={<IoInformationCircleOutline />}
              space={true}
              further={true}
              s={ContentStates.SEITEN_INFO}
            />

            <OptionRow
              func={() => {
                setVisibleContent(ContentStates.SUCHEN);
              }}
              icon={<IoSearchOutline />}
              s={ContentStates.SUCHEN}
            />
            <OptionRow
              func={() => {
                setVisibleContent(ContentStates.BLOCK_AI);
              }}
              icon={<IoSparklesOutline />}
              s={ContentStates.BLOCK_AI}
            />
            <OptionRow
              func={() => {
                setVisibleContent(ContentStates.RECHTSCHREIBUNG);
              }}
              icon={<IoTextOutline />}
              s={ContentStates.RECHTSCHREIBUNG}
            />
            <OptionRow
              func={() => {
                setVisibleContent(ContentStates.TIPS_UND_TRICKS);
              }}
              icon={<IoBulbOutline />}
              last={true}
              s={ContentStates.TIPS_UND_TRICKS}
            />
          </div>
        </motion.div>
      </div>

      {/* {visibleContent && (
        <SheetViewOutline
          isWhite={true}
          backfunc={() => {
            setVisibleContent("");
          }}
          content={
            visibleContent === ContentStates.SEITEN_STIL ? (
              <Spacer
                content={
                  <>
                    <Section s={ContentStates.SEITEN_STIL} content={<></>} />
                  </>
                }
              />
            ) : (
              <></>
            )
          }
        />
      )} */}
    </>
  );
};

export default PageOptionsMenu;
