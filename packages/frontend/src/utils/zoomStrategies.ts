import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";

export type ZoomStrategy = (
  event: KonvaEventObject<WheelEvent>,
  stage: Konva.Stage,
  scaleBy: number,
  minScale: number,
  maxScale: number,
) => void;

export const ctrlWheelZoomStrategy: ZoomStrategy = (
  event,
  stage,
  scaleBy,
  minScale,
  maxScale,
) => {
  event.evt.preventDefault();

  const oldScale = stage.scaleX();
  const pointer = stage.getPointerPosition();

  if (!pointer) return;

  const mousePointTo = {
    x: (pointer.x - stage.x()) / oldScale,
    y: (pointer.y - stage.y()) / oldScale,
  };

  const direction = event.evt.deltaY > 0 ? -1 : 1;
  let newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;
  newScale = Math.max(minScale, Math.min(maxScale, newScale));

  if (newScale === oldScale) return;

  const newPosition = {
    x: pointer.x - mousePointTo.x * newScale,
    y: pointer.y - mousePointTo.y * newScale,
  };
  stage.scale({ x: newScale, y: newScale });
  stage.position(newPosition);
};

export const defaultMoveViewStrategy = (
  event: KonvaEventObject<WheelEvent>,
  stage: Konva.Stage,
) => {
  const currentScale = stage.scaleX();
  stage.position({
    x: stage.x() - event.evt.deltaX / currentScale,
    y: stage.y() - event.evt.deltaY / currentScale,
  });
};
