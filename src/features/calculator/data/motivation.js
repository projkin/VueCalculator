export const motivationMatrix = {
  Ramochnaya: {
    Standartnoe: { assembler: 100, installer: 200 },
    Antikoshka:  { assembler: 150, installer: 250 },
    Antipylca: { assembler: 120, installer: 220 },
  },
  VstavnieVsn: {
    Standartnoe: { assembler: 110, installer: 210 },
    Antikoshka: { assembler: 160, installer: 260 },
    Ultravyu: { assembler: 140, installer: 240 },
    AntipylAntimoshka: { assembler: 130, installer: 230 },
  },
  // ... и так далее для остальных комбинаций
};

export const addonMotivation = {
  installer: {
    Fasteners: {
      Plunger: 100,
      ZMetal: 0,
      ZPlastic: 0,
    },
    Corners: {
      Metal: 50,
      Plastic: 0,
    },
    Handles: {
      Metal: 30,
      Silicon: 0,
    },
    WindowType: {
      Aluminum: 100,
      Plastic: 0,
      NoInstall: 0,
    },
    ReinforcedInstall: {
      Yes: 100,
      No: 0,
    },
  },
  assembler: {
    Fasteners: {
      Plunger: 50,
      ZMetal: 0,
      ZPlastic: 0,
    },
    Corners: {
      Metal: 40,
      Plastic: 0,
    },
    Handles: {
      Metal: 40,
      Silicon: 0,
    },
    WindowType: {
      Aluminum: 0,
      Plastic: 0,
      NoInstall: 0,
    },
    ReinforcedInstall: {
      Yes: 0,
      No: 0,
    },
  },
};
