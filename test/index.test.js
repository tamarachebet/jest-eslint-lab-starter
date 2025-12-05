const { capitalizeWords, filterActiveUsers, logAction } = require('../index');

describe('capitalizeWords function', () => {
  test('should capitalize each word in a string', () => {
    expect(capitalizeWords('hello world')).toBe('Hello World');
  });

  // Edge cases
  test('should handle empty string', () => {
    expect(capitalizeWords('')).toBe('');
  });

  test('should handle strings with special characters', () => {
    expect(capitalizeWords('hello-world')).toBe('Hello-world');
    expect(capitalizeWords('test_string')).toBe('Test_string');
    expect(capitalizeWords('hello.world')).toBe('Hello.world');
  });

  test('should handle single-word strings', () => {
    expect(capitalizeWords('hello')).toBe('Hello');
    expect(capitalizeWords('WORLD')).toBe('WORLD');
    expect(capitalizeWords('a')).toBe('A');
  });

  test('should handle strings with multiple spaces', () => {
    expect(capitalizeWords('hello   world')).toBe('Hello   World');
    expect(capitalizeWords('  leading trailing  ')).toBe('  Leading Trailing  ');
  });

  test('should handle strings with numbers', () => {
    expect(capitalizeWords('hello 123 world')).toBe('Hello 123 World');
    expect(capitalizeWords('123abc def')).toBe('123abc Def');
  });
});

describe('filterActiveUsers function', () => {
  // Test with mixed active/inactive users
  test('should filter active users from mixed array', () => {
    const users = [
      { id: 1, name: 'Alice', isActive: true },
      { id: 2, name: 'Bob', isActive: false },
      { id: 3, name: 'Charlie', isActive: true },
      { id: 4, name: 'Diana', isActive: false },
    ];

    const result = filterActiveUsers(users);
    expect(result).toEqual([
      { id: 1, name: 'Alice', isActive: true },
      { id: 3, name: 'Charlie', isActive: true },
    ]);
    expect(result).toHaveLength(2);
  });

  test('should handle all inactive users', () => {
    const users = [
      { id: 1, name: 'Alice', isActive: false },
      { id: 2, name: 'Bob', isActive: false },
    ];

    const result = filterActiveUsers(users);
    expect(result).toEqual([]);
    expect(result).toHaveLength(0);
  });

  test('should handle all active users', () => {
    const users = [
      { id: 1, name: 'Alice', isActive: true },
      { id: 2, name: 'Bob', isActive: true },
    ];

    const result = filterActiveUsers(users);
    expect(result).toEqual(users);
    expect(result).toHaveLength(2);
  });

  test('should handle empty array', () => {
    const users = [];
    const result = filterActiveUsers(users);
    expect(result).toEqual([]);
    expect(result).toHaveLength(0);
  });

  test('should handle users without isActive property (assume inactive)', () => {
    const users = [
      { id: 1, name: 'Alice', isActive: true },
      { id: 2, name: 'Bob' }, // Missing isActive property
      { id: 3, name: 'Charlie', isActive: false },
    ];

    const result = filterActiveUsers(users);
    expect(result).toEqual([
      { id: 1, name: 'Alice', isActive: true },
    ]);
  });

  test('should handle users with different property names', () => {
    const users = [
      { id: 1, name: 'Alice', isActive: true },
      { id: 2, name: 'Bob', active: true }, // Wrong property name
    ];

    const result = filterActiveUsers(users);
    expect(result).toEqual([
      { id: 1, name: 'Alice', isActive: true },
    ]);
  });
});

describe('logAction function', () => {
  // Store the original Date
  const OriginalDate = global.Date;

  beforeEach(() => {
    // Reset Date mock before each test
    jest.restoreAllMocks();
  });

  afterAll(() => {
    // Restore original Date after all tests
    global.Date = OriginalDate;
  });

  // Normal cases - Note: The implementation includes timestamp
  test('should generate correct log string for valid inputs', () => {
    // Mock Date for consistent testing
    const mockDate = new Date('2024-01-01T12:00:00.000Z');
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate);

    expect(logAction('login', 'alice123')).toBe('User alice123 performed login at 2024-01-01T12:00:00.000Z');
    expect(logAction('logout', 'bob_smith')).toBe('User bob_smith performed logout at 2024-01-01T12:00:00.000Z');
    expect(logAction('update_profile', 'charlie99')).toBe('User charlie99 performed update_profile at 2024-01-01T12:00:00.000Z');
  });

  // Edge cases
  test('should handle empty strings as inputs', () => {
    const mockDate = new Date('2024-01-01T12:00:00.000Z');
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate);

    expect(logAction('', '')).toBe('User  performed  at 2024-01-01T12:00:00.000Z');
    expect(logAction('login', '')).toBe('User  performed login at 2024-01-01T12:00:00.000Z');
    expect(logAction('', 'alice123')).toBe('User alice123 performed  at 2024-01-01T12:00:00.000Z');
  });

  test('should handle missing arguments (undefined)', () => {
    const mockDate = new Date('2024-01-01T12:00:00.000Z');
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate);

    expect(logAction(undefined, 'alice123')).toBe('User alice123 performed undefined at 2024-01-01T12:00:00.000Z');
    expect(logAction('login', undefined)).toBe('User undefined performed login at 2024-01-01T12:00:00.000Z');
    expect(logAction(undefined, undefined)).toBe('User undefined performed undefined at 2024-01-01T12:00:00.000Z');
  });

  test('should handle null values', () => {
    const mockDate = new Date('2024-01-01T12:00:00.000Z');
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate);

    expect(logAction(null, 'alice123')).toBe('User alice123 performed null at 2024-01-01T12:00:00.000Z');
    expect(logAction('login', null)).toBe('User null performed login at 2024-01-01T12:00:00.000Z');
    expect(logAction(null, null)).toBe('User null performed null at 2024-01-01T12:00:00.000Z');
  });

  test('should handle whitespace in inputs', () => {
    const mockDate = new Date('2024-01-01T12:00:00.000Z');
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate);

    expect(logAction('  login  ', '  alice  ')).toBe('User   alice   performed   login   at 2024-01-01T12:00:00.000Z');
    expect(logAction('log action', 'user name')).toBe('User user name performed log action at 2024-01-01T12:00:00.000Z');
  });

  test('should handle special characters in inputs', () => {
    const mockDate = new Date('2024-01-01T12:00:00.000Z');
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate);

    expect(logAction('login@', 'user#123')).toBe('User user#123 performed login@ at 2024-01-01T12:00:00.000Z');
    expect(logAction('action-1', 'admin_user')).toBe('User admin_user performed action-1 at 2024-01-01T12:00:00.000Z');
  });

  test('should handle numeric inputs', () => {
    const mockDate = new Date('2024-01-01T12:00:00.000Z');
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate);

    expect(logAction(123, 'alice')).toBe('User alice performed 123 at 2024-01-01T12:00:00.000Z');
    expect(logAction('login', 456)).toBe('User 456 performed login at 2024-01-01T12:00:00.000Z');
    expect(logAction(123, 456)).toBe('User 456 performed 123 at 2024-01-01T12:00:00.000Z');
  });

  test('should include actual timestamp in output', () => {
    const before = new Date();
    const result = logAction('test', 'user');
    const after = new Date();

    // Extract timestamp from result
    const timestampString = result.split(' at ')[1];
    const resultTimestamp = new Date(timestampString);

    // Check if timestamp is between before and after
    expect(resultTimestamp.getTime()).toBeGreaterThanOrEqual(before.getTime());
    expect(resultTimestamp.getTime()).toBeLessThanOrEqual(after.getTime());
  });
});