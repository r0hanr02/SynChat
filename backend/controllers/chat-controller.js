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
  try {
    if (!req.body.users || !req.body.name) {
      return res.status(400).json({ message: "Please Fill all the Fields" });
    }
    let users = JSON.parse(req.body.users);

    if (users.length < 2) {
      return res.status(400).json({
        message: "More than 2 users are required to form a group chat",
      });
    }

    users.push(req.user);

    const GroupChat = await chatModel.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await chatModel
      .findOne({ _id: GroupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const renameGroup = async (req, res) => {
  try {
    const { chatId, chatName } = req.body;
    const updatedChat = await chatModel
      .findByIdAndUpdate(
        chatId,
        {
          chatName,
        },
        {
          new: true,
        }
      )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!updatedChat) {
      return res.status(404).json({ message: "Chat Not Found" });
    }
    return res.status(200).json(updatedChat);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const addToGroup = async (req, res) => {
  try {
    const { chatId, userId } = req.body;

    const added = await chatModel
      .findByIdAndUpdate(
        chatId,
        {
          $addToSet: { users: userId },
        },
        { new: true }
      )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!added) {
      return res.status(404).json({ message: "Chat Not Found" });
    }
    return res.status(200).json(added);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const removeFromGroup = async (req, res) => {
  try {
    const { chatId, userId } = req.body;

    const added = await chatModel
      .findByIdAndUpdate(
        chatId,
        {
          $pull: { users: userId },
        },
        { new: true }
      )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!added) {
      return res.status(404).json({ message: "Chat Not Found" });
    }
    return res.status(200).json(added);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export {
  accessChat,
  fetchChats,
  createGroupChat,
  removeFromGroup,
  renameGroup,
  addToGroup,
};
