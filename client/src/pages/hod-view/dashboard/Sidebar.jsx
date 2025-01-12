import React from 'react';
import style from './sidebar.module.css';
import { IoHomeSharp } from "react-icons/io5";
import { BsPersonFillAdd, BsToggleOn, BsToggleOff } from "react-icons/bs";
import { BiSolidReport } from "react-icons/bi";
import { FaRegNewspaper } from "react-icons/fa6";
import { GiPapers } from "react-icons/gi";
import { NavLink } from 'react-router-dom';
import { MdIncompleteCircle } from "react-icons/md";

export default function Sidebar({ mode, menu, setMode }) {

  return (
    <aside className={`${style.container} ${menu && style.close}`}>
      <div className={style.ImgContainer}>
        <img src="/logo2.png" alt="" />
        <div className={style.logonameContainer}>
          <span className={`${style.logoHeader} ${style.text}`}>Royal College</span>
          <span className={`${style.logoContext} ${style.text}`}>of Science & Commerce</span>
        </div>
      </div>
      <hr />
      <main>
        <nav>
          <li>
            <NavLink
              to="/hod/home"
              className={({ isActive }) => isActive ? `${style.icon} ${style.active}` : style.icon}
              end
            >
              <span><IoHomeSharp /></span><span className={style.text}>Dashboard</span>
            </NavLink>
          </li>
          
          <li>
            <NavLink
              to="/hod/createSem"
              className={({ isActive }) => isActive ? `${style.icon} ${style.active}` : style.icon}
              end
            >
              <span><FaRegNewspaper /></span><span className={style.text}>Create Sem</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/hod/giveMark"
              className={({ isActive }) => isActive ? `${style.icon} ${style.active}` : style.icon}
              end
            >
              <span><BsPersonFillAdd /></span><span className={style.text}>Marks</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/hod/listStudentMark"
              className={({ isActive }) => isActive ? `${style.icon} ${style.active}` : style.icon}
              end
            >
              <span><GiPapers /></span><span className={style.text}>Student Sheets</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/hod/generateResult"
              className={({ isActive }) => isActive ? `${style.icon} ${style.active}` : style.icon}
              end
            >
              <span><BiSolidReport /></span><span className={style.text}>Generate Result</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/hod/inCompleteSem"
              className={({ isActive }) => isActive ? `${style.icon} ${style.active}` : style.icon}
              end
            >
              <span><MdIncompleteCircle /></span><span className={style.text}>Check Sem</span>
            </NavLink>
          </li>
         

          <div className={style.navBottom}>
            <hr />
            <li className={style.toggle}>
              <span className={style.toggleBtn} onClick={() => setMode(prevMode => !prevMode)}>
                {mode ? <BsToggleOn /> : <BsToggleOff />}
              </span>
              <span className={style.text}>Dark Mode</span>
            </li>
          </div>
        </nav>
      </main>
    </aside>
  );
}
