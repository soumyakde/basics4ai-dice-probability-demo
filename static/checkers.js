// Answer-checking functions. Facilitator types free-text on behalf of a
// group; these parse reasonably flexible formats and check mathematical
// equivalence rather than exact string matching.

function parseIntSafe(str) {
  const n = parseInt(String(str).trim(), 10);
  return Number.isNaN(n) ? null : n;
}

// "1, 2, 3, 4, 5, 6" -> [1,2,3,4,5,6] (dedup, sorted) — any non-digit
// (except minus) separates numbers.
function parseNumberSet(input) {
  const nums = (input.match(/-?\d+/g) || []).map(Number);
  return [...new Set(nums)].sort((a, b) => a - b);
}

function checkNumberSet(input, expected) {
  const got = parseNumberSet(input);
  const exp = [...expected].sort((a, b) => a - b);
  return got.length === exp.length && got.every((v, i) => v === exp[i]);
}

function checkInteger(input, expected) {
  const got = parseIntSafe(input);
  return got !== null && got === expected;
}

// Accepts "1/6", "0.1667", "1", "6/36" etc. Compares numeric value with tolerance.
function parseFractionValue(input) {
  const str = String(input).trim();
  const fracMatch = str.match(/^(-?\d+(?:\.\d+)?)\s*\/\s*(-?\d+(?:\.\d+)?)$/);
  if (fracMatch) {
    const num = parseFloat(fracMatch[1]);
    const den = parseFloat(fracMatch[2]);
    if (den === 0) return null;
    return num / den;
  }
  const num = parseFloat(str.replace(/%$/, ""));
  if (Number.isNaN(num)) return null;
  return str.trim().endsWith("%") ? num / 100 : num;
}

function checkFraction(input, expectedValue, tolerance = 0.001) {
  const got = parseFractionValue(input);
  return got !== null && Math.abs(got - expectedValue) < tolerance;
}

// "6,1; 6,2" / "6-1, 6-2" / "(6,1) (6,2)" -> [[6,1],[6,2]], order of pairs
// doesn't matter but the order WITHIN a pair does (6,1) != (1,6). Dice
// faces are always 1-6 (never negative), so numbers have no sign — this
// also avoids misreading a "-" separator as part of the second number.
function parsePairSet(input) {
  const pairs = [];
  const re = /\(?\s*(\d+)\s*[,\-+]\s*(\d+)\s*\)?/g;
  let match;
  while ((match = re.exec(input)) !== null) {
    pairs.push([Number(match[1]), Number(match[2])]);
  }
  return pairs;
}

function checkPairSet(input, expectedPairs) {
  const got = parsePairSet(input);
  if (got.length !== expectedPairs.length) return false;
  const gotSet = new Set(got.map(([a, b]) => `${a},${b}`));
  const expSet = new Set(expectedPairs.map(([a, b]) => `${a},${b}`));
  if (gotSet.size !== expSet.size) return false;
  for (const key of expSet) if (!gotSet.has(key)) return false;
  return true;
}

function checkYesNo(input, expected) {
  const str = String(input).trim().toLowerCase();
  const truthy = ["yes", "y", "true"];
  const falsy = ["no", "n", "false"];
  if (truthy.includes(str)) return expected === true;
  if (falsy.includes(str)) return expected === false;
  return false; // unrecognized input treated as wrong, explanation still shown
}
