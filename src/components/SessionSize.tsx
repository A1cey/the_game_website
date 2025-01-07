import { Button } from "@nextui-org/button";
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/popover";
import GroupIcon from "./icons/GroupIcon";
import { Divider, Select, SelectedItemProps, SelectItem } from "@nextui-org/react";
import PlayerList from "./Players";
import { useState } from "react";
import useThemeStore from "@/hooks/useThemeStore";
import useSessionStore from "@/hooks/useSessionStore";
import supabase from "@/utils/supabase";

const SessionSize = () => {
  const sessionName = useSessionStore(state => state.session.name);
  const maxNumOfPlayers = useSessionStore(state => state.session.max_num_of_players);
  const numOfPlayers = useSessionStore(state => state.session.num_of_players);
  const theme = useThemeStore(state => state.theme);
  const [isPlayersOpen, setIsPlayersOpen] = useState(false);

  const sessionSizes: Array<SelectedItemProps<number>> = Array.from({ length: 29 }, (_, i) => ({
    key: i,
    data: i + 2,
  }));

  const setNewMaxNumberOfPlayers = async (num: number) => {
    if (numOfPlayers === num) {
      return;
    }

    supabase
      .from("sessions")
      .update({ max_num_of_players: num })
      .eq("name", sessionName)
      .then(({ error }) => {
        if (error) {
          console.error("Error updating session size: ", error);
        }
      });
  };

  return (
    <div
      className="
      bg-default-200 rounded-xl
      dark:border-1  dark:border-default
      dark:bg-default-50
      flex flex-row gap-1 w-fit justify-center items-center
      mr-2
      "
    >
      <p className="pl-3 -translate-y-[10%]">{numOfPlayers + "/" + maxNumOfPlayers}</p>
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
              disabledKeys={[(maxNumOfPlayers - 2).toString()]}
              selectedKeys={[(maxNumOfPlayers - 2).toString()]}
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
            <Divider />
            <PlayerList />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default SessionSize;
