import { ADMIN, USER } from "../constants/index.js";

const ROLES = {
  Admin: ADMIN,
  User: USER,
};

const checkRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req?.user && !req?.user?.role) {
      res.status(401);
      throw new Error("You are not authorized to use our platform");
    }

    const rolesArray = [...allowedRoles];

    const roleFound = req.roles.some((role) => rolesArray.includes(role));

    if (!roleFound) {
      res.status(401);
      throw new Error("You are not authorized to perform this action");
    }

    next();
  };
};

const role = { ROLES, checkRoles };

export default role;
