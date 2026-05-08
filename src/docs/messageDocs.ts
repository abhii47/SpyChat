// src/docs/message.docs.ts

/**
 * @swagger
 * tags:
 *   name: Messages
 *   description: Media upload endpoint
 */

/**
 * @swagger
 * /messages/upload:
 *   post:
 *     tags: [Messages]
 *     summary: Upload media files before sending via Socket
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [media, room_type, room_id]
 *             properties:
 *               media:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Max 5 files, 10MB each
 *               room_type:
 *                 type: string
 *                 enum: [conversation, group]
 *               room_id:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       200:
 *         description: Uploaded media URLs — use in socket send_message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       url:
 *                         type: string
 *                       public_id:
 *                         type: string
 *                       type:
 *                         type: string
 *                         enum: [image, file]
 *       403:
 *         description: Not a member of this room
 */


// # SpyChat — Frontend Plan
// > React.js + TypeScript + Vite + Tailwind + Zustand + Socket.IO

// ---

// ## Folder Structure

// ```
// SpyChat/
// ├── src/                    ← Backend (existing)
// ├── client/                 ← Frontend (new)
// │   ├── public/
// │   │   └── favicon.ico
// │   ├── src/
// │   │   ├── api/            ← Axios instances + all REST calls
// │   │   │   ├── axiosInstance.ts
// │   │   │   ├── authApi.ts
// │   │   │   ├── convApi.ts
// │   │   │   ├── groupApi.ts
// │   │   │   ├── userApi.ts
// │   │   │   └── messageApi.ts
// │   │   │
// │   │   ├── socket/         ← Socket.IO client + all event handlers
// │   │   │   ├── socketInstance.ts
// │   │   │   ├── chatEvents.ts
// │   │   │   ├── convEvents.ts
// │   │   │   ├── groupEvents.ts
// │   │   │   ├── searchEvents.ts
// │   │   │   └── statusEvents.ts
// │   │   │
// │   │   ├── store/          ← Zustand global state
// │   │   │   ├── authStore.ts
// │   │   │   ├── chatStore.ts
// │   │   │   ├── convStore.ts
// │   │   │   ├── groupStore.ts
// │   │   │   ├── searchStore.ts
// │   │   │   └── uiStore.ts
// │   │   │
// │   │   ├── pages/          ← Route-level components
// │   │   │   ├── LoginPage.tsx
// │   │   │   ├── RegisterPage.tsx
// │   │   │   └── ChatPage.tsx
// │   │   │
// │   │   ├── components/     ← Reusable UI components
// │   │   │   ├── auth/
// │   │   │   │   ├── LoginForm.tsx
// │   │   │   │   └── RegisterForm.tsx
// │   │   │   ├── sidebar/
// │   │   │   │   ├── Sidebar.tsx
// │   │   │   │   ├── ConversationList.tsx
// │   │   │   │   ├── ConversationItem.tsx
// │   │   │   │   ├── GroupList.tsx
// │   │   │   │   ├── GroupItem.tsx
// │   │   │   │   └── SearchBar.tsx
// │   │   │   ├── chat/
// │   │   │   │   ├── ChatWindow.tsx
// │   │   │   │   ├── MessageList.tsx
// │   │   │   │   ├── MessageBubble.tsx
// │   │   │   │   ├── MessageInput.tsx
// │   │   │   │   ├── TypingIndicator.tsx
// │   │   │   │   ├── MediaPreview.tsx
// │   │   │   │   └── ChatHeader.tsx
// │   │   │   ├── group/
// │   │   │   │   ├── CreateGroupModal.tsx
// │   │   │   │   ├── GroupDetailsModal.tsx
// │   │   │   │   ├── MemberList.tsx
// │   │   │   │   └── AddMemberModal.tsx
// │   │   │   └── ui/
// │   │   │       ├── Avatar.tsx
// │   │   │       ├── OnlineBadge.tsx
// │   │   │       ├── Modal.tsx
// │   │   │       ├── Spinner.tsx
// │   │   │       └── Toast.tsx
// │   │   │
// │   │   ├── hooks/          ← Custom React hooks
// │   │   │   ├── useAuth.ts
// │   │   │   ├── useSocket.ts
// │   │   │   ├── useMessages.ts
// │   │   │   ├── useTyping.ts
// │   │   │   └── useOnlineStatus.ts
// │   │   │
// │   │   ├── types/          ← TypeScript interfaces
// │   │   │   ├── auth.types.ts
// │   │   │   ├── chat.types.ts
// │   │   │   ├── conv.types.ts
// │   │   │   ├── group.types.ts
// │   │   │   └── socket.types.ts
// │   │   │
// │   │   ├── utils/          ← Helper functions
// │   │   │   ├── formatTime.ts
// │   │   │   ├── formatDate.ts
// │   │   │   └── getInitials.ts
// │   │   │
// │   │   ├── router/
// │   │   │   └── AppRouter.tsx
// │   │   │
// │   │   ├── App.tsx
// │   │   └── main.tsx
// │   │
// │   ├── index.html
// │   ├── package.json
// │   ├── tsconfig.json
// │   ├── vite.config.ts
// │   └── tailwind.config.js
// └── package.json            ← Backend
// ```

