export class ApplicationError extends Error {
  constructor(message) {
    super(message);
  }
}

export class DuplicateMemberError extends ApplicationError {
  /**
   * 
   * @param {'set'|'zset'} type 
   */
  constructor(type) {
    super(`The value already exists in ${type}`);
  }
}

export class DuplicateKeyError extends ApplicationError {
  constructor(key) {
    super(`The key '${key}' already exists`);
  }
}

export class DuplicateFieldError extends ApplicationError {
  constructor() {
    super('The field already exists in hash');
  }
}