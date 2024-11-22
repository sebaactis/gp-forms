import Image from 'next/image';
import styles from './home.module.css'
import logo from '@/public/gp-logo.png'
export default function Home() {
  return (
    <div className={styles.mainContainer}>
      <Image src={logo} alt="logo de gp" className={styles.image}/>
      <button
        className={styles.button}
      >
        Iniciar sesión con Microsoft
      </button>
    </div>
  );
}
