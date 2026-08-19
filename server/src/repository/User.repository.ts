import { User } from "../models/User.model.js";
import type { IUser } from "../models/User.model.js";

interface CreateUserData {
  name: string;
  email: string;
  passwordHash: string;
}

class UserRepository {
  async findByEmail(email: string): Promise<IUser | null> {
    const user = await User.findOne({ email }).select("+passwordHash");

    return user;
  }

  async create(data: CreateUserData): Promise<IUser> {
    const user = await User.create(data);

    return user;
  }
}

export const userRepository = new UserRepository();