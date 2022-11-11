/* eslint-disable */

// Create new specy
// =================================================
// Schemas
// =================================================
// Schema : CreateSpecieSchema
// =================================================
/**
 * @swagger
 *      components:
 *       schema:
 *          CreateSpecieSchema:
 *           type: object
 *           properties:
 *              name:
 *               type: string
 *              description:
 *               type: string
 *              usage:
 *               type: string
 *               enum: 
 *                    - commestible
 *                    - non-commestible
 *              picture:
 *               type: string 
 */

// =================================================
// Schema : CreatedSpecieSchema
// =================================================
/**
 * @swagger
 *     components:
 *      schema:
 *          CreatedSpecieSchema:
 *              type: object
 *              properties:
 *                 message:
 *                  type: string
 *                 specy:
 *                  type: object
 *                  properties:
 *                     name:
 *                      type: string
 *                     description:
 *                      type: string
 *                      enum: 
 *                           - commestible
 *                           - non-commestible
 *                     pictureId:
 *                      type: string
 *                     id:
 *                      type: string
 *                     picture:
 *                      type: object
 *                      properties:
 *                        value:
 *                         type: string
 *                        resource_id:
 *                         type: string
 *                        collectionName:
 *                         type: string
 *                        date:
 *                         type: string
 *                        id:
 *                         type: string
 *                       
 */

// =================================================
// Examples
// =================================================
// Example : CreateSpecieExample
// =================================================
/**
 * @swagger
 *     components:
 *      examples:
 *          CreateSpecieExample:
 *             value:
 *               name: Bolet
 *               description: Bolet qui apparaît dans la foret
 *               usage: commestible
 *               picture: 5f9f9f9f9f9f9f9f9f9f9f9f
 */

// =================================================
// Example : CreatedSpecieExample
// =================================================
/**
 * @swagger
 *    components:
 *     examples:
 *        CreatedSpecieExample:
 *          value:
 *           message: Specie created
 *           specy:
 *              name: Bolet
 *              description: Bolet qui apparaît dans la foret
 *              usage: commestible
 *              pictureId: 5f9fcvdfvfbbbnsf9f9vsvvfs9f9f9f9f9f
 *              id: 5f9f9f9f9f9f9f9f9f9f9f9f
 *           picture:
 *             value: data:image/undefinedbase64,...
 *             resource_id: 5f9f9fvavrnztjsaabstwgb356736gv3ff9f9f9f9f9f9f
 *             collectionName: species
 *             date: 2020-10-29T15:00:00.000Z
 *             id: 5f9f9jv43jt6354zbqhf9f9f9f
 */
// =================================================
// Request Body
// =================================================
// requestBodies: SpecieBody
// =================================================

/**
 * @swagger
 *      components:
 *       requestBodies:
 *          SpecieBody:
 *           description: Create a new specie
 *           required: true
 *           content:
 *              application/json:
 *               schema:
 *                  type: object
 *                  $ref: '#/components/schema/CreateSpecieSchema'
 *               examples:
 *                  CreateSpecieExample:
 *                      $ref: '#/components/examples/CreateSpecieExample'
 */

// =================================================
// =================================================
// =================================================
// =================================================
// Retrieve a specie
// =================================================
// Schemas
// =================================================
// Schema : RetrievedSpecieSchema
// =================================================
/**
 * @swagger
 *     components:
 *          schema:
 *             RetrievedSpecieSchema:
 *              type: object
 *              properties:
 *                 message:
 *                  type: string
 *                 specy:
 *                  type: object
 *                  properties:
 *                     name:
 *                      type: string
 *                     description:
 *                      type: string
 *                      enum: 
 *                           - commestible
 *                           - non-commestible
 *                     pictureId:
 *                      type: string
 *                     id:
 *                      type: string
 *                     picture:
 *                      type: object
 *                      properties:
 *                        value:
 *                         type: string
 *                        resource_id:
 *                         type: string
 *                        collectionName:
 *                         type: string
 *                        date:
 *                         type: string
 *                        id:
 *                         type: string
 */

// =================================================
// Examples
// =================================================
// Example : RetrievedSpecieExample
// =================================================
/**
 * @swagger
 *    components:
 *      examples:
 *          RetrievedSpecieExample:
 *           value:
 *              message: Specie retrieved
 *              specy:
 *                  name: Bolet
 *                  description: Bolet qui apparaît dans la foret
 *                  usage: commestible
 *                  pictureId: 5f9fcvdfvfbbbnsf9f9vsvvfs9f9f9f9f9f
 *                  id: 5f9f9f9f9f9f9f9f9f9f9f9f
 *                  picture:
 *                      value: data:image/undefinedbase64,...
 *                      resource_id: 5f9f9fvavrnztjsaabstwgb356736gv3ff9f9f9f9f9f9f
 *                      collectionName: species
 *                      date: 2020-10-29T15:00:00.000Z
 *                      id: 5f9f9jv43jt6354zbqhf9f9f9f
 */

// =================================================
// =================================================
// =================================================
// =================================================

