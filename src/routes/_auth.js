/* eslint-disable */

// ==========================================================================
// Schemas
// ==========================================================================

// Schema: CredentialSchema
// ==========================================================================

/**
 * @swagger
 *   components:
 *     schema:
 *       CredentialSchema:
 *         type: object
 *         required: [username,password]
 *         properties:
 *           username:
 *             type: string
 *             MaxLength: 20
 *             MinLength: 4
 *           password:
 *             type: string
 *             MaxLength: 100
 *             MinLength: 8
 */

// Schema: CredentialOkSchema
// ==========================================================================

/**
 * @swagger
 *   components:
 *     schema:
 *        CredentialOkSchema:
 *           type: object
 *           properties:
 *             token:
 *                type: string
 *             message:
 *                type: string
 *             user:
 *                type: Object
 */
    
// ==========================================================================
// RequestBodies
// ==========================================================================

// RequestBody: CredentialBody
// ==========================================================================

/**
 * @swagger
 *   components:
 *     requestBodies:
 *       CredentialBody:
 *         description: User authentification object
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#components/schema/CredentialSchema'
 *             examples:
 *               CredentialBodyExemple:
 *                 $ref: '#components/examples/CredentialBodyExample'
 */
    
// ==========================================================================
// Examples
// ==========================================================================

// Example: CredentialBodyExample
// ==========================================================================

/**
 * @swagger
 *   components:
 *     examples:
 *        CredentialBodyExample:
 *           value:
 *             username: user01
 *             password: password01
 */

// Exemple: CredentialOkExample
// ==========================================================================

/**
 * @swagger
 *   components:
 *     examples:
 *        CredentialOkExample:
 *           value:
 *             message: Token succesfully created.
 *             token: 'adfdafduefadfaadf233hu4...' 
 *             user:
 *               username: user01
 *               email: user01@gmail.com
 *               admin: false
 *               id: 63a9a602147117f37fb3bdde
 */

// ==========================================================================
// Responses
// ==========================================================================

// Response: 
// ==========================================================================

/**
 * @swagger
 *   components:
 *     responses:
 *        ResponseOk:
 *          description: todo
 *          content:
 *            application/json:
 *             schema:
 *                $ref: '#/components/schemas/CredentialOkSchema'
 */
