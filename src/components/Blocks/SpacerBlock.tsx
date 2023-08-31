import { Entity } from '@leanscope/ecs-engine'
import React from 'react'
import BlockOutline from './BlockOutline'

interface SpacerBlockProps{
    blockEntity: Entity
    blockEditorEntity: Entity
}
const SpacerBlock: React.FC<SpacerBlockProps> = ({blockEntity, blockEditorEntity}) => {
  // <div className="w-full border-b border-b-[rgb(245,245,245)]  h-1" />
  return (
    <BlockOutline blockEditorEntity={blockEditorEntity} content={    <div className="h-[0.1rem] my-3 rounded-full w-full  bg-bg" ></div>} blockEntity={blockEntity}/>
  )
}

export default SpacerBlock