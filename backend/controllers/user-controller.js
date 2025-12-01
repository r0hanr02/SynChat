import userModel from "../model/user-model.js";

const registerUser = async (req, res) => {
  try {
    const { name, email, password, pic } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all the details" });
    }

    const userExists = await userModel.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already Exists" });
    }

    const newUser = await userModel.create({
      name,
      email,
      password,
      pic,
    });
    const token = await newUser.generateToken();
    return res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      pic: newUser.pic,
      token: token,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const loginUser = async function (req, res) {
  try {
    const { email, password } = req.body;

    const existingUser = await userModel.findOne({ email });

    if (!existingUser) {
      return res.status(400).json({ message: "Invalid Credential" });
    }

    const isMatch = await existingUser.matchPassword(password);

    if (isMatch) {
      return res.status(201).json({
        _id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
        pic: existingUser.pic,
        token: await existingUser.generateToken(),
      });
    } else {
      res.status(401).json("Invalid email or password");
    }
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

// /api/user?search=rohan
const allUsers = async function (req, res) {
  try {
    const keyword = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};

    const users = await userModel
      .find(keyword)
      .find({ _id: { $ne: req.user._id } });
    return res.status(200).json({ users });
  } catch (error) {
    return res.status(500).json(error);
  }
};
export { registerUser, loginUser, allUsers };
