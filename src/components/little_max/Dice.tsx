import {type Dispatch,type SetStateAction, useEffect, useRef, useState } from "react";

type DiceRollProps = {
  num: number;
  roll: boolean;
  setRoll: Dispatch<SetStateAction<boolean>>;
};

const DiceRoll = ({ num, roll, setRoll }: DiceRollProps) => {
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const diceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (roll) {
      rollDice();
    }
  }, [roll]);

  const rollDice = () => {
    if (!diceRef.current) {
      return;
    }

    setIsRolling(true);

    diceRef.current.style.transform = getFinalRotation(num);

    setTimeout(() => {
      setIsRolling(false);
      setRoll(false);
    }, 1000);
  };

  const getFinalRotation = (n: number): string => {
    switch (n) {
      case 1:
        return "rotateX(0deg) rotateY(0deg)";
      case 6:
        return "rotateX(180deg) rotateY(0deg)";
      case 2:
        return "rotateX(-90deg) rotateY(0deg)";
      case 5:
        return "rotateX(90deg) rotateY(0deg)";
      case 3:
        return "rotateX(0deg) rotateY(90deg)";
      case 4:
        return "rotateX(0deg) rotateY(-90deg)";
      default:
        return "rotateX(0deg) rotateY(0deg)";
    }
  };

  return (
    <div className="grid place-items-center size-48 bg-[#eeeeee] rounded-full shadow-xl dark:shadow-md dark:shadow-[#eeeeee]">
      <div className={`dice ${isRolling ? "dice-rolling" : ""}`} ref={diceRef}>
        <div className="dice-face dice-front"/>
        <div className="dice-face dice-back"/>
        <div className="dice-face dice-top"/>
        <div className="dice-face dice-bottom"/>
        <div className="dice-face dice-right"/>
        <div className="dice-face dice-left"/>
      </div>
    </div>
  );
};

export default DiceRoll;
