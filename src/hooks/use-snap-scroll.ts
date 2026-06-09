import { useState, useEffect, useRef, useCallback } from "react";

const animTime = 1000;

function getScrollableAncestor(el: HTMLElement | null): HTMLElement | null {
  if (!el) return null;
  const overflow = getComputedStyle(el).overflowY;
  if (
    (overflow === "auto" || overflow === "scroll") &&
    el.scrollHeight > el.clientHeight + 1
  ) {
    return el;
  }
  return el.parentElement ? getScrollableAncestor(el.parentElement) : null;
}

export function useSnapScroll(numOfPages: number) {
  const [currentPage, setCurrentPage] = useState(1);
  const [bookingOpen, setBookingOpen] = useState(false);
  const scrolling = useRef(false);
  const touchEv = useRef<{
    startY: number;
    scrollable: HTMLElement | null;
    scrollTop: number;
  }>({ startY: 0, scrollable: null, scrollTop: 0 });
  const heroVideoRef = useRef<HTMLVideoElement | null>(null);

  const navigateUp = useCallback(() => {
    if (currentPage > 1) {
      const prev = currentPage - 1;
      setCurrentPage(prev);
      if (prev === 1) {
        heroVideoRef.current?.play().catch(() => {});
      }
    }
  }, [currentPage]);

  const navigateDown = useCallback(() => {
    if (currentPage < numOfPages) {
      if (currentPage === 1) {
        heroVideoRef.current?.pause();
      }
      setCurrentPage((p) => p + 1);
    }
  }, [currentPage, numOfPages]);

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (scrolling.current) return;
      if (Math.abs(e.deltaY) < 50) return;
      const target = e.target instanceof HTMLElement ? e.target : null;
      const scrollable = getScrollableAncestor(target);
      if (scrollable) {
        const atTop = scrollable.scrollTop <= 0;
        const atBottom =
          scrollable.scrollTop + scrollable.clientHeight >=
          scrollable.scrollHeight - 1;
        if ((e.deltaY > 0 && !atBottom) || (e.deltaY < 0 && !atTop)) {
          return;
        }
      }
      scrolling.current = true;
      if (e.deltaY > 0) {
        navigateDown();
      } else {
        navigateUp();
      }
      setTimeout(() => (scrolling.current = false), animTime);
    },
    [navigateDown, navigateUp]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (scrolling.current) return;
      if (e.key === "ArrowUp") {
        scrolling.current = true;
        navigateUp();
        setTimeout(() => (scrolling.current = false), animTime);
      } else if (e.key === "ArrowDown") {
        scrolling.current = true;
        navigateDown();
        setTimeout(() => (scrolling.current = false), animTime);
      }
    },
    [navigateDown, navigateUp]
  );

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const target = e.target instanceof HTMLElement ? e.target : null;
    touchEv.current = {
      startY: e.touches[0].clientY,
      scrollable: getScrollableAncestor(target),
      scrollTop: getScrollableAncestor(target)?.scrollTop ?? 0,
    };
  }, []);

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      if (scrolling.current) return;
      const endY = e.changedTouches[0].clientY;
      const diff = touchEv.current.startY - endY;
      const scrollable = touchEv.current.scrollable;
      if (scrollable) {
        const scrolled = Math.abs(
          scrollable.scrollTop - touchEv.current.scrollTop
        );
        if (scrolled > 5) return;
        const atTop = scrollable.scrollTop <= 0;
        const atBottom =
          scrollable.scrollTop + scrollable.clientHeight >=
          scrollable.scrollHeight - 1;
        if ((diff > 0 && !atBottom) || (diff < 0 && !atTop)) return;
      }
      if (Math.abs(diff) > 50) {
        scrolling.current = true;
        if (diff > 0) {
          navigateDown();
        } else {
          navigateUp();
        }
        setTimeout(() => (scrolling.current = false), animTime);
      }
    },
    [navigateDown, navigateUp]
  );

  const goToPage = useCallback(
    (page: number) => {
      if (scrolling.current || page === currentPage) return;
      scrolling.current = true;
      if (page === 1) {
        heroVideoRef.current?.play().catch(() => {});
      } else if (currentPage === 1) {
        heroVideoRef.current?.pause();
      }
      setCurrentPage(page);
      setTimeout(() => (scrolling.current = false), animTime);
    },
    [currentPage]
  );

  useEffect(() => {
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [handleWheel, handleKeyDown, handleTouchStart, handleTouchEnd]);

  return {
    currentPage,
    bookingOpen,
    setBookingOpen,
    heroVideoRef,
    navigateUp,
    navigateDown,
    goToPage,
  };
}
