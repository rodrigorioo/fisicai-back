import {UserInterface, UserModel} from "../Models/User.model";
import {NotFoundException} from "../Exceptions/Models/NotFoundException";
import {ForgotPasswordModel, ForgotPasswordInterface} from "../Models/ForgotPassword.model";
import formData from 'form-data';
import Mailgun from 'mailgun.js';
import {authConfig} from "../config/auth.config";

const bcrypt = require('bcryptjs');
const md5 = require('md5');
const jwt = require('jsonwebtoken');

export class UserService {

    /**
     *
     * @param email
     * @param password
     */
    login (email: string, password: string) {

        return new Promise( (resolve, reject) => {

            // Get user
            UserModel.findBy('email', email).then( (user ) => {

                // If the user was founded, verify password
                const passwordIsValid = bcrypt.compareSync(
                    password,
                    (user as UserInterface).password
                );

                if (!passwordIsValid) {
                    return reject({
                        code: 401,
                        message: "Contraseña inválida",
                    });
                }

                // Create access token
                const token = jwt.sign(
                    {
                        id: (user as UserInterface).id
                    },
                    authConfig.secret,
                    {
                        algorithm: 'HS256',
                        allowInsecureKeySizes: true,
                        expiresIn: 2628003, // 1 month
                    });

                return resolve({
                    id: (user as UserInterface).id,
                    email: (user as UserInterface).email,
                    accessToken: token,
                });

            }).catch( (err) => {
                return reject({
                    code: err.getCode(),
                    message: err.message,
                });
            });

        });
    }

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
                ForgotPasswordModel.findBy('email', email).then( (forgotPassword) => {

                    this.sendForgotPasswordCode(email, (forgotPassword as ForgotPasswordInterface).code);

                    // Send response
                    return resolve({
                        message: 'El link para resetear la contraseña fue enviado a tu email',
                    });

                }).catch( (e) => {

                    // Si no existe un código generado
                    if(e instanceof NotFoundException) {

                        ForgotPasswordModel.create({
                            email,
                            code: md5(email),
                        }).then( (createResponse) => {

                            ForgotPasswordModel.findBy('id', createResponse.insertId).then( (forgotPassword) => {
                                this.sendForgotPasswordCode(email, (forgotPassword as ForgotPasswordInterface).code);

                                // Send response
                                return resolve({
                                    message: 'El link para resetear la contraseña fue enviado a tu email',
                                });
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

    /**
     *
     * @param email
     * @param code
     */
    sendForgotPasswordCode(email: string, code: string) {

        return new Promise( (resolve, reject) => {

            // Create client
            const mailgun = new Mailgun(formData);
            const mg = mailgun.client({
                username: 'api',
                key: process.env.MAILGUN_API_KEY || '',
            });

            // Send email
            mg.messages.create(process.env.MAILGUN_DOMAIN || '', {
                from: `${process.env.MAILGUN_FROM_NAME} <${process.env.MAILGUN_FROM_EMAIL}>`,
                to: [email],
                subject: "Resetear contraseña",
                html: `<p>A continuación, utilice el siguiente link para resetear su contraseña: <a href="${process.env.FRONTEND_URL}/forgot-password/${code}">Resetear contraseña</a></p>`
            })
                .then(msg => resolve(msg))
                .catch(err => reject(err));
        });


    }

    /**
     *
     * @param code
     */
    checkForgotPasswordCode(code: string) {
        return new Promise( (resolve, reject) => {

            // Get code
            ForgotPasswordModel.findBy('code', code).then( (forgotPassword) => {

                return resolve({
                    message: 'Código válido',
                });

            }).catch( (e) => {

                // Si el código no existe
                if(e instanceof NotFoundException) {
                    return reject({
                        code: 404,
                        message: 'Código inválido',
                    });
                } else {
                    return reject({
                        code: e.getCode(),
                        message: 'Error al consultar el código',
                    });
                }
            });

        });
    }

    /**
     *
     * @param code
     * @param password
     */
    changePasswordForgotten(code: string, password: string) {
        return new Promise( (resolve, reject) => {

            // Get code
            ForgotPasswordModel.findBy('code', code).then( (forgotPassword) => {

                // Update user
                UserModel.update({
                    email: (forgotPassword as ForgotPasswordInterface).email
                }, {
                    password: bcrypt.hashSync(password, 8),
                }).then( (resUpdateUser) => {

                    // Delete code
                    ForgotPasswordModel.delete({
                        code: code,
                    }).then( (resDeleteForgotPassword) => {

                        return resolve({
                            message: 'Contraseña cambiada con éxito',
                        });

                    }).catch( (e) => {
                        return reject({
                            code: e.getCode(),
                            message: 'Error al eliminar el código',
                        });
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
                            message: 'Error al actualizar el usuario',
                        });
                    }
                });

            }).catch( (e) => {

                // Si el código no existe
                if(e instanceof NotFoundException) {
                    return reject({
                        code: 404,
                        message: 'Código inválido',
                    });
                } else {
                    return reject({
                        code: e.getCode(),
                        message: 'Error al consultar el código',
                    });
                }
            });

        });
    }

    checkAuth (userId: number) {

        return new Promise( (resolve, reject) => {
            // Get user
            UserModel.findById(userId).then( (user) => {

                resolve({
                    email: (user as UserInterface).email,
                });

            }).catch( (err) => {

                reject({
                    code: err.getCode(),
                    message: err.message
                });

            });
        });
    }
}
