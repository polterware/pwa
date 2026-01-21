# @polterware/pwa

[![npm version](https://img.shields.io/npm/v/@polterware/pwa.svg)](https://www.npmjs.com/package/@polterware/pwa)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)

A general-purpose PWA utilities package for detecting installation, platform detection, and PWA install instructions. Works with any framework or vanilla JavaScript.

## Features

- 🔍 **Installation Detection**: Detect if your PWA is already installed
- 📱 **Platform Detection**: Detect iOS, Android, macOS Safari, Desktop, and other platforms
- 📋 **Install Instructions**: Get platform-specific install instructions
- 🛠️ **Interactive CLI**: Interactive setup tool to create or update PWA manifest
- ⚛️ **React Hooks**: React hooks for easy integration
- 🎨 **UI Agnostic**: No UI dependencies - use with any UI library
- 📦 **TypeScript**: Full TypeScript support with type definitions

## Installation

```bash
npm install @polterware/pwa
```

For React support (peer dependency):

```bash
npm install react react-dom
```

---

## Quick Reference

### Imports Cheatsheet

```typescript
// Core functions (vanilla JS/TS)
import {
  detectInstalled, // Check if PWA is installed
  detectPlatform, // Get current platform
  getInstallInstructions, // Get platform-specific instructions
} from "@polterware/pwa";

// React hooks & components
import {
  usePWA, // Combined hook (recommended) - returns { isInstalled, platform }
  useIsInstalled, // Simple boolean hook - returns isInstalled status
  usePlatform, // Returns detected platform
  InstallPrompt, // UI-agnostic install prompt component
} from "@polterware/pwa/react";

// Types
import type {
  Platform, // 'ios' | 'android' | 'macos_safari' | 'desktop' | 'other'
  Locale, // 'en' | 'pt-BR' | 'es'
  InstallInstructions, // Install instructions object
  InstallInstruction, // Single instruction step
} from "@polterware/pwa";
```

### Which Hook to Use?

| Hook               | Returns                     | Use Case                                                |
| ------------------ | --------------------------- | ------------------------------------------------------- |
| `usePWA()`         | `{ isInstalled, platform }` | **Recommended** - need both install status AND platform |
| `useIsInstalled()` | `boolean`                   | Simple check if app is installed as PWA                 |
| `usePlatform()`    | `Platform`                  | Only need platform detection                            |

---

## Quick Start

### Vanilla JavaScript / TypeScript

```typescript
import {
  detectInstalled,
  detectPlatform,
  getInstallInstructions,
} from "@polterware/pwa";

const isInstalled = detectInstalled();
const platform = detectPlatform(); // 'ios' | 'android' | 'macos_safari' | 'desktop' | 'other'
const instructions = getInstallInstructions(platform);

console.log(instructions.title); // Platform-specific title
console.log(instructions.steps); // Array of installation steps
```

### React

```tsx
import { usePWA, InstallPrompt } from "@polterware/pwa/react";

function MyApp() {
  const { isInstalled, platform } = usePWA();

  if (isInstalled) {
    return <div>App is installed on {platform}!</div>;
  }

  return (
    <InstallPrompt
      renderTrigger={(instructions) => (
        <button>{instructions.buttonText}</button>
      )}
      renderInstructions={(instructions) => (
        <div>
          <h2>{instructions.title}</h2>
          <p>{instructions.subtitle}</p>
          {instructions.steps.map((step) => (
            <div key={step.number}>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      )}
    />
  );
}
```

---

## CLI Usage

Create or update your PWA manifest interactively:

```bash
npx @polterware/pwa init
```

The CLI will:

1. Look for existing `manifest.json` and use values as placeholders
2. Ask for app name, colors, icons, etc.
3. Create/update the manifest file

Options:

```bash
npx @polterware/pwa init --manifest-path custom/path/manifest.json
```

---

## API Reference

### Core Functions

#### `detectInstalled(): boolean`

Detects if the PWA is installed by checking `display-mode: standalone` and `navigator.standalone` (iOS).

```typescript
const isInstalled = detectInstalled();
```

#### `detectPlatform(): Platform`

Detects the current platform.

```typescript
const platform = detectPlatform();
// Returns: 'ios' | 'android' | 'macos_safari' | 'desktop' | 'other'
```

#### `getInstallInstructions(platform, config?): InstallInstructions`

Returns platform-specific install instructions. Supports built-in locales or custom config.

```typescript
// Using built-in locale (en, pt-BR, es)
const instructions = getInstallInstructions("ios", { locale: "pt-BR" });

// Using custom config
const instructions = getInstallInstructions("ios", {
  title: "Install My App",
  subtitle: "Add to your home screen",
  buttonText: "Install",
  gotItText: "Got it!",
});

// Using locale with overrides
const instructions = getInstallInstructions("ios", {
  locale: "pt-BR",
  overrides: { title: "Meu App" },
});
```

**Available Locales:**

| Locale  | Language            |
| ------- | ------------------- |
| `en`    | English (default)   |
| `pt-BR` | Portuguese (Brazil) |
| `es`    | Spanish             |

### React Hooks

#### `usePWA(): UsePWAReturn`

**Recommended** - Combined hook for PWA status and platform.

```typescript
const { isInstalled, platform } = usePWA();
```

#### `useIsInstalled(): boolean`

Simple hook for PWA installation status.

```typescript
const isInstalled = useIsInstalled();
```

#### `usePlatform(): Platform`

Hook for platform detection.

```typescript
const platform = usePlatform();
```

### React Components

#### `InstallPrompt`

UI-agnostic component with render props for complete customization.

| Prop                 | Type                          | Default | Description                              |
| -------------------- | ----------------------------- | ------- | ---------------------------------------- |
| `renderTrigger`      | `(instructions) => ReactNode` | -       | Render function for trigger button       |
| `renderInstructions` | `(instructions) => ReactNode` | -       | Render function for instructions         |
| `children`           | `ReactNode`                   | -       | Fallback if `renderTrigger` not provided |
| `instructionsConfig` | `object`                      | -       | Override default instruction texts       |
| `hideIfInstalled`    | `boolean`                     | `true`  | Hide component if PWA is installed       |

---

## Types

```typescript
type Platform = "ios" | "macos_safari" | "android" | "desktop" | "other";

interface InstallInstruction {
  number: number;
  title: string;
  description: string;
}

interface InstallInstructions {
  platform: Platform;
  steps: InstallInstruction[];
  title: string;
  subtitle: string;
  buttonText: string;
  gotItText: string;
}

interface UsePWAReturn {
  isInstalled: boolean;
  platform: Platform;
}
```

---

## Examples

### Next.js Integration

```tsx
// app/components/InstallButton.tsx
"use client";

import { usePWA, InstallPrompt } from "@polterware/pwa/react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";

export function InstallButton() {
  const { isInstalled, platform } = usePWA();
  const [open, setOpen] = useState(false);

  if (isInstalled) return null;

  return (
    <InstallPrompt
      instructionsConfig={{
        title: "Install My App",
        subtitle: "Add to your home screen for quick access",
      }}
      renderTrigger={(instructions) => (
        <Button onClick={() => setOpen(true)}>{instructions.buttonText}</Button>
      )}
      renderInstructions={(instructions) => (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{instructions.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {instructions.steps.map((step) => (
                <div key={step.number} className="flex gap-4">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary">
                    {step.number}
                  </div>
                  <div>
                    <h3 className="font-semibold">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Button onClick={() => setOpen(false)}>
              {instructions.gotItText}
            </Button>
          </DialogContent>
        </Dialog>
      )}
    />
  );
}
```

---

## Requirements

- **Node.js**: >= 16.0.0
- **React** (for hooks): >= 16.8.0

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Author

Polterware
