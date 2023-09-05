import {UserModel} from "../Models/User.model";
import {NotFoundException} from "../Exceptions/Models/NotFoundException";

const bcrypt = require('bcryptjs');

export class UserService {

    /**
     *
     * @param email
     * @param password
     */
    register (email: string, password: string) {

        return new Promise( (resolve, reject) => {

            // Get user
            UserModel.findBy('email', email).then( (user) => {

                return reject({
                    code: 409,
                    message: 'Usuario existe',
                });

            }).catch( (e) => {

                // Si el usuario no existe
                if(e instanceof NotFoundException) {
                    UserModel.create({
                        email,
                        password: bcrypt.hashSync(password, 8),
                    }).then( (user) => {

                        return resolve({
                            message: 'Usuario creado con éxito',
                        });

                    }).catch( (err) => {

                        return reject({
                            code: e.getCode(),
                            message: err.message,
                        });

                    });

                } else {
                    return reject({
                        code: e.getCode(),
                        message: 'Error al consultar el usuario',
                    });
                }
            });

        });
    }
}
