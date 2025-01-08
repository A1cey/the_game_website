import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/modal";
import ButtonBordered from "./ui/ButtonBordered";
import useGameStore from "@/hooks/useGameStore";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import useThemeStore from "@/hooks/useThemeStore";
import { useTranslation } from "react-i18next";

const GameRules = () => {
  const currentGame = useGameStore(state => state.game.game_state?.game);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [rules, setRules] = useState("");
  const theme = useThemeStore(state => state.theme);

  const {t } = useTranslation();
  
  useEffect(() => {
    if (!currentGame) {
      return;
    }
    
    const filename = t(currentGame.toString().toLowerCase()).toLowerCase().replace("ä", "ae");
       
    import(`../assets/rules/${filename}.md?raw`)
      .then(module => {
        setRules(module.default);
      })
      .catch(error => {
        console.error(`Error fetching rules for game ${currentGame}:`, error);
        setRules("");
      });

  }, [currentGame]);

  return (
    <div>
      <ButtonBordered onPress={onOpen}>{t("gameRules") }</ButtonBordered>
      <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange} 
        size="5xl" 
        scrollBehavior="inside"
        classNames={{
          header :`${theme === "dark"? "bg-default-900 text-default border-default-700 border-b-1" : "bg-default-100"} rounded-t-xl justify-center text-2xl`,
          body:`${theme === "dark"? "bg-default-900 text-default" : ""}`,        
          footer:`${theme === "dark"? "bg-default-900 text-default border-default-700 border-t-1" : "bg-default-100"} rounded-b-xl`,
        }}
      >
        <ModalContent>
          {onClose => (
            <>
              <ModalHeader>{t("gameRules")}</ModalHeader>
              <ModalBody>
               
               <ReactMarkdown className="markdown">
                {rules}
               </ReactMarkdown>

              </ModalBody>
              <ModalFooter>
                <ButtonBordered onPress={onClose}>Ok</ButtonBordered>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}

export default GameRules;
