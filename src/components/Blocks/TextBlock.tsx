import React, { useState, useRef, useEffect, useContext } from 'react';
import BlockOutline from './BlockOutline';
import {
  ECSContext,
  Entity,
  useEntity,
  useEntityComponents,
  useEntityHasTags,
} from '@leanscope/ecs-engine';
import {
  ChildFacet,
  IdFacet,
  OrderFacet,
  ParentFacet,
  TextFacet,
  TextTypeFacet,
  TodoFacet,
  TypeFacet,
} from '../../app/BlockFacets';
import { v4 as uuid } from 'uuid';
import { BlockTypes, StyleTypes, Tags, TextTypes } from '../../base/Constants';
import * as monaco from 'monaco-editor';
import './monaco-custom.css';
import {
  findNumberBetween,
  getNextHigherOrder,
  getNextLowerOrderEntity,
  getNextHigherOrderEntity,
} from '../OrderHelper';

interface TextBlockProps {
  blockEntity: Entity;
  blockEntities: readonly Entity[];
}

const LINE_HEIGHT_PX = 24; // Annahme der Zeilenhöhe in Pixeln

const TextBlock: React.FC<TextBlockProps> = ({ blockEntity, blockEntities }) => {
  const [textFacet, textTypeFacet] = useEntityComponents(blockEntity, TextFacet, TextTypeFacet);
  const text = textFacet.props.text;
  const textType = textTypeFacet.props.type;
  const [lineContent, setLineContent] = useState(1);
  const [isFocused, isPressed] = useEntityHasTags(blockEntity, Tags.FOCUSED, Tags.PRESSED);
  const [isList] = useEntityHasTags(blockEntity, StyleTypes.LIST);
  const [orderFacet, todoFacet] = useEntityComponents(blockEntity, OrderFacet, TodoFacet);
  const textBlock = useRef<HTMLDivElement>(null);
  const ecs = useContext(ECSContext);
  const editorRef = useRef<HTMLDivElement | null>(null);
  const value = text;
  const order = orderFacet.props.order;
  const todoState = todoFacet.props.state;
  const editorInstance = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  const textStyle = {
    // color: formatting.color,
    fontWeight:
      textType === TextTypes.TITLE
        ? 'bold'
        : textType === TextTypes.SUBTITLE
        ? 'bold'
        : textType === TextTypes.HEADING
        ? 'bold'
        : textType === TextTypes.BOLD
        ? 'bold'
        : textType === TextTypes.TEXT
        ? 'normal'
        : textType === TextTypes.CAPTION
        ? 'normal'
        : 'normal',

    fontSize:
      textType === TextTypes.TITLE
        ? '1.5em'
        : textType === TextTypes.SUBTITLE
        ? '1.4em'
        : textType === TextTypes.HEADING
        ? '1.2em'
        : textType === TextTypes.BOLD
        ? '1em'
        : textType === TextTypes.TEXT
        ? '1em'
        : textType === TextTypes.CAPTION
        ? '0.8em'
        : '1em',

    monacoFontSize:
      textType === TextTypes.TITLE
        ? 24
        : textType === TextTypes.SUBTITLE
        ? 22.4
        : textType === TextTypes.HEADING
        ? 19.15
        : textType === TextTypes.BOLD
        ? 16
        : textType === TextTypes.TEXT
        ? 16
        : textType === TextTypes.CAPTION
        ? 12.8
        : 16, // Standardwert für den Text
  };

  // Benutzerdefinierte Funktion, die aufgerufen wird, wenn Backspace gedrückt wird und keine Buchstaben vorhanden sind
  const handleBackspaceNoText = () => {
    if (editorInstance.current!.getValue().trim() === '') {
      getNextLowerOrderEntity(blockEntity.get(OrderFacet)?.props.order || 1, blockEntities)?.addTag(
        Tags.FOCUSED,
      );
      ecs.engine.removeEntity(blockEntity);
    }
  };

  const handleTodoNoText = () => {
    if (editorInstance.current!.getValue().trim() === '') {
      blockEntity.removeTag(StyleTypes.LIST);
      blockEntity.add(new TodoFacet({ state: 1 }));
    }
  };

  const handleListNoText = () => {
    if (editorInstance.current!.getValue().trim() === '') {
      blockEntity.addTag(StyleTypes.LIST);
      blockEntity.add(new TodoFacet({ state: 0 }));
    }
  };

  const handleEnterPress = () => {
    if (editorInstance.current!.getValue().trim() === '') {
      blockEntity.removeTag(StyleTypes.LIST);
      blockEntity.add(new TodoFacet({ state: 0 }));
    } else {
      blockEntity.removeTag(Tags.FOCUSED);

      const newBlockEntity = new Entity();
      ecs.engine.addEntity(newBlockEntity);
      newBlockEntity.addComponent(new TextFacet({ text: '' }));
      newBlockEntity.addComponent(new TextTypeFacet({ type: TextTypes.TEXT }));
      newBlockEntity.addComponent(new TypeFacet({ type: BlockTypes.TEXT }));
      newBlockEntity.addComponent(new IdFacet({ id: uuid() }));
      newBlockEntity.addComponent(
        new OrderFacet({
          order: findNumberBetween(order, getNextHigherOrder(order, blockEntities) || 1),
        }),
      );
      newBlockEntity.addComponent(
        new ParentFacet({ parentId: blockEntity.get(ParentFacet)?.props.parentId || '1' }),
      );
      newBlockEntity.addTag(Tags.FOCUSED);

      if (todoState >= 1) {
        newBlockEntity.addComponent(new TodoFacet({ state: 1 }));
      }
      if (isList) {
        newBlockEntity.addTag(StyleTypes.LIST);
      }
    }
  };

  const handleArrowUpPress = () => {
    blockEntity.removeTag(Tags.FOCUSED);
    getNextLowerOrderEntity(blockEntity.get(OrderFacet)?.props.order || 1, blockEntities)?.addTag(
      Tags.FOCUSED,
    );
  };

  const handleArrowDownPress = () => {
    blockEntity.removeTag(Tags.FOCUSED);
    getNextHigherOrderEntity(blockEntity.get(OrderFacet)?.props.order || 1, blockEntities)?.addTag(
      Tags.FOCUSED,
    );
  };

  useEffect(() => {
    if (isFocused && editorRef.current) {
      editorInstance.current = monaco.editor.create(editorRef.current, {
        value: value,
        language: 'markdown',
        lineNumbers: 'off',
        automaticLayout: true,
        fontFamily: '-apple-system, BlinkMacSystemFont,  sans-serif',
        selectionHighlight: false,
        glyphMargin: false,
        overviewRulerBorder: false,
        suggestOnTriggerCharacters: false,
scrollBeyondLastColumn: 0,
scrollBeyondLastLine: false,
        quickSuggestions: false,
        overviewRulerLanes: 0,
        find: {
          addExtraSpaceOnTop: false,
          seedSearchStringFromSelection: 'never',
          cursorMoveOnType: false,
          autoFindInSelection: 'never', // Deaktiviere die automatische Hervorhebung von Wörtern
        },
        folding: false,
        // Undocumented see https://github.com/Microsoft/vscode/issues/30795#issuecomment-410998882
        lineDecorationsWidth: 0,

        wordWrap: 'on', // Hier wird der Zeilenumbruch aktiviert
        cursorStyle: 'line-thin',
        cursorSmoothCaretAnimation: 'on',

        renderLineHighlight: 'none', // Deaktiviere die Hervorhebung der aktuelle
        minimap: {
          enabled: false, // Deaktiviere das Mini-Map
        },
        fontSize: textStyle.monacoFontSize,
        fontWeight: textStyle.fontWeight,

        // ... Weitere Stile und Optionen
      });

      editorInstance.current.updateOptions({
        lineHeight: LINE_HEIGHT_PX,
      });

      editorInstance.current.onDidChangeModelContent((event) => {
        const changedText = editorInstance.current!.getValue();
        blockEntity.add(new TextFacet({ text: changedText }));
        console.log(event);
      });

      // Füge weitere Aktionen hinzu...

      const model = editorInstance.current.getModel();
      if (model) {
        const lastLineNumber = model.getLineCount();
        const lastColumn = model.getLineMaxColumn(lastLineNumber);
        editorInstance.current.setPosition({ lineNumber: lastLineNumber, column: lastColumn });
      }

      editorInstance.current.focus(); // Fokussiere den Editor direkt beim Laden der Komponente

      const viewModel = (editorInstance.current as any)._getViewModel() as monaco.editor.ITextModel;
      const wrappingAwareLinesCount = viewModel.getLineCount();
      setLineContent(wrappingAwareLinesCount);

      editorRef.current!.style.height = (wrappingAwareLinesCount * 24).toString();
      editorInstance.current!.layout();

      return () => {
        if (editorInstance.current) {
          editorInstance.current.dispose();
        }
      };
    }
  }, [isFocused]);

  useEffect(() => {
    if (editorInstance.current) {
      const editor = editorInstance.current;

      // Benutzerdefinierte Tastenaktionen
      editorInstance.current.addAction({
        id: 'custom-x-action',
        label: 'Custom X Action',
        keybindings:
          editor.getValue().trim() === ''
            ? [monaco.KeyCode.KeyX]
            : [monaco.KeyCode.AudioVolumeDown],
        run: handleTodoNoText,
      });

      if (value.trim() === '') {
        editor.addAction({
          id: 'custom-minus-action',
          label: 'Custom Minus Action',
          keybindings: value === '' ? [monaco.KeyCode.Minus] : [],

          run: handleListNoText,
        });
      }

      editorInstance.current.addAction({
        id: 'custom-arrow-up-action',
        label: 'Custom Arrow Up Action',
        keybindings: [monaco.KeyCode.UpArrow],
        run: handleArrowUpPress,
      });

      editorInstance.current.addAction({
        id: 'custom-arrow-down-action',
        label: 'Custom Arrow Down Action',
        keybindings: [monaco.KeyCode.DownArrow],
        run: handleArrowDownPress,
      });

      editorInstance.current.addAction({
        id: 'custom-enter-action',
        label: 'Custom Enter Action',
        keybindings: [monaco.KeyCode.Enter],
        run: handleEnterPress,
      });
      editor.addAction({
        id: 'custom-backspace-action',
        label: 'Custom Backspace Action',
        keybindings: value === '' ? [monaco.KeyCode.Backspace] : [],
        precondition: '!editorHasText',
        run: handleBackspaceNoText,
      });

      editorInstance.current.addAction({
        id: 'custom-bold-action',
        label: 'Custom Bold Action',
        keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyB],
        precondition: 'editorTextFocus',
        run: toggleBoldText,
      });

      editorInstance.current.addAction({
        id: 'custom-italic-action',
        label: 'Custom Italic Action',
        keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyI],
        precondition: 'editorTextFocus',
        run: toggleItalicText,
      });

      editorInstance.current.addAction({
        id: 'custom-underline-action',
        label: 'Custom Underline Action',
        keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyU],
        precondition: 'editorTextFocus',
        run: toggleUnderlineText,
      });

      editorInstance.current.addAction({
        id: 'custom-underline-action',
        label: 'Custom Underline Action',
        keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyM],
        precondition: 'editorTextFocus',
        run: toggleMarkText,
      });

      const viewModel = (editor as any)._getViewModel() as monaco.editor.ITextModel;
      if (viewModel) {
        const wrappingAwareLinesCount = viewModel.getLineCount();
        setLineContent(wrappingAwareLinesCount);
      }

      editor.layout();
    }
  }, [isFocused, editorInstance.current && editorInstance.current.getValue()]);

  const toggleBoldText = () => {
    toggleTextFormat('**');
  };

  const toggleItalicText = () => {
    toggleTextFormat('*');
  };

  const toggleUnderlineText = () => {
    toggleTextFormat('__');
  };

  const toggleMarkText = () => {
    toggleTextFormat('--');
  };

  function toggleTextFormat(format: string) {
    const editor = editorInstance.current;
    if (!editor) return;
  
    const selection = editor.getSelection();
    if (!selection) return;
  
    const selectedText = editor.getModel()?.getValueInRange(selection);
  
    if (selectedText) {
      const currentText = selectedText.trim();
      const startsWithFormat = currentText.startsWith(format) && currentText.endsWith(format);
  
      let newText;
      if (startsWithFormat) {
        newText = currentText.slice(format.length, -format.length);
      } else {
        newText = `${format}${currentText}${format}`;
      }
  
      editor.executeEdits('applyFormat', [{ range: selection, text: newText }]);
    }
  
    // Entferne die Markdown-Syntax, die jetzt formatiert wurde
    removeMarkdownSyntax(format);
  }
  
  function removeMarkdownSyntax(format: string) {
    const editor = editorInstance.current;
    if (!editor) return;
  
    const selection = editor.getSelection();
    if (!selection) return;
  
    const selectedText = editor.getModel()?.getValueInRange(selection);
  
    if (selectedText) {
      const currentText = selectedText.trim();
      const newText = currentText.replace(new RegExp(format, 'g'), '');
  
      editor.executeEdits('removeMarkdownSyntax', [{ range: selection, text: newText }]);
    }
  }

  // useEffect(() => {
  //   if (editorInstance.current) {
  //     const model = editorInstance.current.getModel();
  //     if (model) {
  //       const lineCount = model.getLineCount();
  //       console.log('lineContent', lineContent);
  //       const editorHeight = lineCount * LINE_HEIGHT_PX;
  //       editorRef.current!.style.height = `${editorHeight}px`;
  //     }
  //   }
  // }, [isFocused, value]);

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      // Überprüfen, ob das angeklickte Element innerhalb von TextBlock ist
      if (textBlock.current && !textBlock.current.contains(event.target as Node)) {
        blockEntity.remove(Tags.FOCUSED);
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

  return (
    <BlockOutline
      blockEntity={blockEntity}
      content={
        <div ref={textBlock} className="w-full">
          {isFocused && !isPressed ? (
            <div className=" w-full ">
              <div
          
          
                ref={editorRef}
                style={{
                  width: '100%',
                  minHeight: `${LINE_HEIGHT_PX}px`,
                  height: lineContent * LINE_HEIGHT_PX,
                }}
              />
            </div>
          ) : (
            <div
              onClick={() => {
                blockEntity.addTag(Tags.FOCUSED);
              }}
              style={{ ...textStyle }}
              className="w-full min-h-[24px] pr-2 text-base"
              dangerouslySetInnerHTML={{ __html: text }}
            />
          )}
        </div>
      }
      isFocused={isFocused}
    />
  );
};

export default TextBlock;
