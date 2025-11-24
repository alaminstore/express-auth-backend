import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Users } from "../entities/user";
import bcrypt from "bcrypt";

export const cerateUser = async (req: Request, res: Response) => {
  try {
    let payload = req.body;

    if(payload?.account?.provider){
      // Social login user creation
      payload = {
        fullname: payload.user.name,
        email: payload.user.email,
        type: payload.account.provider,
      };
    }

    const userRepo = AppDataSource.getRepository(Users);

    const exists = await userRepo.findOne({ where: { email: payload.email } });

    if (!exists) {
      const user = userRepo.create({
        name: payload.fullname,
        password: payload?.password,
        email: payload.email,
        type: payload.type,
        isActive: true,
      });

      await userRepo.save(user);
      res
        .status(201)
        .json({ message: "User created successfully...", user: user });
    } else {
      res.status(409).json({ message: "User already exist!" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong!" });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const userRepo = AppDataSource.getRepository(Users);
    const user = await userRepo.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        fullname: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong!" });
  }
};
