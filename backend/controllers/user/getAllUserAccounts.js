import asyncHandler from "express-async-handler";
import User from "../../models/userModels.js";

// $-title  Get All User Accounts
// $-path   GET /api/v1/user/all
// $-auth   Private/Admin

const getAllUserAccounts = asyncHandler(async (req, res) => {
  const pageSize = req.query.pageSizes || 10;
  const page = Number(req.query.page) || 1;
  const count = await User.countDocuments({});

  const users = await User.find()
    .sort({ createdAt: -1 })
    .select("-refreshTokens")
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .lean();

  res.status(200).json({
    success: true,
    count,
    numberOfPages: Math.ceil(count / pageSize),
    data: users,
  });
});

export default getAllUserAccounts;
