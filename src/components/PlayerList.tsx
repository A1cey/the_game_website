import useSessionStore from "@/hooks/useSessionStore";
import  { getPlayerNames } from "@/utils/supabase";
import { Listbox, ListboxItem } from "@nextui-org/listbox";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const PlayerList = () => {
  const playerCount = useSessionStore(state => state.session.num_of_players);
  const sessionName = useSessionStore(state => state.session.name);
  const [players, setPlayers] = useState<string[]>([]);
  
  const {t } = useTranslation();

  useEffect(() => {
    getPlayerNames(sessionName, t).then(playerNames => setPlayers(playerNames));     
  }, [playerCount, sessionName]);

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
