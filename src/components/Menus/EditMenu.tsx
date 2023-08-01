import { useEntities, useEntity, useEntityComponents } from '@leanscope/ecs-engine';
import { EntityProps } from '@leanscope/ecs-engine/react-api/classes/EntityProps';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { IsEditingFacet, TypeFacet } from '../../app/BlockFacets';
import {
  IoArrowForwardCircle,
  IoArrowForwardCircleOutline,
  IoColorPalette,
  IoColorPaletteOutline,
  IoShare,
  IoShareOutline,
  IoSparkles,
  IoSparklesOutline,
  IoTrash,
  IoTrashOutline,
} from 'react-icons/io5';
import StyleOptions from './EditMenu/StyleOptions';
import { Tags } from '../../base/Constants';

type option = {
  name: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  content?: React.ReactNode;
};

interface EditOptionProps {
  option: option;
  isVisible: boolean;
}
const EditOption: React.FC<EditOptionProps> = ({ option, isVisible }) => {
  const { name, icon, color, bgColor, content } = option;
  const [isOptionsVisible, setIsOptionsVisible] = useState(false);

  useEffect(() => {
    setIsOptionsVisible(false);
  }, [isVisible]);

  return (
    <>
      <div
        className={`w-full hover:opacity-80 transition-all  min-w-[4rem] p-2 bg-opacity-10 h-18 text-whitee rounded-lg mr-0 m-1 `}
        style={{ color: color, backgroundColor: bgColor, maxWidth: '10rem' }} // Max width set to 10rem
        onClick={() => {
          setIsOptionsVisible(true);
        }}
      >
        <div className="text-2xl flex justify-center mt-2"> {icon}</div>
        <p className="text-xs mt-1 opacity-60 w-full text-center font-light">{name}</p>
      </div>

      <div className="md:relative fixed z-40 md:right-[6.5rem] ">
        <motion.div
          transition={{ type: 'Tween' }}
          animate={{ y: isOptionsVisible && isVisible && content ? 0 : 300 }}
          initial={{ y: 200 }}
          className="bg-white h-40 z-40 rounded-lg  md:w-[31rem]  w-11/12  fixed bottom-7 shadow-[0_0px_40px_1px_rgba(0,0,0,0.12)]"
          drag="y"
          dragConstraints={{ top: 0, bottom: 200 }}
          onDragEnd={(event, info) => {
            console.log(event);
            if (info.offset.y >= 1) setIsOptionsVisible(false);
          }}
        >
          {content}
        </motion.div>
      </div>
    </>
  );
};

const EditMenu = (props: EntityProps) => {


  //const [isEditingFacet] = useEntityComponents(props.entity, IsEditingFacet);
  const isVisible = props.entity?.get(IsEditingFacet)?.props?.isEditing ?? false;
  const [pressedBlockEntities] = useEntities((e) => e.hasTag(Tags.PRESSED));
  const [editOptions, setEditOptions] = useState([
    {
      name: 'Stil',
      icon: <IoColorPalette />,
      color: '#8547F0',
      bgColor: 'rgba(133, 71, 240, 0.1)',
      content: <StyleOptions pressedBlockEntities={pressedBlockEntities} />,
    },
    {
      name: '+ Inhalt',
      icon: <IoArrowForwardCircleOutline />,
      color: '#608AFF',
      bgColor: 'rgba(96, 138, 255, 0.1)',
    },
    {
      name: 'Aktionen',
      icon: <IoShareOutline />,
      color: '#1C8493',
      bgColor: 'rgba(28, 132, 147, 0.1)',
    },
    {
      name: 'Block AI',
      icon: <IoSparkles />,
      color: '#EC76CB',
      bgColor: 'rgba(236, 118, 203, 0.1)',
    },
    {
      name: 'Löschen',
      icon: <IoTrash />,
      color: '#FF5355',
      bgColor: 'rgba(255, 83, 85, 0.1)',
    },
  ]);

  return (
    <div className="w-full flex justify-center">
      <motion.div
        transition={{ type: 'Tween' }}
        animate={{ y: !isVisible ? 200 : 0 }}
        initial={{ y: 200 }}
        className="bg-white h-20 overflow-y-clip  rounded-lg pr-1 flex over md:overflow-hidden  w-11/12 md:w-[30rem] fixed bottom-6 shadow-[0_0px_40px_1px_rgba(0,0,0,0.12)]"
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
      >
        {/* Added a wrapping div with flex-auto class */}
        <div className="flex overflow-x-scroll w flex-auto">
          {editOptions.map((option) => (
            <EditOption isVisible={isVisible} option={option} key={option.name} />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default EditMenu;
