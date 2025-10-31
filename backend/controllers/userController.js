import userModel from "../model/userModel.js";

const registerUser = async (req, res) => {
  try {
    const { name, email, password, pic } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "Enter all the Detailed Fields" });

    const existingUser = await userModel.findOne({ email });

    if (existingUser)
      return res.status(400).json({ message: "User Already Exists" });

    const newUser = await userModel.create({
      name,
      email,
      password,
      pic,
    });
    await newUser.save();
    const token = newUser.generateToken();
    return res
      .status(201)
      .json({ message: "New User created", user: newUser, token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error", error });
  }
};

const authUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await userModel.findOne({ email });
    if (!existingUser)
      return res.status(500).json({ message: "Email not Found" });
    const isMatch = await existingUser.comparePassword(password);
    if (isMatch) {
      res.status(200).json({
        message: "Login Successfull",
        token: await existingUser.generateToken(),
        userId: existingUser._id.toString(),
      });
    }
  } catch (error) {
    console.log(error)
  }
};
export { registerUser, authUser };
