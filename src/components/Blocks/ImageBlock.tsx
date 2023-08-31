import { Entity, useEntityComponents } from '@leanscope/ecs-engine';
import React, { useEffect, useState } from 'react';
import BlockOutline from './BlockOutline';


import ImageView from '../BlockComponents/ImageBlock/ImageView';
import { Base64Facet, SizeFacet, SizeTypes, FitTypes, ImageSizeFacet, ImageFacet, ImageFitFacet } from '@leanscope/ecs-models';

interface ImageBlockProps {
  blockEntity: Entity;
  blockEditorEntity: Entity
}

const ImageBlock: React.FC<ImageBlockProps> = ({ blockEntity , blockEditorEntity}) => {
  const [base64Facet] = useEntityComponents(blockEntity, Base64Facet);
  const [sizeFacet, fitFacet] = useEntityComponents(blockEntity, ImageSizeFacet, ImageFitFacet);
  const [imageUrl, setImageUrl] = useState<string>('');
  const url = base64Facet?.props.data || "";
  const size = sizeFacet?.props.size;
  const fit = fitFacet?.props.fit;
  const [isImageViewVisible, setIsImageViewVisble] = useState(false);

  useEffect(() => {
    if (url.startsWith('blob:')) {
      fetch(url)
        .then((response) => response.blob())
        .then((blob) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64data = reader.result;
            if (typeof base64data === 'string') {
              setImageUrl(base64data);
            }
          };
          reader.readAsDataURL(blob);
        })
        .catch((error) => {
          console.error('Failed to convert Blob URL to Base64:', error);
          setImageUrl('');
        });
    } else {
      setImageUrl(url);
    }
  }, [url]);

  return (
    <>
      <BlockOutline
      blockEditorEntity={blockEditorEntity}
      onClick={() => {setIsImageViewVisble(true)}}
        blockEntity={blockEntity}
        content={
          <>
            {imageUrl ? (
              <div
                
                className="w-full rounded-lg  bg-[#f2f2f45f] flex justify-center"
              >
                <img
                  src={imageUrl}
                  className={
                    size == SizeTypes.AUTO_SIZE && fit == FitTypes.COVER
                      ? 'md:max-h-96 max-h-56 object-cover w-full  rounded-lg'
                      : size == SizeTypes.AUTO_SIZE
                      ? 'md:max-h-96  max-h-56 rounded-lg'
                      : size == SizeTypes.LARGE
                      ? 'w-full rounded-lg h-full '
                      : ''
                  }
                />
              </div>
            ) : (
              <div>Failed to load image</div>
            )}
          </>
        }
      />
      {isImageViewVisible && (
        <ImageView
          url={url}
          backfunc={() => {
            setIsImageViewVisble(false);
          }}
        />
      )}
      
    </>
  );
};

export default ImageBlock;
