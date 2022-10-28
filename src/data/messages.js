/* eslint-disable */
const firstLetterUpperCase = (string) => string[0].toUpperCase() + string.substring(1);
export const RESSOURCES = {
  USER: 'user',
  USERS: 'users',
  SPECY: 'user',
  SPECIES: 'users',
  MUSHROOM: 'mushroom',
  MUSHROOMS: 'mushrooms',
  PICTURE: 'picture',
  PICTURES: 'pictures',
}

const messages = {
  // ==========================================================================
  //   API
  // ==========================================================================

  //  Route users
  // ==========================================================================
  SUCCESS_RESSOURCE_RETRIEVAL: (name) => {
    return { status: 200, msg: `${firstLetterUpperCase(name)} successfully retrieved.` }
  },
  SUCCESS_RESSOURCE_CREATION: (name) => {
    return { status: 201, msg: `${firstLetterUpperCase(name)} successfully created.` }
  },
  SUCCESS_RESSOURCE_MODIFICATION: (name) => {
    return { status: 200, msg: `${firstLetterUpperCase(name)} successfully modified.` }
  },
  SUCCESS_RESSOURCE_DELETION: (name) => {
    return { status: 200, msg: `${firstLetterUpperCase(name)} successfully deleted.` }
  },
  ERROR_RESSOURCE_EXISTANCE: (name) => {
    return { status: 404, msg: `${firstLetterUpperCase(name)} not found.` }
  },
  //  Route auth
  // ==========================================================================
  ERROR_AUTH_LOGIN: { status: 401, msg: 'Username and/or password are/is invalid.' },
  ERROR_AUTH_PERMISSION_GRANTATION: { status: 401, msg: 'Permission not granted.' },
  ERROR_AUTH_HEADER_PRESENCE: { status: 401, msg: 'Authorization header is missing.' },
  ERROR_AUTH_BEARERTOKEN_FORMAT: { status: 401, msg: 'Authorization header is not a bearer token.' },
  ERROR_FIELD_REQUIRED: (name, status = 401) => { return { status: status, msg: `${firstLetterUpperCase(name)} is required.` } },
  //  JWT tokens
  // ==========================================================================
  ERROR_TOKEN_VALIDATION: { status: 401, msg: 'Your token is invalid or has expired.' },
  ERROR_TOKEN_CREATION: { status: 401, msg: 'Token creation failed.' },
  INTERNALERROR_TOKEN_CREATION: { status: 500, msg: 'Unable to create token' },
  INTERNALERROR_TOKEN_VALIDATION: { status: 500, msg: 'Unable to verify token' },
  SUCCESS_TOKEN_CREATION: { status: 201, msg: 'Token succesfully created.' },
  //  Others
  // ==========================================================================
  ERROR_OWNERRIGHT_GRANTATION: { status: 404, msg: 'You can only alter your own ressources.' },
  INTERNALERROR: { status: 500, msg: 'Internal server error.' },
};

export default messages;
