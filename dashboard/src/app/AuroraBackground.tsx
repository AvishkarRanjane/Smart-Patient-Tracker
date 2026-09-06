// app/AuroraBackground.tsx
// Animated aurora blobs that provide the glass-morphism canvas
import styles from './app.module.css';

export default function AuroraBackground() {
  return (
    <div className={styles.aurora} aria-hidden="true">
      <div className={`${styles.blob} ${styles.b1}`}></div>
      <div className={`${styles.blob} ${styles.b2}`}></div>
      <div className={`${styles.blob} ${styles.b3}`}></div>
    </div>
  );
}
