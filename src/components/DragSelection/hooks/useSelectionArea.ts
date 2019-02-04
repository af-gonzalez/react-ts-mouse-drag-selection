import { useEffect, useState } from 'react';
import { Subject } from 'rxjs';

import { DragElementBounds, UseSelectionArea } from '../types';

export const useSelectionArea: UseSelectionArea = (elements, panelOffset) => {
  const [selectionArea, setSelectionArea] = useState<DragElementBounds>(null);
  const elementEnterArea = new Subject<string>();
  const elementLeftArea = new Subject<string>();

  function validateIntersections(element: DragElementBounds): boolean {
    return element.translateX <= selectionArea.translateX + selectionArea.width + panelOffset.left &&
      element.translateX + element.width >= selectionArea.translateX + panelOffset.left &&
      element.translateY <= selectionArea.translateY + selectionArea.height + panelOffset.top &&
      element.translateY + element.height >= selectionArea.translateY + panelOffset.top;
  }

  useEffect(() => {
    if (selectionArea) {
      elements.forEach((elementBounds: DragElementBounds, elementId: string) => {
        const isElementInArea = validateIntersections(elementBounds);
        if (isElementInArea) elementEnterArea.next(elementId);
        else elementLeftArea.next(elementId);
      });
    }
  }, [selectionArea]);

  return [selectionArea, setSelectionArea, elementEnterArea, elementLeftArea];
}