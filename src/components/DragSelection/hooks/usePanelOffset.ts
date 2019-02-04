import { MutableRefObject, useEffect, useState } from 'react';
import { DragPanelOffset } from '../types';

export const usePanelOffset = (container: MutableRefObject<HTMLDivElement>) => {
  const [panelOffset, setPanelOffset] = useState<DragPanelOffset>(null);

  function setOffset(): void {
    const { left, top } = container.current.getBoundingClientRect();
    setPanelOffset({ left, top });
  }

  useEffect(() => {
    setOffset();
    window.addEventListener('resize', setOffset);
    return () => window.removeEventListener('resize', setOffset);
  }, []);

  return panelOffset;
}