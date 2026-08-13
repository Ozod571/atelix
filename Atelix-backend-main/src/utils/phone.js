/**
 * Telefon raqamini normallashtirish (O'zbekiston)
 *  - Barcha belgilardan tozalaydi, faqat raqam
 *  - 9 xonali (9XXXXXXXX) bo'lsa oldiga 998 qo'shadi
 *  - Yakuniy format: 998XXXXXXXXX (12 xona)
 */
function normalizePhone(raw) {
  if (!raw) return "";
  let d = String(raw).replace(/\D/g, "");
  if (d.length === 9) d = "998" + d;             // 901234567 -> 998901234567
  if (d.length === 12 && d.startsWith("998")) return d;
  return d; // boshqa holatlar — o'zgarishsiz (validatsiya xato beradi)
}

/** To'g'ri O'zbekiston raqamimi (998 + 9 xona) */
function isValidUzPhone(d) {
  return /^998\d{9}$/.test(d);
}

/** Ko'rsatish uchun chiroyli format: +998 90 123 45 67 */
function formatPhone(d) {
  if (!isValidUzPhone(d)) return d;
  return `+998 ${d.slice(3, 5)} ${d.slice(5, 8)} ${d.slice(8, 10)} ${d.slice(10, 12)}`;
}

module.exports = { normalizePhone, isValidUzPhone, formatPhone };
