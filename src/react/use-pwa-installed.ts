"use client";

import { useState, useEffect } from "react";
import { detectInstalled } from "../core/detect-installed";

/**
 * React hook to detect if the PWA is already installed.
 * 
 * @returns {boolean} True if the PWA is installed, false otherwise
 */
export function usePwaInstalled(): boolean {
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    setIsInstalled(detectInstalled());
  }, []);

  return isInstalled;
}
