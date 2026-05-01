/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [name, email, password, avatar]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Abhi
 *               email:
 *                 type: string
 *                 example: abhi@example.com
 *               password:
 *                 type: string
 *                 example: secret123
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       422:
 *         description: Validation error
 */

 /**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login and get tokens
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: abhi@example.com
 *               password:
 *                 type: string
 *                 example: secret123
 *     responses:
 *       200:
 *         description: Login successful — accessToken in body, refreshToken in cookie
 *       401:
 *         description: Invalid credentials
 */

 /**
 * @swagger
 * /auth/refresh:
 *   post:
 *     tags: [Auth]
 *     summary: Get new accessToken using refreshToken cookie
 *     security: []
 *     responses:
 *       200:
 *         description: New accessToken returned
 *       401:
 *         description: Invalid or expired refresh token
 */

 /**
 * @swagger
 * /auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Logout — clears Redis session and cookie
 *     security: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 */

 /**
 * @swagger
 * /auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Get logged-in user profile
 *     responses:
 *       200:
 *         description: User profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 */

 
