const User = require('../models/User');
const FriendRequest = require('../models/FriendRequest');

const searchUsers = async (query, currentUserId) => {
  const users = await User.find({
    _id: { $ne: currentUserId },
    full_name: { $regex: query, $options: 'i' },
    status: 'active'
  }).select('_id full_name email avatar is_online').limit(10);

  return users;
};

const sendFriendRequest = async (senderId, receiverId) => {
  // Kiểm tra đã là bạn chưa
  const receiver = await User.findById(receiverId);
  if (!receiver) throw new Error('User not found');

  const isFriend = receiver.friends.includes(senderId);
  if (isFriend) throw new Error('Already friends');

  // Xoá request cũ nếu có (cho phép gửi lại)
  await FriendRequest.deleteOne({
    sender: senderId,
    receiver: receiverId,
    status: 'rejected'
  });

  // Tạo request mới
  let request = await FriendRequest.findOne({
    sender: senderId,
    receiver: receiverId,
    status: 'pending'
  });

  if (!request) {
    request = new FriendRequest({
      sender: senderId,
      receiver: receiverId,
      status: 'pending'
    });
    await request.save();
  }

  return request.populate(['sender', 'receiver']);
};

const getReceivedRequests = async (userId) => {
  const requests = await FriendRequest.find({
    receiver: userId,
    status: 'pending'
  }).populate('sender', '_id full_name email avatar').sort({ createdAt: -1 });

  return requests;
};

const acceptFriendRequest = async (requestId, userId) => {
  const request = await FriendRequest.findById(requestId);
  if (!request) throw new Error('Request not found');
  if (request.receiver.toString() !== userId) throw new Error('Unauthorized');

  // Cập nhật trạng thái
  request.status = 'accepted';
  await request.save();

  // Thêm vào danh sách bạn bè
  await User.updateOne({ _id: request.sender }, { $addToSet: { friends: request.receiver } });
  await User.updateOne({ _id: request.receiver }, { $addToSet: { friends: request.sender } });

  return request.populate(['sender', 'receiver']);
};

const rejectFriendRequest = async (requestId, userId) => {
  const request = await FriendRequest.findById(requestId);
  if (!request) throw new Error('Request not found');
  if (request.receiver.toString() !== userId) throw new Error('Unauthorized');

  request.status = 'rejected';
  await request.save();

  return request;
};

const getOnlineFriends = async (userId) => {
  const user = await User.findById(userId).populate(
    'friends',
    '_id full_name email avatar is_online'
  );

  if (!user) throw new Error('User not found');

  const onlineFriends = user.friends.filter(f => f.is_online);
  return onlineFriends;
};

const getAllFriends = async (userId) => {
  const user = await User.findById(userId).populate(
    'friends',
    '_id full_name email avatar is_online'
  );

  if (!user) throw new Error('User not found');
  return user.friends;
};

module.exports = {
  searchUsers,
  sendFriendRequest,
  getReceivedRequests,
  acceptFriendRequest,
  rejectFriendRequest,
  getOnlineFriends,
  getAllFriends
};
