import { useApp } from '@/contexts/AppContext';
import { useEffect, useState } from 'react';
import styles from './Audio.module.css';
import { getUrl } from "@/util/util";
import { ReactComponent as PlayIcon } from '@/icons/play.svg';
import { ReactComponent as PauseIcon } from '@/icons/pause.svg';
import { ReactComponent as SpinyIcon } from '@/icons/spiny.svg';

const art_sizes = [192, 256, 384, 512]

const artwork: any = [];

const PUBLIC_AUDIO_SKIP_TIME = 10;

let mediaMetadata = {
    title: "Happy Birthday 🎶",
    artist: "Anweshan Roy Chowdhury",
    album: "B'Day Album 💿",
    artwork: [],
}

function updatePosition(element: HTMLAudioElement, position: number) {
    if(element) element.currentTime = position;

    const { duration, playbackRate, currentTime } = element;
    
    if('setPositionState' in navigator.mediaSession){
        navigator.mediaSession.setPositionState({
            duration,
            playbackRate,
            position: currentTime
        })
    }
}

export default function Audio() {
    
    const { storage } = useApp();

    const [ playing, setPlaying ] = useState(false);

    const [ audioUrl, setAudioUrl ] = useState<string | null>(null);

    const [audioElement, setAudioElement] = useState<HTMLAudioElement | undefined>(undefined);
    
    const [ loading, setLoading ] = useState(true);

    const toggleMusic = (event: any) => {
        event.preventDefault();
        if(audioElement?.paused){
            audioElement?.play()?.then(_ => {
                updatePosition(audioElement, audioElement.currentTime);
                setPlaying(true);
            });
        }else {
            audioElement?.pause()
            setPlaying(false);
        }
    };

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
                setLoading(false);
            }});
            
        }
    }, [storage]);

    useEffect( () => {
        if(audioUrl != null) {
            if('mediaSession' in navigator) {
                console.log(mediaMetadata);
                navigator.mediaSession.metadata = new MediaMetadata(mediaMetadata);
            }

            const audio = document.createElement("audio");
            audio.src = audioUrl;

            if('mediaSession' in navigator &&'setActionHandler' in navigator.mediaSession){

                navigator.mediaSession.setActionHandler('play', async () => await audio.play());
                
                navigator.mediaSession.setActionHandler('pause', () => audio.pause());

                navigator.mediaSession.setActionHandler('seekbackward', (evt) => {
                    const skipTime = evt.seekOffset || PUBLIC_AUDIO_SKIP_TIME;

                    const position = Math.max(audio.currentTime - skipTime, 0);

                    updatePosition(audio, position);
                })

                navigator.mediaSession.setActionHandler('seekforward', (evt) => {
                    const skipTime = evt.seekOffset || PUBLIC_AUDIO_SKIP_TIME;
                    const position = Math.max(audio.currentTime + skipTime, 0);

                    updatePosition(audio, position);
                })

            }

            audio.onplay = () => {
                setPlaying(true);
            }

            audio.onpause = () => {
                setPlaying(false);
                updatePosition(audio, 0);
            }

            setAudioElement(audio);
            setPlaying(false);
        }
    }, [audioUrl]);

    return (
        <div className={styles['audio-container']} tabIndex={0} onClick={(e) => toggleMusic(e)}>
            <div className={styles["audio-inner-container"]}
            >
                <div className={styles["audio-app"]}>
                    { loading ? 
                        (   <div className={styles['loader']}>
                                <SpinyIcon className={styles['spin']} />
                            </div> 
                        ) : (
                            !playing ? <PlayIcon className={styles['play']} /> : <PauseIcon className={styles['pause']} />
                        )
                    }
                    
                </div>
            </div>
        </div>
    )
}
