'use client'

import { useContext, useState, useRef, useEffect } from 'react'
import { UserAuth } from '../../../contexts/useAuthContext'
import { SettingsContext } from '../../../contexts/useSettingsContext'
import { getTtl } from '../../../utils/languages'
import { useRouter } from 'next/navigation'
import { BiSearch, BiLogOutCircle } from 'react-icons/bi'
import { IoCallOutline } from 'react-icons/io5'
import { IoMdNotificationsOutline } from 'react-icons/io'
import { FiSettings, FiUser } from 'react-icons/fi'

export const MainNav = () => {
  const { SignOut, user } = UserAuth()
  const { compData } = useContext(SettingsContext)
  const ln = compData?.lng || 'English'
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef(null)

  const LogOut = async () => {
    router.push('/')
    await SignOut()
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className='px-4 md:px-8 xl:px-10 py-3 hidden md:flex items-center justify-between bg-white border-b border-[var(--selago)]'>
      {/* Search Bar */}
      <div className='flex items-center flex-1 max-w-xl'>
        <div className='relative w-full'>
          <BiSearch className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg' />
          <input
            type='text'
            placeholder={getTtl('Search anything...', ln)}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-50 border border-transparent focus:border-[var(--rock-blue)] focus:bg-white focus:outline-none text-sm text-gray-600 placeholder-gray-400 transition-all'
          />
        </div>
      </div>

      {/* Right Side Icons */}
      <div className='flex items-center gap-3'>
        {/* Call Icon */}
        <button className='p-2.5 rounded-lg bg-white border border-gray-200 hover:bg-[var(--selago)] hover:border-[var(--rock-blue)] transition-all group'>
          <IoCallOutline className='text-xl text-gray-500 group-hover:text-[var(--endeavour)]' />
        </button>

        {/* Notifications Icon */}
        <button className='p-2.5 rounded-lg bg-white border border-gray-200 hover:bg-[var(--selago)] hover:border-[var(--rock-blue)] transition-all group relative'>
          <IoMdNotificationsOutline className='text-xl text-gray-500 group-hover:text-[var(--endeavour)]' />
          {/* Notification Badge */}
          {/* <span className='absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-medium'>
            3
          </span> */}
        </button>

        {/* User Profile Dropdown */}
        <div className='relative' ref={dropdownRef}>
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className='flex items-center gap-2 p-1 rounded-lg hover:bg-[var(--selago)] transition-all'
          >
            {/* Avatar */}
            <div className='w-10 h-10 rounded-full bg-gradient-to-r from-[var(--endeavour)] via-[var(--chathams-blue)] to-[var(--endeavour)] flex items-center justify-center text-white font-semibold text-sm overflow-hidden border-2 border-white shadow-md'>
              {user?.email ? user.email.charAt(0).toUpperCase() : <FiUser />}
            </div>
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className='absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-[var(--selago)] py-2 z-50'>
              {/* User Info */}
              <div className='px-4 py-3 border-b border-[var(--selago)]'>
                <p className='text-sm font-semibold text-[var(--port-gore)]'>
                  {user?.displayName || user?.email?.split('@')[0] || 'User'}
                </p>
                <p className='text-xs text-gray-500 truncate'>{user?.email || ''}</p>
              </div>

              {/* Menu Items */}
              <div className='py-1'>
                <button
                  onClick={() => {
                    router.push('/settings')
                    setShowDropdown(false)
                  }}
                  className='w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-[var(--selago)] hover:text-[var(--endeavour)] transition-all'
                >
                  <FiSettings className='text-lg' />
                  {getTtl('Settings', ln)}
                </button>

                <button
                  onClick={LogOut}
                  className='w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-all'
                >
                  <BiLogOutCircle className='text-lg' />
                  {getTtl('Logout', ln)}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

