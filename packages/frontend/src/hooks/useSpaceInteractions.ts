import { useRef, useState } from "react";

import { KonvaEventObject } from "konva/lib/Node";
import { Easings } from "konva/lib/Tween";
import { Vector2d } from "konva/lib/types";
import { Node } from "shared/types";

import { PaletteButtonType } from "@/components/space/PaletteMenu";
import {
  findNearestNode,
  findOverlapNodes,
  getDistanceFromPoints,
} from "@/lib/utils";

type DragState = {
  isDragging: boolean;
  startNode: Node | null;
  overlapNode: Node | null;
  dragPosition: Vector2d | null;
};

type MoveState = {
  isHolding: boolean;
  isMoving: boolean;
  isOverlapping: boolean;
  nextPosition: Vector2d | null;
  targetNode: Node | null;
  animationEvent: KonvaEventObject<MouseEvent | TouchEvent | DragEvent> | null;
};

type SpaceActions = {
  createNode: (
    type: Node["type"],
    parentNode: Node,
    position: Vector2d,
    name?: string,
  ) => void;
  createEdge: (fromNode: Node, toNode: Node) => void;
  updateNode: (nodeId: Node["id"], patch: Partial<Omit<Node, "id">>) => void;
};

const HOLD_DURATION = 500;
const NODE_RADIUS = 64;

