// import { nanoid } from "nanoid";
const nanoid = require("nanoid");

exports.generateId = () => {
  return nanoid(6);
};
