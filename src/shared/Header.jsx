import { NavLink } from 'react-router-dom';
import styles from './Header.module.css';

function Header({ title }) {
  return (
    <>
      <h1>{title}</h1>
      <nav>
        <NavLink
          to={'/'}
          className={({ isActive }) =>
            isActive ? styles.active : styles.inactive
          }
        >
          Home
        </NavLink>
        <NavLink
          to={'/about'}
          className={({ isActive }) =>
            isActive ? styles.active : styles.inactive
          }
        >
          About
        </NavLink>
      </nav>
    </>
  );
}

export default Header;
