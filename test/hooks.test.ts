import { describe, expect, it } from 'vitest';
import { Axette } from '../src/index';

/**
* @vitest-environment jsdom
*/
describe("add", () => {
  const axette = new Axette();

  it("Add hook", () => {
    axette.on('beforeAjax', () => {});
    expect(axette.hooks.beforeAjax.length).toBe(1);
    axette.off('beforeAjax');
  });

  it("Add hook with ID", () => {
    const axette = new Axette();
    axette.on('beforeAjax', () => {}, [], 'test');
    expect(axette.hooks.beforeAjax.findIndex(h => h.id === 'test')).toBeGreaterThan(-1);
  });

  it("Remove hook by ID", () => {
    axette.off('beforeAjax', undefined, 'test');
    expect(axette.hooks.beforeAjax.findIndex(h => h.id === 'test')).toBe(-1);
  });
});
