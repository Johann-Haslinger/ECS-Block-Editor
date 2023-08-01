import { Entity } from '@leanscope/ecs-engine';
import React from 'react';
import { TypeFacet } from '../../../app/BlockFacets';
import { BlockTypes } from '../../../base/Constants';

interface StyleOptionsProps {
  pressedBlockEntities: readonly Entity[];
}
const StyleOptions: React.FC<StyleOptionsProps> = ({pressedBlockEntities}) => {

  return (
    <div>
      <button onClick={()=>{pressedBlockEntities[0].addComponent(new TypeFacet({ type: BlockTypes.TEXT }))}}>Karte</button>
    </div>
  );
};

export default StyleOptions;
