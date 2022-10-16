import useResize from '@/hooks/useResize';
import styles from './Unload.module.css';

const heightBreakPoint: number = 481;

export default function Unload() : JSX.Element {

    const [ dimensions ] = useResize();

    const { width, height } = dimensions;

    const touchPoints = ( height > heightBreakPoint || width > heightBreakPoint ) && !!navigator.maxTouchPoints;

    return (
      <div className={styles.container}>
          <div className={styles['text-area']}>
                <p className={styles.p1}>😞 The device is too small to display the card properly.</p>
                { touchPoints ? <p className={styles.p2}>You could rotate <span className={styles.emoji}>🔄</span> your device to view the same.</p> : ""} 
          </div>
      </div>
    )
  }