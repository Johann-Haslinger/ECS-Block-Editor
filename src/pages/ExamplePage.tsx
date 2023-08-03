import React, { useContext } from 'react';
import BlockEditor from './BlockEditor';
import { ECSContext, Entity, useAnimationFrame, useEntities } from '@leanscope/ecs-engine';
import { ParentFacet, TextFacet, TypeFacet } from '../app/BlockFacets';

const ExamplePage = () => {
  const ecs = useContext(ECSContext);
  const [blockEntities] = useEntities((e: Entity) => e.has(TypeFacet));
  const filteredBlocks = blockEntities.filter((item) => item.get(ParentFacet)?.props.parentId == "1");

  useAnimationFrame((dt: number) => {
    ecs.engine.update(dt);
  });

  return (
    <div className="fixed w-screen h-screen  overflow-y-hidden">
      <BlockEditor blockEntities={filteredBlocks} header={'ECS Block Editor'} />
    </div>
  );
};

export default ExamplePage;
