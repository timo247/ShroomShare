/* eslint-disable */



// All users retrieved
// ============================================================
// Schemas
// ==========================================================
// Schema : UserSchema
// ==========================================================

/**
* @swagger
*   components:
*     schema:
*       UserSchema:
*         type: object
*         properties:
*           message:
*             type: string
*           user:
*             type: array
*             items:
*                type: object
*                properties:
*                  username:
*                    type: string
*                    maxLength: 20
*                    minLength: 4
*                  admin:
*                    type: boolean
*/

// ==========================================================
// Examples
// ==========================================================
// Example : AllUserExample
// ==========================================================
/**
 * @swagger
 *   components:
 *      examples:
 *          AllUserExample:
 *              value:
 *                  message: "Success: All users retrieved"
 *                  user:
 *                        - username: John2022
 *                          admin: false
 *                 
 */

// ==========================================================
// ==========================================================
// ==========================================================
// ==========================================================

// Retrieved a specif user
// ==========================================================
// Schemas
// ==========================================================
// Schema : SpecifUserSchema
// ==========================================================

/**
 * @swagger
 *  components:
 *      schema:
 *          SpecifUserSchema:
 *              type: object
 *              properties:
 *                  message:
 *                      type: string
 *                  username:
 *                      type: string
 *                      maxLength: 20
 *                      minLength: 4
 *                  admin:
 *                      type: boolean
 */    

// ==========================================================
// Examples
// ==========================================================
// Example : SpecifUserExample
// ==========================================================
/**
 * @swagger
 *      components:
 *         examples:
 *            SpecifUserExample:
 *               value:
 *                 message: "Success: Specif user retrieved"
 *                 username: John2022
 *                 admin: false
 */

// ==========================================================
// ==========================================================
// ==========================================================
// ==========================================================
// Create a new user
// =========================================================
// Schemas
// =========================================================
// Schema : CreateUserSchema
// =========================================================
/**
 * @swagger
 *      components:
 *         schema:
 *           CreateUserSchema:
 *             type: object
 *             
 *             properties:
 *                  username:
 *                     type: string
 *                     maxLength: 20
 *                     minLength: 4
 *                  password:
 *                    type: string
 *                    maxLength: 100
 *                    minLength: 8
 *                  email:
 *                   type: string
 *                   format: email
 *                  admin:
 *                   type: boolean
 *              
 *              
 */
  
// =========================================================
//Schema : CreatedUserSchema
// =========================================================
/**
 * @swagger
 *     components:
 *       schema:
 *        CreatedUserSchema:
 *         type: object
 *         properties:
 *          message:
 *           type: string
 *          user:
 *           type: object
 *           properties:
 *              username:
 *               type: string
 *               maxLength: 20
 *               minLength: 4
 *              password:
 *               type: string
 *               maxLength: 100
 *               minLength: 8
 *              email:
 *               type: string
 *               format: email
 *              admin:
 *               type: boolean
 *           token:
 *            type: string
 */

// =========================================================
// Examples
// =========================================================
// Example : CreateUserExample
// =========================================================
/**
 * @swagger
 *     components:
 *       examples:
 *        CreateUserExample:
 *         value:
 *          username: John2022
 *          password: 12345678
 *          email: "user@exemple.com"
 *          admin: false
 */
// =========================================================
// Example : CreatedUserExample
// =========================================================
/**
 * @swagger
 *    components:
 *     examples:
 *          CreatedUserExample:
 *             value:
 *              message: "Success: User created"
 *              user:
 *                username: John2022
 *                password: 12345678
 *                email: "john.doe@gmail.com"
 *                admin: false
 *              token: cknkclwkjnowfèvhaunhbvfhgncabfivbsghfibubg
 */

// =========================================================
// RequestBody
// ==========================================================
// RequestBody : UserBody
// ==========================================================

/**
 * @swagger
 *  components:
 *   requestBodies:
 *    UserBody:
 *     description: User object
 *     required: true
 *     content:
 *      application/json:
 *       schema:
 *          type: object
 *          $ref: '#/components/schema/CreateUserSchema'
 *       examples:
 *         UserExample:
 *          $ref: '#/components/examples/CreateUserExample'
 *    
 */   

// =========================================================
// =========================================================
// =========================================================
// =========================================================
// Update a user
// =========================================================
// Schemas
// =========================================================
// Schema : UpdateUserSchema
// =========================================================
/**
 * @swagger
 *     components:
 *      schema:
 *          UpdateUserSchema:
 *              type: object
 *              properties:
 *                  username:
 *                     type: string
 *                     maxLength: 20
 *                     minLength: 4
 *                  password:
 *                     type: string
 *                     maxLength: 100
 *                     minLength: 8
 *                  email:
 *                     type: string
 *                     format: email
 *                  admin:
 *                     type: boolean
 */

// =========================================================
//Schema : UpdatedUserSchema
// =========================================================
/**
 * @swagger
 *    components:
 *     schema:
 *          UpdatedUserSchema:
 *             type: object
 *             properties:
 *              message:
 *                  type: string
 *              user:
 *                 type: object
 *                 properties:
 *                      username:
 *                         type: string
 *                         maxLength: 20
 *                         minLength: 4
 *                      password:
 *                         type: string
 *                         maxLength: 100
 *                         minLength: 8
 *                      email:
 *                         type: string
 *                         format: email
 *                      admin:
 *                         type: boolean
 */
// =========================================================
// Examples
// =========================================================
// Example : UpdateUserExample
// =========================================================
/**
 * @swagger
 *    components:
 *      examples:
 *         UpdateUserExample:
 *           value:
 *             username: John2022
 *             password: 12345678
 *             email: "john.doe@exemple.com"
 *             admin: false
 */

// =========================================================
// Example : UpdatedUserExample
// =========================================================
/**
 * @swagger
 *   components:
 *    examples:
 *     UpdatedUserExample:  
 *      value:
 *          message: "Success: User updated"
 *          user:
 *             username: John2022
 *             password: 12345678
 *             email: "john.doe@gmail.com"
 *             admin: false
 */

// =========================================================
// Request Body
// =========================================================
// RequestBody : UpdateUserBody
// =========================================================
/**
 * @swagger
 *      components:
 *          requestBodies:
 *             UpdateUserBody:
 *               description: User object
 *               content:
 *                application/json:
 *                  schema:
 *                   type: object
 *                   $ref: '#/components/schema/UpdateUserSchema'
 *                  examples:
 *                   UpdateUserExample:
 *                          $ref: '#/components/examples/UpdateUserExample'
 * 
 *  
 */

// =========================================================
// =========================================================
// =========================================================
// =========================================================
// Delete a user
// =========================================================
// Schemas
// =========================================================
// Schema : DeleteUserSchema
// =========================================================
/**
 * @swagger
 *    components:
 *     schema:
 *          DeletedUserSchema:
 *            type: object
 *            properties:
 *             message:
 *                  type: string
 */

// =========================================================
// Examples
// =========================================================
// Example : DeletedUserExample
// =========================================================

/**
 * @swagger
 *   components:
 *      examples:
 *        DeletedUserExample:
 *         value:
 *              message: "Success: User deleted"
 */