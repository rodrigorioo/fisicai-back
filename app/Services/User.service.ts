import {UserModel} from "../Models/User.model";
import {NotFoundException} from "../Exceptions/Models/NotFoundException";
import {ForgotPassword, ForgotPasswordInterface} from "../Models/ForgotPassword";
import formData from 'form-data';
import Mailgun from 'mailgun.js';

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

                    this.sendForgotPasswordCode(email, (forgotPassword as ForgotPasswordInterface).code);

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
                        }).then( (createResponse) => {

                            ForgotPassword.findBy('id', createResponse.insertId).then( (forgotPassword) => {
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
            ForgotPassword.findBy('code', code).then( (forgotPassword) => {

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

    changePasswordForgotten(code: string, password: string) {
        return new Promise( (resolve, reject) => {

            // Get code
            ForgotPassword.findBy('code', code).then( (forgotPassword) => {

                // Update user
                UserModel.update({
                    email: (forgotPassword as ForgotPasswordInterface).email
                }, {
                    password: bcrypt.hashSync(password, 8),
                }).then( (resUpdateUser) => {

                    // Delete code
                    ForgotPassword.delete({
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
}
