import ButtonBordered from "../ui/ButtonBordered";
import Dice from "./Dice";
import LittleMaxGameProgress from "./LittleMaxGameProgress";

const LittleMaxGame = () => {
  return (
    <div className="flex flex-col h-full">
        {/* dice animation: db function -> chooses numbers -> players get animations */ }
        {/* 
          Dice result 
          -> when revealed -> dice visible animation: everyone -> reveal function updates db -> players get animations 
          -> when rolled first time -> dice visible animation: player, dice hidden animation: everyone else
          -> when rolled second time -> dice hidden animation: everyone
        */ }
        {/* Everyone except current player can see animated text what current player is doing (Thinking, Rolling, Revealing, Choosing Number) */}
      <Dice />
      <div>
        {/*Everything disabled for everyone except current player */}
        <ButtonBordered>{/* Left: Check previous player/reveal button */ }</ButtonBordered>
        <div>
          <ButtonBordered>{/* Middle Top: Dice roll/roll again button */ }</ButtonBordered>
          <LittleMaxGameProgress>{/* Middle Bottom: Number chooser, chosen numbers disabled + whose chose what */ }</LittleMaxGameProgress>
        </div>
        <ButtonBordered>
          {/* 
          Right: Tell number button -> Number must be chosen 
          Timer: runs out -> automatically next number is chosen, turn over
          */ }
        </ButtonBordered>
      </div>
    </div>
  );
};

export default LittleMaxGame;
