import styles from './Unload.module.css';

export default function Unload() : JSX.Element {
    return (
      <div className={styles.container}>
          <div className={styles['text-area']}>
                <p>😞 The device is too small to display the card properly.</p>
          </div>
      </div>
    )
  }