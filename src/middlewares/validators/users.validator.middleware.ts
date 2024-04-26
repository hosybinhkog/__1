import {checkSchema} from "express-validator";
import databaseService from "~/dbs/mongo.dbs";
import {BadRequestResponse} from "~/response";
import {UsersRepository} from "~/repositories";
import {verifyToken} from "~/utils";

export const registerValidator = checkSchema({
    name: {
        isLength: {
            options: {
                min: 6,
                max: 50
            }
        },
        notEmpty: true,
        trim: true,
        isString: true
    },
    email: {
        trim: true,
        notEmpty: true,
        isEmail: true,
        isString: true,
        custom: {
            options: async (value) => {
                const existEmail = await UsersRepository.findEmailExists(value )
                if(existEmail) throw new BadRequestResponse({ message: "Email is exist" })
                return true
            }
        }
    },
    password: {
        trim: true,
        isString: true,
        notEmpty: true,
        isLength: {
            options:{
                min: 6,
                max: 100
            }
        },
        isStrongPassword: {
            options: {
                minLength: 6
            }
        }
    },
    confirm_password: {
        isString: true,
        isLength: {
            options: {
                min: 6,
                max: 100
            }
        },
        notEmpty: true,
        trim: true,
        isStrongPassword: {
            options: {
                minLength: 6
            }
        }
    },
    date_of_birth: {
        isISO8601: {
            options: {
                strict: true,
                strictSeparator: true
            }
        },
        notEmpty: true,
    }
}, ["body"])

export const loginValidator = checkSchema({
    email: {
        notEmpty: true,
        trim: true,
        isEmail: true,
        isString: true,
        custom: {
            options: async( value ) => {
                const user = await UsersRepository.findEmailExists(value)
                if(!user) throw new BadRequestResponse({ message: "Wrong email or password!!!" })
                return true
            }
        }
    },
    password: {
        notEmpty: true,
        trim: true,
        isString: true,
        isLength: {
            options: {
                min: 6,
                max: 100
            }
        },
    },
}, ["body"])


export const logoutValidator = checkSchema({
    Authoziration: {
        notEmpty: true,
    }
}, ["headers"])

export const accessTokenValidator = checkSchema({
    Authoziration: {
        notEmpty: true,
        custom: {
            options: async (value, { req }) => {
                const token = value.split(" ")[1]
                if(!token) throw new BadRequestResponse({ message: "No token" })
                const decoded = await verifyToken({ token, publicOrSecretKey: process.env.ACCESS_TOKEN_SECRET_PRIVATE || '' })
                if(!decoded) throw new BadRequestResponse({ message: "Invalid token" })
                req.decoded = decoded

            }
        }
    }
}, ["headers"])