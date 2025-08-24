import { useEffect, useState, memo, useRef } from 'react';
import { useLocation } from 'react-router-dom';

interface LoaderProps {
  loadingComplete: boolean;
}

const Loader = ({ loadingComplete }: LoaderProps) => {
  // COMPLETELY DISABLED to fix persistent browser loading indicator
  // Return null to prevent any loading screen from showing
  return null;
};

export default memo(Loader); 