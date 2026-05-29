const router = require('express').Router();
const verifyToken = require('../middlewares/auth.middleware');
const {
  search,
  sendRequest,
  getReceivedRequests,
  acceptRequest,
  rejectRequest,
  getOnlineFriends,
  getAllFriends
} = require('../controllers/friend.controller');

// Tất cả các route cần xác thực
router.use(verifyToken);

// Tìm kiếm user
router.get('/search', search);

// Gửi lời mời kết bạn
router.post('/request', sendRequest);

// Lấy danh sách lời mời kết bạn đang chờ
router.get('/requests', getReceivedRequests);

// Đồng ý lời mời kết bạn
router.put('/requests/:requestId/accept', acceptRequest);

// Từ chối lời mời kết bạn
router.put('/requests/:requestId/reject', rejectRequest);

// Lấy danh sách bạn bè đang online
router.get('/online', getOnlineFriends);

// Lấy tất cả bạn bè
router.get('/list', getAllFriends);

module.exports = router;
