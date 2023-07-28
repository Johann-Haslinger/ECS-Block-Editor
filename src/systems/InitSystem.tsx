import { useContext, useEffect, useState } from "react";
import {
  GameStateFacet,
  GameStates,
  PositionFacet,
  HealthFacet,
  NameFacet,
  ValueFacet,
  VisibilityFacet,
} from "../app/GameFacets";
import { Tags } from "../base/Constants";
import { ECSContext, Entity, System } from "@leanscope/ecs-engine";

const InitSystem = () => {
  const ecs = useContext(ECSContext);

  useEffect(() => {
    console.log("app init");
    ecs.engine.clear();

    // ------ Items ------

    // Apple
    const blockEntity = new Entity();
    ecs.engine.addEntity(blockEntity);
    blockEntity.addComponent(new NameFacet({ name: "Items.APPLE "}));
 


    return () => {
      ecs.engine.removeEntity(blockEntity);
    };
  }, []);

  const [blacklistedIdentifiableSystems] = useState();

  return <></>;
};

export default InitSystem;
