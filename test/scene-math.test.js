import { describe, it, expect } from 'vitest';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const SceneMath = require('../lib/scene-math.js');

describe('clamp', () => {
  it('returns the value when within range', () => {
    expect(SceneMath.clamp(5, 0, 10)).toBe(5);
  });

  it('returns the minimum when below range', () => {
    expect(SceneMath.clamp(-3, 0, 10)).toBe(0);
  });

  it('returns the maximum when above range', () => {
    expect(SceneMath.clamp(42, 0, 10)).toBe(10);
  });
});

describe('easeInOutQuad', () => {
  it('starts at 0 and ends at 1', () => {
    expect(SceneMath.easeInOutQuad(0)).toBe(0);
    expect(SceneMath.easeInOutQuad(1)).toBe(1);
  });

  it('is symmetric around the midpoint', () => {
    expect(SceneMath.easeInOutQuad(0.5)).toBeCloseTo(0.5, 10);
    expect(SceneMath.easeInOutQuad(0.25) + SceneMath.easeInOutQuad(0.75)).toBeCloseTo(1, 10);
  });

  it('increases monotonically', () => {
    let previous = -Infinity;
    for (let t = 0; t <= 1; t += 0.1) {
      const value = SceneMath.easeInOutQuad(t);
      expect(value).toBeGreaterThanOrEqual(previous);
      previous = value;
    }
  });
});

describe('cameraPosition', () => {
  it('places the camera on the +z axis for theta = 0', () => {
    const p = SceneMath.cameraPosition({ theta: 0, phi: Math.PI / 2, radius: 10, panX: 0, panY: 0 });
    expect(p.x).toBeCloseTo(0, 6);
    expect(p.y).toBeCloseTo(0, 6);
    expect(p.z).toBeCloseTo(10, 6);
  });

  it('applies pan offsets', () => {
    const p = SceneMath.cameraPosition({ theta: 0, phi: Math.PI / 2, radius: 10, panX: 1, panY: 2 });
    expect(p.x).toBeCloseTo(1, 6);
    expect(p.y).toBeCloseTo(2, 6);
  });

  it('honours the radius as distance from the pan origin', () => {
    const p = SceneMath.cameraPosition({ theta: 0.7, phi: 0.9, radius: 30, panX: 0, panY: 1.5 });
    const distance = Math.sqrt((p.x) ** 2 + (p.y - 1.5) ** 2 + p.z ** 2);
    expect(distance).toBeCloseTo(30, 6);
  });
});

describe('lean', () => {
  it('is deterministic for a given index', () => {
    expect(SceneMath.lean(3)).toBe(SceneMath.lean(3));
  });

  it('stays within the decorative tolerance', () => {
    for (let i = 0; i < 20; i++) {
      expect(Math.abs(SceneMath.lean(i))).toBeLessThanOrEqual(0.04);
    }
  });

  it('varies across indices', () => {
    expect(SceneMath.lean(1)).not.toBe(SceneMath.lean(2));
  });
});

describe('VIEWS', () => {
  it('defines every preset view with numeric fields', () => {
    ['front', 'side', 'top', 'iso', 'pool'].forEach((name) => {
      const view = SceneMath.VIEWS[name];
      expect(view).toBeDefined();
      ['t', 'p', 'r', 'px', 'py'].forEach((key) => {
        expect(typeof view[key]).toBe('number');
      });
    });
  });

  it('exposes clamp bounds used by the controls', () => {
    expect(SceneMath.MIN_PHI).toBeLessThan(SceneMath.MAX_PHI);
    expect(SceneMath.MIN_RADIUS).toBeLessThan(SceneMath.MAX_RADIUS);
  });
});
