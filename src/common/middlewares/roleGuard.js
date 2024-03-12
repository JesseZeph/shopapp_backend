import AppError from '../utils/appError.js';

export function RoleGuard(...roles) {
  return async (req, res, next) => {
    const reqUser = req.user;

    if (!reqUser) {
      throw new AppError('Unauthorized', 401);
    }

    if (!roles.includes(reqUser.role)) {
      throw new AppError('Restricted - access denied', 403);
    }

    next();
  };
}
