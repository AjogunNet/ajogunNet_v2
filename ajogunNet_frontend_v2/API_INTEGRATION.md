# AjogunNet API Integration

This document outlines the integration between the AjogunNet frontend and the backend API service.

## API Endpoints

The application integrates with the backend service at `https://ajogun-willon-sui-2.onrender.com/` with the following endpoints:

### Wallet Management
- **POST** `/wallet/create` - Create a new wallet
- **GET** `/wallet/:ownerAddress` - Get wallet information
- **GET** `/wallet/balance/:ownerAddress` - Get wallet balance
- **POST** `/wallet/transfer` - Transfer tokens

### Will Management
- **POST** `/will/create` - Create a new will
- **POST** `/will/update-activity/:willIndex` - Update will activity
- **POST** `/will/revoke/:willIndex` - Revoke a will
- **GET** `/will/get-all/:ownerAddress` - Get all wills for an owner

### Will Execution
- **POST** `/will/execute/:willIndex/:ownerAddress` - Execute will manually
- **POST** `/will/execute/automatic/:willIndex/:ownerAddress` - Auto execute will

## Integration Components

### 1. API Service Layer (`lib/api-service.ts`)
- Centralized API client with TypeScript interfaces
- Support for both wallet and will management endpoints
- userId/password authentication for all operations
- Error handling and request/response transformation

### 2. Authentication Context (`lib/auth-context.tsx`)
- Manages user credentials (userId/password)
- Persistent login state
- Secure credential storage

### 3. Custom Hook (`hooks/use-api.ts`)
- React hook for API operations with loading states
- Integration with auth context for credentials
- Comprehensive error handling and user notifications

### 4. Auth Modal (`components/auth-modal.tsx`)
- Login and signup functionality
- Automatic wallet creation on signup
- Form validation and error handling

### 5. Will Dashboard (`components/will-dashboard.tsx`)
- Displays user's wills from the API
- Real-time status checking
- Activity updates and will management actions

### 6. Will Creation Flow (`components/will-creation-flow.tsx`)
- Updated to use new API structure
- Simplified heir/share format
- Authentication-based deployment

## Data Flow

1. **User signup/login** → Credentials stored in auth context → Wallet created automatically on signup
2. **Create will** → Form data with userId/password sent to `/will/create` → Will deployed to blockchain
3. **Dashboard loads** → Fetch wills from `/will/get-all/:ownerAddress` → Display user's wills
4. **Activity updates** → Calls to `/will/update-activity/:willIndex` with credentials → Reset execution timer
5. **Token transfers** → `/wallet/transfer` with recipient and amount → Blockchain transaction

## Key Features

### Real Wallet Integration
- Actual wallet creation via API
- Real balance fetching from blockchain
- Secure token transfers

### User Authentication
- Username/password based authentication
- Persistent login sessions
- Secure credential storage

### Will Management
- Simplified heir/share structure
- Real blockchain deployment
- Activity tracking with authentication

### Error Handling
- Network error recovery
- User-friendly error messages
- Comprehensive validation

### Security
- User-based authentication
- Encrypted API communication
- Secure wallet operations

## Usage Examples

### User Authentication
```typescript
const { login, isAuthenticated } = useAuth()

// Login
login("username", "password")

// Check authentication status
if (isAuthenticated) {
  // User is logged in
}
```

### Creating a Wallet
```typescript
const { createWallet } = useApi()

const result = await createWallet({
  userId: "username",
  password: "password"
})
```

### Creating a Will
```typescript
const { createWill } = useApi()
const { userId, password } = useAuth()

const willData = {
  userId,
  password,
  heirs: ["0x123...", "0x456..."],
  shares: ["50", "50"],
  amount: "1000"
}

const result = await createWill(willData)
```

### Fetching User Wills
```typescript
const { fetchWills, willsState } = useApi()

useEffect(() => {
  if (address) {
    fetchWills()
  }
}, [address])

// Access wills data
const wills = willsState.data
```

### Updating Will Activity
```typescript
const { updateActivity } = useApi()
const { userId, password } = useAuth()

await updateActivity(willIndex, userId, password)
```

## Environment Setup

1. Ensure the API service is running at the configured URL
2. Update `API_BASE_URL` in `lib/api-service.ts` if needed
3. Configure CORS settings on the backend for your domain

## Error Handling

The integration includes comprehensive error handling:
- Network connectivity issues
- API server errors
- Invalid request data
- Authentication failures

All errors are displayed to users through the notification system and logged for debugging.

## Future Enhancements

- WebSocket integration for real-time updates
- Batch operations for multiple wills
- Advanced filtering and search
- Export functionality for will data
- Integration with blockchain explorers