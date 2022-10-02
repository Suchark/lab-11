import { readUsersDB } from "../../../backendLibs/dbLib";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export default function login(req, res) {
  if (req.method === "POST") {
    const { username, password } = req.body;

    //validate body
    if (
      typeof username !== "string" ||
      username.length === 0 ||
      typeof password !== "string" ||
      password.length === 0
    )
      return res.status(400).json({
        ok: false,
        Message: " Username or password cannot be empty",
      });

    const users = readUsersDB();

    const foundUser = user.find(
      (x) => x.username === username && bcrypt.compareSync(password, x.password)
    );

    if (!foundUser)
      return res.status(400).json({
        ok: false,
        Message: "Invalid Username od Password",
      });
    //find users with username, password

    const secret = process.env.JWT_SECRET;

    //sign token

    const token = jwt.sign(
      {
        username: foundUser.username,
        inAdmin: foundUser.isAdmin,
      },
      secret,
      {
        expiresIn: "1080s",
      }
    );

    //return response

    return res.json({
      ok: true,
      username: foundUser.username,
      isAdmin: foundUser.isAdmin,
      token,
    });
  }
}
