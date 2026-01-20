"use client";

import { useState, useEffect } from "react";
import { detectPlatform } from "../core/detect-platform";
import type { Platform } from "../core/types";

/**
 * React hook to detect the current platform.
 * 
 * @returns {Platform} The detected platform
 */
export function usePlatform(): Platform {
  const [platform, setPlatform] = useState<Platform>("other");

  useEffect(() => {
    setPlatform(detectPlatform());
  }, []);

  return platform;
}
