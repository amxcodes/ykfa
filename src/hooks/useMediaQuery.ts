import { useState, useEffect } from 'react';

/**
 * Custom hook to check if a media query matches
 * @param query The media query to check
 * @returns True if the media query matches, false otherwise
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Create media query list
    const mediaQuery = window.matchMedia(query);
    
    // Update the state with the match
    setMatches(mediaQuery.matches);

    // Create event listener that changes the matches state when the media query changes
    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Add the event listener
    mediaQuery.addEventListener('change', handler);
    
    // Clean up
    return () => {
      mediaQuery.removeEventListener('change', handler);
    };
  }, [query]);

  return matches;
} 