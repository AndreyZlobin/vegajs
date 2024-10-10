import { beforeEach, describe, expect, it, vi } from 'vitest';
import { QueryStringAdapter } from './query-string-adapter';

describe('QueryStringAdapter', () => {
  describe('Client-side behavior', () => {
    beforeEach(() => {
      Object.defineProperty(global, 'window', {
        writable: true,
        value: {
          location: {
            search: '?key=value',
            pathname: '/test-path',
          },
          history: {
            replaceState: vi.fn(),
          },
        },
      });
    });

    it('should get item from query string', () => {
      const adapter = new QueryStringAdapter();

      expect(adapter.getItemSync('key')).toBe('value');
    });

    it('should return null if key does not exist', () => {
      const adapter = new QueryStringAdapter();

      expect(adapter.getItemSync('nonexistentKey')).toBeNull();
    });

    it('should set item in query string', () => {
      const adapter = new QueryStringAdapter();

      adapter.setItemSync('newKey', 'newValue');

      expect(global.window.history.replaceState).toHaveBeenCalledWith(
        null,
        '',
        '/test-path?key=value&newKey=newValue',
      );
    });

    it('should delete an item from query string', () => {
      const adapter = new QueryStringAdapter();

      adapter.clearItem('key');

      expect(global.window.history.replaceState).toHaveBeenCalledWith(
        null,
        '',
        '/test-path?',
      );
    });

    it('should clear all items from query string', () => {
      const adapter = new QueryStringAdapter();

      adapter.clear();

      expect(global.window.history.replaceState).toHaveBeenCalledWith(
        null,
        '',
        '/test-path?',
      );
    });

    it('should check if a key exists in query string', () => {
      const adapter = new QueryStringAdapter();

      expect(adapter.has('key')).toBe(true);
      expect(adapter.has('nonexistentKey')).toBe(false);
    });
  });
});
