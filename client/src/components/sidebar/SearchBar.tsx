import { useRef, useEffect, useCallback } from 'react'
import { useSearchStore } from '../../store/searchStore'
// import { useConvStore } from '../../store/convStore'
// import { useUiStore } from '../../store/uiStore'
import { getSocket } from '../../socket/socketInstance'
import { searchUsers } from '../../api/userApi'
import Avatar from '../ui/Avatar'
import { Search, X } from 'lucide-react'
import type { SearchUser } from '../../types'

const SearchBar = () => {
  const {
    query, userResults,
    isSearching, isOpen,
    setQuery, setUserResults,
    setSearching, setOpen,
    clearSearch,
  } = useSearchStore()

//   const { addConversation } = useConvStore()
//   const { setActiveChat } = useUiStore()

  const debounceRef = useRef<ReturnType<typeof setTimeout>>(0)
  const inputRef    = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setUserResults([])
      setOpen(false)
      return
    }

    setSearching(true)
    setOpen(true)

    try {
      const data = await searchUsers(q.trim(), 10, 0)
      setUserResults(data.users || [])
    } catch (err) {
      console.error('Search error:', err)
      setUserResults([])
    } finally {
      setSearching(false)
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setQuery(val)

    // Debounce — 400ms wait karo user type karna band kare
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      handleSearch(val)
    }, 400)
  }

  const handleUserClick = (user: SearchUser) => {
    const socket = getSocket()
    if (!socket) return

    socket.emit('join_conv', { receiver_id: user.user_id })
    clearSearch()
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative px-3 py-2">

      {/* Input */}
      <div className="relative">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
        />

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => query && setOpen(true)}
          placeholder="Search users..."
          className="
            w-full pl-9 pr-8 py-2
            bg-slate-800 text-white text-sm
            rounded-xl border border-slate-700
            focus:border-blue-500 outline-none
            placeholder:text-slate-500
            transition-colors duration-200
          "
        />

        {/* Clear button */}
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-2.5 top-1/2 -translate-y-1/2
                       text-slate-500 hover:text-white"
            title="clearSearchBox"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="
            absolute top-full left-3 right-3 mt-1
            bg-slate-800 border border-slate-700
            rounded-xl shadow-xl z-50
            max-h-72 overflow-y-auto
          "
        >
          {isSearching ? (
            <div className="flex items-center justify-center py-6">
              <div className="w-5 h-5 border-2 border-blue-500
                              border-t-transparent rounded-full animate-spin" />
            </div>
          ) : userResults.length === 0 ? (
            <div className="py-6 text-center text-sm text-slate-500">
              No users found for "{query}"
            </div>
          ) : (
            <div className="py-1">
              <p className="px-3 py-1.5 text-xs text-slate-500 font-medium">
                Users
              </p>
              {userResults.map((user) => (
                <button
                  key={user.user_id}
                  onClick={() => handleUserClick(user)}
                  className="
                    w-full flex items-center gap-3
                    px-3 py-2.5
                    hover:bg-slate-700/50
                    transition-colors duration-150
                    text-left
                  "
                >
                  <Avatar
                    src={user.avatar}
                    name={user.name}
                    size="sm"
                    isOnline={user.is_online}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {user.email}
                    </p>
                  </div>

                  {/* Online indicator text */}
                  <span className={`text-xs flex-shrink-0 ${
                    user.is_online ? 'text-green-400' : 'text-slate-600'
                  }`}>
                    {user.is_online ? 'Online' : 'Offline'}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default SearchBar