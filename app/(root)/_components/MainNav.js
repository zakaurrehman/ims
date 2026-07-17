'use client'

import { useContext, useState, useRef, useEffect } from 'react'
import { UserAuth } from '../../../contexts/useAuthContext'
import { SettingsContext } from '../../../contexts/useSettingsContext'
import { getTtl } from '../../../utils/languages'
import { useRouter } from 'next/navigation'
import { X, Search, Bot, LogOut as LogOutIcon, Settings } from 'lucide-react';
import Image from 'next/image';
import { useGlobalSearch } from '../../../contexts/useGlobalSearchContext'
import Tltip from '../../../components/tlTip'
import { Selector } from '@components/selectors/selectShad';
import NotificationBell from '@components/NotificationBell';

// Self-contained clock: owns the 1-second interval so only this tiny component
// re-renders each second — previously the state lived in MainNav and re-rendered
// the whole nav (selector, search, bell) every second on every page.
const Clock = () => {
  const [now, setNow] = useState(null)

  useEffect(() => {
    setNow(new Date())
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  if (!now) return null
  return (
    <div className='flex flex-col items-end leading-tight select-none pointer-events-none pl-4 border-l border-[var(--line)]'>
      <span style={{ fontSize: '0.68rem', color: 'var(--ink-muted)', fontWeight: 500 }}>
        {now.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}
      </span>
      <span style={{ fontSize: '0.85rem', color: 'var(--ink)', fontWeight: 600, letterSpacing: '0.05em', fontVariantNumeric: 'tabular-nums' }}>
        {now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
      </span>
    </div>
  )
}

export const MainNav = () => {
  const { SignOut, user, gisAccount } = UserAuth();
  const { compData, accounts, uidCollection, setUidCollection } = useContext(SettingsContext)
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
    <div
      className='fixed top-0 left-0 right-0 px-1 md:px-2 xl:px-3 py-3 hidden md:flex items-center bg-white z-[100] rounded-lg'
      style={{
        height: 'clamp(56px, 7vh, 80px)',
        borderRadius: '12px',
        border: '1px solid var(--line)',
        boxShadow: 'var(--shadow-xs)',
        padding: '0 clamp(8px, 1vw, 16px)', // reduced horizontal padding
      }}
    >
      {/* Logo Section (left) */}
      <div
        className='flex items-center gap-4'
        style={{
          marginRight: 'clamp(6px, 1vw, 10px)',
        }}
      >
        <img
          src={!gisAccount ? '/logo/ims_main.svg' : '/logo/gisLogo.svg'}
          alt='IMS Logo'
          style={{
            width: !gisAccount ? 'clamp(120px, 18vw, 200px)' : 'clamp(120px, 18vw, 120px)',
            height: 'auto',
            bottom: gisAccount ? '4px' : '0px',
            position: 'relative'
          }}
        />
      </div>


      {/* Right Side: All icons and controls in a row, all functional */}
      <div className='flex items-center gap-2 ml-auto'>
        {/* Global Search */} 
        <div className='relative flex items-center' ref={searchRef}>


          <div className='flex-1 min-w-0 z-50'>
            <Selector arr={accounts} value={accounts.find(x => x.id === uidCollection)}
              onChange={(e) => setUidCollection(e)}
              name='uidCollection'
              secondaryName='name'
            />
          </div>

          {!openSearch ? (
            <Tltip tltpText={getTtl('Search', ln) || 'Search'} direction='bottom'>
              <button
                className='flex items-center justify-center w-9 h-9 rounded-[10px] text-[var(--ink-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--ink)] transition-colors'
                onClick={() => setOpenSearch(true)}
                aria-label='Search'
              >
                <Search size={18} strokeWidth={1.75} />
              </button>
            </Tltip>
          ) : (
            <div className="relative flex items-center responsiveText">
              <input
                type='text'
                placeholder={getTtl('Search anything...', ln) || 'Search anything...'}
                value={query || ''}
                autoFocus
                onBlur={() => setOpenSearch(false)}
                onChange={(e) => setQuery(e.target.value)}
                className='ml-2 w-60 pl-3 pr-8 py-2 rounded-[10px] bg-[var(--bg-subtle)] border border-[var(--line)] focus:border-[var(--brand)] focus:bg-white focus:outline-none focus:ring-[3px] focus:ring-[var(--brand-soft)] placeholder:text-[var(--ink-muted)] placeholder:opacity-100 transition-all'
                style={{ fontSize: 'inherit', color: 'var(--ink)' }}
              />
              <button
                type="button"
                onClick={() => { setOpenSearch(false); setQuery(''); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors"
                tabIndex={-1}
                aria-label="Close search"
              >
                <X size={18} />
              </button>
            </div>
          )}

          {/* Results dropdown, only if openSearch and query */}
          {openSearch && query && (
            <div className='absolute left-0 top-full mt-2 w-72 bg-white rounded-xl border border-[var(--line)] z-[9999] max-h-96 overflow-y-auto p-2' style={{ boxShadow: 'var(--shadow-md)' }}>
              {searchResults.length > 0 ? (
                searchResults.map((r) => (
                  <button
                    key={r.key}
                    type='button'
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => onPickResult(r)}
                    className='w-full text-left px-3 py-2.5 hover:bg-[var(--bg-subtle)] transition-all rounded-lg'
                  >
                    <div className='responsiveText font-medium text-[var(--ink)]'>{r.title}</div>
                    <div className='responsiveText text-[var(--ink-muted)] truncate'>{r.subtitle}</div>
                  </button>
                ))
              ) : (
                <div className='responsiveText text-[var(--ink-muted)] px-4 py-2'>No results</div>
              )}
            </div>
          )}
        </div>

        <Tltip tltpText={getTtl('Ask question', ln) || 'Ask question'} direction='bottom'>
          <button
            className='flex items-center justify-center w-9 h-9 rounded-[10px] text-[var(--ink-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--ink)] transition-colors'
            onClick={() => {
              if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('ims:openChat'))
            }}
            aria-label='Ask question'
          >
            <Bot size={18} strokeWidth={1.75} />
          </button>
        </Tltip>
        {/* Notification center — live bell with unread badge, snooze & sound */}
        <NotificationBell />
        {/* Logout Icon */}
        <Tltip tltpText={getTtl('Logout', ln) || 'Logout'} direction='bottom'>
          <button
            className='flex items-center justify-center w-9 h-9 rounded-[10px] text-[var(--ink-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--ink)] transition-colors'
            onClick={LogOut}
            aria-label='Logout'
          >
            <LogOutIcon size={18} strokeWidth={1.75} />
          </button>
        </Tltip>
        {/* User Role Button and Profile Icon: no gap between */}
        <div className="flex items-center ml-2">
          <div className='relative' ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className='flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-[10px] border border-[var(--line)] bg-white hover:bg-[var(--bg-subtle)] transition-colors'
              aria-label='User menu'
            >
              <span className='w-6 h-6 rounded-full bg-[var(--brand-soft)] text-[var(--brand)] flex items-center justify-center text-[0.6875rem] font-semibold uppercase'>
                {(user?.displayName || user?.email || 'U').charAt(0)}
              </span>
              <span className='responsiveText font-medium text-[var(--ink)]' style={{ maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.displayName || user?.email?.split('@')[0] || 'User'}
              </span>
            </button>
            {showDropdown && (
              <div className='absolute right-0 top-full mt-2 w-56 bg-white rounded-xl border border-[var(--line)] py-2 z-[9999] overflow-visible' style={{ boxShadow: 'var(--shadow-md)' }}>
                <div className='px-4 py-3 border-b border-[var(--line)]'>
                  <p className='responsiveTextTable font-medium text-[var(--ink)]'>
                    {user?.displayName || user?.email?.split('@')[0] || 'User'}
                  </p>
                  <p className='responsiveTextTable text-[var(--ink-muted)] truncate'>{user?.email || ''}</p>
                </div>
                <div className='py-1'>
                  <button
                    onClick={() => {
                      router.push('/settings')
                      setShowDropdown(false)
                    }}
                    className='w-full flex items-center gap-2 px-4 py-2 text-xs text-[var(--ink-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--ink)] transition-all'
                  >
                    <Settings size={14} strokeWidth={1.75} />
                    {getTtl('Settings', ln) || 'Settings'}
                  </button>
                  <button
                    onClick={LogOut}
                    className='w-full flex items-center gap-2 px-4 py-2 text-xs text-[var(--bad-text)] hover:bg-[var(--bad-bg)] transition-all'
                  >
                    <LogOutIcon size={14} strokeWidth={1.75} />
                    {getTtl('Logout', ln) || 'Logout'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Date / Time Widget — far right */}
        <Clock />
      </div>
    </div>
  )
}