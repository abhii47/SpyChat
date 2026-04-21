# Socket.io Integration Plan for SpyChat

This plan outlines the steps to integrate real-time communication into the existing SpyChat backend.

## 1. Infrastructure Changes

### Server Modification (`src/server.ts`)
- Import `http` from Node.js and `Server` from `socket.io`.
- Wrap the Express `app` with `http.createServer(app)`.
- Initialize `socket.io` with the HTTP server and CORS configuration.
- Change `app.listen` to `server.listen`.

### Directory Structure
Create a new directory `src/sockets` to manage real-time logic:
- `src/sockets/index.ts`: Entry point for socket initialization and root event listeners.
- `src/sockets/chatHandler.ts`: Handlers for message-related events (Private & Group).
- `src/sockets/statusHandler.ts`: Handlers for online/offline status and typing indicators.

## 2. Authentication & Room Management
- **Handshake Verification**: Verify JWT tokens to identify the `user_id`.
- **Auto-Join Rooms**: Upon connection, fetch the user's `conversation_id`s from `ConversationMember` and `group_id`s from `GroupMember`.
- **Room Naming**:
    - Private: `room_conv_${conversation_id}`
    - Group: `room_group_${group_id}`
- **User Room**: Every user also joins a personal room `user_${user_id}` for direct notifications.

## 3. Real-time Event Mapping (Model-Aligned)

| Event Name | Direction | Payload Structure | Action |
| :--- | :--- | :--- | :--- |
| `send_message` | Client -> Server | `{ conversation_id?, group_id?, content, type, media_url? }` | Validate membership, save to `Message` table, then broadcast. |
| `new_message` | Server -> Client | `{ message_id, sender_id, content, type, created_at, ... }` | Broadcast to the specific room. |
| `typing` | Client -> Server | `{ id, isGroup: boolean, isTyping: boolean }` | Broadcast to room excluding sender. |
| `mark_read` | Client -> Server | `{ message_id }` | Update `MessageRead` model and notify sender. |

## 4. Interaction with Existing Services
- **Message Persistence**: Socket handlers will call `src/services/messageService.ts` to create records in the `messages` table.
- **Validation**: Ensure `sender_id` is authorized to post in the target `conversation_id` or `group_id`.
- **Redis Integration**: Use `ioredis` for tracking "Last Seen" status and potentially for the Socket.io Redis Adapter.

## 5. Implementation Steps (Phased)
1. **Phase 1**: Modify `server.ts` to support HTTP server and Socket.io.
2. **Phase 2**: Implement JWT authentication for sockets.
3. **Phase 3**: Create basic `connection` and `disconnect` handlers.
4. **Phase 4**: Implement `join_chat` and `send_message` with database persistence.
5. **Phase 5**: Add "polish" features like typing indicators and message read receipts.
