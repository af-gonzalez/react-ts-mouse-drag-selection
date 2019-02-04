import React, { createContext, useReducer, useState } from 'react';
import { Map, Set } from 'immutable';

import { DragElement, DragElements, DragSelectionContext } from './types';
import './DragSelection.css';

export const SelectionContext = createContext<DragSelectionContext>(null);

export const DragContainer: React.FC = ({ children }) => {

  const [sElements, setSelectedElements] = useState(Set());
  const [wrapperScroll, setWrapperScroll] = useState(0);
  const [activeSelection, setActiveSelection] = useState(false);
  const [elements, addElement] = useReducer<DragElements, DragElement>((elements, { id, bounds }) =>
    elements.set(id, bounds), Map());

  const selectionContextValue: DragSelectionContext = {
    elements,
    addElement,
    sElements,
    activeSelection,
    setActiveSelection,
    wrapperScroll,
    setWrapperScroll,
    selectElement: elementId => setSelectedElements(sElements.add(elementId)),
    deselectElement: elementId => setSelectedElements(sElements.delete(elementId)),
    clearSelection: () => setSelectedElements(sElements.clear()),
  }

  return (
    <SelectionContext.Provider value={selectionContextValue}>
      {children}
    </SelectionContext.Provider>
  );
}

