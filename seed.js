// import mongoose from "mongoose";
// import Role from "./model/roleModel.js";
// import Permission from "./model/permissionsModel.js";
// import User from "./model/userModel.js";
// import bcrypt from "bcryptjs";

// const seedDatabase = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });

//     console.log("Database connected");

//     // Clear existing data
//     await Permission.deleteMany({});
//     await Role.deleteMany({});
//     await User.deleteMany({});

//     console.log("Existing data cleared");

//     // Seed Permissions
//     const permissions = await Permission.insertMany([
//       { action: "create_user" },
//       { action: "update_user" },
//       { action: "delete_user" },
//       { action: "read_users" },
//       { action: "create_barang" },
//       { action: "update_barang" },
//       { action: "delete_barang" },
//       { action: "read_barang" },
//       { action: "create_transaksi" },
//       { action: "delete_transaksi" },
//       { action: "read_transaksi" },
//     ]);

//     console.log("Permissions seeded");

//     // Seed Roles
//     const adminRole = new Role({
//       name: "admin",
//       permissions: permissions
//         .filter((perm) =>
//           [
//             "create_user",
//             "update_user",
//             "delete_user",
//             "read_users",
//             "create_barang",
//             "update_barang",
//             "delete_barang",
//             "read_barang",
//           ].includes(perm.action)
//         )
//         .map((perm) => perm._id),
//     });

//     const kasirRole = new Role({
//       name: "kasir",
//       permissions: permissions
//         .filter((perm) =>
//           ["create_transaksi", "delete_transaksi", "read_transaksi"].includes(
//             perm.action
//           )
//         )
//         .map((perm) => perm._id),
//     });

//     await adminRole.save();
//     await kasirRole.save();

//     console.log("Roles seeded");

//     // Seed Users
//     const hashedPassword = await bcrypt.hash("password123", 10);

//     const adminUser = new User({
//       user_name: "admin_user",
//       email: "admin@example.com",
//       password: hashedPassword,
//       role: adminRole._id,
//     });

//     const kasirUser = new User({
//       user_name: "kasir_user",
//       email: "kasir@example.com",
//       password: hashedPassword,
//       role: kasirRole._id,
//     });

//     await adminUser.save();
//     await kasirUser.save();

//     console.log("Users seeded");

//     mongoose.connection.close();
//     console.log("Database seeding completed");
//   } catch (error) {
//     console.error("Error seeding database:", error);
//     mongoose.connection.close();
//   }
// };

// seedDatabase();
