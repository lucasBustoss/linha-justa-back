import { createConnection } from 'typeorm';

class Database {
  mongoConnection;

  constructor() {
    this.init();
  }

  init() {
    createConnection();
  }
}

export default new Database();
