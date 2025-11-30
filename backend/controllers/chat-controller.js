import chatModel from "../model/chat-model.js";
import userModel from "../model/user-model.js";

const accessChat = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      console.log("UserId param not sent with Request");
      return res
        .status(400)
        .json({ message: "UserId param not sent with Request" });
    }

    let isChat = await chatModel
      .find({
        isGroupChat: false,
        $and: [
          { users: { $elemMatch: { $eq: req.user._id } } },
          { users: { $elemMatch: { $eq: userId } } },
        ],
      })
      .populate("users", "-password")
      .populate("latestMessage");

    isChat = await userModel.populate(isChat, {
      path: "latestMessage.sender",
      select: "name pic email",
    });

    if (isChat.length > 0) {
      return res.send(isChat[0]);
    }

    const chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    const createdChat = await chatModel.create(chatData);
    const fullChat = await chatModel
      .findOne({ _id: createdChat._id })
      .populate("users", "-password");
    return res.status(200).json(fullChat);
  } catch (error) {
    console.error("ACCESS CHAT ERROR:", error.message);
    return res.status(500).json({ message: error.message });
  }
};
const fetchChats = async (req, res) => {
  try {
    chatModel
      .find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await userModel.populate(results, {
          path: "latestMessage.sender",
          select: "name pic email",
        });

        return res.status(200).json(results);
      });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


const createGroupChat = async (req, res) => {
  // if(!req)
};
const renameGroup = async (req, res) => {};
const removeFromGroup = async (req, res) => {};
const addToGroup = async (req, res) => {};

export {
  accessChat,
  fetchChats,
  createGroupChat,
  removeFromGroup,
  renameGroup,
  addToGroup,
};
