import React from "react";
import styles from "@/styles/Header.module.css";
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '../Navbar';

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <Link href="/">
          <Image 
            className={styles.logotypeIcon} 
            width={85.5} 
            height={40} 
            alt="Logo" 
            src="/Logotype.svg" 
          />
        </Link>
        <Navbar />
      </div>
    </header>
  );
};

export default Header; 