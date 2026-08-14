function normalizePhone(raw) {
  if (!raw) return "";
  let d = String(raw).replace(/\D/g, "");
  if (d.length === 9) d = "998" + d;
  if (d.length === 12 && d.startsWith("998")) return d;
  return d;
}

function isValidUzPhone(d) {
  return /^998\d{9}$/.test(d);
}

function formatPhone(d) {
  if (!isValidUzPhone(d)) return d;
  return `+998 ${d.slice(3, 5)} ${d.slice(5, 8)} ${d.slice(8, 10)} ${d.slice(10, 12)}`;
}

module.exports = { normalizePhone, isValidUzPhone, formatPhone };
