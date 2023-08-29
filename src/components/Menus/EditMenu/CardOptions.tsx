import React, { SetStateAction, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { IoDocument, IoFlower, IoReader, IoSettings, IoStar } from 'react-icons/io5';
import { EntityProps } from '@leanscope/ecs-engine/react-api/classes/EntityProps';
import { Entity, useEntities, useEntityComponents } from '@leanscope/ecs-engine';
import { BlockTypes, StyleTypes, Tags } from '../../../base/Constants';
import {
  ColorFacet,
  DescriptionFacet,
  IconFacet,
  IsSmallBlockFacet,
  SrcFacet,
  TypeFacet,
} from '../../../app/BlockFacets';
import ColorOptions from './ColorOptions';
import IconOptions from './IconOptions';

interface TypeOptionProps {
  changeType: () => void;
  currentType: any;
  type: any;
  customTextStyle?: any;
}

const TypeOption: React.FC<TypeOptionProps> = ({
  changeType,
  currentType,
  type,
  customTextStyle,
}) => {
  return (
    <div
      onClick={changeType}
      style={{ ...customTextStyle }}
      className={` py-2 items-center rounded-lg px-4 w-full flex border justify-center ${
        currentType == type ? 'text-blue  bg-blue-light border-blue' : ' border-white'
      } ${customTextStyle ? '' : 'text-sm '} `}
    >
      {type}
    </div>
  );
};

interface StyleOptionsProps {
  styleType: StyleTypes;
  getCurrentStyleType: () => StyleTypes | undefined;
}

const StyleOption: React.FC<StyleOptionsProps> = ({ styleType, getCurrentStyleType }) => {
  const [pressedBlockEntities] = useEntities((e) => e.hasTag(Tags.PRESSED));
  const [currentStyleType, setCurrentStyleType] = useState(getCurrentStyleType());

  useEffect(() => {
    setCurrentStyleType(getCurrentStyleType());
  }, []);

  return (
    <TypeOption
      changeType={() => {
        addstyle(styleType, currentStyleType, pressedBlockEntities, setCurrentStyleType);
      }}
      type={styleType}
      currentType={currentStyleType}
    />
  );
};

const addstyle = (
  styleType: StyleTypes,
  currentStyleType: StyleTypes | undefined,
  pressedBlockEntities: readonly Entity[],
  setCurrentStyleType: React.Dispatch<SetStateAction<StyleTypes | undefined>>,
) => {
  pressedBlockEntities.map((block) => {
    switch (styleType) {
      case StyleTypes.DESCRIPTION:
        if (styleType === currentStyleType) {
          block.remove(DescriptionFacet);
          block.add(new TypeFacet({ type: BlockTypes.CARD }));
          setCurrentStyleType(undefined);
        } else {
          block.add(new DescriptionFacet({ description: 'Beschreibung' }));
          block.add(new TypeFacet({ type: BlockTypes.MORE_INFORMATIONS }));
          block.add(new IconFacet({ icon: <IoReader /> }));
          setCurrentStyleType(StyleTypes.DESCRIPTION);
        }
        break;
      case StyleTypes.LARGE:
        if (styleType === currentStyleType) {
          block.remove(IsSmallBlockFacet);
          setCurrentStyleType(undefined);
        } else {
          block.add(new IsSmallBlockFacet({ isSmall: true }));
          setCurrentStyleType(StyleTypes.LARGE);
        }
        break;
      case StyleTypes.BLOCK:
        if (styleType === currentStyleType) {
          block.removeTag(StyleTypes.BLOCK);
          setCurrentStyleType(undefined);
        } else {
          block.add(StyleTypes.BLOCK);
          setCurrentStyleType(StyleTypes.BLOCK);
        }
        break;
    }
  });
};

const CardOptions = () => {
  const [pressedBlockEntities] = useEntities((e) => e.hasTag(Tags.PRESSED));
  const [isColorOptionsVisible, setIsColorOptionsVisible] = useState(false);
  const [isIconOptionsVisible, setIsIconOptionsVisible] = useState(false);
  const [hasSrcFacet, setHasSrcFacet] = useState(false);
  
  const [srcFacet] = useEntityComponents(pressedBlockEntities[0], SrcFacet  )
  const [isSelectingImageSrc, setIsSelectingImageSrc] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const src = srcFacet.props.src

  useEffect(() => {
    if (isSelectingImageSrc && fileInputRef.current !== null) {
      fileInputRef.current.click();
    }
  }, [isSelectingImageSrc]);

  const handleImageSelect = (event: any) => {
    const selectedFile = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      const base64data = reader.result;
      if (typeof base64data == 'string') {
        pressedBlockEntities.map((block) => {
          block.add(new SrcFacet({ src: base64data }));
        });
      }
    };

    reader.readAsDataURL(selectedFile);
    setIsSelectingImageSrc(false);
    return '';
  };

  const openFilePicker = () => {
    setIsSelectingImageSrc(true);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const getCurrentColor = () => {
    let currentColor: string | undefined = '';
    pressedBlockEntities.map((block) => {
      if (currentColor == '') {
        currentColor = block.get(ColorFacet)?.props.color;
      } // else {
      //   currentColor = "#ffffff"
      // }
    });

    return currentColor;
  };

  return (
    <>
      <div className="flex  w-full  overflow-x-scroll  h-16 my-1 items-center justify-between px-3  ">
        <StyleOption
          getCurrentStyleType={() => {
            let currentType: undefined | StyleTypes = undefined;

            pressedBlockEntities.map((block) => {
              if (block.get(DescriptionFacet)?.props.description !== undefined) {
                currentType = StyleTypes.DESCRIPTION;
              }
            });
            return currentType;
          }}
          styleType={StyleTypes.DESCRIPTION}
        />
        <StyleOption
          getCurrentStyleType={() => {
            let currentType: undefined | StyleTypes = StyleTypes.LARGE;

            pressedBlockEntities.map((block) => {
              if (block.get(IsSmallBlockFacet)?.props.isSmall) {
                currentType = undefined;
              }
            });
            return currentType;
          }}
          styleType={StyleTypes.LARGE}
        />
        <StyleOption
          getCurrentStyleType={() => {
            let styleType: StyleTypes | undefined = undefined;

            pressedBlockEntities.map((entity) => {
              if (entity.hasTag(StyleTypes.BLOCK)) {
                styleType = StyleTypes.BLOCK;
                console.log('StyleType');
              }
            });
            return styleType;
          }}
          styleType={StyleTypes.BLOCK}
        />
      </div>
      <div className="flex w-full   space-x-2 overflow-x-scroll  py-4 border-t  border-[rgb(245,245,245)]  justify-between   ">
        <div
          onClick={() => {
            setIsColorOptionsVisible(true);
          }}
          style={{ backgroundColor: getCurrentColor() }}
          className=" py-2 items-center border border-white text-white  rounded-lg px-4 w-full flex  justify-center "
        >
          Farbe
        </div>
        <div
          onClick={() => {
            if (pressedBlockEntities[0].get(SrcFacet)?.props.src) {
              pressedBlockEntities.map((block) => {
                block.remove(SrcFacet);
              });
            } else {
              openFilePicker();
            }
          }}
          className={`py-2 items-center border  px-4 w-full flex  rounded-lg justify-center ${
            src ? 'text-white' : ' border-white'
          } `}
          style={{
            backgroundImage:
            src &&
              `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url(${
                src
              })`,
            backgroundSize: 'cover',
          }}
        >
          Bild
        </div>
        <div
          onClick={() => {
            setIsIconOptionsVisible(true);
          }}
          className={`py-2 items-center border  px-4 w-full flex  rounded-lg justify-center ${
            pressedBlockEntities[0] && pressedBlockEntities[0].get(IconFacet)?.props.icon
              ? 'border-blue bg-blue-light text-blue'
              : ' border-white'
          } `}
        >
          Icon
        </div>
      </div>

      {isColorOptionsVisible && (
        <ColorOptions
          isVisible={isColorOptionsVisible}
          toggleIsVisible={() => {
            setIsColorOptionsVisible(!isColorOptionsVisible);
          }}
        />
      )}
      {isIconOptionsVisible && (
        <IconOptions
          isVisible={isIconOptionsVisible}
          toggleIsVisible={() => {
            setIsIconOptionsVisible(!isIconOptionsVisible);
          }}
        />
      )}
      {isSelectingImageSrc && (
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageSelect}
          style={{ display: 'none' }}
        />
      )}
    </>
  );
};

export default CardOptions;
