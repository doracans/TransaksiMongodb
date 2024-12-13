import User from "../model/userModel.js";
import Role from "../model/roleModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


export const createUserWithRoleAndPermissions = async (req, res) => {
  const { user_name, email, password, role } = req.body;

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create permissions if they don't exist
    const permissionDocs = await Promise.all(
      role.permissions.map(async (action) => {
        const existingPermission = await Permission.findOne({ action });
        return existingPermission || new Permission({ action }).save();
      })
    );

    // Create role with permissions
    const roleDoc = await Role.findOneAndUpdate(
      { name: role.name },
      { name: role.name, permissions: permissionDocs.map((perm) => perm._id) },
      { upsert: true, new: true }
    );

    // Create user with the role
    const newUser = new User({
      user_name,
      email,
      password: hashedPassword,
      role: roleDoc._id,
    });

    await newUser.save();

    res
      .status(201)
      .json({
        message: "User created with role and permissions",
        user: newUser,
      });
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
};
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Email yang dimasukkan:", email);
    console.log("Password yang dimasukkan:", password);

    // Cari user berdasarkan email
    const findUser = await User.findOne({ email: email });

    if (!findUser) {
      console.log("User tidak ditemukan!");
      return res.status(401).json({
        status: false,
        logged: false,
        message: "Username or password is invalid",
      });
    }

    // Verifikasi password
    const isPasswordValid = await bcrypt.compare(password, findUser.password);
    console.log("Apakah password valid?", isPasswordValid);

    if (!isPasswordValid) {
      return res.status(401).json({
        status: false,
        logged: false,
        message: "Username or password is invalid",
      });
    }

    // Siapkan payload untuk token
    const payload = {
      id: findUser._id,
      email: findUser.email,
      role: findUser.role,
    };

    // Ambil secret key dari environment atau gunakan default
    const secretKey = process.env.JWT_SECRET_KEY || "dorakuy";

    // Buat token menggunakan payload dan secretKey
    const token = jwt.sign(payload, secretKey, { expiresIn: "1h" });

    return res.status(200).json({
      status: true,
      logged: true,
      message: "Login Success",
      token,
    });
  } catch (error) {
    console.error("Error:", error); // Log error
    return res.status(500).json({
      status: false,
      message: `There was an error: ${error.message}`,
    });
  }
};