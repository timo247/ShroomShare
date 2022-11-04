import User from '../schemas/user.js';
import Paginator from './Paginator.js';
import useAuth from './useAuth';
import useRouter from './useRouter';
import config from '../../config';

class UsersRoute {
  constructor(schema, req, res) {
    this.req = req;
    this.res = res;
    this.schema = schema;
  }

  async retrieveAllUsers() {
    let users = await User.find().sort('username');
    const pages = this.#getPaginator(users.length);
    users = users.slice(pages.firstIndex, pages.lastIndex);
    const body = {
      users,
      currentPage: pages.currentPage,
      pageSize: pages.pageSize,
      lastPage: pages.lastPage,
    };
    this.#setBody(body);
    return useAuth.send(this.res, msg.SUCCESS_RESSOURCE_RETRIEVAL(R.USERS), this.req.body);
  }

  async retrieveUser() {
    const id = this.req.params.id;
    this.#validateUserId(id);
    const user = this.#findOneRessourceById(id);
    this.req.body = useAuth.setBody({ user });
    this.#setBody({ user });
    useAuth.send(res, msg.SUCCESS_RESSOURCE_RETRIEVAL(R.USER), req.body);
  }

  async createRessource() {
    useRouter.checkForRequiredParams(this.req, this.res, ['password', 'username', 'email']);
    this.req.body.password = await bcrypt.hash(this.req.body.password, config.bcryptCostFactor);
    const payload = useAuth.getPayloadFromToken(this.req);
    this.req.body.admin = payload?.scope === 'admin';
    const alreadyExistingUser = await User.findOne({ username: this.req.body.username });
    if (alreadyExistingUser) return useAuth.send(this.res, msg.ERROR_USER_UNICITY('username'));
    const user = new User(this.req.body);
    const savedUser = await user.save();
    const tokenWrapper = useAuth.generateJwtToken(this.req.currentUserId, this.req.currentUserRole);
    if (tokenWrapper.token) {
      this.#setBody({ user: savedUser, token: tokenWrapper.token });
      return useAuth.send(this.res, msg.SUCCESS_RESSOURCE_CREATION(R.USER), this.req.body);
    }
    this.req.body = useAuth.setBody({ user: savedUser, warnings: [msg.ERROR_TOKEN_CREATION] });
    useAuth.send(this.res, msg.SUCCESS_RESSOURCE_CREATION(R.USER), this.req.body);
  }

  async #findOneRessourceById(id) {
    const user = await this.schema.findOne({ _id: id });
    return user;
  }

  #validateUserId(id) {
    if (!useRouter.isValidMongooseId(id)) {
      return useAuth.send(this.res, msg.ERROR_RESSOURCE_EXISTANCE(R.USER));
    }
  }

  #setBody(bodyObject) {
    this.req.body = useAuth.setBody(bodyObject);
  }

  #getPaginator(numberOfItems) {
    const pages = new Paginator({
      numberOfItems,
      pageSize: this.req.query?.pageSize,
      currentPage: this.req.query?.currentPage,
    });
    return pages;
  }
}

export default UsersRoute;
