"use client";
import { FaAngleLeft } from "react-icons/fa";
import { FaAngleRight } from "react-icons/fa";
import { FaAngleUp, FaAngleDown } from "react-icons/fa";
import { useState, useContext } from "react"
import Tltip from "../../../components/tlTip";
import imsLogo from '../../../public/logo/logoNew.svg';
import Image from 'next/image'
import { FiSettings } from "react-icons/fi";
import { sideBar } from '../../../components/const'
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import { SettingsContext } from "../../../contexts/useSettingsContext";
import { UserAuth } from "../../../contexts/useAuthContext";
import { getTtl } from "../../../utils/languages";
import styles from "./SideBar.module.css";

export default function Sidebar() {
  const pathName = usePathname();
  const { setDates, compData } = useContext(SettingsContext);
  const { userTitle, gisAccount, SignOut } = UserAuth();
  const ln = compData?.lng || 'English';
  const [openDropdowns, setOpenDropdowns] = useState({});

  const showLink = userTitle !== 'Accounting';

  const toggleDropdown = (itemName) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [itemName]: !prev[itemName]
    }));
  };

  return showLink && (
    <nav
      className="relative bg-gradient-to-br from-white via-[var(--endeavour)] to-[var(--port-gore)] flex flex-col border-r shadow-sm shrink-0 h-screen overflow-x-hidden"
      style={{
        
        width: '260px',
        minWidth: '260px',
        maxWidth: '260px',
        color: 'var(--selago)',
      }}
    >
    <div className={`flex-1 min-h-0 overflow-y-auto ${styles['custom-scrollbar']}`}> 
      {/* Logo fixed at top */}
      <div className="px-6 pt-6 pb-4 flex items-center bg-transparent">
        <Image
          src={imsLogo}
          className="overflow-hidden transition-all w-32 2xl:w-36 rounded-lg p-1"
          priority
          alt="IMS Logo"
          width={250}
          height={250}
        />
      </div>
      {/* Scrollable menu area */}

        <ul className="mt-2">
          {/* Render all sidebar groups dynamically from const.js */}
          {sideBar().map((x, i) => (
            <div key={i} className="mb-2">
              {x.ttl && (
                <div className="text-[11px] 2xl:text-xs font-bold tracking-widest uppercase text-white/80 px-6 pb-2 pt-6" style={{letterSpacing: '0.12em'}}>{getTtl(x.ttl, ln)}</div>
              )}
              <div>
                {x.items.map((y, k) => {
                  const isActive = pathName.slice(1) === y.page || pathName.startsWith(`/${y.page}/`);
                  const isDropdownOpen = openDropdowns[y.item];
                  
                  // Check if any sub-item is active
                  const isSubItemActive = y.subItems?.some(sub => pathName.slice(1) === sub.page);
                  
                  if (y.hasDropdown) {
                    return (
                      <div key={k}>
                        {/* Dropdown Header */}
                        <div 
                          onClick={() => toggleDropdown(y.item)}
                          className={`group flex items-center justify-between px-6 py-3 my-1 rounded-xl cursor-pointer transition-all duration-150
                            ${isSubItemActive ? 'bg-[var(--rock-blue)] bg-opacity-30' : 'text-[var(--selago)] hover:bg-[var(--rock-blue)] hover:bg-opacity-20'}
                          `} 
                          style={{ minHeight: 48 }}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className={`text-xl transition-colors shrink-0 ${isSubItemActive ? 'text-white' : 'text-[var(--rock-blue)]'} group-hover:text-[var(--selago)]`}>{y.img}</span>
                            <span className={`ml-2 text-sm font-medium leading-tight tracking-wide text-[var(--selago)]`}>{getTtl(y.item, ln)}</span>
                          </div>
                          <span className="text-[var(--selago)]">
                            {isDropdownOpen ? <FaAngleUp /> : <FaAngleDown />}
                          </span>
                        </div>
                        
                        {/* Dropdown Items */}
                        <div className={`overflow-hidden transition-all duration-300 ${isDropdownOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                          <div className="ml-4 mr-2 bg-[var(--rock-blue)]/30 rounded-xl overflow-hidden">
                            {y.subItems.map((sub, si) => {
                              const isSubActive = pathName.slice(1) === sub.page;
                              return (
                                <Link href={`/${sub.page}`} key={si} onClick={setDates}>
                                  <div className={`group flex items-center gap-3 px-4 py-3 cursor-pointer transition-all duration-150
                                    ${isSubActive 
                                      ? 'bg-white text-[var(--endeavour)] font-semibold' 
                                      : 'text-white hover:bg-white/20'}
                                  `}>
                                    <span className={`text-lg ${isSubActive ? 'text-[var(--endeavour)]' : 'text-white'}`}>{sub.img}</span>
                                    <span className={`text-sm ${isSubActive ? 'text-[var(--endeavour)]' : 'text-white'}`}>{getTtl(sub.item, ln)}</span>
                                  </div>
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  }
                  
                  return (
                    <Link href={`/${y.page}`} key={k} onClick={setDates}>
                      <div className={`group flex items-center gap-3 px-6 py-3 my-1 rounded-xl cursor-pointer transition-all duration-150
                        ${isActive ? 'bg-[var(--rock-blue)] bg-opacity-80 text-[var(--endeavour)] shadow-md font-bold' : 'text-[var(--selago)] hover:bg-[var(--rock-blue)] hover:text-[var(--selago)]'}
                      `} style={{ minHeight: 48 }}>
                        <span className={`text-xl transition-colors shrink-0 ${isActive ? 'text-[var(--endeavour)]' : 'text-[var(--rock-blue)]'} group-hover:text-[var(--selago)]`}>{y.img}</span>
                        <span className={`ml-2 text-sm font-medium leading-tight tracking-wide`}>{getTtl(y.item, ln)}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </ul>
      </div>
      {/* Fixed bottom area for settings and logout */}
      <div className="shrink-0 pb-2 pt-2">
        <div className="flex flex-col gap-2 px-0">
          <Tltip direction='right' tltpText={getTtl('Settings', ln)} show={false}>
            <Link href='/settings'>
              <div className="flex items-center gap-3 px-6 py-3 rounded-xl cursor-pointer transition-all duration-150 text-[var(--selago)] hover:bg-[var(--rock-blue)] hover:text-[var(--selago)]">
                <FiSettings className='text-xl shrink-0' />
                <span className="ml-2 text-sm font-medium leading-tight tracking-wide">{getTtl('Settings', ln)}</span>
              </div>
            </Link>
          </Tltip>
          {/* Logout button example, adjust as needed */}
          <Tltip direction='right' tltpText={getTtl('Logout', ln)} show={false}>
            <button
              onClick={async () => {
                await SignOut();
                window.location.href = '/';
              }}
              className="flex items-center gap-3 px-6 py-3 rounded-xl cursor-pointer transition-all duration-150 text-[var(--selago)] hover:bg-[var(--rock-blue)] hover:text-[var(--selago)] w-full text-left"
            >
              <span className="text-xl shrink-0"><svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 19C7.58172 19 4 15.4183 4 11C4 6.58172 7.58172 3 12 3C13.6569 3 15.1566 3.63214 16.2426 4.75736" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
              <span className="ml-2 text-sm font-medium leading-tight tracking-wide">{getTtl('Logout', ln)}</span>
            </button>
          </Tltip>
        </div>
      </div>
      
    </nav>
  );
}
