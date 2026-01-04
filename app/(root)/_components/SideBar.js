
// "use client";
// import { FaAngleUp, FaAngleDown } from "react-icons/fa";
// import { useState, useContext } from "react"
// import Tltip from "../../../components/tlTip";
// import imsLogo from '../../../public/logo/logoNew.svg';
// import Image from 'next/image'
// import { FiSettings } from "react-icons/fi";
// import { sideBar } from '../../../components/const'
// import Link from 'next/link'
// import { usePathname } from 'next/navigation';
// import { SettingsContext } from "../../../contexts/useSettingsContext";
// import { UserAuth } from "../../../contexts/useAuthContext";
// import { getTtl } from "../../../utils/languages";
// import styles from "./SideBar.module.css";

// export default function Sidebar() {
//   const pathName = usePathname();
//   const { setDates, compData } = useContext(SettingsContext);
//   const { userTitle, gisAccount, SignOut } = UserAuth();
//   const ln = compData?.lng || 'English';
//   const [openDropdowns, setOpenDropdowns] = useState({});
//   const [showShadow, setShowShadow] = useState(false);

//   const showLink = userTitle !== 'Accounting';

//   const toggleDropdown = (itemName) => {
//     setOpenDropdowns(prev => ({
//       ...prev,
//       [itemName]: !prev[itemName]
//     }));
//   };

//   const handleScroll = (e) => {
//     setShowShadow(e.target.scrollTop > 5);
//   };

//   return showLink && (
//     <nav
//       className="relative flex flex-col shrink-0 h-screen overflow-hidden z-[10500]"
//       style={{
//         width: '260px',
//         minWidth: '260px',
//         maxWidth: '260px',
//         boxShadow: '2px 0 8px rgba(0, 0, 0, 0.08)'
//       }}
//     >
//       {/* Ultra-compact Logo section with rounded bottom */}
//       <div 
//         className="shrink-0 flex items-center justify-center relative z-10 transition-all duration-300"
//         style={{
//           // radial gradient: bright white at center, blue towards edges
//           background: 'radial-gradient(circle at center, rgba(255,255,255,1) 0%, rgba(255,255,255,0.95) 18%, rgba(14,95,165,1) 100%)',
      
//           // compact height but full sidebar width
//           height: '64px',
//           minHeight: '64px',
//           width: '100%',
//           paddingLeft: '12px',
//           paddingRight: '12px'
//         }}
//       >
//         <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%'}}>
//           <Image
//             src={imsLogo}
//             className="overflow-hidden transition-all hover:scale-105 duration-300"
//             style={{height: '98px', width: 'auto', objectFit: 'contain'}}
//             priority
//             alt="IMS Logo"
//             width={200}
//             height={48}
//           />
//         </div>
//       </div>

//       {/* Scrollable menu area - Ultra compact spacing */}
//       <div 
//         className={`flex-1 min-h-0 overflow-y-auto ${styles['custom-scrollbar']}`}
//         onScroll={handleScroll}
//         style={{
//           background: 'linear-gradient(180deg, #0e5fa5 0%, #0a4d84 30%, #064378 60%, #003d6e 100%)'
//         }}
//       > 
//         <ul className="py-1.5">
//           {sideBar().map((x, i) => (
//             <div key={i} className="mb-0">
//               {x.ttl && (
//                 <div 
//                   className="text-[8px] 2xl:text-[9px] font-semibold tracking-[0.1em] uppercase px-4 pb-1 pt-2"
//                   style={{
//                     color: 'rgba(255, 255, 255, 0.45)',
//                     letterSpacing: '0.1em'
//                   }}
//                 >
//                   {getTtl(x.ttl, ln)}
//                 </div>
//               )}
//               <div>
//                 {x.items.map((y, k) => {
//                   const isActive = pathName.slice(1) === y.page || pathName.startsWith(`/${y.page}/`);
//                   const isDropdownOpen = openDropdowns[y.item];
//                   const isSubItemActive = y.subItems?.some(sub => pathName.slice(1) === sub.page);
                  
