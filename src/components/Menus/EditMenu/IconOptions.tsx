import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useEntities } from '@leanscope/ecs-engine';
import { Colors, Tags } from '../../../base/Constants';
import { Theme, Themes } from '../../Theme';
import {
  IoEllipsisHorizontal,
  IoEllipsisHorizontalCircle,
  IoFlash,
  IoImage,
} from 'react-icons/io5';
import SheetViewOutline from '../../StyleLibary/SheetViewOutline';
import { Icons, StringToIcon } from '../../Icons';
import { IconNameFacet } from '@leanscope/ecs-models';

interface IconOptionsProps {
  isVisible: boolean;
  toggleIsVisible: () => void;
}

const IconOptions: React.FC<IconOptionsProps> = ({ toggleIsVisible }) => {
  const [pressedBlockEntities] = useEntities((e) => e.hasTag(Tags.PRESSED));
  const [isGoingBack, setIsGoingBack] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredIcons, setFilteredIcons] = useState<string[]>([]);

  const handleClick = (icon: string) => {
    pressedBlockEntities.map((entity) => {
      entity.addComponent(new IconNameFacet({ iconName: icon }));
    });
    setIsGoingBack(true);
  };

  const handleSearch = (query: string) => {
    const normalizedQuery = query.toLowerCase();
    const filtered = Icons.filter((icon) => icon.toLowerCase().includes(normalizedQuery));
    setFilteredIcons(filtered);
  };

  return (
    <SheetViewOutline
      isGoingBack={isGoingBack}
      backfunc={toggleIsVisible}
      content={
        <div>
          <div className=" pb-10 flex justify-center w-full">
            <input
              type="text"
              className="md:w-8/12 w-11/12 h-8 rounded-lg flex bg-[rgb(233,233,239)] outline-none px-3 placeholder:text-[rgb(122,122,128)]"
              placeholder="Suche nach Icons..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                handleSearch(e.target.value);
              }}
            />
          </div>
          <div className=" text-2xl pb-10 text-blue w-full flex justify-between flex-wrap">
            {searchTerm == '' ? (
              Icons.map((icon) => (
                <div
                  onClick={() => {
                    handleClick(icon);
                  }}
                  key={icon}
                  className="md:my-4 my-3 transition-all hover:opacity-50 mx-6 md:mx-10"
                >
                  {StringToIcon(icon)}
                </div>
              ))
            ) : (
              <>
                <div className=" rounded-lg  p-2 mx-3 ">
                <div className='flex justify-center text-base'> <IoFlash /></div>
                <p className='text-xs  text-center'>  Generieren</p>
                </div>
                {filteredIcons.map((icon) => (
                  <div
                    onClick={() => {
                      handleClick(icon);
                    }}
                    key={icon}
                    className="md:my-4 my-3 transition-all hover:opacity-50 mx-6 md:mx-10"
                  >
                    {StringToIcon(icon)}
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      }
    />
  );
};

export default IconOptions;
