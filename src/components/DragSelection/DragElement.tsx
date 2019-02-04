import React, { useContext, useEffect, useRef, useState } from 'react';
import { SelectionContext } from './DragContainer';

type ComponentProps = {
  elementId: any;
  className?: string;
};

export const DragElement: React.FC<ComponentProps> = ({ children, elementId, className }) => {
  const selectableItem = useRef<HTMLDivElement>(null);
  const [isSelected, setSelected] = useState(false);
  const {
    addElement,
    sElements,
    selectElement,
    deselectElement,
    activeSelection,
    wrapperScroll
  } = useContext(SelectionContext);

  function handleElementClick(e: React.MouseEvent): void {
    if (!activeSelection) {
      if (!sElements.has(elementId)) selectElement(elementId);
      else deselectElement(elementId);
    }
  }

  function setElementBounds(): void {
    const { top, left, width, height } = selectableItem.current.getBoundingClientRect();
    addElement({ id: elementId, bounds: { translateX: left, translateY: top, width, height } });
  }

  useEffect(() => {
    window.addEventListener('resize', setElementBounds);
    return () => window.removeEventListener('resize', setElementBounds);
  }, []);

  useEffect(() => {
    setSelected(sElements.has(elementId));
  }, [sElements]);

  useEffect(() => {
    setElementBounds();
  }, [wrapperScroll]);

  return (
    <div
      className={`${className}${isSelected ? ' selected' : ''}`}
      ref={selectableItem}
      onMouseUp={handleElementClick}
      onScroll={() => console.log('asd')}
    >
      {children}
    </div>
  );
}