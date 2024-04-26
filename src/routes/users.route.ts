import express from 'express'
import {UsersController} from "~/controllers";
import {catchAsyncHandler} from "~/handlers";
import {loginValidator, registerValidator,logoutValidator} from "~/middlewares";
import {validate} from "~/utils";

const userRouter = express.Router()

userRouter.post('/register', validate(registerValidator), catchAsyncHandler(UsersController.register))
userRouter.post('/login', validate(loginValidator), catchAsyncHandler(UsersController.login))
userRouter.post('/verify-token', catchAsyncHandler(UsersController.testVerifyToken))
userRouter.post('/logout', validate(logoutValidator),catchAsyncHandler(UsersController.testVerifyToken))

export default userRouter