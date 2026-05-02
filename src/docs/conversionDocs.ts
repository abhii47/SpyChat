// src/docs/conversation.docs.ts

/**
 * @swagger
 * tags:
 *   name: Conversations
 *   description: 1-to-1 chat endpoints
 */

/**
 * @swagger
 * /conversations:
 *   post:
 *     tags: [Conversations]
 *     summary: Start or get existing conversation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [receiverId]
 *             properties:
 *               receiverId:
 *                 type: integer
 *                 example: 5
 *     responses:
 *       201:
 *         description: New conversation created
 *       200:
 *         description: Existing conversation returned
 *       400:
 *         description: Cannot start conversation with yourself
 */

/**
 * @swagger
 * /conversations:
 *   get:
 *     tags: [Conversations]
 *     summary: Get all conversations with last message and unread count
 *     responses:
 *       200:
 *         description: List of conversations
 */

/**
 * @swagger
 * /conversations/{id}/messages:
 *   get:
 *     tags: [Conversations]
 *     summary: Get paginated messages for a conversation
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Conversation ID
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *     responses:
 *       200:
 *         description: Paginated messages
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *                 messages:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Message'
 *       403:
 *         description: Not a member of this conversation
 */