// Update a specie
// =================================================
// Schemas
// =================================================
// Schema : UpdateSpecieSchema
// =================================================
/**
 * @swagger
 *      components:
 *       schema:
 *          UpdateSpecieSchema:
 *           type: object
 *           properties:
 *              name:
 *               type: string
 *              description:
 *               type: string
 *              usage:
 *               type: string
 *               enum: 
 *                    - commestible
 *                    - non-commestible
 *              picture:
 *               type: string 
 */

// =================================================
// Schema : UpdatedSpecieSchema
// =================================================

/**
 * @swagger
 *     components:
 *          schema:
 *             UpdatedSpecieSchema:
 *              type: object
 *              properties:
 *                 message:
 *                  type: string
 *                 specy:
 *                  type: object
 *                  properties:
 *                     name:
 *                      type: string
 *                     description:
 *                      type: string
 *                      enum: 
 *                           - commestible
 *                           - non-commestible
 *                     pictureId:
 *                      type: string
 *                     id:
 *                      type: string
 *                     picture:
 *                      type: object
 *                      properties:
 *                        value:
 *                         type: string
 *                        resource_id:
 *                         type: string
 *                        collectionName:
 *                         type: string
 *                        date:
 *                         type: string
 *                        id:
 *                         type: string
 */

// =================================================
// Examples
// =================================================
// Example : UpdateSpecieExample
// =================================================
/**
 * @swagger
 *     components:
 *      examples:
 *          UpdateSpecieExample:
 *             value:
 *               name: Bolet
 *               description: Bolet qui apparaît dans la foret
 *               usage: commestible
 *               picture: 5f9f9f9f9f9f9f9f9f9f9f9f
 */

// =================================================
// Example : UpdatedSpecieExample
// =================================================
/**
 * @swagger
 *    components:
 *      examples:
 *          UpdatedSpecieExample:
 *           value:
 *              message: Specie updated
 *              specy:
 *                  name: Bolet
 *                  description: Bolet qui apparaît dans la foret
 *                  usage: commestible
 *                  pictureId: 5f9fcvdfvfbbbnsf9f9vsvvfs9f9f9f9f9f
 *                  id: 5f9f9f9f9f9f9f9f9f9f9f9f
 *                  picture:
 *                      value: data:image/undefinedbase64,...
 *                      resource_id: 5f9f9fvavrnztjsaabstwgb356736gv3ff9f9f9f9f9f9f
 *                      collectionName: species
 *                      date: 2020-10-29T15:00:00.000Z
 *                      id: 5f9f9jv43jt6354zbqhf9f9f9f
 */


// =================================================
// Request Body
// =================================================
// requestBodies: UpdateSpecieBody
// =================================================

/**
 * @swagger
 *      components:
 *       requestBodies:
 *          UpdateSpecieBody:
 *           description: Update a specie
 *           content:
 *              application/json:
 *               schema:
 *                  type: object
 *                  $ref: '#/components/schema/UpdateSpecieSchema'
 *               examples:
 *                  UpdateSpecieExample:
 *                      $ref: '#/components/examples/UpdateSpecieExample'
 */

// =================================================
// =================================================
// =================================================
// =================================================
// Delete a specie
// =================================================
// Schemas
// =================================================
// Schema : DeletedSpecieSchema
// =================================================
/**
 * @swagger
 *    components:
 *     schema:
 *       DeletedSpecieSchema:
 *          type: object
 *          properties:
 *              message:
 *                  type: string
 */

// =================================================
// Examples
// =================================================
// Example : DeletedSpecieExample
// =================================================
/**
 * @swagger
 *   components:
 *      examples:
 *          DeletedSpecieExample:
 *              value:
 *                  message: Specie deleted
 */
// =================================================
// =================================================
// =================================================
// =================================================
// Get all species
// =================================================
// Schemas
// =================================================
// Schema : RetrievedAllSpecieSchema
// =================================================
/**
* @swagger
*   components:
*     schema:
*       RetrievedAllSpecieSchema:
*         type: object
*         properties:
*           message:
*             type: string
*           species:
*             type: array
*             items:
*                type: object
*                properties:
*                    name:
*                      type: string
*                    description:
*                      type: string
*                    enum: 
*                      - commestible
*                      - non-commestible
*                    pictureId:
*                      type: string
*                    id:
*                      type: string
*                    picture:
*                      type: object
*                      properties:
*                        value:
*                         type: string
*                        resource_id:
*                         type: string
*                        collectionName:
*                         type: string
*                        date:
*                         type: string
*                        id:
*                         type: string
*/

// =================================================
// Examples
// =================================================
// Example : RetrievedAllSpecieExample
// =================================================

/**
 * @swagger
 *    components:
 *      examples:
 *          RetrievedAllSpecieExample:
 *           value:
 *              message: Specie retrieved
 *              species:
 *                - name: Bolet
 *                  description: Bolet qui apparaît dans la foret
 *                  usage: commestible
 *                  pictureId: 5f9fcvdfvfbbbnsf9f9vsvvfs9f9f9f9f9f
 *                  id: 5f9f9f9f9f9f9f9f9f9f9f9f
 *                  picture:
 *                      value: data:image/undefinedbase64,...
 *                      resource_id: 5f9f9fvavrnztjsaabstwgb356736gv3ff9f9f9f9f9f9f
 *                      collectionName: species
 *                      date: 2020-10-29T15:00:00.000Z
 *                      id: 5f9f9jv43jt6354zbqhf9f9f9f
 */