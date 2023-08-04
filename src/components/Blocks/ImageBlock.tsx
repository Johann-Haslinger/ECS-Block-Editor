import { Entity, useEntityComponents } from '@leanscope/ecs-engine';
import React, { useEffect, useState } from 'react';
import BlockOutline from './BlockOutline';
import { FitFacet, SizeFacet, SrcFacet } from '../../app/BlockFacets';
import { FitTypes, SizeTypes } from '../../base/Constants';

interface ImageBlockProps {
  blockEntity: Entity;
}

const ImageBlock: React.FC<ImageBlockProps> = ({ blockEntity }) => {
  const [srcFacet] = useEntityComponents(blockEntity, SrcFacet);
  const [sizeFacet, fitFacet] = useEntityComponents(blockEntity, SizeFacet, FitFacet);
  const [imageUrl, setImageUrl] = useState<string>('');
  const url = srcFacet.props.src;
  const size = sizeFacet.props.size;
  const fit = fitFacet.props.fit;

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
    <BlockOutline
      blockEntity={blockEntity}
      content={
        <>
          {imageUrl ? (
            <div
              onClick={() => {}}
              className="w-full rounded-lg  bg-[#f2f2f45f] flex justify-center"
            >
              <img
                src={imageUrl}
                className={
                  size == SizeTypes.AUTO && fit == FitTypes.COVER
                    ? 'md:max-h-96 max-h-56 object-cover w-full  rounded-lg'
                    : size == SizeTypes.AUTO
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
  );
};

export default ImageBlock;
