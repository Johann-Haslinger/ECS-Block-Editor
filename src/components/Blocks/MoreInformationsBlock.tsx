import { Entity } from '@leanscope/ecs-engine';
import React from 'react';
import BlockOutline from './BlockOutline';
import { IoAccessibility, IoChevronForward, IoCode } from 'react-icons/io5';

interface MoreInformationsBlockProps {
  blockEntity: Entity;
}
const MoreInformationsBlock: React.FC<MoreInformationsBlockProps> = ({ blockEntity }) => {
  const block = {
    name: 'Programmierung',
    description:
      'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat.',
    icon: <IoCode />,
    color: '#608AFF',
  };
  return (
    <BlockOutline
      blockEntity={blockEntity}
      content={
        <div className="  md:hover:scale-105 transition-all   w-full ">
          <div
            style={{ backgroundColor: block.color }}
            className="p-4 opacity-60 text-white text-4xl h-40 rounded-lg"
          />
          <div
            style={{ color: block.color }}
            className="flex justify-center text-6xl relative bottom-28 mt-0.5"
          >
            {block.icon}
          </div>
          <div className=" relative bottom-10 pb-6 ">
            <p className="lg:text-xl font-semibold">{block.name}</p>
            <p className="text-sm md:text-base ">{block.description}</p>
            <div className="mt-2  text-blue flex text-sm md:text-base">
              <p className="border-b-2 border-opacity-0 hover:border-opacity-100 border-blue ">
                Mehr
              </p>
              <IoChevronForward className="mt-1 ml-1" />
            </div>
          </div>
        </div>
      }
    />
  );
};

export default MoreInformationsBlock;
