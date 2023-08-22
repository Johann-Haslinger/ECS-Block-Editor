import React from 'react';
import { motion } from 'framer-motion';
import { useEntities } from '@leanscope/ecs-engine';
import { Colors, Tags } from '../../../base/Constants';
import { ColorFacet } from '../../../app/BlockFacets';
import { Theme, Themes } from '../../Theme';
import { IoEllipsisHorizontal, IoEllipsisHorizontalCircle, IoImage } from 'react-icons/io5';

interface ColorOptionsProps {
  isVisible: boolean;
  toggleIsVisible: () => void;
}

const ColorOptions: React.FC<ColorOptionsProps> = ({ isVisible, toggleIsVisible }) => {
  const [pressedBlockEntities] = useEntities((e) => e.hasTag(Tags.PRESSED));

  const onClick = (color: string) => {
    pressedBlockEntities.map((entity) => {
      entity.addComponent(new ColorFacet({ color: color }));
    });
  };

  return (
    <div className="  flex w-screen fixed z-40 left-0 justify-center">
      <motion.div
        transition={{ type: 'Tween' }}
        animate={{ y: isVisible ? 0 : 600 }}
        initial={{ y: 600 }}
        className="bg-white h-44 rounded-lg px-4 md:w-[32rem]  w-11/12  fixed bottom-8 shadow-[0_0px_40px_1px_rgba(0,0,0,0.12)]"
        drag="y"
        dragConstraints={{ top: 0, bottom: 200 }}
        onDragEnd={(event, info) => {
          console.log(event);
          if (info.offset.y >= 1) toggleIsVisible();
        }}
      >
        <div className="w-full flex justify-center">
          <div className="w-8 mt-1.5 h-1 rounded-full  bg-input-white-bg" />
        </div>

        <div className="flex pt-6 flex-wrap ">
          {Themes.map((color) => (
            <div className="w-11 hover:opacity-50  transition-all m-1 h-11 rounded-lg" onClick={()=> {onClick(Theme(color))}} style={{ backgroundColor: Theme(color) }} />
          ))}
          <div className='h-11 w-11 hover:opacity-50  transition-all rounded-lg bg-bg m-1 p-3 text-lg text-text2' ><IoEllipsisHorizontal/></div>
        </div>
      </motion.div>
    </div>
  );
};

export default ColorOptions;
