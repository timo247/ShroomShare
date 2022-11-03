import msg from '../data/messages.js';
import useAuth from './useAuth.js';

const useRouter = {
  checkForRequiredParams: (req, res, paramNames) => {
    const missingParametersMessages = [];
    const statusCode = msg.ERROR_FIELD_REQUIRED().status;
    paramNames.forEach((name) => {
      if (typeof req.body?.[name] === 'undefined') {
        missingParametersMessages.push(msg.ERROR_FIELD_REQUIRED(name).msg);
      }
    });
    if (missingParametersMessages.length > 0) {
      const message = { status: statusCode, msg: missingParametersMessages };
      useAuth.send(res, message);
    }
  },
  isValidMongooseId: (id) => id.match(/^[0-9a-fA-F]{24}$/),
};
export default useRouter;
