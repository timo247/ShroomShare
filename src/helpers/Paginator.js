export default class Paginator {
  static #defaultPageSize = 5;

  #pageSize;

  #lastPage;

  #currentPage;

  #firstIndex;

  #lastIndex;

  constructor({ numberOfItems, pageSize, currentPage } = {}) {
    console.log(numberOfItems, pageSize, currentPage);
    Paginator.#isValidParam(numberOfItems, 'numberOfItems');
    Paginator.#isValidParam(pageSize, 'pageSize');
    Paginator.#isValidParam(currentPage, 'currentPage');

    this.#pageSize = Number(pageSize) || Paginator.#defaultPageSize;
    this.#lastPage = Math.trunc(numberOfItems || 0 / this.#pageSize);
    this.#currentPage = (() => {
      let value = Number(currentPage) || 1;
      if (value < 1) value = 1;
      if (value > this.#lastPage) value = this.#lastPage;
      return value;
    })();
    this.#firstIndex = (this.#currentPage - 1) * this.#pageSize;
    this.#lastIndex = this.#firstIndex + this.#pageSize;
  }

  static #isIntOrUndefined(n) {
    if (typeof n === 'undefined') return true;
    const value = Number(n);
    if (Number.isNaN(value)) return false;
    if (value % 1 === 0) return true;
    return false;
  }

  static #isValidParam(param, name) {
    if (!Paginator.#isIntOrUndefined(param)) {
      throw new Error(`${name} is required and should be an integer`);
    }
  }

  getPageSize() {
    return this.#pageSize;
  }

  getLastPage() {
    return this.#lastPage;
  }

  getCurrentPage() {
    return this.#currentPage;
  }

  getFirstIndex() {
    return this.#firstIndex;
  }

  getLastIndex() {
    return this.#lastIndex;
  }
}