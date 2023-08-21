import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  IoBrushOutline,
  IoChevronBack,
  IoCreateOutline,
  IoEllipseOutline,
  IoPencilOutline,
  IoShareOutline,
} from "react-icons/io5";

import DrawingCanvas from "./DrawingCanvas";
import { useWindowDimensions } from "../../Size";
import { useStateContext } from "../../../contexts/ContextProvider";
import { delay } from "../../Delay";

interface ImageViewProps {
  backfunc: () => void;
  url: string;
}


const ImageView: React.FC<ImageViewProps> = ({ backfunc, url }) => {
  const { width } = useWindowDimensions();
  const { setTheme, theme } = useStateContext();

  const [isGoingBack, setIsGoingBack] = useState<boolean>(false);
  const [isFullView, setIsFullView] = useState<boolean>(false);
  const optionsBarRef = useRef<HTMLDivElement | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isVertical, setIsVertical] = useState<boolean>(false);

  useEffect(() => {
    const image = new Image();
    image.src = url;

    image.onload = () => {
      setIsVertical(image.height > image.width);
    };
  }, [url]);

  const imageClass = isVertical ? "h-screen object-contain" : "w-screen object-contain";

  useEffect(() => {
    setTheme(isEditing ? "#ffffff" : isGoingBack || isFullView ? "#000000" : "rgb(247,247,247)");
  }, [isEditing, isGoingBack, isFullView]);

  const handleBackClick = async () => {
    setIsGoingBack(true);

    if (width > 550) {
      setTheme("rgb(243,243,248)");
    } else {
      setTheme("#ffffff");
    }

    await delay(200);
    backfunc();
  };

  const handlePencilClick = () => {
    setIsEditing(true);
  };

  return (
    <motion.div
      draggable={false}
      animate={{ background: isGoingBack ? "#ffffff00" : "#00000029" }}
      initial={{ background: "#ffffff00" }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        width: "100vw",
      }}
      className="z-50"
    >
      <motion.div
        onClick={() => {
          setIsFullView(!isFullView);
        }}
       
        transition={{ type: "tween" }}
        animate={{
          x: isGoingBack ? 1400 : 0,
          backgroundColor: isFullView ? "black" : "white",
        }}
        initial={{ x: width < 550 ? 400 : 1400, backgroundColor: "white" }}
        className="z-50 overflow-hidden h-screen fixed top-0 left-0 right-0 w-screen"
      >
        <div className="flex h-full items-center justify-center">
          {isEditing ? (
            <DrawingCanvas />
          ) : (
            <img src={url} className={imageClass} />
          )}
        </div>

        {!isFullView && (
          <motion.div
            transition={{ type: "tween" }}
            initial={{ y: 0 }}
            ref={optionsBarRef}
            className="pl-4 border-b-[rgba(215,214,215,0.72)] pr-4 bg-[rgb(247,247,247)] border-b justify-end space-x-6 flex md:pr-5 fixed text-blue backdrop-blur h-14 items-center top-0 left-0 bg-opacity-90 w-full"
          >
            <IoShareOutline className="hover:opacity-50 transition-all text-2xl" />
            {/* <IoPencilOutline
              onClick={handlePencilClick}
              className="hover:opacity-50 transition-all text-2xl"
            /> */}
            <div onClick={handleBackClick} className="font-bold">
              Fertig
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ImageView;
