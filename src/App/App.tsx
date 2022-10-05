import { useApp } from "@/contexts/AppContext"
import { useRef, useEffect } from "react";
import { getUrl } from "@/util/util";

export default function App() : JSX.Element {
  const { storage } = useApp();
  const inputElement = useRef<any>(undefined);

  useEffect(() => {
      if(storage != null) {
        console.log("Hold My Hand 🤝🏻");
        const { bucket } = inputElement.current.dataset;
        
        getUrl({ storage, bucket, callback: (url: string) => {
              inputElement.current.src = url;
            }
          });
      }
  }, [storage]);
  
  return (
    <>
      There should hear a song 🎶 below 👇🏻:
      <audio ref={inputElement} muted={true} controls={true} data-bucket="birthday/audio/HappyBirthday.mp3"></audio>
    </>
  )
}
