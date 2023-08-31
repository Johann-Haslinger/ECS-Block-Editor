import {
  Entity,
  useEntities,
  useEntity,
  useEntityComponents,
  useEntityHasTags,
  useEntityProps,
} from '@leanscope/ecs-engine';
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { IoCheckmarkCircle, IoEllipseOutline } from 'react-icons/io5';

import FurtherView from '../FurtherView';
import { StyleTypes, Tags } from '../../base/Constants';
import {
  TodoFacet,
  FurtherFacet,
  ColorFacet,
  TypeFacet,
  BlockTypes,
  ParentFacet,
} from '@leanscope/ecs-models';

interface BlockOutlineProps {
  content: ReactNode;
  blockEntity: Entity;
  isFocused?: boolean;
  onClick?: () => void;
  blockEditorEntity: Entity
}

const BlockOutline: React.FC<BlockOutlineProps> = ({ content, blockEntity, onClick, blockEditorEntity }) => {
  const [isPressed, isFocused] = useEntityHasTags(blockEntity, Tags.PRESSED, Tags.FOCUSED);
  // console.log(tag)
  // const isPressed = blockEntity?.hasTag(Tags.PRESSED);
 
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const textBlockRef = useRef<HTMLDivElement | null>(null);
  const [startX, setStartX] = useState<number | null>(null);
  const [translateX, setTranslateX] = useState<number>(0);
  const [isSwiping, setIsSwiping] = useState<boolean>(false);
  const [todoFacet] = useEntityComponents(blockEntity, TodoFacet);
  const [furtherFacet] = useEntityComponents(blockEntity, FurtherFacet);
  const isFurtherViewVisible = furtherFacet?.props.isGoingFurther;
  const [isEditing] = useEntityHasTags(blockEditorEntity, Tags.IS_EDITING);
  const todoState = todoFacet?.props.state;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (textBlockRef.current && !textBlockRef.current.contains(event.target as Node)) {
        setTranslateX(0);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [textBlockRef]);

  useEffect(() => {
    if (!isEditing) {
      blockEntity.removeTag(Tags.PRESSED);
    }
  }, [isEditing]);

  const toggleActivePressed = () => {
    if (!isFocused) {
      blockEditorEntity?.addTag(Tags.IS_EDITING);
      blockEditorEntity.removeTag(Tags.IS_CREATEMENU_VISIBLE);

      if (!isPressed) {
        blockEntity.addTag(Tags.PRESSED);
      } else {
        blockEntity.removeTag(Tags.PRESSED);
      }
      // blockEntity.addTag(Tags.FOCUSED);
    }
  };
  const handleMouseDown = () => {
    if (isEditing) {
      toggleActivePressed();
    } else {
      if (onClick) {
        onClick();
      }
      timeoutRef.current = setTimeout(() => {
        if (!isFocused) {
          toggleActivePressed();
        }
      }, 500);
    }
  };

  const handleMouseUp = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0];
    setStartX(touch.clientX);
    timeoutRef.current = setTimeout(() => {
      if (!isFocused) {
        toggleActivePressed();
      }
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
    }, 500);
  };

  const handleTouchEnd = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setStartX(null);
    setIsSwiping(false);
    setTranslateX(0);
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (startX !== null) {
      const touch = event.touches[0];
      const deltaX = touch.clientX - startX;
      setTranslateX(deltaX);

      if (deltaX > 50 || deltaX < -50) {
        // set pressed to true if moved 50px in either direction
        if (!isSwiping) {
          toggleActivePressed();
        }
        setIsSwiping(true);
      } else {
        // set pressed to false if already pressed
      }
    }
  };

  const transitionStyle: React.CSSProperties = {
    transition: 'transform 0.1s ease-out',
    transform: `translateX(${translateX}px)`,
  };

  return (
    <>
      <div
        className={`${
          isPressed
            ? blockEntity.hasTag(StyleTypes.BLOCK)
              ? 'bg-[rgb(225,241,254)] w-full z-40 select-none  p-2  '
              : 'bg-[rgb(225,241,254)] w-full z-40 select-none rounded-md p-2  md:mb-1 mb-0.5'
            : 'w-full p-2  border-white'
        } ${blockEntity.hasTag(StyleTypes.BLOCK) ? 'p-4 ' : 'md:mb-1 mb-0.5'}`}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        ref={textBlockRef}
        style={{
          backgroundColor: blockEntity.hasTag(StyleTypes.BLOCK)
            ? blockEntity.get(ColorFacet)?.props.colorName
              ? blockEntity.get(ColorFacet)?.props.colorName
              : 'rgb(250, 250, 250)'
            : '',

          color: blockEntity.hasTag(StyleTypes.BLOCK)
            ? blockEntity.get(TypeFacet)?.props.type === BlockTypes.CARD ||
              blockEntity.get(TypeFacet)?.props.type === BlockTypes.MORE_INFORMATIONS
              ? 'white'
              : ''
            : '',
          ...transitionStyle,
        }}
      >
        <div className="w-full  flex h-full relative">
          {todoState === 1 ? (
            <div
              onClick={() => {
                if (!isEditing) {
                  blockEntity.addComponent(new TodoFacet({ state: 2 }));
                }
              }}
              className="h-full flex items-center  text-xl pr-2 py-0.5 text-[rgb(212,212,212)]"
            >
              <IoEllipseOutline />
            </div>
          ) : todoState === 2 ? (
            <div
              onClick={() => {
                if (!isEditing) {
                  blockEntity.addComponent(new TodoFacet({ state: 1 }));
                }
              }}
              className="h-full flex items-center  text-xl pr-2 py-0.5 text-blue"
            >
              <IoCheckmarkCircle />
            </div>
          ) : blockEntity.hasTag(StyleTypes.LIST) ? (
            <div className=" p-2.5  ">
              <div className="w-1.5 h-1.5 rounded-full bg-black" />
            </div>
          ) : (
            <></>
          )}

          {content}
          <div
            className={`${
              isEditing
                ? 'w-6 h-full flex items-center absolute top-0 right-0'
                : 'invisible h-full items-center absolute top-0 right-0'
            }`}
          >
            <div
              className={`${
                isPressed
                  ? 'w-3 h-3 select-none rounded-full bg-blue'
                  : 'w-3 h-3 select-none rounded-full border border-[rgb(212,212,212)]'
              }`}
            ></div>
          </div>
        </div>
      </div>
      {isFurtherViewVisible && (
        <FurtherView
          backfunc={() => {
            blockEditorEntity.add(
              new ParentFacet({ parentId: blockEntity.get(ParentFacet)?.props.parentId || '1' }),
            );
          }}
          blockEntity={blockEntity}
        />
      )}
    </>
  );
};

export default BlockOutline;
