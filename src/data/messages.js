export const RESSOURCES = {
  USER: 'user',
  USERS: 'users',
  SPECY: 'user',
  SPECIES: 'users',
  MUSHROOM: 'mushroom',
  MUSHROOMS: 'mushrooms',
  PICTURE: 'picture',
  PICTURES: 'pictures',
  RESSOURCE: 'ressource',
  RESSOURCES: 'ressources',
};
class Message {
  constructor(ressourceName, msg, status = 401, onlyVerifiedStrings = true) {
    if (onlyVerifiedStrings) Message.isValidRessource(ressourceName);
    this.status = status;
    this.msg = `${Message.firstLetterUpperCase(ressourceName)} ${msg}`;
  }

  static isValidRessource(string) {
    if (!Object.values(RESSOURCES).includes(string)) throw new Error(`${string} is not a valid input`);
  }

  static firstLetterUpperCase(string) {
    return string[0].toUpperCase() + string.substring(1);
  }

  getMessageWrapper() {
    return { status: this.status, msg: this.msg };
  }
}

const messages = {
  //  Ressources manipulation
  // ==========================================================================
  SUCCESS_RESSOURCE_RETRIEVAL: (name) => new Message(name, 'successfully retrieved.', 200).getMessageWrapper(),
  SUCCESS_RESSOURCE_CREATION: (name) => new Message(name, 'successfully created.', 201).getMessageWrapper(),
  SUCCESS_RESSOURCE_MODIFICATION: (name) => new Message(name, 'successfully modified.', 200).getMessageWrapper(),
  SUCCESS_RESSOURCE_DELETION: (name) => new Message(name, 'successfully deleted.', 200).getMessageWrapper(),
  ERROR_RESSOURCE_EXISTANCE: (name) => new Message(name, 'not found.', 404).getMessageWrapper(),
  //  Route auth
  // ==========================================================================
  ERROR_AUTH_LOGIN: { status: 401, msg: 'Username and/or password are/is invalid.' },
  ERROR_AUTH_PERMISSION_GRANTATION: { status: 401, msg: 'Permission not granted.' },
  ERROR_AUTH_HEADER_PRESENCE: { status: 401, msg: 'Authorization header is missing.' },
  ERROR_AUTH_BEARERTOKEN_FORMAT: { status: 401, msg: 'Authorization header is not a bearer token.' },
  //  Route users
  // ==========================================================================
  ERROR_USER_UNICITY: (name) => new Message(name, 'is already taken', 401, false).getMessageWrapper(),
  //  JWT tokens
  // ==========================================================================
  ERROR_TOKEN_VALIDATION: { status: 401, msg: 'Your token is invalid or has expired.' },
  ERROR_TOKEN_CREATION: { status: 401, msg: 'Token creation failed.' },
  INTERNALERROR_TOKEN_CREATION: { status: 500, msg: 'Unable to create token' },
  INTERNALERROR_TOKEN_VALIDATION: { status: 500, msg: 'Unable to verify token' },
  SUCCESS_TOKEN_CREATION: { status: 201, msg: 'Token succesfully created.' },
  //  Schema validation
  // ==========================================================================
  ERROR_SCHEMA_EMAIL: (props) => `The value '${props.value}' is not a valid email.`,
  //  Others
  // ==========================================================================
  ERROR_OWNERRIGHT_GRANTATION: { status: 404, msg: 'You can only alter your own ressources.' },
  INTERNALERROR: { status: 500, msg: 'Internal server error.' },
  ERROR_FIELD_REQUIRED: (name, status = 401) => ({ status, msg: `The body field '${name}' is required.` }),
  ERROR_PARAM_REQUIRED: (name, status = 401) => ({ status, msg: `The query param '${name}' is required.` }),
};

export default messages;
