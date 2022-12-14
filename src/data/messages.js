export const RESSOURCES = {
  USER: 'user',
  USERS: 'users',
  SPECY: 'specy',
  SPECIES: 'species',
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
    if (!Object.values(RESSOURCES).includes(string)) {
      throw new Error(`${string} is not a valid input`);
    }
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
  SUCCESS_RESSOURCE_COUNTING: (name) => new Message(name, 'successfully counted.', 200).getMessageWrapper(),
  ERROR_RESSOURCE_EXISTANCE: (name) => new Message(name, 'not found.', 404).getMessageWrapper(),
  ERROR_RESSOURCE_UNICITY: (name) => new Message(name, 'is already taken.', 401, false).getMessageWrapper(),
  ERROR_RESSOURCE_DUPLICATE: (name) => new Message(name, 'already exist.', 409).getMessageWrapper(),
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
  //  Schema validation
  // ==========================================================================
  ERROR_SCHEMA_EMAIL: (props) => `The value '${props.value}' is not a valid email.`,
  ERROR_SCHEMA_USAGE: (props, values) => `Usage should be one of the folowings values '${values}'.`,
  //  Chat
  // ==========================================================================
  CHAT_USER_DISCONNECTION: 'User disconnected.',
  CHAT_USER_CONNECTION: 'User connected.',
  CHAT_MESSAGE_RECEPTION: 'Message received. ',
  //  Pictures
  // ==========================================================================
  ERROR_IMG_BASE64: { status: 401, msg: 'Picture is not base64.' },
  ERROR_PICTURE_ID: (pictureId) => { return { status: 401, msg: `the picture_id '${pictureId}' is not a valid id.` }; },
  ERROR_PICTURE_EXISTENCE: (pictureId) => { return { status: 401, msg: `the picture_id '${pictureId}' doesn't exist.` }; },
  //  Geolocalisation
  // ==========================================================================
  ERROR_LONGITUDE_VALIDATION: { status: 401, msg: 'Not a valid longitude.' },
  ERROR_LATITUDE_VALIDATION: { status: 401, msg: 'Not a valid latitude.' },
  ERROR_GEOJSON_FORMAT: { status: 401, msg: 'Latitude and/or longitude are/is not valid.' },
  ERROR_RADIUS_NAN: { status: 401, msg: 'The radius should be a number.' },
  //  Others
  // ==========================================================================
  ERROR_OWNERRIGHT_GRANTATION: { status: 404, msg: 'You can only alter your own ressources.' },
  INTERNALERROR: { status: 500, msg: 'Internal server error.' },
  ERROR_FIELD_REQUIRED: (name, status = 401) => ({ status, msg: `The body field '${name}' is required.` }),
  ERROR_PARAM_REQUIRED: (name, status = 401) => ({ status, msg: `The query param '${name}' is required.` }),
  ERROR_DATE_FORMAT: { status: 401, msg: 'Date format is unvalid.' },
  ERROR_USAGE_FORMAT: { status: 401, msg: `Usage value should eighter be 'edible' or 'inedible'.` },//eslint-disable-line
  ERROR_DATE_VALIDATION: { status: 401, msg: 'Date cannot be in futur.' },
  ERROR_DURATION_VALIDATION: { status: 401, msg: 'Duration is too big' },
  ERROR_ROUTE_EXISTENCE: { status: 404, msg: 'This route doesn\'t exist.' },
  ERROR_METHOD_EXISTENCE: { status: 404, msg: 'This method is not available for this route.' },
  ERROR_EMPTY_ARRAY: (arrayName) => { return { status: 401, msg: `The array '${arrayName}' can't be empty.` }; },
};

export default messages;
