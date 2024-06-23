import React, { useState, useEffect, useRef } from "react";
import dogeImage1 from "./doge.png";
import dogeImage2 from "./doge2.png";
import dogeImage3 from "./dogeChino.png";
import china from "./china.mp3";
import pablo from "./pablo.mp3";

const Doge = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [trail, setTrail] = useState([]);
  const [clickCount, setClickCount] = useState(0);
  const [currentImage, setCurrentImage] = useState(dogeImage1);
  const [clickSound, setClickSound] = useState(
    "https://www.myinstants.com/media/sounds/bruh.mp3"
  );
  const mousePosition = useRef({ x: 0, y: 0 });
  const soundRef = useRef(clickSound);

  useEffect(() => {
    const handleMouseMove = (event) => {
      mousePosition.current = { x: event.clientX, y: event.clientY };
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setPosition((prevPosition) => {
        const newX =
          prevPosition.x + (mousePosition.current.x - prevPosition.x) * 0.1;
        const newY =
          prevPosition.y + (mousePosition.current.y - prevPosition.y) * 0.1;
        return { x: newX, y: newY };
      });

      setTrail((prevTrail) =>
        [...prevTrail, { x: position.x, y: position.y, id: Date.now() }].slice(
          -50
        )
      ); // Limita el rastro a las últimas 50 posiciones
    }, 50);

    return () => {
      clearInterval(interval);
    };
  }, [position]);

  const handleClick = () => {
    const audio = new Audio(clickSound);
    audio.play();
    setClickCount((prevCount) => prevCount + 1);

    if (clickCount + 1 >= 10) {
      if (Math.random() > 0.5) {
        setClickSound(pablo);
        setCurrentImage(dogeImage2);
      } else {
        setClickSound(china);
        setCurrentImage(dogeImage3);
      }
    }
  };

  return (
    <div>
      {trail.map((t) => (
        <img
          key={t.id}
          src={dogeImage1}
          alt="Doge Trail"
          style={{
            position: "absolute",
            left: t.x,
            top: t.y,
            width: "20px", // Ajusta el tamaño del rastro si es necesario
            opacity: 0.5,
            pointerEvents: "none",
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}
      <img
        src={currentImage}
        alt="Doge Musculoso"
        style={{
          position: "absolute",
          left: position.x,
          top: position.y,
          width: "100px", // Ajusta el tamaño de Doge si es necesario
          transform: "translate(-50%, -50%)",
          cursor: "pointer",
        }}
        onClick={handleClick}
      />
    </div>
  );
};

export default Doge;
