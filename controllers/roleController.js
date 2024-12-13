// const Role = require("../models/Role"); // Model untuk role
// const Permission = require("../models/Permission"); // Model untuk permission

// // Create a new role
// exports.createRole = async (req, res) => {
//   try {
//     const { name, permissions } = req.body;
//     const newRole = new Role({
//       name,
//       permissions: permissions || [],
//     });
//     await newRole.save();
//     res.status(201).json(newRole);
//   } catch (err) {
//     res.status(500).json({ message: "Error creating role", error: err });
//   }
// };

// // Get all roles
// exports.getAllRoles = async (req, res) => {
//   try {
//     const roles = await Role.find().populate("permissions"); // Populate permissions
//     res.status(200).json(roles);
//   } catch (err) {
//     res.status(500).json({ message: "Error retrieving roles", error: err });
//   }
// };

// // Get a single role by ID
// exports.getRoleById = async (req, res) => {
//   try {
//     const { roleId } = req.params;
//     const role = await Role.findById(roleId).populate("permissions");
//     if (!role) {
//       return res.status(404).json({ message: "Role not found" });
//     }
//     res.status(200).json(role);
//   } catch (err) {
//     res.status(500).json({ message: "Error retrieving role", error: err });
//   }
// };

// // Update a role by ID
// exports.updateRole = async (req, res) => {
//   try {
//     const { roleId } = req.params;
//     const { name, permissions } = req.body;
//     const role = await Role.findById(roleId);
//     if (!role) {
//       return res.status(404).json({ message: "Role not found" });
//     }
//     role.name = name || role.name;
//     role.permissions = permissions || role.permissions;
//     await role.save();
//     res.status(200).json(role);
//   } catch (err) {
//     res.status(500).json({ message: "Error updating role", error: err });
//   }
// };

// // Delete a role by ID
// exports.deleteRole = async (req, res) => {
//   try {
//     const { roleId } = req.params;
//     const role = await Role.findById(roleId);
//     if (!role) {
//       return res.status(404).json({ message: "Role not found" });
//     }
//     await role.remove();
//     res.status(200).json({ message: "Role deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ message: "Error deleting role", error: err });
//   }
// };