// ---

// ## Tech Stack

// ```
// Bundler:          Vite + React + TypeScript
// Styling:          Tailwind CSS
// State:            Zustand (lightweight, no boilerplate)
// HTTP:             Axios (with interceptors for auto token refresh)
// Socket:           socket.io-client
// Routing:          React Router v6
// Forms:            React Hook Form + Zod
// Notifications:    react-hot-toast
// Icons:            lucide-react
// Date:             date-fns
// ```

// ---

// ## Phase-wise Build Plan

// ---

// ## Phase 1 — Project Setup + Base Config
// **Goal: App chale, routes kaam karein, Tailwind dikh jaaye**

// ### 1.1 Vite Project Create
// ```bash
// cd SpyChat
// npm create vite@latest client -- --template react-ts
// cd client
// npm install
// ```

// ### 1.2 Dependencies Install
// ```bash
// npm install axios socket.io-client zustand react-router-dom
// npm install react-hook-form @hookform/resolvers zod
// npm install react-hot-toast lucide-react date-fns
// npm install -D tailwindcss postcss autoprefixer
// npx tailwindcss init -p
// ```

// ### 1.3 Files to Create/Configure
// ```
// vite.config.ts     → proxy /api → http://localhost:4000
// tailwind.config.js → content paths set karo
// src/main.tsx       → BrowserRouter wrap
// src/App.tsx        → routes define karo
// ```

// ### 1.4 Routes Structure
// ```
// /login       → LoginPage     (public)
// /register    → RegisterPage  (public)
// /            → ChatPage      (protected)
// *            → redirect /login
// ```

// ### Deliverable
// ```
// ✅ npm run dev → http://localhost:5173 kaam kare
// ✅ /login → LoginPage dikhey
// ✅ /register → RegisterPage dikhey
// ✅ / → redirect to /login (not authenticated)
// ```

// ---

// ## Phase 2 — Types + API Layer + Auth Store
// **Goal: Backend se baat karo, token manage karo**

// ### 2.1 TypeScript Types — `src/types/`

// ```typescript
// // auth.types.ts
// interface User {
//   user_id: number
//   name: string
//   email: string
//   avatar: string | null
//   is_active: boolean
//   last_seen: string | null
// }

// interface LoginResponse {
//   user: User
//   accessToken: string
//   expires_in: string  // "90 minutes"
// }

// // conv.types.ts
// interface Conversation {
//   conversation_id: number
//   members: ConversationMember[]
//   lastMessage: Message | null
//   unread_count: number
//   updated_at: string
// }

// // group.types.ts
// interface Group {
//   group_id: number
//   name: string
//   description: string
//   avatar: string | null
//   created_by: number
//   admin: { user_id: number; name: string; avatar: string }
// }

// // chat.types.ts
// interface Message {
//   message_id: number
//   sender_id: number
//   conversation_id: number | null
//   group_id: number | null
//   content: string
//   type: 'text' | 'media'
//   media: MediaItem[] | null
//   sender: { user_id: number; name: string; avatar: string }
//   created_at: string
// }

// interface MediaItem {
//   url: string
//   public_id: string
//   type: 'image' | 'file'
// }
// ```

// ### 2.2 Axios Instance — `src/api/axiosInstance.ts`

