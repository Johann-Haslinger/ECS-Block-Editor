import {
  Entity,
  useEntities,
  useEntityClassAndTagComponents,
  useEntityComponents,
  useEntityHasTags,
} from '@leanscope/ecs-engine';
import React from 'react';

import FurtherViewOutline from './StyleLibary/FurtherViewOutline';
import BlockEditor from '../pages/BlockEditor';
import { Tags } from '../base/Constants';
import { TextFacet, TypeFacet, ParentFacet, FurtherFacet, IdentifierFacet } from '@leanscope/ecs-models';

interface FurtherViewProps {
  blockEntity: Entity;
  backfunc: () => void;
}

const FurtherView: React.FC<FurtherViewProps> = ({ blockEntity, backfunc }) => {
  const [identifierFacet, textFacet] = useEntityComponents(blockEntity, IdentifierFacet, TextFacet);
  const id = identifierFacet?.props.guid;
  const text = textFacet?.props.text;
  const [blockEntities] = useEntities((e: Entity) => e.has(TypeFacet));
  const filteredBlocks = blockEntities.filter(
    (item) => item.get(ParentFacet)?.props.parentId == id,
  );

  return (
    <FurtherViewOutline
      backfunc={() => {
        blockEntity.addComponent(new FurtherFacet({ isGoingFurther: false }));
        backfunc();
      }}
      content={
        <BlockEditor
          setHeader={(header) => {
            blockEntity.add(new TextFacet({ text: header }));
            console.log("header", header)
          }}
          parentId={blockEntity.get(IdentifierFacet)?.props.guid || '1'}
          blockEntities={filteredBlocks}
          header={text || "Fehler"}
        />
      }
    />
  );
};

export default FurtherView;
