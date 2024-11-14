import React from "react";

function createContext<A extends {} | null>(displayName: string) {
  const ctx = React.createContext<A | undefined>(undefined);
  ctx.displayName = displayName;
  function useContext() {
    const c = React.useContext(ctx);
    if (c === undefined)
      throw new Error("useContext must be inside a Provider with a value");
    return c;
  }
  return [useContext, ctx.Provider] as const;
}

export interface ThemeContext {
  isDark: boolean;
  setIsDark: (value: boolean) => void;
}

export const [useThemeContext, ThemeContextProvider] =
  createContext<ThemeContext>("Themes");
