import { Entity, useEntities } from '@leanscope/ecs-engine';
import React from 'react';
import { ChildFacet, TypeFacet } from '../app/BlockFacets';
import { BlockTypes } from '../base/Constants';
import TextBlock from './Blocks/TextBlock';
import ErrorBlock from './Blocks/ErrorBlock';

interface ComponentRendererProps {
  blockEntities: readonly Entity[];
}

const ComponentRenderer: React.FC<ComponentRendererProps> = ({ blockEntities }) => {
  return blockEntities.map((blockEntity) =>
    blockEntity?.get(TypeFacet)?.props.type == BlockTypes.TEXT ? (
      <TextBlock blockEntity={blockEntity} />
    ) : (
      <ErrorBlock />
    ),
  );
};

export default ComponentRenderer;
