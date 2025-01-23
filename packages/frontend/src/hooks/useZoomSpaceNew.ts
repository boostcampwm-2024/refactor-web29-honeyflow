import React, { useRef } from "react";

import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";

import {
  ctrlWheelZoomStrategy,
  defaultMoveViewStrategy,
} from "@/utils/zoomStrategies";

interface UseZoomSpaceProps {
  stageRef: React.RefObject<Konva.Stage>;
  scaleBy?: number;
  minScale?: number;
  maxScale?: number;
}

export function useZoomSpace({
  stageRef,
  scaleBy = 1.018,
  minScale = 0.5,
  maxScale = 3,
}: UseZoomSpaceProps) {
  const lastDistRef = useRef<number | null>(null);

  const zoomSpace = (event: KonvaEventObject<WheelEvent>) => {
    if (stageRef.current !== null) {
      const stage = stageRef.current;

      if (event.evt.ctrlKey) {
        ctrlWheelZoomStrategy(event, stage, scaleBy, minScale, maxScale);
      } else {
        defaultMoveViewStrategy(event, stage);
      }
    }
  };

  const handleTouchMove = (event: KonvaEventObject<TouchEvent>) => {
    if (stageRef.current !== null && event.evt.touches.length === 2) {
      const stage = stageRef.current;
      const touch1 = event.evt.touches[0];
      const touch2 = event.evt.touches[1];

      const dist = Math.sqrt(
        (touch1.clientX - touch2.clientX) ** 2 +
          (touch1.clientY - touch2.clientY) ** 2,
      );

      if (lastDistRef.current !== null) {
        const oldScale = stage.scaleX();
        const pointer = stage.getPointerPosition();

        if (!pointer) return;

        const mousePointTo = {
          x: (pointer.x - stage.x()) / oldScale,
          y: (pointer.y - stage.y()) / oldScale,
        };

        const scaleChange = lastDistRef.current / dist;
        let newScale = oldScale * scaleChange;
        newScale = Math.max(minScale, Math.min(maxScale, newScale));

        if (newScale !== oldScale) {
          const newPosition = {
            x: pointer.x - mousePointTo.x * newScale,
            y: pointer.y - mousePointTo.y * newScale,
          };
          stage.scale({ x: newScale, y: newScale });
          stage.position(newPosition);
        }
      }

      lastDistRef.current = dist;
    }
  };

  const handleTouchEnd = () => {
    lastDistRef.current = null;
  };

  return { zoomSpace, handleTouchMove, handleTouchEnd };
}
