import useGameStore from "@/hooks/useGameStore";
import useThemeStore from "@/hooks/useThemeStore";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/modal";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";
import ButtonBordered from "../ui/ButtonBordered";
import assholeRulesEn from "@/assets/rules/asshole.en.md?raw?raw";
import assholeRulesDe from "@/assets/rules/asshole.de.md?raw";
import durakRulesEn from "@/assets/rules/durak.en.md?raw";
import durakRulesDe from "@/assets/rules/durak.de.md?raw";
import littleMaxRulesEn from "@/assets/rules/little_max.en.md?raw";
import littleMaxRulesDe from "@/assets/rules/little_max.de.md?raw";
import pokerRulesEn from "@/assets/rules/poker.en.md?raw";
import pokerRulesDe from "@/assets/rules/poker.de.md?raw";
import thirtyOneRulesEn from "@/assets/rules/thirty_one.en.md?raw";
import thirtyOneRulesDe from "@/assets/rules/thirty_one.de.md?raw";
import werwolfRulesEn from "@/assets/rules/werwolf.en.md?raw";
import werwolfRulesDe from "@/assets/rules/werwolf.de.md?raw";
import { GameRulesMap_t } from "@/types/game/game.types";

const GameRules = () => {
  const currentGame = useGameStore(state => state.game.game_state?.game);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [rules, setRules] = useState("");
  const theme = useThemeStore(state => state.theme);

  const {
    t,
    i18n: { language },
  } = useTranslation();

  const rulesMap: GameRulesMap_t = {
    "ASSHOLE": {
      en: assholeRulesEn,
      de: assholeRulesDe
    },
    "DURAK": {
      en: durakRulesEn,
      de: durakRulesDe
    },
    "LITTLE_MAX": {
      en: littleMaxRulesEn,
      de: littleMaxRulesDe
    },
    "POKER": {
      en: pokerRulesEn,
      de: pokerRulesDe
    },
    "THIRTY_ONE": {
      en: thirtyOneRulesEn,
      de: thirtyOneRulesDe
    },
    "WERWOLF": {
      en: werwolfRulesEn,
      de: werwolfRulesDe
    }
  };

  useEffect(() => {
    if (!currentGame) {
      return;
    }

    const rules = rulesMap[currentGame][language as "en" | "de"];
    setRules(rules)
  }, [currentGame, language]);

  return (
    <div>
      <ButtonBordered onPress={onOpen} isDisabled={currentGame !== "LITTLE_MAX"}>{t("gameRules")}</ButtonBordered>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="5xl"
        scrollBehavior="inside"
        classNames={{
          header: `${theme === "dark" ? "bg-default-900 text-default border-default-700 border-b-1" : "bg-default-100"} rounded-t-xl justify-center text-2xl`,
          body: `${theme === "dark" ? "bg-default-900 text-default" : ""}`,
          footer: `${theme === "dark" ? "bg-default-900 text-default border-default-700 border-t-1" : "bg-default-100"} rounded-b-xl`,
        }}
      >
        <ModalContent>
          {onClose => (
            <>
              <ModalHeader>{t("gameRules")}</ModalHeader>
              <ModalBody>
                <ReactMarkdown className="markdown">{rules}</ReactMarkdown>
              </ModalBody>
              <ModalFooter>
                <ButtonBordered onPress={onClose}>Ok</ButtonBordered>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default GameRules;
