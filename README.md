# @polterware/pwa

A general-purpose PWA utilities package for detecting installation, platform detection, and generating PWA configurations. Works with any framework or vanilla JavaScript.

## Features

- 🔍 **Installation Detection**: Detect if your PWA is already installed
- 📱 **Platform Detection**: Detect iOS, Android, macOS Safari, Desktop, and other platforms
- 📋 **Install Instructions**: Get platform-specific install instructions
- ⚙️ **Manifest Generator**: Generate Web App Manifest JSON
- 🏷️ **Meta Tags Generator**: Generate HTML meta tags for PWA support
- ⚛️ **React Hooks**: React hooks for easy integration
- 🎨 **UI Agnostic**: No UI dependencies - use with any UI library

## Installation

```bash
npm install @polterware/pwa
```

## Usage

### Vanilla JavaScript / TypeScript

```typescript
import { 
  detectInstalled, 
  detectPlatform, 
  getInstallInstructions,
  generateManifest,
  generateMetaTags 
} from '@polterware/pwa';

// Detect if PWA is installed
const isInstalled = detectInstalled();

// Detect platform
const platform = detectPlatform(); // 'ios' | 'android' | 'macos_safari' | 'desktop' | 'other'

// Get install instructions for the platform
const instructions = getInstallInstructions(platform, {
  title: "Install My App",
  subtitle: "Add to your home screen",
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
    }
  ]
});

// Generate meta tags
const metaTags = generateMetaTags({
  manifestPath: "/manifest.json",
  themeColor: "#7b2dff",
  appleMobileWebAppTitle: "My App",
  appleTouchIcons: [
    { href: "/icons/apple-touch-icon.png" },
    { href: "/icons/apple-touch-icon-180x180.png", sizes: "180x180" }
  ]
});
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

#### `detectPlatform(): Platform`

Detects the current platform based on user agent. Returns:
- `"ios"` - iPhone, iPad, iPod
- `"android"` - Android devices
- `"macos_safari"` - macOS with Safari browser
- `"desktop"` - Desktop browsers (Chrome, Edge, Firefox, etc.)
- `"other"` - Unknown/other platforms

#### `getInstallInstructions(platform: Platform, config?: DefaultInstallInstructionsConfig): InstallInstructions`

Returns platform-specific install instructions. You can customize all texts via the config parameter.

#### `generateManifest(config: ManifestConfig): object`

Generates a Web App Manifest JSON object based on the provided configuration.

#### `generateMetaTags(config?: MetaTagsConfig): MetaTag[]`

Generates HTML meta tags for PWA support. Returns an array of meta tag objects.

#### `metaTagsToHTML(tags: MetaTag[]): string`

Converts meta tag objects to HTML string.

### React Hooks

#### `usePwaInstalled(): boolean`

React hook that returns `true` if the PWA is installed, `false` otherwise.

#### `useIsPWA(): boolean`

Alias for `usePwaInstalled()` with a more direct naming. Returns `true` if the app is running as a PWA.

#### `usePWA(): UsePWAReturn`

Combined hook that returns both PWA status and platform information:
```typescript
{
  isPWA: boolean;
  isInstalled: boolean; // alias for isPWA
  platform: Platform;
}
```

#### `usePlatform(): Platform`

React hook that returns the detected platform.

### React Components

#### `InstallPrompt`

A UI-agnostic component that provides install instructions. Uses render props for complete customization.

**Props:**
- `renderInstructions?: (instructions: InstallInstructions) => ReactNode` - Custom render function for instructions
- `renderTrigger?: (instructions: InstallInstructions) => ReactNode` - Custom render function for trigger button
- `children?: ReactNode` - Children will be used as trigger if renderTrigger is not provided
- `instructionsConfig?: DefaultInstallInstructionsConfig` - Configuration to override default texts
- `hideIfInstalled?: boolean` - Hide component if PWA is installed (default: `true`)

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
```

## Examples

### Next.js Integration

**app/layout.tsx:**
```typescript
import { generateMetaTags, metaTagsToHTML } from '@polterware/pwa';

export default function RootLayout({ children }) {
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
    }
  ]
}
```

## License

MIT License - veja o arquivo [LICENSE](LICENSE) para mais detalhes.

Copyright (c) 2024 Polterware

## Author

Polterware