// ```typescript
// // Base config + interceptors
// const axiosInstance = axios.create({
//   baseURL: '/api',         // vite proxy se /api → localhost:4000/api
//   withCredentials: true,   // cookie bhejne ke liye (refreshToken)
// })

// // Request interceptor → Authorization header attach
// axiosInstance.interceptors.request.use((config) => {
//   const token = useAuthStore.getState().accessToken
//   if (token) config.headers.Authorization = `Bearer ${token}`
//   return config
// })

// // Response interceptor → 401 aaye → refresh karo → retry
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     if (error.response?.status === 401) {
//       // POST /api/auth/refresh → naya token
//       // store update karo
//       // original request retry karo
//     }
//   }
// )
// ```

// ### 2.3 Auth API — `src/api/authApi.ts`
// ```
// register(formData)    → POST /api/auth/register
// login(email, pass)    → POST /api/auth/login
// refresh()             → POST /api/auth/refresh
// logout()              → POST /api/auth/logout
// getMe()               → GET  /api/auth/me
// ```

// ### 2.4 Auth Store — `src/store/authStore.ts`
// ```typescript
// interface AuthStore {
//   user: User | null
//   accessToken: string | null
//   isAuthenticated: boolean
//   isLoading: boolean

//   // Actions
//   login(email, password): Promise<void>
//   register(formData): Promise<void>
//   logout(): Promise<void>
//   refreshToken(): Promise<void>
//   setUser(user): void
// }
// ```

// ### 2.5 Token Auto-Refresh Timer
// ```typescript
// // Login hone ke baad timer set karo
// // 90 min - 5 min = 85 min baad proactively refresh karo
// // Browser tab focus pe bhi check karo
// const REFRESH_BEFORE_MS = 5 * 60 * 1000  // 5 min pehle
// setTimeout(() => authStore.refreshToken(), 85 * 60 * 1000)
// ```

// ### Deliverable
// ```
// ✅ POST /api/auth/login kaam kare
// ✅ POST /api/auth/register kaam kare
// ✅ Token memory mein store ho
// ✅ Cookie browser mein set ho (refreshToken)
// ✅ 401 aane pe auto refresh ho
// ```

// ---

// ## Phase 3 — Auth Pages (Login + Register)
// **Goal: User login/register kar sake**

// ### 3.1 LoginPage + LoginForm
// ```
// Fields: email, password
// Validation: Zod schema (email format, password min 8)
// Submit: authStore.login()
// Success: navigate("/")
// Error: toast.error(err.message)
// ```

// ### 3.2 RegisterPage + RegisterForm
// ```
// Fields: name, email, password, avatar (file input)
// Validation: Zod schema
// Avatar preview before upload
// Submit: multipart/form-data
// Success: navigate("/login")
// ```

// ### 3.3 Protected Route
// ```typescript
// // Authenticated nahi → /login redirect
// // Authenticated hai → children render
// const ProtectedRoute = ({ children }) => {
//   const { isAuthenticated } = useAuthStore()
//   return isAuthenticated ? children : <Navigate to="/login" />
// }
// ```

// ### Deliverable
// ```
// ✅ Login form → success → / pe jaaye
// ✅ Register form → success → /login pe jaaye
// ✅ Validation errors dikh rahi hain
// ✅ Avatar preview kaam kar raha hai
// ✅ / pe jaao bina login ke → /login pe redirect
// ```

// ---

// ## Phase 4 — Socket Setup + Connection
// **Goal: Socket connect ho, events listen ho, store update ho**

// ### 4.1 Socket Instance — `src/socket/socketInstance.ts`
// ```typescript
// let socket: Socket | null = null

// export const connectSocket = (token: string) => {
//   socket = io('http://localhost:4000', {
//     auth: { token },           // frontend client — auth object
//     reconnection: true,
//     reconnectionAttempts: 5,
//     reconnectionDelay: 2000,
//   })

//   // Connection events
//   socket.on('connect', () => console.log('Socket connected'))
//   socket.on('connect_error', handleConnectError)
//   socket.on('disconnect', handleDisconnect)
//   socket.on('error', handleSocketError)  // emitSocketError se aata hai

//   return socket
// }

// export const disconnectSocket = () => {
//   socket?.disconnect()
//   socket = null
// }

// export const getSocket = () => socket
// ```

// ### 4.2 Socket Error Handler
// ```typescript
// // connect_error → auth fail
// // error → handler mein kuch galat hua
// socket.on('connect_error', (err) => {
//   if (err.data?.code === 'TOKEN_EXPIRED') {
//     authStore.refreshToken().then((newToken) => {
//       socket.auth.token = newToken
//       socket.connect()
//     })
//   }
//   if (err.data?.code === 'TOKEN_INVALID') {
//     authStore.logout()
//   }
// })

// socket.on('error', (err) => {
//   // { event, message }
//   toast.error(err.message)
// })
// ```

// ### 4.3 Socket in Auth Flow
// ```typescript
// // Login success → socket connect
// authStore.login() → connectSocket(accessToken)

// // Logout → socket disconnect
// authStore.logout() → disconnectSocket()

// // Token refresh → socket re-auth
// authStore.refreshToken() → socket.auth.token = newToken
// ```

// ### 4.4 Status Events — `src/socket/statusEvents.ts`
// ```typescript
// // user_online → onlineUsers set mein add karo
// // user_offline → onlineUsers set se hata do, last_seen update karo
// socket.on('user_online', ({ userId }) => {
//   chatStore.addOnlineUser(userId)
// })
// socket.on('user_offline', ({ userId, last_seen }) => {
//   chatStore.removeOnlineUser(userId)
//   chatStore.updateLastSeen(userId, last_seen)
// })
// ```

// ### Deliverable
// ```
// ✅ Login ke baad socket connect ho
// ✅ Server console mein "User Connected" dikh raha ho
// ✅ Logout ke baad socket disconnect ho
// ✅ user_online / user_offline events store update karein
// ```

// ---

// ## Phase 5 — Sidebar + Conversation List
// **Goal: Left panel — conversations + groups dikh rahi hain**

// ### 5.1 Conv API + Store
// ```typescript
// // src/api/convApi.ts
// getMyConversations()           → GET /api/conversations
// startConversation(receiverId)  → POST /api/conversations
// getMessages(id, page, limit)   → GET /api/conversations/:id/messages

// // src/store/convStore.ts
// interface ConvStore {
//   conversations: Conversation[]
//   activeConvId: number | null
//   isLoading: boolean

//   fetchConversations(): Promise<void>
//   setActiveConv(id): void
//   addConversation(conv): void
//   updateLastMessage(convId, message): void
//   incrementUnread(convId): void
//   resetUnread(convId): void
// }
// ```

// ### 5.2 Conv Socket Events — `src/socket/convEvents.ts`
// ```typescript
// // listen karo
// socket.on('join_conv_success', ({ conversation, isNew }) => {
//   if (isNew) convStore.addConversation(conversation)
//   convStore.setActiveConv(conversation.conversation_id)
// })

// socket.on('notify', (data) => {
//   // dusre user ne conversation start ki tumhare saath
//   convStore.addConversation(data.conversation)
// })

// socket.on('conv_list', ({ conversations }) => {
//   convStore.setConversations(conversations)
// })
// ```

// ### 5.3 Group API + Store
// ```typescript
// // src/api/groupApi.ts
// getMyGroups()                  → GET /api/groups
// createGroup(formData)          → POST /api/groups
// uploadGroupAvatar(file)        → POST /api/groups/upload-avatar
// getGroupDetail(id)             → GET /api/groups/:id
// addMember(groupId, userId)     → POST /api/groups/:groupId/members/:userId
// removeMember(groupId, userId)  → DELETE /api/groups/:groupId/members/:userId
// getGroupMessages(id, page)     → GET /api/groups/:id/messages

// // src/store/groupStore.ts — convStore jaisi structure
// ```

// ### 5.4 Sidebar Layout
// ```
// ┌─────────────────────────┐
// │  🔍 Search              │  ← SearchBar
// ├─────────────────────────┤
// │  💬 Conversations       │  ← Tab
// │  👥 Groups              │  ← Tab
// ├─────────────────────────┤
// │  [Avatar] Raj Patel     │
// │           Hey bhai! 2m  │  ← ConversationItem
// │                    (3)  │  ← unread badge
// ├─────────────────────────┤
// │  [Avatar] MCA Batch     │
// │           Assignment... │  ← GroupItem
// └─────────────────────────┘
// ```

// ### Deliverable
// ```
// ✅ Sidebar mein conversations list dikh rahi hai
// ✅ Groups list dikh rahi hai
// ✅ Last message + time dikh raha hai
// ✅ Unread count badge dikh raha hai
// ✅ Active conversation highlight ho rahi hai
// ✅ Click karo → active set ho
// ```

// ---

// ## Phase 6 — Chat Window (Core Feature)
// **Goal: Messages dikho, bhej sako**

// ### 6.1 Message Store — `src/store/chatStore.ts`
// ```typescript
// interface ChatStore {
//   messages: Record<string, Message[]>  // key: "conv_1" | "group_5"
//   onlineUsers: Set<number>
//   typingUsers: Record<string, number[]>  // room → userIds[]
//   isLoading: boolean

//   setMessages(roomKey, messages): void
//   addMessage(roomKey, message): void
//   removeMessage(roomKey, messageId): void
//   addOnlineUser(userId): void
//   removeOnlineUser(userId): void
//   setTyping(room, userId, isTyping): void
// }
// ```

// ### 6.2 Chat Socket Events — `src/socket/chatEvents.ts`
// ```typescript
// // New message
// socket.on('new_message', (message) => {
//   const roomKey = message.conversation_id
//     ? `conv_${message.conversation_id}`
//     : `group_${message.group_id}`
//   chatStore.addMessage(roomKey, message)
//   convStore.updateLastMessage(...)  // sidebar update
// })

// // Typing
// socket.on('typing', ({ userId, isTyping }) => {
//   chatStore.setTyping(currentRoom, userId, isTyping)
// })

// // Message deleted
// socket.on('notify', (data) => {
//   if (data.message_id) {
//     chatStore.removeMessage(roomKey, data.message_id)
//   }
// })

// // Message read
// socket.on('message_read', ({ message_id, read_by }) => {
//   // tick marks update karo
// })
// ```

// ### 6.3 ChatWindow Layout
// ```
// ┌────────────────────────────────────┐
// │ ChatHeader                         │
// │ [Avatar] Raj Patel  🟢 Online      │
// ├────────────────────────────────────┤
// │                                    │
// │  MessageList                       │
// │                                    │
// │         [Raj]: Hey bhai! 10:05 ✓✓ │
// │  [You]: Hello! 10:06          ✓✓  │
// │                                    │
// │  Raj is typing...                  │
// ├────────────────────────────────────┤
// │ MessageInput                       │
// │ 📎 [Type a message...]  📷  Send  │
// └────────────────────────────────────┘
// ```

// ### 6.4 MessageBubble
// ```
// Own message  → right align, primary color
// Other message → left align, grey
// Media message → image/file preview
// Time         → bottom right small
// Read receipt → ✓ (sent) ✓✓ (read) — blue
// Delete option → long press / right click → own messages only
// ```

// ### 6.5 MessageInput
// ```
// Text input → typing emit (debounced 500ms)
// Send button → send_message emit
// 📎 button → file picker → POST /api/messages/upload → send_message
// Paste image → detect → upload → send
// Enter to send, Shift+Enter new line
// ```

// ### 6.6 Typing Indicator
// ```typescript
// // Input mein kuch type karo → emit typing
// // 500ms debounce → stop typing emit
// const handleTyping = debounce(() => {
//   socket.emit('typing', { id: convId, isGroup: false, isTyping: false })
// }, 500)
// ```

// ### Deliverable
// ```
// ✅ Messages page karo → load ho
// ✅ Message bhejo → real-time dono sides pe dikhe
// ✅ Typing indicator dikhe
// ✅ Online status ChatHeader mein dikhe
// ✅ Media image send ho aur preview dikhe
// ✅ Message delete ho aur dono sides se hatey
// ✅ Scroll to bottom on new message
// ✅ Load more on scroll up (pagination)
// ```

// ---

// ## Phase 7 — Search + New Conversation
// **Goal: User dhundo, conversation shuru karo**

// ### 7.1 Search Flow
// ```
// SearchBar → type karo → debounce 300ms
//   → socket.emit("search", { query, limit: 10 })
//   → socket.on("search_result", results)
//   → dropdown mein users dikh rahi hain + online badge

// Click user →
//   → socket.emit("join_conv", { receiver_id })
//   → socket.on("join_conv_success", { conversation, isNew })
//   → sidebar mein conversation add ho (if new)
//   → ChatWindow open ho
// ```

// ### 7.2 Search Group
// ```
// Tab switch → Group search
//   → socket.emit("search_group", { query })
//   → socket.on("search_group_result", groups)
//   → dropdown mein groups dikh rahi hain
// Click group → group chat open ho
// ```

// ### 7.3 SearchBar Component
// ```
// Input → debounced emit
// Results dropdown:
//   Users tab:
//     [Avatar] Raj Patel  🟢        ← online
//     [Avatar] Priya Shah  ⚫       ← offline
//   Groups tab:
//     [Avatar] MCA Batch  12 members
// ```

// ### Deliverable
// ```
// ✅ Search type karo → real-time results aayein
// ✅ User click → conversation open ho (new ya existing)
// ✅ Online/offline badge search results mein
// ```

// ---

// ## Phase 8 — Groups Feature
// **Goal: Group banao, manage karo**

// ### 8.1 Create Group Flow
// ```
// "+" button click → CreateGroupModal open

// Step 1: Group info
//   Name, Description, Avatar upload
//   → POST /api/groups/upload-avatar (avatar file)
//   → avatarUrl mile

// Step 2: Add members
//   Search users → select karo → list mein dikhao
//   Member list: [X] Raj Patel  [X] Priya Shah

// Submit:
//   → socket.emit("create_group", {
//       name, description,
//       avatarUrl, memberIds: [2, 3]
//     })
//   → socket.on("create_group_success", { group })
//   → sidebar mein group add ho
//   → Group chat window open ho
// ```

// ### 8.2 Group Details Modal
// ```
// Click group name → GroupDetailsModal

// Members list:
//   [Avatar] Abhi (You)  👑 Admin
//   [Avatar] Raj Patel   Member  [Remove]  ← sirf admin dikhe
//   [Avatar] Priya Shah  Member  [Remove]

// Actions:
//   Admin:    [+ Add Member] [Leave] (disabled if last admin)
//   Member:   [Leave Group]
// ```

// ### 8.3 Add Member Flow
// ```
// "+ Add Member" → AddMemberModal
//   Search users (jo already member nahi)
//   Select → socket.emit("add_member", { group_id, user_id })
//   → socket.on("add_member_success")
//   → member list update ho
//   → New member ko notify event jaata hai
// ```

// ### 8.4 Leave Group
// ```
// "Leave Group" click → confirm dialog
//   → socket.emit("leave_group", { group_id })
//   → socket.on("leave_group_success")
//   → sidebar se group remove ho
//   → ChatWindow close ho
// ```

// ### Deliverable
// ```
// ✅ Group create ho with avatar
// ✅ Members add/remove karo
// ✅ Group detail modal mein members dikh rahi hain
// ✅ Admin controls sirf admin ko dikhe
// ✅ Leave group kaam kare
// ✅ Real-time member updates room mein dikhe
// ```

// ---

// ## Phase 9 — Profile + Settings
// **Goal: Apna profile dekho aur update karo**

// ### 9.1 Profile Section
// ```
// Sidebar bottom:
//   [Avatar] Abhi Rajpurohit  ⚙️

// Click → ProfilePanel slide in

// Profile Panel:
//   [Large Avatar]  📷 Change
//   Name:  Abhi Rajpurohit  [Edit]
//   Email: abhi@test.com    [Edit]
//   [Update Profile]
//   [Logout]
// ```

// ### 9.2 User Profile View
// ```
// Click kisi user pe → UserProfileModal
//   [Avatar]
//   Raj Patel
//   🟢 Online / Last seen 2h ago
//   [Message]  ← conversation open karo
// ```

// ### 9.3 Update Profile Flow
// ```
// Change name/email/avatar
//   → PUT /api/users/update (form-data)
//   → authStore.user update karo
//   → toast.success("Profile updated")
// ```

// ### Deliverable
// ```
// ✅ Profile sidebar mein dikh raha hai
// ✅ Profile update kaam kare
// ✅ Avatar change kaam kare
// ✅ Logout button kaam kare
// ✅ Dusre user ka profile click se dekho
// ```

// ---

// ## Phase 10 — Polish + Production Ready
// **Goal: App feel complete ho**

// ### 10.1 UI Polish
// ```
// Empty states:
//   No conversations → "Start a new conversation"
//   No messages → "Say hello 👋"
//   No search results → "No users found"

// Loading states:
//   Skeleton loaders — message list
//   Spinner — send button
//   Blur — modal background

// Error states:
//   Toast notifications (react-hot-toast)
//   Connection lost banner
//   Retry button
// ```

// ### 10.2 Responsive Design
// ```
// Mobile:  Sidebar full screen → Chat full screen (toggle)
// Tablet:  Sidebar 40% → Chat 60%
// Desktop: Sidebar 30% → Chat 70%
// ```

// ### 10.3 Optimizations
// ```
// Virtual scrolling — large message lists
// Image lazy loading
// Debounce — typing, search
// Memoization — MessageBubble (React.memo)
// Socket cleanup — useEffect return mein
// ```

// ### 10.4 Environment Variables
// ```
// # client/.env
// VITE_API_URL=http://localhost:4000
// VITE_SOCKET_URL=http://localhost:4000
// ```

// ---

// ## Phase Summary

// ```
// Phase  Goal                              Key Deliverable
// ────────────────────────────────────────────────────────────────────
// 1      Setup + Config                    App runs, routes work
// 2      Types + API + Auth Store          Backend se baat ho
// 3      Auth Pages                        Login/Register kaam kare
// 4      Socket Setup                      Real-time connection live
// 5      Sidebar + Lists                   Conversations/Groups dikh rahi
// 6      Chat Window                       Messages bhej/receive kar sako
// 7      Search + New Conv                 Users dhundo, chat shuru karo
// 8      Groups Feature                    Create, manage groups
// 9      Profile + Settings                Profile update karo
// 10     Polish + Production               App production ready
// ```

// ---

// ## REST vs Socket — Kab Kya Use Karein

// ```
// Action                    REST                    Socket
// ──────────────────────────────────────────────────────────────────
// Login/Register            ✅ REST only            —
// Token Refresh             ✅ REST only            —
// Profile Update            ✅ REST only            —
// Media File Upload         ✅ REST only            —
//                           (socket pe file nahi)

// Initial Data Load         ✅ REST (faster)        —
//   conversations list
//   messages history

// Real-time Actions         —                       ✅ Socket
//   Send message
//   Typing indicator
//   Mark read
//   Delete message
//   Create conversation
//   Create group
//   Add/Remove member
//   Search (live)

// Background Updates        —                       ✅ Socket
//   new_message
//   user_online/offline
//   member added/removed
//   notify events
// ```

// ---

// ## Key Implementation Notes

// ### 1. Token Storage — Memory only
// ```typescript
// // ❌ Never do this
// localStorage.setItem('token', accessToken)  // XSS vulnerable

// // ✅ Always this
// const useAuthStore = create((set) => ({
//   accessToken: null,  // memory mein sirf
//   ...
// }))
// // Page refresh pe token gone → /api/auth/refresh from cookie
// ```

// ### 2. Page Refresh Handling
// ```typescript
// // App.tsx → mount hone pe refresh karo
// useEffect(() => {
//   authStore.refreshToken()  // cookie se naya token lo
//     .then(() => connectSocket(token))
//     .catch(() => navigate('/login'))
// }, [])
// ```

// ### 3. Message Rooms Key Convention
// ```typescript
// // Store mein messages ek object mein rakhna
// const roomKey = message.conversation_id
//   ? `conv_${message.conversation_id}`
//   : `group_${message.group_id}`

// messages[roomKey] = [...existing, newMessage]
// ```

// ### 4. Notify Event — 2 formats handle karo
// ```typescript
// socket.on('notify', (data) => {
//   // Format 1: Message deleted
//   if (data.message_id) {
//     const key = data.room.startsWith('room_conv')
//       ? `conv_${data.room.split('_')[2]}`
//       : `group_${data.room.split('_')[2]}`
//     chatStore.removeMessage(key, data.message_id)
//     return
//   }
//   // Format 2: Group notification
//   if (data.type && data.message) {
//     toast(data.message)
//   }
// })
// ```

// ### 5. Unread Count Reset
// ```typescript
// // Chat open karte waqt unread reset karo
// const openChat = (convId) => {
//   convStore.setActiveConv(convId)
//   convStore.resetUnread(convId)
//   // Backend pe bhi mark karo — GET /api/messages/:id/read
// }
// ```