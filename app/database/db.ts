import { createPool } from "mysql";

import { dbConfig } from "../config/db.config";

export const db = createPool({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB
});
