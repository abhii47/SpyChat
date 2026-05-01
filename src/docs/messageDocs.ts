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