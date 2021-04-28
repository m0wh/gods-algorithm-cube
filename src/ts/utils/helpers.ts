
export function range (val: number, inMin: number, inMax: number, outMin: number, outMax: number): number { return (val - inMin) * (outMax - outMin) / (inMax - inMin) + outMin }
export function lerp (start: number, end: number, amt: number): number { return (1 - amt) * start + amt * end }

export function randomGenerator (a?) {
  return a ? function (): number {
    var t = a += 0x6D2B79F5
    t = Math.imul(t ^ t >>> 15, t | 1)
    t ^= t + Math.imul(t ^ t >>> 7, t | 61)
    var r = ((t ^ t >>> 14) >>> 0) / 4294967296
    return r
  } : Math.random
}
