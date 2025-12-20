'use client'

import { useContext, useState, useRef, useEffect } from 'react'
import { UserAuth } from '../../../contexts/useAuthContext'
import { SettingsContext } from '../../../contexts/useSettingsContext'
import { getTtl } from '../../../utils/languages'
import { useRouter } from 'next/navigation'
import { BiLogOutCircle } from 'react-icons/bi'
import { IoChatbubblesOutline } from 'react-icons/io5'
import { FiSettings, FiUser } from 'react-icons/fi'
import GlobalSearch from '../../../components/GlobalSearch'

export const MainNav = () => {
  const { SignOut, user } = UserAuth()
  const { compData } = useContext(SettingsContext)
  const ln = compData?.lng || 'English'
  const router = useRouter()
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
      {/* Global Search */}
      <GlobalSearch />

      {/* Right Side Icons */}
      <div className='flex items-center gap-3 ml-4'>
        {/* Message Icon */}
        <button
          className='p-2.5 rounded-lg bg-white border border-gray-200 hover:bg-[var(--selago)] hover:border-[var(--rock-blue)] transition-all group'
          onClick={() => router.push('apps/Assistant')}
        >
          <IoChatbubblesOutline className='text-xl text-gray-500 group-hover:text-[var(--endeavour)]' />
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