//                   if (y.hasDropdown) {
//                     return (
//                       <div key={k} className="px-1.5">
//                         {/* Ultra compact dropdown items */}
//                         <div className="ml-0.5 mb-0">
//                           {y.subItems.map((sub, si) => {
//                             const isSubActive = pathName.slice(1) === sub.page;
//                             return (
//                               <Link href={`/${sub.page}`} key={si} onClick={setDates}>
//                                 <div className={`group flex items-center gap-2 px-3 py-1.5 mx-0.5 my-0 rounded-md cursor-pointer transition-all duration-200
//                                   ${isSubActive 
//                                     ? 'bg-gradient-to-r from-[#7ba7cc] to-[#6b9ac2] text-white font-medium shadow-lg scale-[1.01]' 
//                                     : 'text-white/90 hover:bg-white/10 hover:translate-x-0.5'}
//                                 `}>
//                                   <span className={`text-[14px] transition-all duration-200 ${isSubActive ? 'scale-105' : ''} group-hover:scale-105`}>{sub.img}</span>
//                                   <span className="text-[12px] leading-tight">{getTtl(sub.item, ln)}</span>
//                                 </div>
//                               </Link>
//                             );
//                           })}
//                         </div>
//                       </div>
//                     );
//                   }
                  
//                   return (
//                     <Link href={`/${y.page}`} key={k} onClick={setDates}>
//                       <div className={`group flex items-center gap-2 px-4 py-2 mx-1.5 my-0 rounded-lg cursor-pointer transition-all duration-200
//                         ${isActive 
//                           ? 'bg-gradient-to-r from-[#7ba7cc] to-[#6b9ac2] text-white font-medium shadow-lg scale-[1.01]' 
//                           : 'text-white hover:bg-[#0a4d84]/50 hover:translate-x-0.5'}
//                       `}>
//                         <span className={`text-[16px] shrink-0 transition-all duration-200 ${isActive ? 'scale-105' : ''} group-hover:scale-105`}>{y.img}</span>
//                         <span className="text-[13px] font-medium tracking-wide leading-tight">{getTtl(y.item, ln)}</span>
//                       </div>
//                     </Link>
//                   );
//                 })}
//               </div>
//             </div>
//           ))}
//         </ul>
//       </div>
      
//       {/* Compact bottom section with rounded top */}
//       <div 
//         className="shrink-0 py-1.5"
//         style={{
//           background: 'linear-gradient(180deg, #064378 0%, #003d6e 100%)',
         
//         }}
//       >
//         <div className="flex flex-col gap-0">
//           <Tltip direction='right' tltpText={getTtl('Settings', ln)} show={false}>
//             <Link href='/settings'>
//               <div className="group flex items-center gap-2 px-4 py-2 mx-1.5 rounded-lg cursor-pointer transition-all duration-200 text-white hover:bg-[#0a4d84]/50 hover:translate-x-0.5">
//                 <FiSettings className='text-[16px] shrink-0 transition-transform duration-200 group-hover:rotate-90 group-hover:scale-105' />
//                 <span className="text-[13px] font-medium tracking-wide leading-tight">{getTtl('Settings', ln)}</span>
//               </div>
//             </Link>
//           </Tltip>
//           <Tltip direction='right' tltpText={getTtl('Logout', ln)} show={false}>
//             <button
//               onClick={async () => {
//                 await SignOut();
//                 window.location.href = '/';
//               }}
//               className="group flex items-center gap-2 px-4 py-2 mx-1.5 rounded-lg cursor-pointer transition-all duration-200 text-white hover:bg-red-500/20 hover:translate-x-0.5 w-full text-left"
//             >
//               <span className="text-[16px] shrink-0 transition-transform duration-200 group-hover:translate-x-1">
//                 <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                   <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                   <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                   <path d="M12 19C7.58172 19 4 15.4183 4 11C4 6.58172 7.58172 3 12 3C13.6569 3 15.1566 3.63214 16.2426 4.75736" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                 </svg>
//               </span>
//               <span className="text-[13px] font-medium tracking-wide leading-tight">{getTtl('Logout', ln)}</span>
//             </button>
//           </Tltip>
//         </div>
//       </div>
      
