import bcrypt from "bcrypt";
import { userRepository } from "../repository/User.repository.js";
import { AppError } from "../errors/AppError.js";

interface registerUserData {
  name: string;
  email: string;
  password: string;
}

class UserService {
  async register(data: registerUserData) {
    const existingUser = await userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new AppError("User with this email already exists", 409);
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await userRepository.create({
      name: data.name,
      email: data.email,
      passwordHash,
    });
    return user;
  }
}

export const userService = new UserService();
