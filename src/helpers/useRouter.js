import msg from '../data/messages.js';
import useAuth from './useAuth.js';

const useRouter = {
  checkForRequiredParams: (req, res, paramNames) => {
    paramNames.forEach((name) => {
      if (typeof req.body?.[name] === 'undefined') useAuth.send(res, msg.ERROR_PARAM_REQUIRED(name));
    });
  },
  isValidMongooseId: (id) => id.match(/^[0-9a-fA-F]{24}$/),
};
export default useRouter;
