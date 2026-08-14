const isDataImage = (s, maxBytes = 3_200_000) =>
  typeof s === "string" &&
  /^data:image\/(png|jpe?g|webp|gif);base64,/.test(s) &&
  s.length < maxBytes;

module.exports = { isDataImage };
