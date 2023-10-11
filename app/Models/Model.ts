import { db } from "../database/db";
import {OkPacket, Pool} from "mysql";
import {ModelException} from "../Exceptions/Models/ModelException";
import {NotFoundException} from "../Exceptions/Models/NotFoundException";

export class Model {

    protected static db: Pool = db;
    protected static table: string = "";

    constructor() {}

    /**
     * Find row by id field
     * @param id
     */
    static findById (id: number) {

        return new Promise<object>( (success, failure) => {
            const query = `SELECT * FROM ${this.table} WHERE id = ${id}`;

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

    /**
     *
     * @param findColumns
     * @param updateColumns
     */
    static update(findColumns: object, updateColumns: object) {

        return new Promise( (success, failure) => {

            // Get columns names and values
            const columnUpdateNames = Object.keys(updateColumns);
            const columnUpdateValues = Object.values(updateColumns);
            const columnFindNames = Object.keys(findColumns);
            const columnFindValues = Object.values(findColumns);

            // Build update values string
            let updateValues: string = "";
            columnUpdateValues.forEach( (value, index) => {

                // Add space
                if(updateValues !== "") {
                    updateValues += ", ";
                }

                // Add column name
                updateValues += `${columnUpdateNames[index]} = `;

                // Add column value
                if(typeof value === "string") {
                    updateValues += `'${value}'`;
                } else {
                    updateValues += `${value}`;
                }
            });

            // Build find values string
            let findValues: string = "";
            columnFindValues.forEach( (value, index) => {

                // Add space
                if(findValues !== "") {
                    findValues += " AND ";
                }

                // Add column name
                findValues += `${columnFindNames[index]} = `;

                // Add column value
                if(typeof value === "string") {
                    findValues += `'${value}'`;
                } else {
                    findValues += `${value}`;
                }
            });

            const query = `UPDATE ${this.table} SET ${updateValues} WHERE ${findValues}`;

            this.db.query(query, (err, res) => {

                if (err) {
                    return failure(new ModelException(err.message));
                }

                success(res);
            });
        });
    }

    /**
     *
     * @param whereColumns
     */
    static delete(whereColumns: object) {

        return new Promise( (success, failure) => {

            // Get columns names and values
            const columnWhereNames = Object.keys(whereColumns);
            const columnWhereValues = Object.values(whereColumns);

            // Build where values string
            let whereValues: string = "";
            columnWhereValues.forEach( (value, index) => {

                // Add space
                if(whereValues !== "") {
                    whereValues += " AND ";
                }

                // Add column name
                whereValues += `${columnWhereNames[index]} = `;

                // Add column value
                if(typeof value === "string") {
                    whereValues += `'${value}'`;
                } else {
                    whereValues += `${value}`;
                }
            });

            const query = `DELETE FROM ${this.table} WHERE ${whereValues}`;

            this.db.query(query, (err, res) => {

                if (err) {
                    return failure(new ModelException(err.message));
                }

                success(res);
            });
        });
    }
}
