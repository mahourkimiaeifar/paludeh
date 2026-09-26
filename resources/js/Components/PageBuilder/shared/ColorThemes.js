export const colorThemes = {
    cyan: {
        primary: 0x06b6d4,
        secondary: 0x3b82f6,
        accent: 0x67e8f9,
        glow: 0x22d3ee,
        bg: 0x001420,
    },
    blue: {
        primary: 0x2563eb,
        secondary: 0x1d4ed8,
        accent: 0x60a5fa,
        glow: 0x3b82f6,
        bg: 0x000a1f,
    },
    purple: {
        primary: 0x8b5cf6,
        secondary: 0x7c3aed,
        accent: 0xc084fc,
        glow: 0xa78bfa,
        bg: 0x0f0520,
    },
    emerald: {
        primary: 0x10b981,
        secondary: 0x059669,
        accent: 0x6ee7b7,
        glow: 0x34d399,
        bg: 0x001a10,
    },
    rose: {
        primary: 0xf43f5e,
        secondary: 0xe11d48,
        accent: 0xfda4af,
        glow: 0xfb7185,
        bg: 0x1a0005,
    },
};

export const getTheme = (themeName) => colorThemes[themeName] || colorThemes.cyan;