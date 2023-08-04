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
import {
  FurtherFacet,
  IdFacet,
  IsEditingFacet,
  IsFocusedFacet,
  IsPressedFacet,
  TextFacet,
  TodoFacet,
} from '../../app/BlockFacets';
import { Tags } from '../../base/Constants';
import FurtherView from '../FurtherView';

interface BlockOutlineProps {
  content: ReactNode;
  blockEntity: Entity;
  isFocused?: boolean;
  onClick?: () => void;
}

const BlockOutline: React.FC<BlockOutlineProps> = ({ content, blockEntity, onClick }) => {
  const [isPressed] = useEntityHasTags(blockEntity, Tags.PRESSED);
  // console.log(tag)
  // const isPressed = blockEntity?.hasTag(Tags.PRESSED);
  const [blockEditorEntities] = useEntities((e: Entity) => e.has(IsEditingFacet));
  const blockEditorEntity = blockEditorEntities[0];
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const textBlockRef = useRef<HTMLDivElement | null>(null);
  const [startX, setStartX] = useState<number | null>(null);
  const [translateX, setTranslateX] = useState<number>(0);
  const [isSwiping, setIsSwiping] = useState<boolean>(false);
  const [isEditingFacet] = useEntityComponents(blockEditorEntity, IsEditingFacet);
  const [todoFacet] = useEntityComponents(blockEntity, TodoFacet);
  const [furtherFacet] = useEntityComponents(blockEntity, FurtherFacet);
  const isFurtherViewVisible = furtherFacet.props.isGoingFurther;
  const isEditing = isEditingFacet.props.isEditing;
  const todoState = todoFacet.props.state;

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
    blockEditorEntity?.addComponent(new IsEditingFacet({ isEditing: true }));
    blockEditorEntity.removeTag(Tags.IS_CREATEMENU_VISIBLE)
    console.log('activ');
    if (!isPressed) {
      blockEntity.addTag(Tags.PRESSED);
    } else {
      blockEntity.removeTag(Tags.PRESSED);
    }
    blockEntity.addComponent(new IsFocusedFacet({ isFocused: false }));
  };

  const handleMouseDown = () => {
    if (isEditing) {
      toggleActivePressed();
    } else {
      if (onClick) {
        onClick();
      }
      timeoutRef.current = setTimeout(() => {
        toggleActivePressed();
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
      toggleActivePressed();
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
            ? 'bg-[rgb(225,241,254)] w-full z-40 select-none rounded-md p-2  md:mb-1 mb-0.5'
            : 'w-full p-2  md:mb-1 mb-0.5 border-white'
        }`}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        ref={textBlockRef}
        style={transitionStyle}
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
      {isFurtherViewVisible && <FurtherView blockEntity={blockEntity} />}
    </>
  );
};

export default BlockOutline;
