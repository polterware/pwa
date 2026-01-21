# @polterware/pwa

[![npm version](https://img.shields.io/npm/v/@polterware/pwa.svg)](https://www.npmjs.com/package/@polterware/pwa)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)

A general-purpose PWA utilities package for detecting installation, platform detection, and PWA install instructions. Works with any framework or vanilla JavaScript.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [CLI Usage](#cli-usage)
- [Usage](#usage)
  - [Vanilla JavaScript / TypeScript](#vanilla-javascript--typescript)
  - [React](#react)
  - [React with Custom UI Library](#react-with-custom-ui-library)
- [API Reference](#api-reference)
  - [Core Functions](#core-functions)
  - [React Hooks](#react-hooks)
  - [React Components](#react-components)
- [Types](#types)
- [Examples](#examples)
  - [Next.js Integration](#nextjs-integration)
- [Requirements](#requirements)
- [License](#license)
- [Author](#author)

## Features

- 🔍 **Installation Detection**: Detect if your PWA is already installed
- 📱 **Platform Detection**: Detect iOS, Android, macOS Safari, Desktop, and other platforms
- 📋 **Install Instructions**: Get platform-specific install instructions
- 🛠️ **Interactive CLI**: Interactive setup tool to create or update PWA manifest with guided questions
- ⚛️ **React Hooks**: React hooks for easy integration
- 🎨 **UI Agnostic**: No UI dependencies - use with any UI library
- 📦 **TypeScript**: Full TypeScript support with type definitions
- 🧪 **Well Tested**: Comprehensive test coverage

## Installation

```bash
npm install @polterware/pwa
```

For React support, make sure you have React installed (peer dependency):

```bash
npm install react react-dom
```

## CLI Usage

The easiest way to set up your PWA manifest is using the interactive CLI tool.

### Initialize Manifest

Run the interactive setup to create or update your `manifest.json`:

```bash
npx @polterware/pwa init
```

The CLI will:
1. **Look for existing manifest** - If a `manifest.json` already exists, it will read it and use existing values as placeholders
2. **Ask interactive questions** - Fill in all required fields through a friendly questionnaire
3. **Create manifest** - Create or update the `manifest.json` file with your answers

**Example interactive session:**

```
📖 Found existing manifest at: public/manifest.json

📝 Let's set up your PWA manifest!

? App name (full name): My Awesome App
? App short name (max 12 characters recommended): MyApp
? App description: An amazing progressive web app
? Start URL (usually '/' for root): /
? Theme color (hex, e.g., #000000): #7b2dff
? Background color (hex, e.g., #ffffff): #0f0f0f
? Icon folder path (e.g., /icons): /icons
? Icon sizes (select all that apply): 192x192, 512x512

✅ Manifest created successfully!
📝 Location: public/manifest.json
```

**Example created manifest.json:**

```json
{
  "name": "My Awesome App",
  "short_name": "MyApp",
  "description": "An amazing progressive web app",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0f0f0f",
  "theme_color": "#7b2dff",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

You can also specify a custom manifest path:

```bash
npx @polterware/pwa init --manifest-path custom/path/manifest.json
```

### Icon Configuration

The CLI will ask for:
1. **Icon folder path** - The folder where your icons are stored (e.g., `/icons`)
2. **Icon sizes** - Select which icon sizes you want to include (192x192 and 512x512 are recommended and selected by default)

The CLI automatically creates icon entries in the format: `{folder}/icon-{size}.png`
- Example: If folder is `/icons` and you select `192x192` and `512x512`, it will create:
  - `/icons/icon-192x192.png`
  - `/icons/icon-512x512.png`

### Features

- ✅ **Interactive Setup**: Guided questions make configuration easy and foolproof
- ✅ **Smart Defaults**: Existing manifest values are automatically used as placeholders
- ✅ **Update Existing**: Easily update an existing manifest by running the command again
- ✅ **Auto-Detection**: Automatically finds manifest.json in common locations (root, public/, app/)
- ✅ **Icon Size Selection**: Choose which icon sizes to include from a list
- ✅ **Validation**: Validates inputs (hex colors, required fields, etc.)
- ✅ **Framework Agnostic**: Works with any framework or vanilla JavaScript project
- ✅ **Standalone Default**: Display mode is always set to "standalone" (standard for PWAs)

## Quick Start

### Vanilla JavaScript / TypeScript

```typescript
import { detectInstalled, detectPlatform, getInstallInstructions } from '@polterware/pwa';

// Detect if PWA is installed
const isInstalled = detectInstalled();

// Detect platform
const platform = detectPlatform(); // 'ios' | 'android' | 'macos_safari' | 'desktop' | 'other'

// Get install instructions for the platform
const instructions = getInstallInstructions(platform);
console.log(instructions.title); // Platform-specific install instructions
```

### React

```typescript
import { usePWA, InstallPrompt } from '@polterware/pwa/react';

function MyApp() {
  const { isPWA, platform } = usePWA();

  if (isPWA) {
    return <div>App is installed!</div>;
  }

  return (
    <InstallPrompt
      renderTrigger={(instructions) => (
        <button>{instructions.buttonText}</button>
      )}
    />
  );
}
```

## Usage

### Vanilla JavaScript / TypeScript

```typescript
import { detectInstalled, detectPlatform, getInstallInstructions } from '@polterware/pwa';

// Detect if PWA is installed
const isInstalled = detectInstalled();

// Detect platform
const platform = detectPlatform(); // 'ios' | 'android' | 'macos_safari' | 'desktop' | 'other'

// Get install instructions for the platform
const instructions = getInstallInstructions(platform, {
  title: "Install My App",
  subtitle: "Add to your home screen",
  buttonText: "Install",
  gotItText: "Got it!",
  // ... customize instruction texts
});
```

### React

**Option 1: Simple check**
```typescript
import { useIsPWA, InstallPrompt } from '@polterware/pwa/react';
import { useState } from 'react';

function MyApp() {
  const isPWA = useIsPWA();
  const [open, setOpen] = useState(false);

  if (isPWA) {
    return <div>App is installed!</div>;
  }

  return (
    <InstallPrompt
      renderTrigger={(instructions) => (
        <button onClick={() => setOpen(true)}>
          {instructions.buttonText}
        </button>
      )}
      renderInstructions={(instructions) => (
        <div>
          <h2>{instructions.title}</h2>
          <p>{instructions.subtitle}</p>
          {instructions.steps.map(step => (
            <div key={step.number}>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
          <button onClick={() => setOpen(false)}>
            {instructions.gotItText}
          </button>
        </div>
      )}
    />
  );
}
```

**Option 2: Combined hook (recommended)**
```typescript
import { usePWA, InstallPrompt } from '@polterware/pwa/react';
import { useState } from 'react';

function MyApp() {
  const { isPWA, platform } = usePWA();
  const [open, setOpen] = useState(false);

  if (isPWA) {
    return <div>App is installed on {platform}!</div>;
  }

  return (
    <InstallPrompt
      renderTrigger={(instructions) => (
        <button onClick={() => setOpen(true)}>
          {instructions.buttonText}
        </button>
      )}
      renderInstructions={(instructions) => (
        <div>
          <h2>{instructions.title}</h2>
          <p>{instructions.subtitle}</p>
          {instructions.steps.map(step => (
            <div key={step.number}>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
          <button onClick={() => setOpen(false)}>
            {instructions.gotItText}
          </button>
        </div>
      )}
    />
  );
}
```

**Option 3: Separate hooks**
```typescript
import { usePwaInstalled, usePlatform, InstallPrompt } from '@polterware/pwa/react';
import { useState } from 'react';

function MyApp() {
  const isInstalled = usePwaInstalled();
  const platform = usePlatform();
  const [open, setOpen] = useState(false);

  if (isInstalled) {
    return <div>App is installed on {platform}!</div>;
  }

  return (
    <InstallPrompt
      renderTrigger={(instructions) => (
        <button onClick={() => setOpen(true)}>
          {instructions.buttonText}
        </button>
      )}
      renderInstructions={(instructions) => (
        <div>
          <h2>{instructions.title}</h2>
          <p>{instructions.subtitle}</p>
          {instructions.steps.map(step => (
            <div key={step.number}>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
          <button onClick={() => setOpen(false)}>
            {instructions.gotItText}
          </button>
        </div>
      )}
    />
  );
}
```

### React with Custom UI Library (e.g., shadcn/ui)

```typescript
import { usePwaInstalled, usePlatform, InstallPrompt } from '@polterware/pwa/react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useState } from 'react';

function InstallButton() {
  const isInstalled = usePwaInstalled();
  const platform = usePlatform();
  const [open, setOpen] = useState(false);

  if (isInstalled) return null;

  return (
    <InstallPrompt
      instructionsConfig={{
        title: "Install My App",
        subtitle: "Add to your home screen for quick access"
      }}
      renderTrigger={(instructions) => (
        <Button onClick={() => setOpen(true)}>
          {instructions.buttonText}
        </Button>
      )}
      renderInstructions={(instructions) => (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{instructions.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {instructions.steps.map(step => (
                <div key={step.number} className="flex gap-4">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary">
                    {step.number}
                  </div>
                  <div>
                    <h3 className="font-semibold">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
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

## API Reference

### Core Functions

#### `detectInstalled(): boolean`

Detects if the PWA is already installed by checking:
- `display-mode: standalone` media query
- `navigator.standalone` (iOS Safari)

**Returns:** `true` if the PWA is installed, `false` otherwise.

**Example:**
```typescript
const isInstalled = detectInstalled();
if (isInstalled) {
  console.log('PWA is already installed');
}
```

#### `detectPlatform(): Platform`

Detects the current platform based on user agent.

**Returns:** One of the following platform strings:
- `"ios"` - iPhone, iPad, iPod
- `"android"` - Android devices
- `"macos_safari"` - macOS with Safari browser
- `"desktop"` - Desktop browsers (Chrome, Edge, Firefox, etc.)
- `"other"` - Unknown/other platforms

**Example:**
```typescript
const platform = detectPlatform();
console.log(`Detected platform: ${platform}`);
```

#### `getInstallInstructions(platform: Platform, config?: DefaultInstallInstructionsConfig): InstallInstructions`

Returns platform-specific install instructions. You can customize all texts via the config parameter.

**Parameters:**
- `platform` - The platform to get instructions for
- `config` - Optional configuration to override default instruction texts

**Returns:** `InstallInstructions` object with platform-specific installation steps.

**Example:**
```typescript
const instructions = getInstallInstructions('ios', {
  title: "Install My App",
  subtitle: "Add to your home screen"
});
```

#### `mergeManifest(existingManifest: object, newManifestConfig: object): object`

Merges a new manifest configuration into an existing manifest. Only updates app-specific fields (name, description, icons, theme colors, etc.), preserving all custom fields (shortcuts, share_target, categories, etc.).

**Parameters:**
- `existingManifest` - The existing manifest JSON object
- `newManifestConfig` - The new manifest configuration to merge

**Returns:** Merged manifest object.

**Fields that are updated:** `name`, `short_name`, `description`, `start_url`, `display`, `theme_color`, `background_color`, `icons`. All other fields are preserved.

**Example:**
```typescript
import { mergeManifest } from '@polterware/pwa';

const existing = {
  name: "Old Name",
  shortcuts: [{ name: "Custom Shortcut", url: "/shortcut" }],
  categories: ["games"]
};

const newConfig = {
  name: "New Name",
  short_name: "NewApp",
  description: "New description"
};

const updated = mergeManifest(existing, newConfig);

// Result preserves shortcuts and categories while updating name
```

#### `getAppSpecificFields(): string[]`

Returns the list of fields that will be updated when using `mergeManifest()`. Useful for logging/debugging what will change.

**Returns:** Array of field names that are considered app-specific.

**Example:**
```typescript
import { getAppSpecificFields } from '@polterware/pwa';

const fields = getAppSpecificFields();
console.log(fields); // ['name', 'short_name', 'description', ...]
```

### React Hooks

#### `usePwaInstalled(): boolean`

React hook that returns `true` if the PWA is installed, `false` otherwise.

**Example:**
```typescript
const isInstalled = usePwaInstalled();
```

#### `useIsPWA(): boolean`

Alias for `usePwaInstalled()` with a more direct naming. Returns `true` if the app is running as a PWA.

**Example:**
```typescript
const isPWA = useIsPWA();
```

#### `usePWA(): UsePWAReturn`

Combined hook that returns both PWA status and platform information.

**Returns:**
```typescript
{
  isPWA: boolean;
  isInstalled: boolean; // alias for isPWA
  platform: Platform;
}
```

**Example:**
```typescript
const { isPWA, platform } = usePWA();
```

#### `usePlatform(): Platform`

React hook that returns the detected platform.

**Example:**
```typescript
const platform = usePlatform();
```

### React Components

#### `InstallPrompt`

A UI-agnostic component that provides install instructions. Uses render props for complete customization.

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `renderInstructions` | `(instructions: InstallInstructions) => ReactNode` | No | - | Custom render function for instructions |
| `renderTrigger` | `(instructions: InstallInstructions) => ReactNode` | No | - | Custom render function for trigger button |
| `children` | `ReactNode` | No | - | Children will be used as trigger if `renderTrigger` is not provided |
| `instructionsConfig` | `DefaultInstallInstructionsConfig` | No | - | Configuration to override default texts |
| `hideIfInstalled` | `boolean` | No | `true` | Hide component if PWA is installed |

**Example:**
```typescript
<InstallPrompt
  hideIfInstalled={true}
  instructionsConfig={{
    title: "Install My App",
    subtitle: "Add to your home screen"
  }}
  renderTrigger={(instructions) => (
    <button>{instructions.buttonText}</button>
  )}
  renderInstructions={(instructions) => (
    <div>
      <h2>{instructions.title}</h2>
      {/* ... */}
    </div>
  )}
/>
```

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
  isPWA: boolean;
  isInstalled: boolean;
  platform: Platform;
}
```

## Examples

### Next.js Integration

**app/components/InstallButton.tsx:**
```typescript
'use client';

import { usePWA, InstallPrompt } from '@polterware/pwa/react';
import { Button } from '@/components/ui/button';

export function InstallButton() {
  const { isPWA } = usePWA();

  if (isPWA) return null;

  return (
    <InstallPrompt
      renderTrigger={(instructions) => (
        <Button>{instructions.buttonText}</Button>
      )}
    />
  );
}
```

## Requirements

- **Node.js**: >= 16.0.0
- **React** (for React hooks): >= 16.8.0

## License

MIT License - see the [LICENSE](LICENSE) file for details.

Copyright (c) 2026 Polterware

## Author

Polterware
