import supabase from "@/utils/supabase";
import GameCarousel from "@/components/ui/GameCarousel";
import GameOptions from "@/components/game_options/GameOptions";
import { Games } from "@/types/game.types";
import {
  Button,
  Divider,
  Link,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  type SelectedItemProps,
  SelectItem,
  Snippet,
} from "@nextui-org/react";
import useSessionStore from "@/hooks/useSessionStore";
import usePlayerStore from "@/hooks/usePlayerStore";
import useGameStore from "@/hooks/useGameStore";
import ButtonBordered from "@/components/ui/ButtonBordered";
import {  getGameImgs } from "@/utils/game";
import useThemeStore from "@/hooks/useThemeStore";
import { useState } from "react";
import PlayerList from "@/components/Players";
import GroupIcon from "@/components/ui/icons/GroupIcon";


const Session = () => {
  const session = useSessionStore(state => state.session);
  const gameState = useGameStore(state => state.game.game_state);
  const playerId = usePlayerStore(state => state.player.id);
  const theme = useThemeStore(state => state.theme);

  const [isPlayersOpen, setIsPlayersOpen] = useState(false);

  const sessionSizes: Array<SelectedItemProps<number>> = Array.from({ length: 29 }, (_, i) => ({
    key: i,
    data: i + 2,
  }));

  const removePlayerFromSession = async () => {
    if (!playerId) {
      console.error("Error removing player from session: player id not set.");
      return;
    }

    supabase
      .from("players")
      .delete()
      .eq("id", playerId)
      .then(({ error }) => {
        if (error) console.error("Error removing player from session: ", error);
      });
  };

  const startGame = async () => {
    supabase.rpc("start_game", { session_name: session.name }).then(({ error }) => {
      if (error) console.log("Error while starting game: ", error);
    });
  };

  const setNewMaxNumberOfPlayers = async (num: number) => {
    if (session.num_of_players === num) {
      return;
    }

    supabase
      .from("sessions")
      .update({ max_num_of_players: num })
      .eq("name", session.name)
      .then(({ error }) => {
        if (error) {
          console.error("Error updating session size: ", error);
        }
      });
  };

  return (
    <div>
      <div className="p-2 flex gap-20 w-full items-center justify-between">
        <div className="w-1/2">
          <ButtonBordered as={Link} color="primary" href={"/"} onPress={removePlayerFromSession}>
            Home
          </ButtonBordered>
        </div>
        <div className="w-1/2 flex justify-end gap-4">
          <Snippet
            codeString={session.name}
            hideSymbol={true}
            className={`
              ${theme} text-${theme === "dark" ? "white" : "black"} ${theme === "dark" ? "border-1 border-default bg-default-50" : "bg-default-200"}`}
            tooltipProps={{
              delay: 0,
              color: "foreground",
              content: "Copy",
              placement: "top",
              closeDelay: 0,
            }}
          >
            {"Session Name: " + session.name}
          </Snippet>
          <div
            className="
            bg-default-200 rounded-xl
            dark:border-1  dark:border-default
            dark:bg-default-50
            flex flex-row gap-1 w-fit justify-center items-center
            mr-2
            "
          >
            <p className="pl-3 -translate-y-[10%]">{session.num_of_players + "/" + session.max_num_of_players}</p>
            <Popover placement="bottom-end" isOpen={isPlayersOpen} onOpenChange={open => setIsPlayersOpen(open)}>
              <PopoverTrigger>
                <Button isIconOnly aria-label="Players" className="bg-transparent relative ml-4 mr-4 hover:scale-[1.1]">
                  <GroupIcon filled={true} fill={`${theme === "dark" ? "white" : "black"}`} />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className={`${theme} text-${theme === "dark" ? "white" : "black"} ${theme === "dark" ? "border-1 border-default" : ""}
              w-fit
              `}
              >
                <div className="flex flex-wrap gap-4 w-fit">
                  <Select
                    items={sessionSizes}
                    maxListboxHeight={200}
                    fullWidth={true}
                    className="min-w-40"
                    label="Set session size"
                    labelPlacement="outside-left"
                    disabledKeys={[(session.max_num_of_players - 2).toString()]}
                    selectedKeys={[(session.max_num_of_players - 2).toString()]}
                    onChange={e => setNewMaxNumberOfPlayers(Number(e.target.value) + 2)}
                    classNames={{
                      label: "text-nowrap translate-y-[50%]",
                      listboxWrapper: `${theme === "dark" ? "bg-default-700 text-default" : "bg-default-200"} max-h-[400px]`,
                      popoverContent: `${theme === "dark" ? "bg-default-700" : "bg-default-200"}`,
                      trigger: `${theme === "dark" ? "bg-default" : "bg-default-200"}`,
                    }}
                    listboxProps={{
                      itemClasses: {
                        base: [
                          `${theme === "dark" ? "bg-default-700 data-[hover=true]:bg-default-400" : "bg-default-200 data-[hover=true]:text-foreground"}`,
                        ],
                      },
                    }}
                  >
                    {sessionSizes.map(size => (
                      <SelectItem key={size.key}>{size.data?.toString()}</SelectItem>
                    ))}
                  </Select>
                  <Divider/>
                  <PlayerList />
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
      <div className="grid gap-20 justify-center">
        <div className="mt-40">
          <GameCarousel gameImgs={getGameImgs()} />
        </div>
        <div className="flex gap-20 justify-center">
          <GameOptions
            currentGame={
              gameState?.game ? (Games[gameState.game as unknown as keyof typeof Games] as unknown as Games) : undefined
            }
          />
          <ButtonBordered onPress={startGame}>Start</ButtonBordered>
        </div>
      </div>
    </div>
  );
};

export default Session;
