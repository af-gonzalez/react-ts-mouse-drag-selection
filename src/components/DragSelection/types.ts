import { Set, Map } from 'immutable';
import { Subject } from 'rxjs';

export type DragElementBounds = { translateX: number, translateY: number, width: number, height: number };
export type DragElement = { id: string, bounds: DragElementBounds }
export type DragElements = Map<string, DragElementBounds>;
export type SelectedDragElements = Set<string>;
export type DragPanelOffset = { top: number, left: number };
export type DragCoordinate = { x: number, y: number };

export type DragSelectionContext = {
  elements: DragElements;
  addElement: (element: DragElement) => void;
  sElements: SelectedDragElements;
  selectElement: (elementId: string) => void;
  deselectElement: (elementId: string) => void;
  clearSelection: () => void;
  activeSelection: boolean;
  setActiveSelection: (isActive: boolean) => void;
  wrapperScroll: number;
  setWrapperScroll: (value: number) => void;
};

export type UseSelectionArea =
  (elements: DragElements, panelOffset: DragPanelOffset) =>
    [DragElementBounds, (selectionArea: DragElementBounds) => void, Subject<string>, Subject<string>];
