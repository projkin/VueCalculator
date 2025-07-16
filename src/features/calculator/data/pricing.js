// Этот файл содержит только информацию о ценах.
export const priceMatrix = {
  Ramochnaya: {
    Standartnoe: {
      White: 1000,
      Brown: 1100,
      Gray: 1150,
      Ral: 3000,
    },
    Antikoshka: {
      White: 1300,
      Brown: 1400,
      Gray: 1450,
      Ral: 1300,
    },
    Antipylca: {
      White: 1200,
      Brown: 1300,
      Gray: 1350,
      Ral: 1200,
    },
  },
  VstavnieVsn: {
    Standartnoe: {
      White: 1200,
      Brown: 1300,
      Gray: 1350,
      Ral: 1200,
    },
    Antikoshka: {
      White: 1500,
      Brown: 1600,
      Gray: 1650,
      Ral: 1500,
    },
    Ultravyu: {
      White: 1400,
      Brown: 1500,
      Gray: 1550,
      Ral: 1400,
    },
  },
  // ... и так далее для всех профилей и их комбинаций
};

export const optionsPriceMatrix = {
  Ramochnaya: {
    Fasteners: {
      Plunger: 1200,
      ZMetal: 600,
      ZPlastic: 100,
    },
    Corners: {
      Metal: 350,
      Plastic: 0,
    },
    Handles: {
      Metal: 150,
      Silicon: 0,
    },
    WindowType: {
      Aluminum: 500,
      Plastic: 400,
      NoInstall: 0,
    },
    ReinforcedInstall: {
      Yes: 300,
      No: 0,
    }
  },
  VstavnieVsn: {},
  Razdvizhnaya: {},
  UsilenniyProfil: {},
  DverSetka: {},
  DverSetkaUsilennaya: {},
  PlisseRussia: {},
  PlisseItaly: {},
  RulonnayaItaly: {},
  RulonnayaRussia: {},
  Perekatka: {},
  UsilenniyProfil42mm: {},
  VstavnieVsn45: {},
};

export const RAL_COST = 8500;

export const DELIVERY_PRICING = {
  MIN: 500,
  DISTANCE: 40,
};
