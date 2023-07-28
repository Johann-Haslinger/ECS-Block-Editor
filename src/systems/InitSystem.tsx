import { useContext, useEffect, useState } from 'react';
import { ChildFacet, TextFacet, TypeFacet } from '../app/BlockFacets';
import { BlockTypes, Tags } from '../base/Constants';
import { ECSContext, Entity, System } from '@leanscope/ecs-engine';

const InitSystem = () => {
  const ecs = useContext(ECSContext);

  useEffect(() => {
    console.log('app init');
    ecs.engine.clear();

    const blockEntity = new Entity();
    ecs.engine.addEntity(blockEntity);
    blockEntity.addComponent(new TextFacet({ text: 'Toller Text' }));
    blockEntity.addComponent(new ChildFacet({ childOf: 'Block Editor' }));
    blockEntity.addComponent(new TypeFacet({ type: BlockTypes.TEXT }));

    const blockEditor = new Entity();
    ecs.engine.addEntity(blockEditor);

    return () => {
      ecs.engine.removeEntity(blockEntity);
      ecs.engine.removeEntity(blockEditor);
    };
  }, []);

  const [blacklistedIdentifiableSystems] = useState();

  return <></>;
};

export default InitSystem;
