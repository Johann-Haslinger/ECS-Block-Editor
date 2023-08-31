import React, { useEffect, useState } from 'react';
import {
  IoCropOutline,
  IoCutOutline,
  IoMoveOutline,
  IoScanOutline,
  IoSquareOutline,
} from 'react-icons/io5';

import { Entity, useEntities } from '@leanscope/ecs-engine';
import { useStateContext } from '../../../contexts/ContextProvider';
import {  FitTypes, SizeTypes, SizeFacet, TypeFacet, BlockTypes, ImageSizeFacet, ImageFitFacet } from '@leanscope/ecs-models';
import { Tags } from '../../../base/Constants';



const LayoutOptionButton = ({
  isActive,
  onClick,
  icon,
  label,
}: {
  isActive: boolean;
  onClick: () => void;
  icon: React.ReactElement;
  label: string;
}) => (
  <div
    onClick={onClick}
    className={`text-sm ${
      isActive ? 'bg-[rgb(225,241,254)] text-blue' : 'bg-input-white-bg text-deaktive'
    } pt-4 rounded-md border ${isActive ? 'border-blue' : 'border-white'} w-1/2 py-2 px-4`}
  >
    {React.cloneElement(icon, { className: 'text-2xl w-full text-center mb-2' })}
    <p className="w-full text-center">{label}</p>
  </div>
);

const LayoutOptions = () => {
  const [pressedBlockEntities] = useEntities((e) => e.hasTag(Tags.PRESSED));
  const [currentFit, setCurrentFit] = useState<FitTypes | undefined>(undefined);
  const [currentSize, setCurrentSize] = useState<SizeTypes | undefined>(undefined);

  const changeSize = (size: SizeTypes) => {
    pressedBlockEntities.forEach((block) => {
      block.addComponent(new ImageSizeFacet({size: size }));
    });
    setCurrentSize(size)
  };
  
  const changeFit = (fit: FitTypes) => {
    pressedBlockEntities.forEach((block) => {
      block.addComponent(new ImageFitFacet({ fit: fit }));
    });
    setCurrentFit(fit)
  };

  useEffect(() => {
    pressedBlockEntities.map((block) => {
      if (block.get(TypeFacet)?.props.type === BlockTypes.IMAGE) {
        setCurrentFit(block.get(ImageFitFacet)?.props.fit);
        setCurrentSize(block.get(ImageSizeFacet)?.props.size);
      }
    });
  }, [pressedBlockEntities]);

  return (
    <div className="flex w-full pt-5 justify-between">
      <div className="w-1/2">
        <p className="text-sm w-full text-center text-deaktive">Bild Anpassen</p>
        <div className="flex w-full pt-4 px-3">
          <LayoutOptionButton
            isActive={currentFit === FitTypes.AUTO_FIT}
            onClick={() => changeFit(FitTypes.AUTO_FIT)}
            icon={<IoScanOutline />}
            label="Anpassen"
          />
          <LayoutOptionButton
            isActive={currentFit === FitTypes.COVER}
            onClick={() => changeFit(FitTypes.COVER)}
            icon={<IoMoveOutline />}
            label="Füllen"
          />
        </div>
      </div>
      <div className="w-1/2">
        <p className="text-sm w-full text-center text-deaktive">Bildgröße</p>
        <div className="flex w-full pt-4 px-3">
          <LayoutOptionButton
            isActive={currentSize === SizeTypes.AUTO_SIZE}
            onClick={() => changeSize(SizeTypes.AUTO_SIZE)}
            icon={<IoCropOutline />}
            label="Auto"
          />
          <LayoutOptionButton
            isActive={currentSize === SizeTypes.LARGE}
            onClick={() => changeSize(SizeTypes.LARGE)}
            icon={<IoSquareOutline />}
            label="Groß"
          />
        </div>
      </div>
    </div>
  );
};

export default LayoutOptions;
