import React, { useState, useRef, useEffect, useContext } from 'react';
import BlockOutline from './BlockOutline';
import { ECSContext, Entity, useEntity } from '@leanscope/ecs-engine';
import { ChildFacet, IdFacet, TextFacet, TypeFacet } from '../../app/BlockFacets';
import { v4 as uuid } from 'uuid';
import { BlockTypes } from '../../base/Constants';

interface TextBlockProps {
  blockEntity: Entity;
  handleAddBlock: (text: string) => void;
}

const TextBlock: React.FC<TextBlockProps> = ({ blockEntity, handleAddBlock }) => {
  const block = useEntity(blockEntity);
  const text = (block[0][0] as EntityPropsType)?.props.text;
  const ecs = useContext(ECSContext);

  const [isFocused, setIsFocused] = useState(false);
  const contentEditableRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' && contentEditableRef.current) {
      const htmlText = contentEditableRef.current.innerHTML;

      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlText, 'text/html');

      const divs = doc.querySelectorAll('div');
      if (divs.length > 0) {
        const lastDiv = divs[divs.length - 1];
        console.log('lastDiv.innerHTML', lastDiv.innerHTML);
      }
    }
  };

  // const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
  //   if (event.key === 'Enter' && contentEditableRef.current) {
  //     event.persist(); // Event persistieren, um es später verwenden zu können
  //     console.log("Enter");
  //     const htmlText = contentEditableRef.current.innerHTML;

  //     const parser = new DOMParser();
  //     const doc = parser.parseFromString(htmlText, 'text/html');

  //     const divs = doc.querySelectorAll('div');
  //     if (divs.length > 0) {
  //       const lastDiv = divs[divs.length - 1];
  //       console.log("lastDiv", lastDiv)

  //       const newBlockEntity = new Entity();
  //       ecs.engine.addEntity(newBlockEntity);
  //       newBlockEntity.addComponent(new TextFacet({ text: lastDiv.innerHTML }));
  //       newBlockEntity.addComponent(new ChildFacet({ childOf: 'Block Editor' }));
  //       newBlockEntity.addComponent(new TypeFacet({ type: BlockTypes.TEXT }));
  //       newBlockEntity.addComponent(new IdFacet({ id: uuid() }));
  //       console.log('lastDiv.innerHTML', lastDiv.innerText);
  //     } else {
  //       // Hier wird handleAddBlock aufgerufen, wenn keine div-Elemente vorhanden sind
  //       const newBlockEntity = new Entity();
  //       ecs.engine.addEntity(newBlockEntity);
  //       newBlockEntity.addComponent(new TextFacet({ text:"Enter" }));
  //       newBlockEntity.addComponent(new ChildFacet({ childOf: 'Block Editor' }));
  //       newBlockEntity.addComponent(new TypeFacet({ type: BlockTypes.TEXT }));
  //       newBlockEntity.addComponent(new IdFacet({ id: uuid() }));
  //       console.log('no Text', );
  //     }
  //   }
  // };

  useEffect(() => {
    if (contentEditableRef.current && isFocused) {
      // Text im HTML-Format speichern
      const htmlText = contentEditableRef.current.innerHTML;
      blockEntity.addComponent(new TextFacet({ text: htmlText }));
    }
  }, [isFocused]);

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      // Überprüfen, ob das angeklickte Element innerhalb von TextBlock ist
      if (
        contentEditableRef.current &&
        !contentEditableRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };

    // Event-Listener hinzufügen, wenn TextBlock fokussiert ist
    if (isFocused) {
      document.addEventListener('click', handleDocumentClick);
    }

    // Event-Listener entfernen, wenn TextBlock nicht mehr fokussiert ist
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [isFocused]);

  // const handleKeyUp = () => {
  //   if (contentEditableRef.current) {
  //     const htmlText = contentEditableRef.current.innerHTML;
  //     const parser = new DOMParser();
  //     const doc = parser.parseFromString(htmlText, 'text/html');

  //     const divs = doc.querySelectorAll('div');
  //     if (divs.length > 0) {
  //       const lastDiv = divs[divs.length - 1];
  //       const updatedText = htmlText.replace(lastDiv.innerHTML, '');
  //       blockEntity.addComponent(new TextFacet({ text: updatedText }));

  //       console.log('lastDiv.innerHTML', lastDiv.innerHTML);
  //       const newBlockEntity = new Entity();
  //       ecs.engine.addEntity(newBlockEntity);
  //       newBlockEntity.addComponent(new TextFacet({ text: lastDiv.innerHTML }));
  //       newBlockEntity.addComponent(new ChildFacet({ childOf: 'Block Editor' }));
  //       newBlockEntity.addComponent(new TypeFacet({ type: BlockTypes.TEXT }));
  //       newBlockEntity.addComponent(new IdFacet({ id: uuid() }));
  //     } 
  //   }
  // };

  const handleBlur = () => {
    if (contentEditableRef.current) {
      const htmlText = contentEditableRef.current.innerHTML;
      // Save the final content here or perform any other operations you need
      blockEntity.addComponent(new TextFacet({ text: htmlText }));
    }
  };

  return (
    <BlockOutline
      onClick={() => {
        setIsFocused(true);
      }}
      blockEntity={blockEntity}
      content={
        <div className="w-full">
          {isFocused ? (
            <div
              // onKeyUp={handleKeyUp}
              onBlur={handleBlur}
              ref={contentEditableRef}
              className="w-full bg-blue-light bg-opacity-40 outline-none"
              contentEditable
              dangerouslySetInnerHTML={{ __html: text }} // Here the HTML content is displayed
            />
          ) : (
            <div className="w-full" dangerouslySetInnerHTML={{ __html: text }} /> // Here the HTML content is displayed
          )}
        </div>
      }
      isFocused={isFocused}
    />
  );
};

export default TextBlock;
