/* eslint-disable */

// Create a new mushroom
// ===============================================================
// Schemas
// ===============================================================
// Schema : CreateMushroomSchema
// ===============================================================
/**
 * @swagger
 *      components:
 *       schema:
 *          CreateMushroomSchema:
 *           type: object
 *           properties:
 *              species_id:
 *                  type: number
 *              picture:
 *                  type: string
 *              description:
 *                  type: string
 *              date:
 *                  type: string
 *              geolocalisation:
 *                  type: object
 *                  properties:
 *                     location:
 *                        type: string
 *                        enum: [Point]
 *                     coordinates:
 *                        type: array
 *                        minItems: 2
 *                        maxItems: 2
 *                        items:
 *                           type: number 
 * 
 */

// ===============================================================
// Schema : CreatedMushroomSchema
// ===============================================================

/**
 * @swagger
 *     components:
 *      schema:
 *          CreatedMushroomSchema:
 *              type: object
 *              properties:
 *                 message:
 *                  type: string
 *                 mushroom:
 *                  type: object
 *                  properties:
 *                     id:
 *                       type: string
 *                     species_id:
 *                      type: number
 *                     user_id:
 *                      type: number
 *                     description:
 *                      type: string
 *                     date:
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
 *                         format: date-time
 *                        id:
 *                         type: string
 *                     geolocalisation:
 *                      type: object
 *                      properties:
 *                        location:
 *                            type: string
 *                            enum: [Point]
 *                        coordinates:
 *                            type: array
 *                            minItems: 2
 *                            maxItems: 2
 *                            items:
 *                               type: number
 *                       
 */

// ===============================================================
// Examples
// ===============================================================
// Example : CreatedMushroomExample
// ===============================================================
/**
 * @swagger
 *    components:
 *     examples:
 *      CreatedMushroomExample:
 *       value:
 *          message: "Mushroom successfully created"
 *          mushroom:
 *             id: "5f9f9f9f9f9f9f9f9f9f9f9f"
 *             species_id: 1
 *             user_id: 1
 *             description: "This is a mushroom"
 *             date: "2020-01-01"
 *             picture:
 *              value: "data:image/undefinedbase64,..."
 *              resource_id: "5e1f9b9b9b9b9b9b9b9b9b9b"
 *              collectionName: "mushrooms"
 *              date: "2020-01-01T00:00:00.000Z"
 *              id: "5e1f9b9b9b9b9b9b9b9b9b9b"
 *             geolocalisation:
 *              location: Point
 *              coordinates: [1, 1]
 */
 
// ===============================================================
// Example : CreateMushroomExample
// ===============================================================
/**
 * @swagger
 *     components:
 *      examples:
 *          CreateMushroomExample:
 *             value:
 *                 species_id: 1
 *                 picture: bcqipséncbqwvvbqwbljhfqii238rufz8uq3b4
 *                 description: This is a description
 *                 date: 2020-10-27T15:00:00.000Z
 *                 geolocalisation:
 *                    location: Point
 *                    coordinates:
 *                     - 2.345
 *                     - 48.8566
 */
// ==========================================================
// Request body
// ==========================================================
// RequestBodies : CreateMushroomBody
// ==========================================================
/**
 * @swagger
 *      components:
 *       requestBodies:
 *          CreateMushroomBody:
 *           description : Valeur à compléter pour créer un champignon
 *           required: true
 *           content:
 *              application/json:
 *               schema:
 *                  type: object
 *                  $ref: '#/components/schema/CreateMushroomSchema'
 *               examples:
 *                  CreateMushroomExample:
 *                    $ref: '#/components/examples/CreateMushroomExample'
 * 
 *              
 */

// ==========================================================
// ==========================================================
// ==========================================================
// ==========================================================
// Delete a mushroom
// ===============================================================
// Schemas
// ===============================================================
// Schema : DeletedMushroomSchema
// ===============================================================
/**
 * @swagger
 *     components:
 *      schema:
 *         DeletedMushroomSchema:
 *          type: object
 *          properties:
 *            message:
 *             type: string
 */

// ===============================================================
// Examples
// ===============================================================
// Example : DeletedMushroomExample
// ===============================================================
/**
 * @swagger
 *   components:
 *      examples:
 *          DeletedMushroomExample:
 *              value:
 *                 message: "Mushroom successfully deleted"
 */

// ===============================================================
// ===============================================================
// ===============================================================
// ===============================================================

// Update a mushroom
// ===============================================================
// Schemas
// ===============================================================
// Schema : UpdateMushroomSchema
// ===============================================================

/**
 * @swagger
 *      components:
 *       schema:
 *          UpdateMushroomSchema:
 *           type: object
 *           properties:
 *              species_id:
 *                  type: number
 *              picture:
 *                  type: string
 *              description:
 *                  type: string
 *              date:
 *                  type: string
 *              geolocalisation:
 *                  type: object
 *                  properties:
 *                     location:
 *                            type: string
 *                            enum: [Point]
 *                     coordinates:
 *                            type: array
 *                            minItems: 2
 *                            maxItems: 2
 *                            items:
 *                               type: number 
 * 
 */

