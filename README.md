![Header](https://rjgupsedtqayyhdyqgfk.supabase.co/storage/v1/object/public/polterware-bucket/pwa.png)

# @polterware/pwa

[![npm version](https://img.shields.io/npm/v/@polterware/pwa.svg)](https://www.npmjs.com/package/@polterware/pwa)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)

Headless PWA install utilities and manifest tools for modern web apps.

## Overview

`@polterware/pwa` v2 is centered around install environment detection instead of UI components.

- Detect the current install environment with browser-aware rules
- Use native install prompts when the browser exposes `beforeinstallprompt`
- Show manual guides only for verified flows such as iOS Safari and Safari on macOS
- Keep manifest generation in a dedicated module
- Use React hooks without forcing a button, modal, or layout

## Installation

```bash
npm install @polterware/pwa
```

For React integration:

```bash
npm install react react-dom
```

## Package Entry Points

```ts
import {
  detectInstallEnvironment,
  getInstallGuide,
} from "@polterware/pwa";

import { usePWAInstall } from "@polterware/pwa/react";

import {
  generateManifest,
  mergeManifest,
} from "@polterware/pwa/manifest";
```

## Browser Matrix

| Browser / OS | Install strategy | Notes |
| --- | --- | --- |
| Safari on iOS | Manual guide | Uses `ios_share_sheet` |
| Safari on macOS | Manual guide | Uses `safari_add_to_dock` |
| Chrome desktop | Native prompt | Available only after `beforeinstallprompt` |
| Edge desktop | Native prompt | Available only after `beforeinstallprompt` |
| Samsung Internet | Native prompt | Available only after `beforeinstallprompt` |
| Arc desktop | Unsupported | No manual fallback is generated |
| Firefox / unknown browsers | Unsupported | No guessed instructions |

## Quick Start

### Vanilla TypeScript

```ts
import {
  detectInstallEnvironment,
  getInstallGuide,
} from "@polterware/pwa";

const environment = detectInstallEnvironment();
const guide = getInstallGuide(environment.guideId, { locale: "en" });

if (environment.availability === "manual" && guide) {
  console.log(guide.title);
  console.log(guide.steps);
}
```

### React

```tsx
import { usePWAInstall } from "@polterware/pwa/react";

export function InstallCallout() {
  const { canPrompt, promptInstall, status, guide } = usePWAInstall({
    locale: "en",
  });

  if (status === "installed" || status === "unsupported") {
    return null;
  }

  if (canPrompt) {
    return (
      <button onClick={() => void promptInstall()}>
        Install app
      </button>
    );
  }

  if (!guide) {
    return null;
  }

  return (
    <section>
      <h2>{guide.title}</h2>
      <p>{guide.description}</p>
      <ol>
        {guide.steps.map((step) => (
          <li key={step.number}>
            <strong>{step.title}</strong>
            <p>{step.description}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
```

## Runtime API

### `detectInstallEnvironment(): InstallEnvironment`

Returns a browser-aware snapshot of the current runtime.

```ts
const environment = detectInstallEnvironment();

// {
//   os: "windows",
//   browser: "chrome",
//   isInstalled: false,
//   availability: "unavailable",
//   reason: "criteria_unmet",
//   guideId: null
// }
```

### `getInstallGuide(guideId, config?): InstallGuide | null`

Returns manual install content only for supported guide ids.

```ts
const guide = getInstallGuide("ios_share_sheet", {
  locale: "en",
});
```

### `usePWAInstall(options?): UsePWAInstallReturn`

React hook that combines environment detection, deferred prompt lifecycle, and guide lookup.

```ts
const {
  environment,
  canPrompt,
  promptInstall,
  status,
  guide,
} = usePWAInstall();
```

The hook:

- captures `beforeinstallprompt`
- exposes `canPrompt`
- runs `promptInstall()` only when a deferred prompt exists
- reacts to `appinstalled`
- keeps manual guides and native prompts mutually exclusive

## Manifest Module

The manifest helpers now live in `@polterware/pwa/manifest`.

```ts
import {
  generateManifest,
  mergeManifest,
} from "@polterware/pwa/manifest";

const manifest = generateManifest({
  name: "Polterware",
  short_name: "Polter",
  description: "Headless PWA install flow",
  start_url: "/",
  icons: [
    {
      src: "/icons/icon-192x192.png",
      sizes: "192x192",
      type: "image/png",
      purpose: "any maskable",
    },
  ],
});
```

## CLI

Create or update `manifest.json` interactively:

```bash
npx @polterware/pwa init
```

Custom manifest path:

```bash
npx @polterware/pwa init --manifest-path public/manifest.json
```

## Public Types

```ts
type OperatingSystem =
  | "ios"
  | "android"
  | "macos"
  | "windows"
  | "linux"
  | "other";

type Browser =
  | "safari"
  | "chrome"
  | "arc"
  | "edge"
  | "firefox"
  | "samsungInternet"
  | "other";

type InstallAvailability =
  | "native"
  | "manual"
  | "unsupported"
  | "unavailable";

type InstallGuideId = "ios_share_sheet" | "safari_add_to_dock";
```

## Breaking Changes in v2

These APIs are no longer part of the main public surface:

- `detectPlatform`
- `getInstallInstructions`
- `usePWA`
- `usePlatform`
- `useIsInstalled`
- `InstallPrompt`

The library now expects the application to own the button, modal, and install UI.
