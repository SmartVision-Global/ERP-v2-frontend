const TAB07 = [
  [0, 0, 0],
  [240000, 0, 0],
  [480000, 23, 55200],
  [960000, 27, 184800],
  [1920000, 30, 472800],
  [3840000, 33, 1106400],
  [9999999, 35, 3262399.65],
];

let IMPM = 0;
let ABAT = 0;
let RET = 0;
let TAUX = 0;
let TB = 0;
let TD = 0;

// Main IRG calculation function
function c_irg(SOUMIS) {
  const BRTS = 12 * SOUMIS;
  let SKIP = 0;

  for (let i = 0; i < TAB07.length; i++) {
    if (BRTS <= TAB07[i][0]) {
      break;
    } else {
      SKIP = i + 1;
    }
  }

  TAUX = SKIP > 4 ? TAB07[SKIP - 1][1] : TAB07[SKIP][1];

  if (SKIP === 0) {
    TB = TAB07[SKIP][0];
    TD = TAB07[SKIP][2];
  } else {
    TB = TAB07[SKIP - 1][0];
    TD = TAB07[SKIP - 1][2];
  }

  const N = BRTS - TB;
  const IMPOTA = (N * TAUX) / 100 + TD;

  IMPM = IMPOTA / 12;
  ABAT = (40 * IMPM) / 100;

  if (ABAT < 1000) ABAT = 1000;
  if (ABAT > 1500) ABAT = 1500;

  RET = IMPM - ABAT;
  return RET < 0 ? 0 : RET;
}

// Full calculation logic (similar to jButton2ActionPerformed)
export function calculateIRG2025(s_iv, isHandicapped) {
  let irg = c_irg(s_iv);

  let n_rv = irg;

  if (isHandicapped) {
    if (s_iv <= 42500) {
      let x = (irg * 93) / 61;
      let y = 81213 / 41;
      n_rv = x - y;

      if (n_rv < 0) n_rv = 0;
      if (s_iv <= 30000) n_rv = 0;
    }
  } else {
    if (s_iv <= 35000) {
      let x = (irg * 137) / 51;
      let y = 27925 / 8;
      n_rv = x - y;

      if (n_rv < 0) n_rv = 0;
      if (s_iv <= 30000) n_rv = 0;
    }
  }
  return n_rv;
}
