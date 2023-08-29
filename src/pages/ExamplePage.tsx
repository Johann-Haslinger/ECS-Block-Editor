import React, { useContext } from 'react';
import BlockEditor from './BlockEditor';
import { ECSContext, Entity, useAnimationFrame, useEntities } from '@leanscope/ecs-engine';
import { ParentFacet, TextFacet, TypeFacet } from '../app/BlockFacets';

const ExamplePage = () => {
  const ecs = useContext(ECSContext);
  const parentId = '1';
  const [blockEntities] = useEntities((e: Entity) => e.has(TypeFacet));
  const filteredBlocks = blockEntities.filter(
    (item) => item.get(ParentFacet)?.props.parentId == parentId,
  );

  useAnimationFrame((dt: number) => {
    ecs.engine.update(dt);
  });

  return (
    <div className="fixed w-screen h-screen  overflow-y-hidden">
      <BlockEditor
        parentId={parentId}
        blockEntities={filteredBlocks}
        header={'ECS Block Editor'}
        setHeader={function (newHeader: string): void {
          console.log(newHeader);
          throw new Error('Function not implemented.');
        }}
      />
    </div>
  );
};

export default ExamplePage;
