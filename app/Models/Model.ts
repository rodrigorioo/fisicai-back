import { db } from "../database/db";
import {OkPacket, Pool} from "mysql";
import {ModelException} from "../Exceptions/Models/ModelException";
import {NotFoundException} from "../Exceptions/Models/NotFoundException";

export class Model {

    protected static db: Pool = db;
    protected static table: string = "";

    constructor() {}

    /**
     * Field row by column name and value
     * @param column
     * @param value
     */
    static findBy (column: string, value: string|number) {

        return new Promise<object>( (success, failure) => {

            let queryValue = `${value}`;

            if (typeof value === "string") {
                queryValue = `"${value}"`;
            }

            const query = `SELECT * FROM ${this.table} WHERE ${column} = ${queryValue}`;

            this.db.query(query, (err, res) => {

                if (err) {
                    return failure(new ModelException(err.message));
                }

                if (res.length) {
                    return success(res[0]);
                }

                failure(new NotFoundException());
            });
        });
    }

    /**
     * Create new row sending columns object with column names and values
     * @param columns
     */
    static create (columns: object): Promise<OkPacket> {

        return new Promise( (success, failure) => {

            // Get columns names and values
            const columnNames = Object.keys(columns);
            const columnValues = Object.values(columns);

            // Build values string
            let values: string = "";
            columnValues.forEach( (value) => {

                if(values !== "") {
                    values += ", ";
                }

                if(typeof value === "string") {
                    values += `'${value}'`;
                } else {
                    values += `${value}`;
                }
            });

            const query = `INSERT INTO ${this.table}(${columnNames.join(", ")}) VALUES (${values})`;

            this.db.query(query, (err, res) => {

                if (err) {
                    return failure(new ModelException(err.message));
                }

                success(res);
            });
        });
    }
}
