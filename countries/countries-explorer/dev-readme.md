# Countries Explorer - Developer Documentation

## Prerequisites

- **Node.js**: v24 (specified in [.nvmrc](.nvmrc))
- **Package Manager**: pnpm v10.23.0
- **nvm**: Recommended for Node.js version management

## Quick Start

### 1. Environment Setup

`nvm` Setup Instructions:
<https://github.com/nvm-sh/nvm>

```bash
# Use the correct Node.js version
nvm use

# Enable/install pnpm
corepack enable pnpm

# Install dependencies
pnpm install
```

### 2. Available Commands

```bash
# Start development server (default: http://localhost:5173)
pnpm dev

# Run tests
pnpm test

# Build for production
pnpm build

# Preview production build
pnpm preview

# Lint code
pnpm lint
```

## Architecture Overview

### Technology Stack

All packages are updated to their latest versions for security and modern features:

- **React 19**: UI framework with latest concurrent features
- **TypeScript 5.9**: Type safety and developer experience
- **Vite 7**: Fast build tool and dev server with HMR
- **Vitest 4**: Fast unit testing with Vite integration
- **MSW 2**: API mocking for tests
- **Testing Library**: React testing utilities

### Project Structure

```text
src/
├── api/
│   └── CountriesDataManager.ts    # API layer for REST Countries API
├── tests/
│   ├── api/                       # API tests
│   └── views/                     # Component tests
├── styles/                        # CSS modules
├── types.ts                       # TypeScript interfaces
├── App.tsx                        # Main application component
├── countryDetailView.tsx          # Modal component for country details
└── main.tsx                       # Application entry point
```

## Key Architectural Decisions

### 1. **Data Fetching Strategy**

- **Direct fetch API**: Used native fetch instead of axios/other libraries to minimize dependencies
- **Field filtering**: API calls include `?fields=` parameter to reduce payload size
- **Separate endpoints**: List view uses minimal fields; detail view fetches additional data on-demand
- **Error handling**: Centralized error handler in [CountriesDataManager.ts](src/api/CountriesDataManager.ts:3-23) for consistent error messaging

### 2. **View Modes**

The application supports two viewing modes toggle-able by the user:

- **Paginated View** (default): Client-side pagination with 10 items per page
  - Reduces initial render time
  - Provides navigation controls
  - Better UX for large datasets

- **All-at-once View**: Renders all countries in a single scrollable list
  - Uses lazy loading for images via `loading="lazy"` attribute
  - Better for users who prefer scrolling over pagination

**Implementation**: Array slicing in [App.tsx:33-101](src/App.tsx#L33-L101) - pagination is computed client-side after fetching all data

### 3. **State Management**

- **React useState**: Simple, sufficient for current scope
- **Local state**: All state managed in App component
- **Props drilling**: Minimal depth (one level to modal)

**Why not XState?** Although included in dependencies, the application's state complexity doesn't currently warrant a state machine. Could be beneficial for:

- Future favorites feature with persistence
- Complex loading/error states
- Multi-step flows

### 4. **Country Details Modal**

- **On-demand fetching**: Details only fetched when country is clicked
- **Body scroll lock**: Prevents background scrolling when modal is open ([countryDetailView.tsx:19,31](src/countryDetailView.tsx#L19))
- **Separate data type**: Uses [CountryDetails](src/types.ts#L16-L37) interface distinct from list view's [Country](src/types.ts#L1-L14) type

### 5. **Performance Optimizations**

- **Lazy image loading**: `loading="lazy"` on flag images
- **Sorted data**: Countries alphabetically sorted on initial load
- **Capital sorting**: Ensures consistent display for multi-capital countries
- **Field-specific API calls**: Reduces bandwidth by requesting only needed fields

### 6. **Testing Strategy**

- **Component tests**: React Testing Library for UI behavior ([src/tests/views/](src/tests/views/))
- **API tests**: Unit tests for data manager ([src/tests/api/](src/tests/api/))
- **MSW**: Mocks REST Countries API for reliable testing
- **Faker**: Generates test data

### 7. **Styling Approach**

- **Responsive**: Flexbox/Grid for adaptive layouts
- **No framework**: Vanilla CSS to meet requirements without unnecessary dependencies

## Development Process

Based on commit history, the implementation followed this sequence:

1. **Foundation**: Set up views and display logic with pagination vs. load-all toggle
2. **Testing**: Added comprehensive test coverage for main page
3. **Details view**: Implemented modal with on-demand data fetching
4. **Polish**: Added CSS styling for professional appearance
5. **Test expansion**: Added tests for country detail modal

## Future Enhancements

Potential improvements not yet implemented:

1. **Favorites**: Persistent storage using localStorage/IndexedDB
2. **Search/Filter**: By name, region, population, etc.
3. **Routing**: Utilize React Router for shareable URLs
4. **Virtualization**: For truly massive lists (react-window/react-virtual)
5. **Caching**: Store fetched data to avoid refetching
6. **Accessibility**: ARIA labels, keyboard navigation, focus management
7. **Loading states**: Skeletons/spinners for better UX
8. **Error boundaries**: Graceful error handling at component level

## Notes

- **Package manager**: pnpm chosen for performance and disk efficiency
- **Security**: All packages kept up-to-date with latest stable versions
- **Monorepo ready**: [pnpm-workspace.yaml](pnpm-workspace.yaml) prepared for future expansion
