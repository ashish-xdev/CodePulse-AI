import { User } from "../models/User.model.js";
import type { IUser, UserDocument } from "../models/User.model.js";

interface CreateUserData {
  name: string;
  email: string;
  passwordHash: string;
}

class UserRepository {
  async findByEmail(email: string): Promise<UserDocument | null> {
    return User.findOne({ email });
  }

  async findByEmailWithPassword(
    email: string,
  ): Promise<UserDocument | null> {
    return User.findOne({ email }).select("+passwordHash");
  }

  async create(data: CreateUserData): Promise<UserDocument> {
    return User.create(data);
  }

  async findById(userId: string): Promise<UserDocument | null> {
    return User.findById(userId);
  }
}

export const userRepository = new UserRepository();