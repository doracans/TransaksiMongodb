import jwt from "jsonwebtoken";
import User from "../model/userModel.js";

// Authenticate Middleware
export const authenticate = async (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY || "Dorakuy");
    req.user = await User.findById(decoded.id)
      .populate({
        path: "role",
        populate: {
          path: "permissions",
        },
      })
      .exec();
    
    next();
  } catch (error) {
    
    res.status(401).json({ message: "Invalid token" });
  }
};

// Authorization Middleware
export const authorize = (requiredPermissions) => async (req, res, next) => {
  const userPermissions = req.user.role.permissions.map((perm) => perm.action);
  console.log("User Permissions:", userPermissions); 
  console.log("Required Permissions:", requiredPermissions); 

  if (!requiredPermissions.some((perm) => userPermissions.includes(perm))) {
    return res
      .status(403)
      .json({ message: "Access denied: Insufficient permissions" });
  }
  next();
};
