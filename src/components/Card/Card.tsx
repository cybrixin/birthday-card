import { useApp } from '@/contexts/AppContext'
import React, { useEffect, useState } from 'react';
import { getUrl, sleep } from "@/util/util";
import Spinner from "@/components/Spinner";
import styles from './Card.module.css';

const bgStyle = `linear-gradient(to bottom, rgba(255, 255, 255), rgba(255, 255, 255, 0.5))`;

const cakeBucket = 'birthday/images/cake.jpg';

const coverBucket = 'birthday/images/bd.png';

export default function Card( { greet='' } : CardProps ) {
    
    if(greet === '') {
       greet = 'to You'; 
    }

    const { storage } = useApp();
    const [ loading, setLoading ] = useState<boolean>(true);
    const [ bgUrl, setBgUrl ] = useState<string | null>(null);
    const [ coverUrl, setCoverUrl ] = useState<string>('');

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
        if(bgUrl != null && coverUrl.length > 0 && loading == true) {
            setLoading(!loading);
        }
    }, [bgUrl, coverUrl]);


    useEffect( () => {
        if(!loading) {
            const notify = async () => {
                
                const { toast } = await import('react-toastify');

                toast('Click on the card to see the message ✉.', {
                    position: "top-left",
                    autoClose: 8000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });

                await sleep(5000);

                toast('Click on the ▶ below to hear your birthday song 🎶.', {
                    position: "top-left",
                    autoClose: 8000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            };

            sleep(2000).then(_ => notify());
        }
    }, [loading]);
    
    
    return (
       ( 
            loading ? <Spinner /> : 
            
            (<div className={styles["card-bd"]} style={{backgroundImage: `${bgStyle}, url('${bgUrl}')`}}>
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
        </div>)
       )
    )
}
