/* eslint-disable */

// Retrieve all pictures
// ==========================================================================
// ==========================================================================
// Schemas
// ==========================================================================
// Schema: RetrievePictureSchema
// ==========================================================================
/**
 * @swagger
 *  components:
 *   schema:
 *    RetrievePictureSchema:
 *      type: object
 *      properties:
 *       id:
 *          type: array
 *          items:
 *           type: string
 */ 

// ==========================================================================
// Schema: RetrievedPictureSchema
// ==========================================================================
/**
 * @swagger
 * components:
 *  schema:
 *      RetrievedPictureSchema:
 *          type: object
 *          properties:
 *              message:
 *                  type: string
 *              picture:
 *                  type: array
 *                  items:
 *                      type: object
 *                      properties:
 *                          value:
 *                              type: string
 *                          ressources_id:
 *                              type: string
 *                          collectionName:
 *                              type: string
 *                          date:
 *                              type: string
 *                          id:
 *                              type: string
 */
// ==========================================================================
// Examples
// ==========================================================================
// Example: RetrievePictureExample
// ==========================================================================
/**
 * @swagger
 *  components:
 *      examples:
 *          RetrievePictureExample:
 *              value:
 *                  id: 
 *                     - 5f1f9b9b9b9b9b9b9b9b9b9b
 */

// ==========================================================================
// Example: RetrievedPictureExample
// ==========================================================================
/**
 * @swagger
 *  components:
 *      examples:
 *          RetrievedPictureExample:
 *              value:
 *                  message: Picture retrieved   
 *                  picture:
 *                    - value: cnwqigciccqi
 *                      ressources_id: 5f1f9b9b9b9b9b9b9b9b9b9b
 *                      collectionName: species
 *                      date: 2020-07-24T15:00:00.000Z
 *                      id: 5f1f9b9b9b9b9b9b9b9b9b9b
 */
 
// Request Body
// ==========================================================================
// RequestBodies : RetrievePicturesBody
// ==========================================================================

/**
 * @swagger
 *  components:
 *   requestBodies:
 *    RetrievePicturesBody:
 *      description: Retrieve pictures
 *      required: true
 *      content:
 *          application/json:
 *             schema:
 *              type: object
 *              $ref: '#components/schema/RetrievePictureSchema'
 *             examples:
 *              RetrievePicturesExample:
 *               $ref: '#/components/examples/RetrievePictureExample'
 */