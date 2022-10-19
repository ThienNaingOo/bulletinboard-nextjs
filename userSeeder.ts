import mongoose from "mongoose";
import User from "./models/user.model";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config({
  path: __dirname + "/.env.local",
});

const MONGODB_URI =
  typeof process.env.DB_URI === "string" ? process.env.DB_URI : "";
let saltWorkFactor = parseInt(process.env.SALT_WORK_FACTOR || "10") as number;

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("MONGO CONNECTION OPEN!!!");
  })
  .catch((err) => {
    console.log(err);
  });

const seedDB = async () => {
  let salt = await bcrypt.genSalt(saltWorkFactor); // generate hash salt of ? rounds
  let hashedPassword = await bcrypt.hash("A1234567", salt); // hash the password
  const adminId = new mongoose.Types.ObjectId();
  const seedUser = [
    {
      _id: adminId,
      name: "Admin",
      email: "admin@mail.com",
      password: hashedPassword,
      type: "0",
      phone: "09400033516",
      dob: "",
      address: "122/124, 4th Quarter, Botahtaung Pagoda Road, Botahtaung Township, Yangon.",
      profile: "/common/app.png",
      createdAt : new Date().toDateString(),
      updatedAt : new Date().toDateString(),
      created_user_id: adminId
    },
    // {
    //   name: "Normal User",
    //   email: "user@mail.com",
    //   password: hashedPassword,
    //   type: "1",
    //   phone: "09400033316",
    //   dob: "",
    //   address: "122/124, 4th Quarter, Botahtaung Pagoda Road, Botahtaung Township, Yangon.",
    //   profile: "/common/app.png",
    //   createdAt : new Date().toDateString(),
    //   updatedAt : new Date().toDateString(),
    //   created_user_id: adminId
    // },
  ];
  await User.insertMany(seedUser);
};

seedDB().then(() => {
  console.log("Seeding User Succeed!!!");
  mongoose.connection.close();
});
