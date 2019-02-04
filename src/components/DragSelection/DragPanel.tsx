import React, { useContext, useEffect, useRef, useState } from 'react';
import { filter } from 'rxjs/operators';
import { Set } from 'immutable';

import { DragCoordinate } from './types';
import { SelectionContext } from './DragContainer';
import { useSelectionArea } from './hooks/useSelectionArea';
import { usePanelOffset } from './hooks/usePanelOffset';


export const DragPanel: React.FC = ({ children }) => {
  const container = useRef<HTMLDivElement>(null);
  const contentWrapper = useRef<HTMLDivElement>(null);
  const panelOffset = usePanelOffset(container);
  const {
    elements,
    sElements,
    selectElement,
    deselectElement,
    clearSelection,
    setActiveSelection,
    setWrapperScroll
  } = useContext(SelectionContext);
  const [previousSelection, setPreviousSelection] = useState(Set());
  const [startPoint, setStartPoint] = useState<DragCoordinate>(null);
  const [appendMode, setAppendMode] = useState(false);
  const [selectionArea, setSelectionArea, elementEnterArea, elementLeftArea] = useSelectionArea(elements, panelOffset);

  elementEnterArea
    .pipe(filter(elementId => !sElements.has(elementId)))
    .subscribe(elementId => selectElement(elementId));

  elementLeftArea
    .pipe(filter(elementId => sElements.has(elementId) && (!appendMode || !previousSelection.has(elementId))))
    .subscribe(elementId => deselectElement(elementId));

  function handleMouseDown(e: React.MouseEvent<HTMLDivElement>): void {
    const { pageX: x, pageY: y } = e;
    setAppendMode(e.shiftKey);
    setStartPoint({ x, y });
  }

  function handleMouseMove(e: MouseEvent): void {
    const { pageX, pageY } = e;
    const { x, y } = startPoint;
    setActiveSelection(true);
    setSelectionArea({
      translateX: Math.min(pageX, x) - panelOffset.left,
      translateY: Math.min(pageY, y) - panelOffset.top,
      width: Math.abs(pageX - x),
      height: Math.abs(pageY - y),
    });
  }

  function handleMouseUp(): void {
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
    setSelectionArea(null);
    setActiveSelection(false);
  }

  function handleWrapperScroll() {
    setWrapperScroll(contentWrapper.current.scrollTop);
  }

  useEffect(() => {
    if (appendMode) {
      setPreviousSelection(sElements);
    } else {
      clearSelection();
    }
    if (startPoint) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
  }, [startPoint])

  return (
    <div
      className="selection-panel"
      onMouseDown={handleMouseDown}
      ref={container}
    >
      {selectionArea && (
        <div
          className="selection-area"
          style={{
            transform: `translateX(${selectionArea.translateX}px) translateY(${selectionArea.translateY}px)`,
            width: selectionArea.width,
            height: selectionArea.height,
          }}
        />
      )}
      <div className="content-wrapper" ref={contentWrapper} onScroll={handleWrapperScroll}>
        {children}
      </div>
    </div>
  );
}