import {UserModel} from "../Models/User.model";
import {NotFoundException} from "../Exceptions/Models/NotFoundException";
import {ForgotPassword} from "../Models/ForgotPassword";

const bcrypt = require('bcryptjs');
const md5 = require('md5');

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

    /**
     *
     * @param email
     */
    forgotPassword (email: string) {

        return new Promise( (resolve, reject) => {

            // Get user
            UserModel.findBy('email', email).then( (user) => {

                // Check if not exist a previous code
                ForgotPassword.findBy('email', email).then( (forgotPassword) => {

                    // TODO: Send email with code for reset password

                    // Send response
                    return resolve({
                        message: 'El link para resetear la contraseña fue enviado a tu email',
                    });

                }).catch( (e) => {

                    // Si no existe un código generado
                    if(e instanceof NotFoundException) {

                        ForgotPassword.create({
                            email,
                            code: md5(email),
                        }).then( (forgotPassword) => {

                            // TODO: Send email with code for reset password

                            // Send response
                            return resolve({
                                message: 'El link para resetear la contraseña fue enviado a tu email',
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

            }).catch( (e) => {

                // Si el usuario no existe
                if(e instanceof NotFoundException) {
                    return reject({
                        code: 404,
                        message: 'Usuario no existe',
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
