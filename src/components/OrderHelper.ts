import { Entity } from '@leanscope/ecs-engine';
import { OrderFacet } from '@leanscope/ecs-models';

export const getNextHigherOrder = (order: number, blockEntities: readonly Entity[]) => {
  const sortedEntities = blockEntities.slice().sort((a, b) => {
    const orderA = a.get(OrderFacet)?.props.index || 0;
    const orderB = b.get(OrderFacet)?.props.index || 0;
    return orderA - orderB;
  });

  for (let entity of sortedEntities) {
    const entityOrder = entity.get(OrderFacet)?.props.index;
    if (entityOrder && entityOrder > order) {
      return entityOrder;
    }
  }

  return null; // Wenn keine höhere Zahl gefunden wurde
};

export const getNextLowerOrder = (order: number, blockEntities: readonly Entity[]) => {
  const sortedEntities = blockEntities.slice().sort((a, b) => {
    const orderA = a.get(OrderFacet)?.props.index || 0;
    const orderB = b.get(OrderFacet)?.props.index || 0;
    return orderA - orderB;
  });

  let lowerOrder = null;

  for (let entity of sortedEntities) {
    const entityOrder = entity.get(OrderFacet)?.props.index;
    if (entityOrder && entityOrder < order) {
      lowerOrder = entityOrder;
    } else {
      // Since the entities are sorted, once we encounter an entity with order greater or equal to the desired order, we can break the loop.
      break;
    }
  }

  return lowerOrder;
};


export const getNextLowerOrderEntity = (order: number, blockEntities: readonly Entity[]) => {
  const sortedEntities = blockEntities.slice().sort((a, b) => {
    const orderA = a.get(OrderFacet)?.props.index || 0;
    const orderB = b.get(OrderFacet)?.props.index || 0;
    return orderA - orderB;
  });

  for (let i = sortedEntities.length - 1; i >= 0; i--) {
    const entityOrder = sortedEntities[i].get(OrderFacet)?.props.index;
    console.log('getNextLowerOrderEntity(order)', order, entityOrder);
    if (entityOrder && entityOrder < order) {
      return sortedEntities[i];
    }
  }

  return null; // Wenn keine passende BlockEntity gefunden wurde
};

export const getNextHigherOrderEntity = (order: number, blockEntities: readonly Entity[]) => {
  const sortedEntities = blockEntities.slice().sort((a, b) => {
    const orderA = a.get(OrderFacet)?.props.index || 0;
    const orderB = b.get(OrderFacet)?.props.index || 0;
    return orderA - orderB;
  });

  for (let i = 0; i < sortedEntities.length; i++) {
    const entityOrder = sortedEntities[i].get(OrderFacet)?.props.index;
    console.log('getNextHigherOrderEntity(order)', order, entityOrder);
    if (entityOrder && entityOrder > order) {
      return sortedEntities[i];
    }
  }

  return null; // Wenn keine passende BlockEntity gefunden wurde
};

export const findNumberBetween = (num1: number, num2: number): number => (num1 + num2) / 2;

export const getHighestOrder = ( blockEntities: readonly Entity[]) => {
  const sortedEntities = blockEntities.slice().sort((a, b) => {
    const orderA = a.get(OrderFacet)?.props.index || 0;
    const orderB = b.get(OrderFacet)?.props.index || 0;
    return orderA - orderB;
  });
  let highestOrder = sortedEntities[sortedEntities.length - 1].get(OrderFacet)?.props.index;

  return highestOrder;
};
