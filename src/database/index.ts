import { createConnection } from 'typeorm';

class Database {
  constructor() {
    this.init();
  }

  init() {
    createConnection();
  }
}

export default new Database();
