import { Routes, Route, useHref } from "react-router-dom";
import Home from "@/pages/Home";
import Game from "@/pages/Game";
import Session from "@/pages/Session";
import { useNavigate } from "react-router-dom";
import { NextUIProvider } from "@nextui-org/react";
import { useEffect } from "react";
import useGameStore from "./hooks/useGameStore";
import useSessionStore from "./hooks/useSessionStore";
import usePlayerStore from "./hooks/usePlayerStore";
import useThemeStore from "./hooks/useThemeStore";
import Header from "./components/Header";
import { removePlayerFromSession } from "./utils/supabase";
import { useTranslation } from "react-i18next";

const App = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();
  const theme = useThemeStore(state => state.theme);
  const sessionName = useSessionStore(state => state.session.name);
  const playerId = usePlayerStore(state => state.player.id);

  const resetPlayer = usePlayerStore(state => state.resetStore);
  const resetSession = useSessionStore(state => state.resetStore);
  const resetGame = useGameStore(state => state.resetStore);

  useEffect(() => {
    // Cleanup subscriptions
    return (): void => {
      resetSession();
      resetGame();
      resetPlayer();
    };
  }, []);

  // prevent browser actions tab closing/refreshing when user in session
  useEffect(() => {
    const beforeUnload = (e: BeforeUnloadEvent): void => {
      e.preventDefault();
      // Ignored from most browsers
      e.returnValue = t("leavePageMessage");
    };

    const unload = async () => {
      await removePlayerFromSession(playerId);
      navigate("/");
    };

    if (sessionName) {
      window.addEventListener("beforeunload", beforeUnload);
      window.addEventListener("unload", unload);
      return;
    }

    return () => {
      window.removeEventListener("beforeunload", beforeUnload);
      window.removeEventListener("unload", unload);
    };
  }, [sessionName]);

  return (
    <NextUIProvider navigate={navigate} useHref={useHref}>
      <main className={`${theme} text-foreground bg-background h-screen w-screen`}>
        <Header />
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