export default function useSpaceInteractions(
  nodes: Node[],
  spaceActions: SpaceActions,
) {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    startNode: null,
    overlapNode: null,
    dragPosition: null,
  });
  const [dropPosition, setDropPosition] = useState<Vector2d | null>(null);
  const [moveState, setMoveState] = useState<MoveState>({
    isHolding: false,
    isMoving: false,
    isOverlapping: false,
    nextPosition: null,
    targetNode: null,
    animationEvent: null,
  });

  const animationFrameId = useRef<number>();
  const lastPositionRef = useRef<Vector2d | null>();
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ====== Drag Handlers ======
  const handleDragStart = (node: Node) => {
    const nodePosition = { x: node.x, y: node.y };
    setDragState((prev) => ({
      ...prev,
      isDragging: true,
      startNode: node,
      dragPosition: nodePosition,
    }));

    setDropPosition(null);
  };

  const handleDragMove = (e: KonvaEventObject<DragEvent>) => {
    const position = e.target.getLayer()?.getRelativePointerPosition();
    if (!position) return;

    lastPositionRef.current = position;

    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }

    animationFrameId.current = requestAnimationFrame(() => {
      const overlapNodes = findOverlapNodes(position, nodes);
      const selectedNode =
        overlapNodes.length > 0
          ? findNearestNode(position, overlapNodes)
          : null;

      setDragState((prev) => ({
        ...prev,
        dragPosition: position,
        overlapNode: selectedNode,
      }));

      animationFrameId.current = undefined;
    });
  };

  const handleDragEnd = (isMoving: boolean = false) => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }

    const { startNode, dragPosition, overlapNode } = dragState;
    if (!startNode || !dragPosition) return;

    if (!overlapNode && !isMoving) {
      setDropPosition(dragPosition);
    }

    if (overlapNode && overlapNode.id !== startNode.id && !isMoving) {
      setDropPosition(null);
      spaceActions.createEdge(startNode, overlapNode);
    }

    setDragState((prev) => ({
      ...prev,
      isDragging: false,
      dragPosition: null,
      overlapNode: null,
    }));
  };

  const handlePaletteSelect = (type: PaletteButtonType, name: string = "") => {
    const { startNode } = dragState;

    if (
      !startNode ||
      !dropPosition ||
      type === "close" ||
      type === "image" ||
      type === "url"
    ) {
      if (type === "image" || type === "url")
        window.alert("아직 지원하지 않는 타입이에요.");
      setDropPosition(null);
      return;
    }

    spaceActions.createNode(type, startNode, dropPosition, name);

    setDragState((prev) => ({
      ...prev,
      isDragging: false,
      startNode: null,
      dragPosition: null,
    }));
    setDropPosition(null);
  };

  // ====== Move Handlers ======
  const getCircle = (
    e: KonvaEventObject<MouseEvent | TouchEvent | DragEvent>,
  ) => {
    const group = e.target.getParent();
    const circle = group?.findOne("Circle");
    return circle;
  };

  const setHoldingAnimation = (
    e: KonvaEventObject<MouseEvent | TouchEvent | DragEvent> | null,
    isActive: boolean,
  ) => {
    if (!e) return;

    getCircle(e)?.to({
      easing: Easings.EaseInOut,
      shadowBlur: isActive ? 10 : 0,
      duration: 0.5,
    });
  };

  const startHold = (
    node: Node,
    e: KonvaEventObject<MouseEvent | TouchEvent | DragEvent>,
  ) => {
    if (e.evt instanceof MouseEvent && e.evt.button === 2) {
      return;
    }

    setMoveState((prev) => ({
      ...prev,
      isHolding: true,
      targetNode: node,
      animationEvent: e,
    }));

    setHoldingAnimation(e, true);

    if (holdTimer.current) {
      clearTimeout(holdTimer.current);
    }
    holdTimer.current = setTimeout(() => {
      setMoveState((prev) => ({
        ...prev,
        isMoving: true,
      }));
    }, HOLD_DURATION);
  };

  const endHold = () => {
    if (moveState.isMoving) return;

    setHoldingAnimation(moveState.animationEvent, false);

    setMoveState((prev) => ({
      ...prev,
      isHolding: false,
      targetNode: null,
      animationEvent: null,
    }));

    if (holdTimer.current) {
      clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }
  };

  const monitorHoldingPosition = (
    e: KonvaEventObject<MouseEvent | TouchEvent | DragEvent>,
  ) => {
    if (!moveState.isHolding) return;

    const layer = e.target.getLayer();
    if (!layer) return;

    const targetPosition = e.target.getAbsolutePosition(layer);
    const pointerPosition = layer.getRelativePointerPosition();
    if (!pointerPosition) return;

    const distance = getDistanceFromPoints(targetPosition, pointerPosition);
    if (distance > NODE_RADIUS) {
      endHold();
    }

    const overlapNodes = findOverlapNodes(pointerPosition, nodes);

    setMoveState((prev) => ({
      ...prev,
      isOverlapping: overlapNodes.length > 0,
    }));
  };

  const endMove = (
    e: KonvaEventObject<MouseEvent | TouchEvent | DragEvent>,
  ) => {
    setHoldingAnimation(moveState.animationEvent, false);
    if (!moveState.isMoving) return;

    const pointerPosition = e.target.getLayer()?.getRelativePointerPosition();
    if (!pointerPosition || !moveState.targetNode) return;

    if (!moveState.isOverlapping) {
      const { id } = moveState.targetNode;
      const { x, y } = pointerPosition;
      spaceActions.updateNode(id, { x, y });
    }
    setMoveState((prev) => ({
      ...prev,
      isHolding: false,
      isMoving: false,
      targetNode: null,
      animationEvent: null,
    }));
  };

  const nodeEventHandlers = (node: Node) => ({
    onDragStart: () => handleDragStart(node),
    onDragMove: (e: KonvaEventObject<DragEvent>) => {
      handleDragMove(e);
      monitorHoldingPosition(e);
    },
    onDragEnd: (e: KonvaEventObject<DragEvent>) => {
      handleDragEnd(moveState.isMoving);
      endMove(e);
    },
    onMouseDown: (e: KonvaEventObject<MouseEvent>) => startHold(node, e),
    onMouseUp: endHold,
    onTouchStart: (e: KonvaEventObject<TouchEvent>) => startHold(node, e),
    onTouchEnd: endHold,
  });

  return {
    drag: {
      isActive: dragState.isDragging,
      startNode: dragState.startNode,
      overlapNode: dragState.overlapNode,
      position: dragState.dragPosition,
      handlers: {
        onDragStart: handleDragStart,
        onDragMove: handleDragMove,
        onDragEnd: handleDragEnd,
      },
    },
    move: {
      handlers: { startHold, endHold, monitorHoldingPosition, endMove },
      state: moveState,
    },
    dropPosition,
    setDropPosition,
    handlePaletteSelect,
    nodeEventHandlers,
  };
}