//     </nav>
//   );
// }
"use client";
import { FaAngleUp, FaAngleDown } from "react-icons/fa";
import { useState, useContext } from "react";
import Tltip from "../../../components/tlTip";
import imsLogo from "../../../public/logo/logoNew.svg";
import Image from "next/image";
import { FiSettings } from "react-icons/fi";
import { sideBar } from "../../../components/const";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SettingsContext } from "../../../contexts/useSettingsContext";
import { UserAuth } from "../../../contexts/useAuthContext";
import { getTtl } from "../../../utils/languages";
import styles from "./SideBar.module.css";

export default function Sidebar() {
  const pathName = usePathname();
  const { setDates, compData } = useContext(SettingsContext);
  const { userTitle } = UserAuth();
  const ln = compData?.lng || "English";
  const [openDropdowns, setOpenDropdowns] = useState({});

  const showLink = userTitle !== "Accounting";

  return (
    showLink && (
      <nav
        className="relative flex flex-col h-screen overflow-hidden"
        style={{
          width: "clamp(220px, 18vw, 260px)",
          minWidth: "clamp(220px, 18vw, 260px)",
          maxWidth: "clamp(220px, 18vw, 260px)",
          boxShadow: "2px 0 8px rgba(0, 0, 0, 0.08)",
        }}
      >
        {/* Logo */}
        <div
          className="shrink-0 flex items-center justify-center overflow-hidden"
          style={{
            background:
              "radial-gradient(circle at center, rgba(255,255,255,1) 0%, rgba(255,255,255,0.95) 18%, rgba(14,95,165,1) 100%)",
            height: "clamp(50px, 7vh, 64px)",
            minHeight: "clamp(50px, 7vh, 64px)",
            width: "100%",
            padding: "clamp(6px, 1vw, 10px)",
          }}
        >
          <Image
            src={imsLogo}
            className="overflow-hidden transition-all hover:scale-105 duration-300"
            style={{
              height: "clamp(60px, 8vh, 88px)",
              width: "auto",
              objectFit: "contain",
              maxWidth: "100%",
            }}
            priority
            alt="IMS Logo"
            width={200}
            height={48}
          />
        </div>

        {/* Menu */}
        <div
          className="flex-1 min-h-0 flex flex-col overflow-hidden"
          style={{
            background:
              "linear-gradient(180deg, #0e5fa5 0%, #0a4d84 30%, #064378 60%, #003d6e 100%)",
          }}
        >
          <ul
            className="flex-1 overflow-hidden"
            style={{
              paddingTop: "clamp(4px, 0.5vh, 6px)",
              paddingBottom: "clamp(4px, 0.5vh, 6px)",
            }}
          >
            {sideBar().map((x, i) => (
              <div key={i}>
                {x.ttl && (
                  <div
                    className="font-semibold tracking-[0.1em] uppercase"
                    style={{
                      color: "rgba(255, 255, 255, 0.45)",
                      fontSize: "clamp(7px, 0.6vw, 9px)",
                      paddingLeft: "clamp(10px, 1.5vw, 14px)",
                      paddingRight: "clamp(10px, 1.5vw, 14px)",
                      paddingBottom: "clamp(2px, 0.3vh, 4px)",
                      paddingTop: "clamp(4px, 0.6vh, 8px)",
                    }}
                  >
                    {getTtl(x.ttl, ln)}
                  </div>
                )}

                <div>
                  {x.items.map((y, k) => {
                    const isActive =
                      pathName.slice(1) === y.page ||
                      pathName.startsWith(`/${y.page}/`);

                    if (y.hasDropdown) {
                      return (
                        <div key={k}>
                          {y.subItems.map((sub, si) => {
                            const isSubActive =
                              pathName.slice(1) === sub.page;

                            return (
                              <Link
                                href={`/${sub.page}`}
                                key={si}
                                onClick={setDates}
                              >
                                <div
                                  className={`group flex items-center rounded-md cursor-pointer transition-all duration-200
                                  ${
                                    isSubActive
                                      ? "bg-gradient-to-r from-[#7ba7cc] to-[#6b9ac2] text-white font-medium shadow-lg scale-[1.01]"
                                      : "text-white/90 hover:bg-white/10 hover:translate-x-0.5"
                                  }`}
                                  style={{
                                    gap: "clamp(4px, 0.8vw, 7px)",
                                    paddingTop:
                                      "clamp(3px, 0.5vh, 5px)",
                                    paddingBottom:
                                      "clamp(3px, 0.5vh, 5px)",
                                    paddingLeft:
                                      "clamp(6px, 1.2vw, 10px)",
                                    paddingRight:
                                      "clamp(6px, 1.2vw, 10px)",
                                    marginLeft:
                                      "clamp(1px, 0.2vw, 2px)",
                                    marginRight:
                                      "clamp(1px, 0.2vw, 2px)",
                                  }}
                                >
                                  <span
                                    style={{
                                      fontSize:
                                        "clamp(11px, 0.95vw, 13px)",
                                    }}
                                  >
                                    {sub.img}
                                  </span>
                                  <span
                                    style={{
                                      fontSize:
                                        "clamp(9px, 0.8vw, 11px)",
                                    }}
                                  >
                                    {getTtl(sub.item, ln)}
                                  </span>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      );
                    }

                    return (
                      <Link
                        href={`/${y.page}`}
                        key={k}
                        onClick={setDates}
                      >
                        <div
                          className={`group flex items-center rounded-lg cursor-pointer transition-all duration-200
                          ${
                            isActive
                              ? "bg-gradient-to-r from-[#7ba7cc] to-[#6b9ac2] text-white font-medium shadow-lg scale-[1.01]"
                              : "text-white hover:bg-[#0a4d84]/50 hover:translate-x-0.5"
                          }`}
                          style={{
                            gap: "clamp(5px, 0.9vw, 7px)",
                            paddingTop:
                              "clamp(4px, 0.7vh, 7px)",
                            paddingBottom:
                              "clamp(4px, 0.7vh, 7px)",
                            paddingLeft:
                              "clamp(8px, 1.5vw, 14px)",
                            paddingRight:
                              "clamp(8px, 1.5vw, 14px)",
                            marginLeft:
                              "clamp(3px, 0.6vw, 5px)",
                            marginRight:
                              "clamp(3px, 0.6vw, 5px)",
                          }}
                        >
                          <span
                            style={{
                              fontSize:
                                "clamp(13px, 1.1vw, 15px)",
                            }}
                          >
                            {y.img}
                          </span>
                          <span
                            style={{
                              fontSize:
                                "clamp(10px, 0.9vw, 12px)",
                            }}
                          >
                            {getTtl(y.item, ln)}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Settings inside menu */}
            <Tltip direction="right" tltpText={getTtl("Settings", ln)} show={false}>
              <Link href="/settings">
                <div
                  className="group flex items-center rounded-lg cursor-pointer transition-all duration-200 text-white hover:bg-[#0a4d84]/50 hover:translate-x-0.5"
                  style={{
                    gap: "clamp(5px, 0.9vw, 7px)",
                    paddingTop:
                      "clamp(4px, 0.7vh, 7px)",
                    paddingBottom:
                      "clamp(4px, 0.7vh, 7px)",
                    paddingLeft:
                      "clamp(8px, 1.5vw, 14px)",
                    paddingRight:
                      "clamp(8px, 1.5vw, 14px)",
                    marginLeft:
                      "clamp(3px, 0.6vw, 5px)",
                    marginRight:
                      "clamp(3px, 0.6vw, 5px)",
                  }}
                >
                  <FiSettings
                    className="shrink-0 transition-transform duration-200 group-hover:rotate-90 group-hover:scale-105"
                    style={{
                      fontSize:
                        "clamp(13px, 1.1vw, 15px)",
                    }}
                  />
                  <span
                    className="font-medium tracking-wide leading-tight"
                    style={{
                      fontSize:
                        "clamp(10px, 0.9vw, 12px)",
                    }}
                  >
                    {getTtl("Settings", ln)}
                  </span>
                </div>
              </Link>
            </Tltip>
          </ul>
        </div>
      </nav>
    )
  );
}
