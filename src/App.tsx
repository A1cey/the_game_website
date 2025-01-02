import { Routes, Route, useHref } from "react-router-dom";
import Home from "@/pages/Home";
import Game from "@/pages/Game";
import Session from "@/pages/Session";
import { useNavigate } from "react-router-dom";
import { NextUIProvider } from "@nextui-org/react";
import { useTheme } from "@nextui-org/use-theme";
import { useEffect, useState } from "react";
import useGameStore from "./hooks/useGameStore";
import useSessionStore from "./hooks/useSessionStore";
import usePlayerStore from "./hooks/usePlayerStore";
import useThemeStore from "./hooks/useThemeStore";

const App = () => {
  const navigate = useNavigate();
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    // Cleanup subscriptions
    return () => {
      useSessionStore.getState().unsubscribe();
      useGameStore.getState().unsubscribe();
      usePlayerStore.getState().unsubscribe();
    };
  }, []);
  
  return (
    <NextUIProvider navigate={navigate} useHref={useHref}>
      <main className={`${theme} text-foreground bg-background`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/session" element={<Session />} />
          <Route path="/game" element={<Game />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
    </NextUIProvider>
  );
};

export default App;
