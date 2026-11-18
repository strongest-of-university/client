import { createGlobalStyle } from "styled-components";

export const tokens = {
  colors: {
    background: "#fffdf8",
    surface: "#fff",
    text: "#1d1c1a",
    textStrong: "#33312e",
    textMuted: "#6b665d",
    textSubtle: "#625d56",
    border: "#ded6cc",
    divider: "#eae4d8",
    accent: "#88745a",
  },
  fonts: {
    sans: "'Noto Sans KR', sans-serif",
    serif: "'Noto Serif KR', serif",
    display: "'Cormorant Garamond', serif",
  },
} as const;

export const GlobalStyle = createGlobalStyle`
  :root {
    --font-sans: ${tokens.fonts.sans};
    --font-serif: ${tokens.fonts.serif};
    --font-display: ${tokens.fonts.display};

    --color-background: ${tokens.colors.background};
    --color-surface: ${tokens.colors.surface};
    --color-text: ${tokens.colors.text};
    --color-text-strong: ${tokens.colors.textStrong};
    --color-text-muted: ${tokens.colors.textMuted};
    --color-text-subtle: ${tokens.colors.textSubtle};
    --color-border: ${tokens.colors.border};
    --color-divider: ${tokens.colors.divider};
    --color-accent: ${tokens.colors.accent};

    font-family: var(--font-sans);
    color: var(--color-text);
    background: var(--color-background);
    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
  }

  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
  }

  button {
    font: inherit;
    cursor: pointer;
  }

  @media (prefers-reduced-motion: no-preference) {
    html {
      scroll-behavior: smooth;
    }
  }
`;
