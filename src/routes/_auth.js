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
 *                maxLength: 12   
 *           required: [token]
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
 *             username: user01
 *             password: password01
 *             message: Token succesfully created.
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