import type {Request, Response} from 'express';
import {userService} from '../services/User.service.js';

class UserController {
    async register(req: Request, res: Response) {
        const user = await userService.register(req.body);

        return res.status(201).json({
            message: 'User registered successfully',
            user,
        });
    }
}

export const userController = new UserController();