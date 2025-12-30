'use client'

import { useContext, useState, useRef, useEffect } from 'react'
import { UserAuth } from '../../../contexts/useAuthContext'
import { SettingsContext } from '../../../contexts/useSettingsContext'
import { getTtl } from '../../../utils/languages'
import { useRouter } from 'next/navigation'
import { BiSearch, BiLogOutCircle } from 'react-icons/bi'
import { IoChatbubblesOutline } from 'react-icons/io5'
import { FiSettings, FiUser } from 'react-icons/fi'
import { useGlobalSearch } from '../../../contexts/useGlobalSearchContext'

export const MainNav = () => {
  const { SignOut, user } = UserAuth()
  const { compData } = useContext(SettingsContext)
  const ln = compData?.lng || 'English'
  const router = useRouter()
  const { query, setQuery, items } = useGlobalSearch()

  const [openSearch, setOpenSearch] = useState(false)
  const searchRef = useRef(null)

  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef(null)

  const LogOut = async () => {
    await SignOut()
    router.push('/')
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setOpenSearch(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const normalizedQuery = (query || '').trim().toLowerCase()

  const searchResults =
    normalizedQuery.length < 2
      ? []
      : items
          .filter((x) => (x.searchText || '').toLowerCase().includes(normalizedQuery))
          .slice(0, 10)

  const onPickResult = (item) => {
    setOpenSearch(false)
    setQuery('')
    router.push(`${item.route}?focus=${encodeURIComponent(item.rowId)}`)
  }

  return (
    <div className='px-4 md:px-8 xl:px-10 py-3 hidden md:flex items-center justify-between bg-white border-b border-[var(--selago)]'>
      {/* Search Bar */}
      <div className='flex items-center flex-1 max-w-xl'>
        <div className='relative w-full' ref={searchRef}>
          <BiSearch className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg' />
          <input
            type='text'
            placeholder={getTtl('Search anything...', ln)}
            value={query}
            onFocus={() => setOpenSearch(true)}
            onChange={(e) => {
              setQuery(e.target.value)
              setOpenSearch(true)
            }}
            className='w-full pl-10 pr-4 py-2 rounded-full bg-gray-50 border border-gray-200 shadow-sm focus:border-[var(--rock-blue)] focus:bg-white focus:outline-none text-sm text-gray-700 placeholder-gray-500 transition-all'
          />

          {/* Search Dropdown */}
          {openSearch && searchResults.length > 0 && (
            <div className='absolute left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-[var(--selago)] z-50 overflow-hidden'>
              {searchResults.map((r) => (
                <button
                  key={r.key}
                  type='button'
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => onPickResult(r)}
                  className='w-full text-left px-4 py-3 hover:bg-[var(--selago)] transition-all'
                >
                  <div className='text-sm font-semibold text-[var(--port-gore)]'>{r.title}</div>
                  <div className='text-xs text-gray-500 truncate'>{r.subtitle}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Side Icons */}
      <div className='flex items-center gap-3'>
        <button
          className='p-2.5 rounded-lg bg-white border border-gray-200 hover:bg-[var(--selago)] hover:border-[var(--rock-blue)] transition-all group'
          onClick={() => router.push('apps/Assistant')}
        >
          <IoChatbubblesOutline className='text-xl text-gray-500 group-hover:text-[var(--endeavour)]' />
        </button>

        <div className='relative' ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className='flex items-center gap-2 p-1 rounded-lg hover:bg-[var(--selago)] transition-all'
          >
            <div className='w-10 h-10 rounded-full bg-gradient-to-r from-[var(--endeavour)] via-[var(--chathams-blue)] to-[var(--endeavour)] flex items-center justify-center text-white font-semibold text-sm overflow-hidden border-2 border-white shadow-md'>
              {user?.email ? user.email.charAt(0).toUpperCase() : <FiUser />}
            </div>
          </button>

          {showDropdown && (
            <div className='absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-[var(--selago)] py-2 z-50'>
              <div className='px-4 py-3 border-b border-[var(--selago)]'>
                <p className='text-sm font-semibold text-[var(--port-gore)]'>
                  {user?.displayName || user?.email?.split('@')[0] || 'User'}
                </p>
                <p className='text-xs text-gray-500 truncate'>{user?.email || ''}</p>
              </div>

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
