import { Entity } from '@leanscope/ecs-engine';
import React from 'react';

interface StyleOptionsProps {
  pressedBlockEntities: readonly Entity[];
}
const StyleOptions: React.FC<StyleOptionsProps> = ({pressedBlockEntities}) => {
  return (
    <div>
      <button>Karte</button>
    </div>
  );
};

export default StyleOptions;