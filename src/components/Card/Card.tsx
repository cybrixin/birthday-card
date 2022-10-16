import styles from './Card.module.css';
import { useApp } from '@/contexts/AppContext'
import { lazy, useEffect, useState } from 'react';
import { getUrl } from "@/util/util";
import useResize from '@/hooks/useResize';

const  { Unload, Spinner }  = {
    Spinner: lazy( () => import("@/components/Spinner") ),
    Unload: lazy( () => import("@/components/Unload") ),
};

const bgStyle = `linear-gradient(to bottom, rgba(255, 255, 255), rgba(255, 255, 255, 0.5))`;

const cakeBucket = 'birthday/images/cake.jpg';

const coverBucket = 'birthday/images/bd.png';

const heightBreakPoint = 481;

export default function Card( { greet='' } : CardProps ) {
    
    if(greet === '') {
       greet = 'to You'; 
    }

    const { storage } = useApp();
    const [ loading, setLoading ] = useState<boolean>(true);
    const [ bgUrl, setBgUrl ] = useState<string>('');
    const [ coverUrl, setCoverUrl ] = useState<string>('');
    const [ triggered, setTriggered ] = useState<boolean>(false);
    const [ dimensions ] = useResize();

    useEffect( () => {
        if(storage != null) {
            getUrl({ storage, bucket: cakeBucket, callback: (url:string) => {
                setBgUrl(url);
            }});

            getUrl({ storage, bucket: coverBucket, callback: (url:string) => {
                setCoverUrl(url);
            }});
        }
    }, [storage]);


    useEffect( () => {
        if(bgUrl.length > 0 && coverUrl.length > 0 && loading == true) {
            setLoading( (old) => !old);
        }
    }, [bgUrl, coverUrl]);

    const isBreakpoint = dimensions.height > heightBreakPoint ; 

    useEffect( () => {
        if(!loading && !triggered && isBreakpoint) {
            
            const notify = async () => {
                
                const { toast } = await import ('react-toastify');
                
                toast('Click on the card to see the message ✉.', {
                    position: "top-left",
                    toastId: "clickCard",
                    autoClose: 8000,
                    hideProgressBar: false,
                    pauseOnFocusLoss: false,
                    pauseOnHover: false,
                    delay: 2000,
                });

                toast('Click on the ▶ below to hear your birthday song 🎶.', {
                    position: "top-left",
                    toastId: "clickPlay",
                    autoClose: 8000,
                    hideProgressBar: false,
                    pauseOnFocusLoss: false,
                    pauseOnHover: false,
                    delay: 4000
                });
            }

            setTriggered( (old) => !old );
            Promise.all([notify()]);
        }
    }, [loading, isBreakpoint] );
    
    
    return (
        loading ? <Spinner /> : ( isBreakpoint ? <BirthdayCard bgUrl={bgUrl} coverUrl={coverUrl} greet={greet}/> : <Unload /> )
    )
}

type CardComponentProps = {
    bgUrl: string;
    coverUrl: string;
} & CardProps;

const BirthdayCard = ({ bgUrl, coverUrl, greet} : CardComponentProps ) : JSX.Element => {
  return (
    <div className={styles["card-bd"]} style={{backgroundImage: `${bgStyle}, url('${bgUrl}')`}}>
            <div className={styles["back"]}></div>
            <div className={styles["front"]}>
                <div className={styles["imgset"]}>
                    <img width="100%" src={coverUrl} id="bdimg" alt="Card Front" />
                </div>
            </div>
            <div className={styles["text-container"]}>
                <p className={styles["head"]}>Happy Birthday {greet} 🎈</p>
                <p>May every day be filled with warmth of sunshine 🌞, the happiness of smiles 😊, the sounds of laughter 😀 and the feeling of love 💖.</p>
                <p>Wishing a year ahead filled with joy 🥳. Have lots of fun 💃🏻🕺🏻.</p>
                <p>May God bless You 🙏🏻</p>
                <p className={styles["foot"]}>Anweshan Roy Chowdhury</p>
            </div>
        </div>
  )
}

