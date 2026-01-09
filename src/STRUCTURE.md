# Project Structure

This document describes the recommended folder structure for this React Native application.

## Directory Overview

```
src/
├── components/      # Reusable UI components
├── screens/         # Screen-level components (full pages)
├── navigation/      # Navigation configuration
├── services/        # API calls and external services
├── hooks/           # Custom React hooks
├── context/         # React Context providers
├── utils/           # Utility functions and helpers
├── types/           # TypeScript type definitions
├── constants/       # Application constants
├── config/          # Configuration files
├── theme/           # Styling, colors, typography
└── assets/          # Static assets (images, fonts)
    ├── images/
    └── fonts/
```

## Detailed Description

### `/components`

Reusable UI components that can be used across multiple screens. Each component should be self-contained with its own styles and types.

**Example structure:**

```
components/
├── Button/
│   ├── Button.tsx
│   ├── Button.styles.ts
│   ├── Button.types.ts
│   └── Button.test.tsx
└── index.ts
```

### `/screens`

Screen-level components representing full pages/views in the app. These typically compose multiple components.

**Example structure:**

```
screens/
├── HomeScreen/
│   ├── HomeScreen.tsx
│   ├── HomeScreen.styles.ts
│   └── HomeScreen.test.tsx
└── index.ts
```

### `/navigation`

Navigation setup and configuration. Typically uses React Navigation.

**Files:**

- `index.tsx` - Main navigation container
- `types.ts` - Navigation type definitions
- `routes.ts` - Route constants

### `/services`

API calls, data fetching, and external service integrations.

**Example files:**

- `api.ts` - HTTP client and API methods
- `storage.ts` - AsyncStorage utilities
- `auth.ts` - Authentication services
- `analytics.ts` - Analytics tracking

### `/hooks`

Custom React hooks for reusable logic.

**Examples:**

- `useAuth.ts` - Authentication state
- `useApi.ts` - API data fetching
- `useDebounce.ts` - Debounce utility

### `/context`

React Context providers for global state management.

**When to use:**

- Global app state (theme, user, settings)
- State accessed by many components
- Alternative to Redux for simpler needs

### `/utils`

Utility functions and helper methods.

**Examples:**

- Date formatting
- String manipulation
- Validation functions
- Data transformation

### `/types`

TypeScript type definitions and interfaces.

**Structure:**

- `index.ts` - Main types
- `api.types.ts` - API-related types
- `navigation.types.ts` - Navigation types

### `/constants`

Application-wide constants.

**Types:**

- API endpoints
- Storage keys
- Screen/route names
- Configuration values

### `/config`

Application configuration and environment settings.

**Includes:**

- Environment-specific configs
- Feature flags
- Third-party service configs

### `/theme`

Styling constants and theme configuration.

**Includes:**

- Color palette
- Typography definitions
- Spacing constants
- Common style patterns

### `/assets`

Static assets like images and fonts.

**Structure:**

- `images/` - Image files
- `fonts/` - Font files

## Best Practices

1. **Keep components small and focused** - Each component should have a single responsibility
2. **Use TypeScript** - Leverage type safety throughout the app
3. **Centralize exports** - Use index.ts files for clean imports
4. **Separate concerns** - Keep business logic out of components
5. **Consistent naming** - Use clear, descriptive names
6. **Reusability** - Extract common patterns into reusable components/hooks

## Import Examples

```typescript
// Import from theme
import { colors, spacing, typography } from '../theme';

// Import from utils
import { formatDate, debounce } from '../utils';

// Import from types
import { User, ApiResponse } from '../types';

// Import from constants
import { API_BASE_URL, STORAGE_KEYS } from '../constants';

// Import components
import { Button, Card } from '../components';

// Import screens
import { HomeScreen } from '../screens';
```
