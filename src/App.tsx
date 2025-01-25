import Game from "@/pages/Game";
import Home from "@/pages/Home";
import Session from "@/pages/Session";
import { HeroUIProvider } from "@heroui/react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Route, Routes, useHref } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Header from "./components/Header";
import useGameStore from "./hooks/useGameStore";
import usePlayerStore from "./hooks/usePlayerStore";
import useSessionStore from "./hooks/useSessionStore";
import useThemeStore from "./hooks/useThemeStore";
import { removePlayerFromSession } from "./utils/supabase";

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
    <HeroUIProvider navigate={navigate} useHref={useHref}>
      <main className={`${theme} text-foreground bg-background h-screen w-screen overflow-scroll`}>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/session" element={<Session />} />
          <Route path="/game" element={<Game />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
    </HeroUIProvider>
  );
};

export default App;
