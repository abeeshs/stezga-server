import asyncHandler from 'express-async-handler';
import Message from '../model/messageModel.js';
import User from '../model/userModel.js';
import Chat from '../model/chatModel.js';

export const createChatService = asyncHandler(async (data) => {
  const createdData = await Chat.create(data);
  const fullChat = await Chat.findOne({ _id: createdData._id }).populate(
    'users'
  );
  return fullChat;
});

export const getExistChat = asyncHandler(async (userId, inUserId) => {
  var result = Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: inUserId } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate('users')
    .populate('latestMessage');

  result = await User.populate(result, {
    path: 'latestMessage.sender',
    select: 'username email mobile',
  });
  return result;
});

export const getUserAllChat = asyncHandler(async (userId) => {
  var result = Chat.find({ users: { $elemMatch: { $eq: userId } } })
    .populate('users')
    .populate('latestMessage')
    .sort({ upadtedAt: -1 });

  result = await User.populate(result, {
    path: 'latestMessage.sender',
    select: 'username email mobile',
  });
  return result;
});

export const searchUserService = asyncHandler(async (user, keyword) => {
  const foundUser = await User.find(keyword).find({
    company_id: user.company_id,
    _id: { $ne: user._id },
  });
  return foundUser;
});

export const sendMessageServise = asyncHandler(async (messageData) => {
  var data = await Message.create(messageData);
  //data = await Message.findById(data._id).populate('sender').populate('chat');
  data = await data.populate('sender', 'username email');
  data = await data.populate('chat');
  data = await User.populate(data, {
    path: 'chat.users',
    select: 'username email',
  });
  console.log(data);
  await Chat.findByIdAndUpdate(messageData.chat, {
    latestMessage: data,
  });

  return data;
});

export const getMessageService = asyncHandler(async (chatId) => {
  const allMessages = await Message.find({ chat: chatId })
    .populate('sender')
    .populate('chat');

  return allMessages;
});
