const friendService = require('../services/friend.service');

const search = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length < 1) {
      return res.status(400).json({ message: 'Search query required' });
    }

    const users = await friendService.searchUsers(q.trim(), req.user.id);
    res.json(users);
  } catch (err) {
    next(err);
  }
};

const sendRequest = async (req, res, next) => {
  try {
    const { receiverId } = req.body;
    if (!receiverId) {
      return res.status(400).json({ message: 'Receiver ID required' });
    }

    const request = await friendService.sendFriendRequest(req.user.id, receiverId);
    res.status(201).json({ message: 'Friend request sent', request });
  } catch (err) {
    next(err);
  }
};

const getReceivedRequests = async (req, res, next) => {
  try {
    const requests = await friendService.getReceivedRequests(req.user.id);
    res.json(requests);
  } catch (err) {
    next(err);
  }
};

const acceptRequest = async (req, res, next) => {
  try {
    const { requestId } = req.params;
    const request = await friendService.acceptFriendRequest(requestId, req.user.id);
    res.json({ message: 'Friend request accepted', request });
  } catch (err) {
    next(err);
  }
};

const rejectRequest = async (req, res, next) => {
  try {
    const { requestId } = req.params;
    const request = await friendService.rejectFriendRequest(requestId, req.user.id);
    res.json({ message: 'Friend request rejected', request });
  } catch (err) {
    next(err);
  }
};

const getOnlineFriends = async (req, res, next) => {
  try {
    const friends = await friendService.getOnlineFriends(req.user.id);
    res.json(friends);
  } catch (err) {
    next(err);
  }
};

const getAllFriends = async (req, res, next) => {
  try {
    const friends = await friendService.getAllFriends(req.user.id);
    res.json(friends);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  search,
  sendRequest,
  getReceivedRequests,
  acceptRequest,
  rejectRequest,
  getOnlineFriends,
  getAllFriends
};
