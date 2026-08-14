const MEASUREMENT_FIELDS = [
  { key: "height",        label: "Bo'y (umumiy uzunlik)",     min: 100, max: 220 },
  { key: "chest",         label: "Ko'krak aylanasi",          min: 40,  max: 200 },
  { key: "chestSpan",     label: "Ko'krak oralig'i",          min: 10,  max: 60  },
  { key: "chestLength",   label: "Ko'krakgacha uzunlik",      min: 15,  max: 90  },
  { key: "waist",         label: "Bel aylanasi",              min: 40,  max: 200 },
  { key: "waistLength",   label: "Belgacha uzunlik",          min: 20,  max: 110 },
  { key: "collar",        label: "Yoqa (bo'yin aylanasi)",    min: 20,  max: 70  },
  { key: "sleeveLength",  label: "Yeng uzunligi",             min: 20,  max: 100 },
  { key: "sleeveWidth",   label: "Yeng kengligi",             min: 8,   max: 60  },
  { key: "hips",          label: "Bo'ksa aylanasi",           min: 40,  max: 200 },
  { key: "hipsLength",    label: "Bo'ksagacha uzunlik",       min: 15,  max: 100 },
  { key: "shoulderWidth", label: "Yelka kengligi",            min: 20,  max: 80  },
  { key: "pantsWidth",    label: "Lozim/bryuk kengligi",      min: 8,   max: 80  },
];

const MEASUREMENT_KEYS = MEASUREMENT_FIELDS.map((f) => f.key);

module.exports = { MEASUREMENT_FIELDS, MEASUREMENT_KEYS };
