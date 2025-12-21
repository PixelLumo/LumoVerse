# PixelLumoApp - Testing Guide with Jest

This document provides comprehensive testing setup and examples for both frontend and backend.

---

## 📊 Testing Overview

### Current State
- No automated tests
- Manual testing only
- No coverage tracking
- High risk of regression bugs

### Goals
- 70%+ code coverage
- Catch bugs before production
- Safe refactoring
- Better code quality
- Faster development

---

## 🧪 Frontend Testing Setup

### 1. Installation

```bash
# From root directory
npm install --save-dev jest babel-jest jest-mock-react-native
npm install --save-dev @testing-library/react-native @testing-library/jest-native
npm install --save-dev @testing-library/user-event
npm install --save-dev jest-timeout-in-seconds
npm install --save-dev @react-navigation/native --save-dev
```

### 2. Jest Configuration

**jest.config.js** (root directory)

```javascript
module.exports = {
  preset: 'react-native',
  
  // Test environment
  testEnvironment: 'node',
  
  // Setup files
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  
  // Module paths
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  
  // Ignore patterns
  testPathIgnorePatterns: [
    '/node_modules/',
    '/.expo/',
    '/build/',
  ],
  
  // Coverage settings
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
    '!src/index.js',
  ],
  
  // Coverage thresholds
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
    './src/utils/': {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
  
  // Timeout
  testTimeout: 10000,
};
```

**jest.setup.js**

```javascript
import '@testing-library/jest-native/extend-expect';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  multiSet: jest.fn(),
  multiGet: jest.fn(),
  clear: jest.fn(),
}));

// Mock navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
  }),
  useRoute: () => ({
    params: {},
  }),
}));

// Mock Socket.io
jest.mock('socket.io-client', () => ({
  io: jest.fn(() => ({
    on: jest.fn(),
    emit: jest.fn(),
    disconnect: jest.fn(),
  })),
}));

// Global test setup
global.fetch = jest.fn();
```

### 3. Package.json Scripts

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:debug": "node --inspect-brk node_modules/.bin/jest --runInBand",
    "test:ci": "jest --ci --coverage --maxWorkers=2"
  }
}
```

### 4. Example Frontend Tests

#### A. Component Testing

**src/components/Button.test.tsx**

```typescript
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import Button from './Button';

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button title="Click Me" />);
    expect(screen.getByText('Click Me')).toBeTruthy();
  });

  it('calls onPress when clicked', () => {
    const mockPress = jest.fn();
    render(<Button title="Click Me" onPress={mockPress} />);
    
    const button = screen.getByTestId('button');
    fireEvent.press(button);
    
    expect(mockPress).toHaveBeenCalledTimes(1);
  });

  it('disables when disabled prop is true', () => {
    const { getByTestId } = render(
      <Button title="Click Me" disabled={true} />
    );
    
    const button = getByTestId('button');
    expect(button.props.disabled).toBe(true);
  });

  it('shows loading state', () => {
    const { getByTestId } = render(
      <Button title="Click Me" loading={true} />
    );
    
    expect(getByTestId('button-loader')).toBeTruthy();
  });
});
```

#### B. Screen Testing

**src/screens/LoginScreen.test.tsx**

```typescript
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { AuthProvider } from '../../state/AuthContext';
import LoginScreen from './LoginScreen';

// Mock navigation
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

describe('LoginScreen', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders login form', () => {
    render(
      <AuthProvider>
        <LoginScreen />
      </AuthProvider>
    );
    
    expect(screen.getByTestId('email-input')).toBeTruthy();
    expect(screen.getByTestId('password-input')).toBeTruthy();
    expect(screen.getByTestId('login-button')).toBeTruthy();
  });

  it('shows error for invalid email', async () => {
    const { getByTestId } = render(
      <AuthProvider>
        <LoginScreen />
      </AuthProvider>
    );

    const emailInput = getByTestId('email-input');
    const loginButton = getByTestId('login-button');

    fireEvent.changeText(emailInput, 'invalid-email');
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid email/i)).toBeTruthy();
    });
  });

  it('shows error for empty password', async () => {
    const { getByTestId } = render(
      <AuthProvider>
        <LoginScreen />
      </AuthProvider>
    );

    const emailInput = getByTestId('email-input');
    const loginButton = getByTestId('login-button');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(screen.getByText(/password required/i)).toBeTruthy();
    });
  });

  it('navigates to home on successful login', async () => {
    // Mock API response
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            token: 'fake-token',
            user: { id: '1', email: 'test@example.com' },
          }),
      })
    );

    const { getByTestId } = render(
      <AuthProvider>
        <LoginScreen />
      </AuthProvider>
    );

    const emailInput = getByTestId('email-input');
    const passwordInput = getByTestId('password-input');
    const loginButton = getByTestId('login-button');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'TestPassword123!');
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('MainTab');
    });
  });
});
```

#### C. Hook Testing

**src/hooks/useAuth.test.ts**

```typescript
import { renderHook, act } from '@testing-library/react-native';
import { AuthProvider, useAuth } from '../state/AuthContext';

