// src/docs/group.docs.ts

/**
 * @swagger
 * tags:
 *   name: Groups
 *   description: Group chat endpoints
 */

/**
 * @swagger
 * /groups:
 *   post:
 *     tags: [Groups]
 *     summary: Create a new group
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [name, memberIds] 
 *             properties:
 *               name:
 *                 type: string
 *                 example: MCA Batch 2024
 *               description:
 *                 type: string
 *                 example: Our class group
 *               memberIds:
 *                 type: string
 *                 example: '"[2,3,4]"'
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Group created successfully
 */

/**
 * @swagger
 * /groups:
 *   get:
 *     tags: [Groups]
 *     summary: Get all groups with last message and unread count
 *     responses:
 *       200:
 *         description: List of groups
 */

/**
 * @swagger
 * /groups/{id}:
 *   get:
 *     tags: [Groups]
 *     summary: Get group detail with member list
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Group detail
 *       403:
 *         description: Not a member
 */

/**
 * @swagger
 * /groups/{id}/members:
 *   post:
 *     tags: [Groups]
 *     summary: Add member to group (admin only)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [user_id]
 *             properties:
 *               user_id:
 *                 type: integer
 *                 example: 7
 *     responses:
 *       201:
 *         description: Member added
 *       403:
 *         description: Only admin can add members
 */

/**
 * @swagger
 * /groups/{id}/members/{userId}:
 *   delete:
 *     tags: [Groups]
 *     summary: Remove member or leave group
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Member removed or left group
 *       400:
 *         description: Last admin cannot leave
 *       403:
 *         description: Only admin can remove members
 */

/**
 * @swagger
 * /groups/{id}/messages:
 *   get:
 *     tags: [Groups]
 *     summary: Get paginated group messages
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *     responses:
 *       200:
 *         description: Paginated group messages
 *       403:
 *         description: Not a member
 */