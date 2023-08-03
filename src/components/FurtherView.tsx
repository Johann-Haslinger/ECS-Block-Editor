import {
  Entity,
  useEntities,
  useEntityClassAndTagComponents,
  useEntityComponents,
  useEntityHasTags,
} from '@leanscope/ecs-engine';
import React from 'react';
import { FurtherFacet, IdFacet, ParentFacet, TextFacet, TypeFacet } from '../app/BlockFacets';
import FurtherViewOutline from './StyleLibary/FurtherViewOutline';
import BlockEditor from '../pages/BlockEditor';
import { Tags } from '../base/Constants';

interface FurtherViewProps {
  blockEntity: Entity;
}

const FurtherView: React.FC<FurtherViewProps> = ({ blockEntity }) => {
  const [idFacet, textFacet] = useEntityComponents(blockEntity, IdFacet, TextFacet);
  const id = idFacet.props.id;
  const text = textFacet.props.text
  const [blockEntities] = useEntities((e: Entity) => e.has(TypeFacet));
  const filteredBlocks = blockEntities.filter(
    (item) => item.get(ParentFacet)?.props.parentId == id,
  );

  return (
    <FurtherViewOutline
      backfunc={() => {
        blockEntity.addComponent(new FurtherFacet({ isGoingFurther: false }));
      }}
      content={<BlockEditor blockEntities={filteredBlocks} header={text} />}
    />
  );
};

export default FurtherView;