describe('useAuth Hook', () => {
  it('provides initial auth context', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('logs in user', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await act(async () => {
      await result.current.login('test@example.com', 'TestPassword123!');
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user?.email).toBe('test@example.com');
  });

  it('logs out user', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await act(async () => {
      await result.current.login('test@example.com', 'TestPassword123!');
    });

    expect(result.current.isAuthenticated).toBe(true);

    await act(async () => {
      await result.current.logout();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });
});
```

---

## 🧪 Backend Testing Setup

### 1. Installation

```bash
cd backend
npm install --save-dev jest supertest ts-jest @types/jest
npm install --save-dev @types/supertest
```

### 2. Jest Configuration

**backend/jest.config.js**

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>'],
  testMatch: ['**/__tests__/**/*.test.ts', '**/?(*.)+(spec|test).ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
    'routes/**/*.ts',
    'controllers/**/*.ts',
    'models/**/*.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  testTimeout: 10000,
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};
```

**backend/jest.setup.ts**

```typescript
import mongoose from 'mongoose';

// Set test database URL
process.env.MONGO_URI = 'mongodb://localhost:27017/pixellumo-test';
process.env.JWT_SECRET = 'test-secret-key';
process.env.NODE_ENV = 'test';

// Increase timeout for database operations
jest.setTimeout(10000);

// Cleanup after all tests
afterAll(async () => {
  await mongoose.connection.close();
});
```

### 3. Package.json Scripts

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:debug": "node --inspect-brk node_modules/.bin/jest --runInBand",
    "test:ci": "jest --ci --coverage --maxWorkers=2"
  }
}
```

### 4. Example Backend Tests

#### A. Route Testing

**backend/routes/__tests__/auth.test.ts**

```typescript
import request from 'supertest';
import app from '../../server';
import { User } from '../../models/User';

describe('Auth Routes', () => {
  beforeEach(async () => {
    // Clear users collection
    await User.deleteMany({});
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'newuser@example.com',
          password: 'SecurePassword123!',
          firstName: 'John',
          lastName: 'Doe',
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user.email).toBe('newuser@example.com');
      expect(res.body.user.password).toBeUndefined(); // Password should not be returned
    });

    it('should reject duplicate email', async () => {
      // Create first user
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'duplicate@example.com',
          password: 'SecurePassword123!',
          firstName: 'John',
          lastName: 'Doe',
        });

      // Try to create duplicate
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'duplicate@example.com',
          password: 'AnotherPassword123!',
          firstName: 'Jane',
          lastName: 'Smith',
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toContain('already exists');
    });

    it('should reject invalid email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'invalid-email',
          password: 'SecurePassword123!',
          firstName: 'John',
          lastName: 'Doe',
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toContain('email');
    });

    it('should reject weak password', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: '123', // Too short
          firstName: 'John',
          lastName: 'Doe',
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toContain('password');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create test user
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'testuser@example.com',
          password: 'TestPassword123!',
          firstName: 'Test',
          lastName: 'User',
        });
    });

    it('should login with correct credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'testuser@example.com',
          password: 'TestPassword123!',
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user.email).toBe('testuser@example.com');
    });

    it('should reject incorrect password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'testuser@example.com',
          password: 'WrongPassword123!',
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toContain('invalid');
    });

    it('should reject non-existent user', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'TestPassword123!',
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toContain('invalid');
    });
  });

  describe('GET /api/auth/me', () => {
    let token: string;

    beforeEach(async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'authtest@example.com',
          password: 'TestPassword123!',
          firstName: 'Auth',
          lastName: 'Test',
        });
      token = res.body.token;
    });

    it('should return current user with valid token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.email).toBe('authtest@example.com');
    });

    it('should reject request without token', async () => {
      const res = await request(app).get('/api/auth/me');

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toContain('token');
    });

    it('should reject invalid token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token');

      expect(res.statusCode).toBe(401);
    });
  });
});
```

#### B. Controller Testing

**backend/controllers/__tests__/auth.test.ts**

```typescript
import { Request, Response } from 'express';
import { authController } from '../authController';
import { User } from '../../models/User';
import bcrypt from 'bcryptjs';

