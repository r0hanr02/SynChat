import chatModel from "../model/chat-model.js";
import messageModel from "../model/message-model.js";
import userModel from "../model/user-model.js";

const sendMessage = async (req, res) => {
  const { content, chatId } = req.body;

  console.log(chatId);
  if (!content || !chatId) {
    return res
      .status(400)
      .json({ message: "invalid data passed into request" });
  }

  let newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    let message = await messageModel.create(newMessage);
    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await userModel.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });
    await chatModel.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });
    return res.status(200).json(message);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const allMessages = async (req, res) => {
  try {
    const message = await messageModel
      .find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");

    return res.status(200).json(message);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export { sendMessage, allMessages };
