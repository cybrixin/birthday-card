import styles from './Spinner.module.css';

export default function Spinner() : JSX.Element {
  return (
    // No collision in class name modules have been used
    <div className={styles.container}>
        <svg className={styles.spinner} viewBox="0 0 50 50">
            <circle className={styles.path} cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
        </svg>
    </div>
  )
}