describe('Auth Controller', () => {
  describe('register', () => {
    it('should create a new user', async () => {
      const mockReq = {
        body: {
          email: 'test@example.com',
          password: 'TestPassword123!',
          firstName: 'Test',
          lastName: 'User',
        },
      } as unknown as Request;

      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await authController.register(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalled();

      const response = (mockRes.json as jest.Mock).mock.calls[0][0];
      expect(response.user.email).toBe('test@example.com');
      expect(response.token).toBeDefined();
    });
  });

  describe('login', () => {
    beforeEach(async () => {
      await User.deleteMany({});
      // Create test user
      const hashedPassword = await bcrypt.hash('TestPassword123!', 12);
      await User.create({
        email: 'test@example.com',
        password: hashedPassword,
        firstName: 'Test',
        lastName: 'User',
      });
    });

    it('should login user with correct credentials', async () => {
      const mockReq = {
        body: {
          email: 'test@example.com',
          password: 'TestPassword123!',
        },
      } as unknown as Request;

      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await authController.login(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalled();

      const response = (mockRes.json as jest.Mock).mock.calls[0][0];
      expect(response.token).toBeDefined();
      expect(response.user.email).toBe('test@example.com');
    });
  });
});
```

#### C. Model Testing

**backend/models/__tests__/User.test.ts**

```typescript
import { User } from '../User';
import bcrypt from 'bcryptjs';

describe('User Model', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  it('should create a user', async () => {
    const user = await User.create({
      email: 'test@example.com',
      password: 'SecurePassword123!',
      firstName: 'Test',
      lastName: 'User',
    });

    expect(user.email).toBe('test@example.com');
    expect(user.firstName).toBe('Test');
    expect(user.lastName).toBe('User');
  });

  it('should hash password before saving', async () => {
    const plainPassword = 'SecurePassword123!';
    const user = await User.create({
      email: 'test@example.com',
      password: plainPassword,
      firstName: 'Test',
      lastName: 'User',
    });

    expect(user.password).not.toBe(plainPassword);
    expect(await bcrypt.compare(plainPassword, user.password)).toBe(true);
  });

  it('should enforce unique email', async () => {
    await User.create({
      email: 'unique@example.com',
      password: 'Password123!',
      firstName: 'Test',
      lastName: 'User',
    });

    expect(
      User.create({
        email: 'unique@example.com',
        password: 'Password123!',
        firstName: 'Another',
        lastName: 'User',
      })
    ).rejects.toThrow();
  });

  it('should validate email format', async () => {
    expect(
      User.create({
        email: 'invalid-email',
        password: 'Password123!',
        firstName: 'Test',
        lastName: 'User',
      })
    ).rejects.toThrow();
  });
});
```

---

## 📊 Running Tests

### Frontend

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage

# Debug specific test
npm run test:debug -- LoginScreen.test.tsx
```

### Backend

```bash
cd backend

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage

# Run specific test suite
npm test -- auth.test.ts
```

### CI/CD

```bash
# Run tests with coverage for CI pipeline
npm run test:ci
```

---

## 📈 Coverage Goals

### By Category

| Area | Target | Current |
|------|--------|---------|
| Utils/Helpers | 95% | 0% |
| Services | 80% | 0% |
| Components | 75% | 0% |
| Screens | 70% | 0% |
| Controllers | 80% | 0% |
| Models | 85% | 0% |

---

## 🧪 Best Practices

### Do's ✅
- Test business logic, not implementation details
- Use descriptive test names
- Keep tests isolated and independent
- Mock external dependencies
- Test both success and failure cases
- Aim for high coverage on critical paths
- Use setup/teardown for common operations
- Group related tests with describe blocks

### Don'ts ❌
- Don't test library functionality
- Don't create overly complex assertions
- Don't share state between tests
- Don't test UI details (just functionality)
- Don't have hard dependencies on timing
- Don't write tests that are brittle
- Don't skip edge cases
- Don't ignore test warnings

---

## 📚 Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Native Testing](https://reactnative.dev/docs/testing-overview)
- [Testing Library](https://testing-library.com/docs/react-native-testing-library/intro/)
- [Supertest](https://github.com/visionmedia/supertest)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

**Last Updated**: December 21, 2025  
**Status**: Testing Guide Complete  
**Recommended**: Implement gradually, start with high-impact tests
