import React, { useContext } from 'react';
import BlockEditor from './BlockEditor';
import { ECSContext, Entity, useAnimationFrame, useEntities } from '@leanscope/ecs-engine';
import { TextFacet } from '../app/BlockFacets';

const ExamplePage = () => {
  const ecs = useContext(ECSContext);
  const [blocks] = useEntities((e: Entity) => e.has(TextFacet));

  useAnimationFrame((dt: number) => {
    ecs.engine.update(dt);
  });

  return (
    <div className="fixed w-screen h-screen  overflow-y-hidden">
      <BlockEditor blockEntities={blocks} header={''} />
    </div>
  );
};

export default ExamplePage;
