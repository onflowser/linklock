import { RefObject, useEffect } from "react";

export function useClickOutside(
  ref: RefObject<HTMLElement>,
  callback: (event: any) => void
) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event: any) {
      if (ref?.current && !ref.current.contains(event.target)) {
        callback(event);
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
}
