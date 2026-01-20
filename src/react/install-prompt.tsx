"use client";

import { usePwaInstalled } from "./use-pwa-installed";
import { usePlatform } from "./use-platform";
import { getInstallInstructions } from "../constants/install-instructions";
import type { InstallInstructions, DefaultInstallInstructionsConfig } from "../constants/install-instructions";
import type { ReactNode } from "react";

export interface InstallPromptProps {
  /**
   * Custom render function for the install instructions.
   * Receives the install instructions object and should return React nodes.
   */
  renderInstructions?: (instructions: InstallInstructions) => ReactNode;

  /**
   * Custom render function for the trigger button.
   * Receives the install instructions object and should return React nodes.
   */
  renderTrigger?: (instructions: InstallInstructions) => ReactNode;

  /**
   * Children will be used as the trigger if renderTrigger is not provided.
   */
  children?: ReactNode;

  /**
   * Configuration to override default instruction texts.
   */
  instructionsConfig?: DefaultInstallInstructionsConfig;

  /**
   * If true, the component will not render if PWA is already installed.
   * @default true
   */
  hideIfInstalled?: boolean;
}

/**
 * InstallPrompt component that provides install instructions based on the detected platform.
 * This component is UI-agnostic and uses render props for complete customization.
 * 
 * @example
 * ```tsx
 * <InstallPrompt
 *   renderTrigger={(instructions) => (
 *     <button onClick={handleOpen}>
 *       {instructions.buttonText}
 *     </button>
 *   )}
 *   renderInstructions={(instructions) => (
 *     <div>
 *       <h2>{instructions.title}</h2>
 *       {instructions.steps.map(step => (
 *         <div key={step.number}>
 *           <h3>{step.title}</h3>
 *           <p>{step.description}</p>
 *         </div>
 *       ))}
 *     </div>
 *   )}
 * />
 * ```
 */
export function InstallPrompt({
  renderInstructions,
  renderTrigger,
  children,
  instructionsConfig,
  hideIfInstalled = true,
}: InstallPromptProps) {
  const isInstalled = usePwaInstalled();
  const platform = usePlatform();
  const instructions = getInstallInstructions(platform, instructionsConfig);

  if (hideIfInstalled && isInstalled) {
    return null;
  }

  // If renderInstructions is provided, it means the parent wants to control the UI
  // In this case, we just provide the instructions data
  if (renderInstructions) {
    return <>{renderInstructions(instructions)}</>;
  }

  // If renderTrigger is provided, render it
  if (renderTrigger) {
    return <>{renderTrigger(instructions)}</>;
  }

  // If children are provided, render them
  if (children) {
    return <>{children}</>;
  }

  // Default: render nothing (parent should use renderInstructions or renderTrigger)
  return null;
}
