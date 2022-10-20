const messages = {
  // ==========================================================================
  //   API
  // ==========================================================================

  //  Route users
  // ==========================================================================
  SUCCES_USER_RETRIEVAL: 'User succesfully retrieved.',
  SUCCES_USERS_RETRIEVAL: 'Users succesfully retrieved.',
  SUCCES_USER_CREATION: 'Users succesfully created.',
  SUCCES_USER_MODIFICATION: 'User succesfully modified.',
  SUCCES_USER_DELETION: 'User succesfully deleted.',
  SUCCES_USERS_DELETION: 'Users succesfully deleted.',
  ERROR_USER_EXISTANCE: 'User not found.',
  //  Route auth
  // ==========================================================================
  ERROR_AUTH_LOGIN: 'Username and/or password are/is invalid.',
  ERROR_AUTH_PERMISSION_GRANTATION: 'Permission not granted.',
  ERROR_AUTH_HEADER_PRESENCE: 'Authorization header is missing.',
  ERROR_AUTH_BEARERTOKEN_FORMAT: 'Authorization header is not a bearer token.',
  ERROR_TOKEN_VALIDATION: 'Your token is invalid or has expired.',
  ERROR_TOKEN_CREATION: 'Token creation failed.',
  SUCCES_TOKEN_CREATION: 'Token succesfully created.',
  //  Others
  // ==========================================================================
};

export default messages;
