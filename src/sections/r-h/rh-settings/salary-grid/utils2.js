/**
 * @file This module provides functions for calculating the Algerian IRG tax for 2020.
 * @author Converted from Java by a helpful AI assistant
 * @version 1.0.0
 */

/**
 * A namespace for the IRG calculation functions.
 * @namespace
 */
// const irg2020 = {
/**
 * The tax brackets for the 2020 IRG calculation.
 * @private
 * @type {number[][]}
 */
const _TAB07 = [
  [0, 0, 0],
  [240000, 23, 55200],
  [480000, 27, 184800],
  [960000, 30, 472800],
  [1920000, 33, 1106400],
  [3840000, 35, 3262399.65],
];

/**
 * Calculates the base IRG (Impôt sur le Revenu Global).
 * @param {number} soumis - The monthly taxable amount.
 * @returns {number} The calculated monthly IRG.
 */
function c_irg(soumis) {
  const BRTS = 12 * soumis;
  let skip = 0;

  for (let i = 0; i < _TAB07.length; i++) {
    if (BRTS > _TAB07[i][0]) {
      skip = i + 1;
    } else {
      break;
    }
  }

  const Taux = _TAB07[skip - 1][1];
  const TB = _TAB07[skip - 1][0];
  const TD = _TAB07[skip - 1][2];

  const N = BRTS - TB;
  const IMPOTA = (N * Taux) / 100 + TD;
  const IMPM = IMPOTA / 12;

  let abat = (40 * IMPM) / 100;
  if (abat < 1000) {
    abat = 1000;
  } else if (abat > 1500) {
    abat = 1500;
  }

  let ret = IMPM - abat;
  if (ret < 0) {
    ret = 0;
  }

  return ret;
}

/**
 * Calculates the final IRG amount, considering special conditions like disabilities or retirement.
 * @param {number} s_iv - The monthly taxable amount.
 * @param {boolean} isHandicappedOrRetired - True if the person is handicapped or retired.
 * @returns {number|null} The final IRG amount, or null if the input is invalid.
 */
export function calculateIrg2022(s_iv, isHandicappedOrRetired) {
  if (!isNumeric(s_iv) || s_iv === '') return null;

  const monthlyTaxableAmount = parseFloat(s_iv);
  const irg = c_irg(monthlyTaxableAmount);
  let finalIrg = irg;

  if (isHandicappedOrRetired) {
    if (monthlyTaxableAmount <= 42500) {
      let x = (irg * 93) / 61;
      let y = 81213 / 41;
      finalIrg = x - y;
    }
  } else {
    if (monthlyTaxableAmount <= 35000) {
      let x = (irg * 137) / 51;
      let y = 27925 / 8;
      finalIrg = x - y;
    }
  }

  if (monthlyTaxableAmount <= 30000) {
    finalIrg = 0;
  }

  if (finalIrg < 0) {
    finalIrg = 0;
  }

  return finalIrg;
}

/**
 * Checks if a string is a numeric value.
 * @param {*} str - The string to check.
 * @returns {boolean} True if the string is numeric, otherwise false.
 */
function isNumeric(str) {
  if (typeof str !== 'number') return false; // we only process strings!
  return (
    !isNaN(str) && // use type coercion to parse the entirety of the string
    !isNaN(parseFloat(str))
  ); // ...and ensure strings of whitespace fail
}

/**
 * Formats a number to two decimal places with thousand separators.
 * @param {number} num - The number to format.
 * @returns {string} The formatted number as a string.
 */

export function formatNumber(num) {
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
