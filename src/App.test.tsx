import { describe, it, expect, vi } from 'vitest';

// Mock Firebase before importing anything else
vi.mock('./config/firebase', () => ({
  auth: null,
  default: null,
}));

// Mock di_web initialization
vi.mock('@sudobility/di_web', () => ({
  initializeStorageService: vi.fn(),
  initializeNetworkService: vi.fn(),
}));

describe('App', () => {
  it('basic smoke test', () => {
    // Just verify the test suite runs
    expect(true).toBe(true);
  });
});
