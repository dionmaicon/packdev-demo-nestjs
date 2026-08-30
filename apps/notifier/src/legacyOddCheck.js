// Legacy helper, not part of the TS build (tsconfig's include is *.ts only)
// — kept as plain CJS on purpose. Static named-import usage of is-odd, used
// to real-world-verify the api-diff static pre-filter (packdev-agents T13):
// is-odd only ever ships a default function export, never a named "isOdd".
const { isOdd } = require("is-odd");

module.exports = { isOdd };
