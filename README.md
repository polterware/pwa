# @polterware/pwa

[![npm version](https://img.shields.io/npm/v/@polterware/pwa.svg)](https://www.npmjs.com/package/@polterware/pwa)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)

A general-purpose PWA utilities package for detecting installation, platform detection, and generating PWA configurations. Works with any framework or vanilla JavaScript.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
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
- ⚙️ **Manifest Generator**: Generate Web App Manifest JSON
- 🏷️ **Meta Tags Generator**: Generate HTML meta tags for PWA support
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
import { 
  detectInstalled, 
  detectPlatform, 
  getInstallInstructions,
  generateManifest,
  generateMetaTags,
  metaTagsToHTML
} from '@polterware/pwa';

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

// Generate manifest.json
const manifest = generateManifest({
  name: "My App",
  short_name: "MyApp",
  description: "My awesome app",
  start_url: "/",
  display: "standalone",
  theme_color: "#7b2dff",
  background_color: "#0f0f0f",
  icons: [
    {
      src: "/icons/icon-192x192.png",
      sizes: "192x192",
      type: "image/png",
      purpose: "any maskable"
    },
    {
      src: "/icons/icon-512x512.png",
      sizes: "512x512",
      type: "image/png",
      purpose: "any maskable"
    }
  ]
});

// Generate meta tags
const metaTags = generateMetaTags({
  manifestPath: "/manifest.json",
  themeColor: "#7b2dff",
  appleMobileWebAppTitle: "My App",
  appleMobileWebAppCapable: true,
  appleMobileWebAppStatusBarStyle: "black-translucent",
  appleTouchIcons: [
    { href: "/icons/apple-touch-icon.png" },
    { href: "/icons/apple-touch-icon-180x180.png", sizes: "180x180" }
  ]
});

// Convert meta tags to HTML string
const metaTagsHTML = metaTagsToHTML(metaTags);
// Use in your HTML head section
```

### React

```typescript
import { useIsPWA, usePWA, usePlatform, InstallPrompt } from '@polterware/pwa/react';

function MyApp() {
  // Option 1: Simple check
  const isPWA = useIsPWA();
  
  // Option 2: Combined hook (recommended)
  const { isPWA: isInstalled, platform } = usePWA();
  
  // Option 3: Separate hooks
  const isInstalled = usePwaInstalled();
  const platform = usePlatform();

  if (isPWA) {
    return <div>App is installed!</div>;
  }

  return (
    <InstallPrompt
      renderTrigger={(instructions) => (
        <button onClick={handleOpen}>
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

#### `generateManifest(config: ManifestConfig): object`

Generates a Web App Manifest JSON object based on the provided configuration.

**Parameters:**
- `config` - Manifest configuration object

**Returns:** A Web App Manifest JSON object.

**Example:**
```typescript
const manifest = generateManifest({
  name: "My App",
  short_name: "MyApp",
  description: "My awesome app",
  start_url: "/",
  display: "standalone",
  theme_color: "#7b2dff",
  background_color: "#0f0f0f",
  icons: [/* ... */]
});
```

#### `generateMetaTags(config?: MetaTagsConfig): MetaTag[]`

Generates HTML meta tags for PWA support.

**Parameters:**
- `config` - Optional configuration for meta tags

**Returns:** An array of meta tag objects.

**Example:**
```typescript
const metaTags = generateMetaTags({
  manifestPath: "/manifest.json",
  themeColor: "#7b2dff",
  appleMobileWebAppTitle: "My App"
});
```

#### `metaTagsToHTML(tags: MetaTag[]): string`

Converts meta tag objects to HTML string.

**Parameters:**
- `tags` - Array of meta tag objects

**Returns:** HTML string with meta tags.

**Example:**
```typescript
const tags = generateMetaTags(/* ... */);
const html = metaTagsToHTML(tags);
// Use in your HTML head section
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

interface ManifestConfig {
  name: string;
  short_name: string;
  description: string;
  start_url: string;
  display?: "standalone" | "fullscreen" | "minimal-ui" | "browser";
  background_color?: string;
  theme_color?: string;
  orientation?: "portrait" | "landscape" | "any";
  icons: Array<{
    src: string;
    sizes: string;
    type: string;
    purpose?: "any" | "maskable" | "any maskable";
  }>;
  categories?: string[];
  lang?: string;
  dir?: "ltr" | "rtl";
}

interface MetaTagsConfig {
  manifestPath?: string;
  themeColor?: string;
  appleMobileWebAppCapable?: boolean;
  appleMobileWebAppStatusBarStyle?: "default" | "black" | "black-translucent";
  appleMobileWebAppTitle?: string;
  appleTouchIcons?: Array<{
    href: string;
    sizes?: string;
  }>;
}

interface UsePWAReturn {
  isPWA: boolean;
  isInstalled: boolean;
  platform: Platform;
}

interface MetaTag {
  tag: string;
  attributes: Record<string, string>;
}
```

## Examples

### Next.js Integration

**app/layout.tsx:**
```typescript
import { generateMetaTags, metaTagsToHTML } from '@polterware/pwa';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const metaTags = generateMetaTags({
    manifestPath: "/manifest.json",
    themeColor: "#7b2dff",
    appleMobileWebAppTitle: "My App",
    appleTouchIcons: [
      { href: "/icons/apple-touch-icon.png" }
    ]
  });

  return (
    <html>
      <head dangerouslySetInnerHTML={{ __html: metaTagsToHTML(metaTags) }} />
      <body>{children}</body>
    </html>
  );
}
```

**public/manifest.json:**
```json
{
  "name": "My App",
  "short_name": "MyApp",
  "description": "My awesome app",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#7b2dff",
  "background_color": "#0f0f0f",
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

Copyright (c) 2024 Polterware

## Author

Polterware
