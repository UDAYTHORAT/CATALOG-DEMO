import { useCallback, useState } from 'react';
import type { Content } from '../types';

const cloneContent = (content: Content) => structuredClone(content);

export function useEditorHistory(initialContent: Content) {
  const [history, setHistory] = useState<Content[]>(() => [cloneContent(initialContent)]);
  const [index, setIndex] = useState(0);

  const push = useCallback((nextContent: Content) => {
    setHistory((prev) => {
      // Create new history up to current index
      const next = prev.slice(0, index + 1).map(cloneContent);
      next.push(cloneContent(nextContent));
      
      // Keep only last 50 items
      const trimmed = next.length > 50 ? next.slice(next.length - 50) : next;
      
      // Update index in the same cycle
      setIndex(trimmed.length - 1);
      return trimmed;
    });
  }, [index]);

  const undo = useCallback(() => {
    setIndex((i) => Math.max(0, i - 1));
  }, []);

  const redo = useCallback(() => {
    setIndex((i) => (history.length > 0 ? Math.min(history.length - 1, i + 1) : i));
  }, [history.length]);

  const reset = useCallback((newContent: Content) => {
    setHistory([cloneContent(newContent)]);
    setIndex(0);
  }, []);

  const current = history[index] || initialContent;

  return {
    current,
    setHistory, // for direct manipulation if needed
    index,
    canUndo: index > 0,
    canRedo: index < history.length - 1,
    push,
    undo,
    redo,
    reset,
    history,
  };
}
