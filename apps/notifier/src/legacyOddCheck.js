// Legacy helper, not part of the TS build (tsconfig's include is *.ts only)
// — kept as plain CJS on purpose. Static named-import usage of is-odd, used
// to real-world-verify the static-incompatible false-positive FIX
// (packdev-agents: isConfidentStaticRegression now also checks the
// control): is-odd only ever ships a default function export, never a
// named "isOdd" — missing at EVERY version, so this is a pre-existing
// issue, not something a version bump introduces.
const { isOdd } = require("is-odd");

module.exports = { isOdd };
