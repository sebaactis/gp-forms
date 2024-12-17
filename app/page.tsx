"use client"

import Image from 'next/image';
import styles from './home.module.css'
import logo from '@/public/gp-logo.png'
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import PulseLoader from 'react-spinners/PulseLoader';
export default function Home() {

  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onLogin = () => {
    // TO DO LOGIN...

    setLoading(true);

    setTimeout(() => {
      router.push('/home')
      setLoading(false);
    }, 2000) 
  }

  return (
    <div className={styles.mainContainer}>
      <Image src={logo} alt="logo de gp" className={styles.image} />
      <button
        className={styles.button}
        onClick={onLogin}
      >
        {loading ? <PulseLoader size={10} color="white" /> : "Iniciar sesión con Microsoft"}
      </button>
    </div>
  );
}
