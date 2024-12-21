import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import style from './header.module.css';
import { AiOutlineMenuFold, AiOutlineMenuUnfold } from "react-icons/ai";

export default function Header({ setMenu, menu }) {
  const [drop, setDrop] = useState(false); // Fixed useState initialization
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('auth'); // Clear authentication data
    setDrop(false); // Close dropdown
    toast.success('You have logged out successfully. if not reload the pafe'); // Optional toast notification
    window.reload(); // Reload the page
  };
  

  return (
    <nav className={style.container}>
      <div className={style.menuContainer1}>
        <div className={style.menuContainer}>
          <button className={style.btn} onClick={() => setMenu(prevMenu => !prevMenu)}>
            {menu ? <AiOutlineMenuFold /> : <AiOutlineMenuUnfold />}
          </button>
        </div>
        <div>
          <h1>Admin Dashboard</h1>
        </div>
      </div>

      <div className={style.imgContainer}>
        <div
          className={style.img}
          onClick={() => setDrop(prevDrop => !prevDrop)}
        >
          <img
            src={`https://thumb.ac-illust.com/be/bee98c70d1cfc02d0f387d2852464bf5_t.jpeg`}
            alt="Profile"
          />
        </div>
        {drop && (
          <div className={style.imageList}>
            <ul>
              <li onClick={handleLogout}>Logout</li>
            </ul>
            <hr />
          </div>
        )}
      </div>
    </nav>
  );
}
