import { useRef, useLayoutEffect } from "react";

export function useCallbacksRef<
  T extends Record<string, ((...args: never[]) => unknown) | undefined>
>(callbacks: T): React.RefObject<T> {
  const callbacksRef = useRef<T>(callbacks);

  useLayoutEffect(() => {
    callbacksRef.current = callbacks;
  });

  return callbacksRef;
}
