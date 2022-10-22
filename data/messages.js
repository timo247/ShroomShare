const messages = {
  // ==========================================================================
  //   API
  // ==========================================================================

  //  Route users
  // ==========================================================================
  SUCCESS_USER_RETRIEVAL: { status: 200, msg: 'User successfully retrieved.' },
  SUCCESS_USERS_RETRIEVAL: { status: 200, msg: 'Users successfully retrieved.' },
  SUCCESS_USER_CREATION: { status: 201, msg: 'Users successfully created.' },
  SUCCESS_USER_MODIFICATION: { status: 200, msg: 'User successfully modified.' },
  SUCCESS_USER_DELETION: { status: 200, msg: 'User successfully deleted.' },
  SUCCESS_USERS_DELETION: { status: 200, msg: 'Users successfully deleted.' },
  ERROR_USER_EXISTANCE: { status: 404, msg: 'User not found.' },
  //  Route auth
  // ==========================================================================
  ERROR_AUTH_LOGIN: { status: 401, msg: 'Username and/or password are/is invalid.' },
  ERROR_AUTH_PERMISSION_GRANTATION: { status: 401, msg: 'Permission not granted.' },
  ERROR_AUTH_HEADER_PRESENCE: { status: 401, msg: 'Authorization header is missing.' },
  ERROR_AUTH_BEARERTOKEN_FORMAT: { status: 401, msg: 'Authorization header is not a bearer token.' },
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
