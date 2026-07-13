import { useEffect, useRef } from "react";
import { Platform, ScrollView } from "react-native";

// Movement beyond this (px) counts as a drag, not a tap.
const DRAG_THRESHOLD = 6;

// react-native-web's horizontal ScrollView doesn't turn a plain vertical
// mouse-wheel gesture, or a mouse click-and-drag, into horizontal scrolling
// on its own (only touch/trackpad-drag does). This wires both up on web so
// desktop mouse users can wheel-scroll or drag-to-scroll horizontal lists
// like category tabs and product carousels.
export function useHorizontalWheelScroll() {
  const scrollRef = useRef<ScrollView>(null);
  const offsetRef = useRef(0);
  const dragRef = useRef<{ startX: number; startOffset: number; moved: boolean } | null>(null);
  const suppressClickRef = useRef(false);

  // react-native-web fires a real "click" on mouseup regardless of how far the
  // pointer moved in between — dragging across a tab still selects it, which
  // then scrolls the row back to that tab and undoes the drag. Swallow that
  // one click after a real drag. This has to attach directly to the DOM node:
  // react-native-web doesn't forward onClickCapture as a prop.
  useEffect(() => {
    if (Platform.OS !== "web") return;
    const node = scrollRef.current?.getScrollableNode?.();
    if (!node) return;
    const handleClickCapture = (e: MouseEvent) => {
      if (!suppressClickRef.current) return;
      suppressClickRef.current = false;
      e.stopPropagation();
      e.preventDefault();
    };
    node.addEventListener("click", handleClickCapture, true);
    return () => node.removeEventListener("click", handleClickCapture, true);
  }, []);

  if (Platform.OS !== "web") {
    return {
      scrollRef,
      onScroll: undefined,
      onWheel: undefined,
      onMouseDown: undefined,
      onMouseMove: undefined,
      onMouseUp: undefined,
      onMouseLeave: undefined,
    };
  }

  const onScroll = (e: { nativeEvent: { contentOffset: { x: number } } }) => {
    offsetRef.current = e.nativeEvent.contentOffset.x;
  };

  const onWheel = (e: { deltaX: number; deltaY: number; preventDefault: () => void }) => {
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (delta === 0) return;
    e.preventDefault();
    const next = Math.max(0, offsetRef.current + delta);
    scrollRef.current?.scrollTo({ x: next, animated: false });
  };

  const onMouseDown = (e: { clientX: number }) => {
    dragRef.current = { startX: e.clientX, startOffset: offsetRef.current, moved: false };
  };

  const onMouseMove = (e: { clientX: number; buttons: number; preventDefault: () => void }) => {
    if (!dragRef.current) return;
    if (e.buttons === 0) {
      dragRef.current = null;
      return;
    }
    e.preventDefault();
    const delta = e.clientX - dragRef.current.startX;
    if (Math.abs(delta) > DRAG_THRESHOLD) dragRef.current.moved = true;
    const next = Math.max(0, dragRef.current.startOffset - delta);
    scrollRef.current?.scrollTo({ x: next, animated: false });
  };

  const onMouseUp = () => {
    if (dragRef.current?.moved) suppressClickRef.current = true;
    dragRef.current = null;
  };

  return { scrollRef, onScroll, onWheel, onMouseDown, onMouseMove, onMouseUp, onMouseLeave: onMouseUp };
}
