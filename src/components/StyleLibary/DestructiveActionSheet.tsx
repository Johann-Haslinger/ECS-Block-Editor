import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useStateContext } from "../../contexts/ContextProvider";
import { useWindowDimensions } from "../Size";
import { delay } from "../Delay";


interface DestructiveActionSheetProps {
  deleteFunc: () => void;
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  length: number;
}

const DestructiveActionSheet: React.FC<DestructiveActionSheetProps> = ({
  deleteFunc,
  isVisible,
  setIsVisible,
  length,
}) => {
  const [back, setBack] = useState(false);
  const refOne = useRef<HTMLDivElement>(null);
  const { setTheme } = useStateContext();
  const { width } = useWindowDimensions();

  useEffect(() => {
    if (isVisible) {
      setTheme(width < 550 ? "rgb(214,214,214)" : "rgb(202,202,207)");
    }
  }, [isVisible, width]);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  function handleClickOutside(e: MouseEvent) {
    if (refOne.current && !refOne.current.contains(e.target as Node)) {
      handleBackClick();
    }
  }

  async function handleBackClick() {
    setBack(true);
    setTheme(width < 550 ? "#ffffff" : "rgb(243,243,248)");
    await delay(100);
    setIsVisible(false);
    setBack(false);
  }

  function handleDeleteClick() {
    deleteFunc();
    handleBackClick();
  }

  return (
    <>
      {isVisible && (
        <motion.div
          draggable={false}
          animate={{
            background: back ? "#ffffff00" : "#00000029",
          }}
          initial={{ background: "#ffffff00" }}
          className={
            "w-screen z-50 items-center h-screen flex justify-center fixed top-0 left-0 text-[#ffffff00]"
          }
        >
          <motion.div
            ref={refOne}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: !back ? 1 : 0, scale: !back ? 1 : 1.1 }}
            transition={{ duration: 0.2 }}
            className="bg-white text-black w-10/12 md:w-64 backdrop-blur-lg bg-opacity-90 rounded-lg"
          >
            <div className="p-4">
              <p className="text-center font-bold">Bist du sicher?</p>
              <p className="text-sm text-center mt-0.5">
                {length} {length === 1 ? "Element" : "Elemente"} löschen?
              </p>
            </div>
            <div className="border-[rgb(221,221,221)] border-t flex">
              <button
                onClick={handleBackClick}
                className="w-1/2 p-2 transition-all hover:bg-[rgba(212,211,211,0.24)] rounded-bl-lg text-center border-r border-[rgb(221,221,221)] font-bold text-blue"
              >
                Abbrechen
              </button>
              <button
                onClick={handleDeleteClick}
                className="w-1/2 p-2 transition-all hover:bg-[rgba(212,211,211,0.24)] text-center text-red"
              >
                Löschen
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default DestructiveActionSheet;
