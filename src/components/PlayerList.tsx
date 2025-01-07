import useSessionStore from "@/hooks/useSessionStore";
import { formatDefaultPlayerName } from "@/utils/other";
import supabase from "@/utils/supabase";
import { Listbox, ListboxItem } from "@nextui-org/listbox";
import { useEffect, useState } from "react";

const PlayerList = () => {
  const playerCount = useSessionStore(state => state.session.num_of_players);
  const sessionName = useSessionStore(state => state.session.name);
  const [players, setPlayers] = useState<string[]>([]);

  useEffect(() => {
    supabase.rpc("get_player_names", { session_name_input: sessionName }).then(({ data, error }) => {
      if (error) {
        console.error("Error fetching player list: ", error);
      }
      if (data) {
        setPlayers(data.map(({ name }) => formatDefaultPlayerName(name)));
      }
    });
  }, [playerCount]);

  const getPlayerList = () => {
    return (
      <Listbox aria-label="Table of all players in the party.">
        {players.map((name, idx) => (
          // biome-igore lint/suspicious/noArrayIndexKey: The key is the index of the array, which is fine in this case.
          <ListboxItem key={idx} value={name}>
            {name}
          </ListboxItem>
        ))}
      </Listbox>
    );
  };

  return <div>{!players ? "No data available." : getPlayerList()}</div>;
};

export default PlayerList;
