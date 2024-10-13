import React from 'react';
import Image from 'next/image'; // Asegúrate de importar este componente si usas Next.js
import styles from './Header.module.css'; // Crea un archivo CSS para los estilos

const Header = () => {
  return (
    <header className={styles.header}>
      {/* Logo como enlace */}
      <a href="/" className={styles.logo}>
        <Image 
          src="https://i.imgur.com/Xq80Mue.jpeg" // Cambia esto a la ruta de tu logo
          alt="Logo de la página"
          width={150} // Ajusta el tamaño según tus necesidades
          height={150} // Ajusta el tamaño según tus necesidades
        />
      </a>
    </header>
  );
}

export default Header;
