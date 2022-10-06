import { useApp } from '@/contexts/AppContext';
import { useEffect, useState } from 'react';
import styles from './Audio.module.css';
import { getUrl } from "@/util/util";

const art_sizes = [192, 256, 384, 512]

const artwork: any = [];

let mediaMetadata = {
    title: "Happy Birthday 🎶",
    artist: "Anweshan Roy Chowdhury",
    album: "B'Day Album 💿",
    artwork: null,
}

export default function Audio() {
    
    const { storage } = useApp();

    const [ playing, setPlaying ] = useState(false);

    const [ audioUrl, setAudioUrl ] = useState<string | null>(null);

    useEffect( () => {
        if(storage != null) {
            art_sizes.forEach( size => {
                const bucket = `birthday/images/meta/round-${size}.png`
                const sizes = `${size}x${size}`;
                const type = "image/png";
                
                getUrl({ storage, bucket, callback: (src:string) => {
                    artwork.push({
                        src,
                        sizes,
                        type
                    })
                }})
            });

            mediaMetadata = {
                ...mediaMetadata,
                artwork
            }

            const bucket = 'birthday/audio/HappyBirthday.mp3';

            getUrl({ storage, bucket, callback: (url:string) => {
                setAudioUrl(url);
            }});
            
        }
    }, [storage]);

    useEffect( () => {
        if(audioUrl != null) {
            // Do something...
        }
    }, [audioUrl]);

    return (
        <div className={styles['audio-container']} tabIndex={0}>
            <div className={styles["audio-inner-container"]}
            >
                <div className={styles["audio-app"]}>
                    <div className={styles['icon']}>
                        <i className={`fas fa-${playing ? 'play' : 'pause'} fa-2x`}></i>
                    </div>
                </div>
            </div>
        </div>
    )
}
