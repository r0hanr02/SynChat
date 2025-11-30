import chatModel from "../model/chat-model.js";
import userModel from "../model/user-model.js";

const accessChat = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      console.log("UserId param not sent with Request");
      return res.status(400);
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
    return res.status(500).json({ message: error });
  }
};
const fetchChats = async (req, res) => {};
const createGroupChat = async (req, res) => {};
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