// ===============================================================
// Schema : UpdatedMushroomSchema
// ===============================================================

/**
 * @swagger
 *     components:
 *      schema:
 *          UpdatedMushroomSchema:
 *              type: object
 *              properties:
 *                 message:
 *                  type: string
 *                 mushroom:
 *                  type: object
 *                  properties:
 *                     id:
 *                      type: string
 *                     species_id:
 *                      type: number
 *                     user_id:
 *                      type: number
 *                     description:
 *                      type: string
 *                     date:
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
 *                         format: date-time
 *                        id:
 *                         type: string
 *                     geolocalisation:
 *                      type: object
 *                      properties:
 *                        location:
 *                            type: string
 *                            enum: [Point]
 *                        coordinates:
 *                            type: array
 *                            minItems: 2
 *                            maxItems: 2
 *                            items:
 *                               type: number 
 *                       
 */
// ===============================================================
// Examples
// ===============================================================
// Example : UpdateMushroomExample
// ===============================================================

/**
 * @swagger
 *     components:
 *      examples:
 *          UpdateMushroomExample:
 *             value:
 *                 species_id: 1
 *                 picture: bcqipséncbqwvvbqwbljhfqii238rufz8uq3b4
 *                 description: This is a description
 *                 date: 2020-10-27T15:00:00.000Z
 *                 geolocalisation:
 *                    location: Point
 *                    coordinates:
 *                     - 2.345
 *                     - 48.8566
 */

// ===============================================================
// Example : UpdatedMushroomExample
// ===============================================================

/**
 * @swagger
 *    components:
 *     examples:
 *      UpdatedMushroomExample:
 *       value:
 *          message: "Mushroom successfully updated"
 *          mushroom:
 *             id: "5f9f9f9f9f9f9f9f9f9f9f9f"
 *             species_id: 1
 *             user_id: 1
 *             description: "This is a mushroom"
 *             date: "2020-01-01"
 *             picture:
 *              value: "data:image/undefinedbase64,..."
 *              resource_id: "5e1f9b9b9b9b9b9b9b9b9b9b"
 *              collectionName: "mushrooms"
 *              date: "2020-01-01T00:00:00.000Z"
 *              id: "5e1f9b9b9b9b9b9b9b9b9b9b"
 *             geolocalisation:
 *              location: Point
 *              coordinates: [1, 1]
 */

// ===============================================================
// Request body
// ===============================================================
// RequestBodies : UpdateMushroomBody
// ===============================================================

/**
 * @swagger
 *      components:
 *       requestBodies:
 *          UpdateMushroomBody:
 *           description : Valeur à compléter pour créer un champignon
 *           content:
 *              application/json:
 *               schema:
 *                  type: object
 *                  $ref: '#/components/schema/UpdateMushroomSchema'
 *               examples:
 *                  CreateMushroomExample:
 *                    $ref: '#/components/examples/UpdateMushroomExample'
 * 
 *              
 */

// ===============================================================
// ===============================================================
// ===============================================================
// ===============================================================
// Get mushroom
// ===============================================================
// Schemas
// ===============================================================
// Schema : RetrievedMushroomSchema
// ===============================================================

/**
 * @swagger
 *     components:
 *      schema:
 *          RetrievedMushroomSchema:
 *              type: object
 *              properties:
 *                 message:
 *                  type: string
 *                 mushroom:
 *                  type: object
 *                  properties:
 *                     id:
 *                      type: string
 *                     species_id:
 *                      type: number
 *                     user_id:
 *                      type: number
 *                     description:
 *                      type: string
 *                     date:
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
 *                         format: date-time
 *                        id:
 *                         type: string
 *                     geolocalisation:
 *                      type: object
 *                      properties:
 *                        location:
 *                            type: string
 *                            enum: [Point]
 *                        coordinates:
 *                            type: array
 *                            minItems: 2
 *                            maxItems: 2
 *                            items:
 *                               type: number
 *                       
 */

// ===============================================================
// Examples
// ===============================================================
// Example : RetrievedMushroomExample
// ===============================================================

/**
 * @swagger
 *    components:
 *     examples:
 *      RetrievedMushroomExample:
 *       value:
 *          message: "Mushroom successfully updated"
 *          mushroom:
 *             id: "5f9f9f9f9f9f9f9f9f9f9f9f"
 *             species_id: 1
 *             user_id: 1
 *             description: "This is a mushroom"
 *             date: "2020-01-01"
 *             picture:
 *              value: "data:image/undefinedbase64,..."
 *              resource_id: "5e1f9b9b9b9b9b9b9b9b9b9b"
 *              collectionName: "mushrooms"
 *              date: "2020-01-01T00:00:00.000Z"
 *              id: "5e1f9b9b9b9b9b9b9b9b9b9b"
 *             geolocalisation:
 *              location: Point
 *              coordinates: [1, 1]
 */