const Ticket = require("../models/Ticket");
const Event = require("../models/events");
const User = require("../models/user");
const generateRandomString = require("../utils/uniqueId");

exports.buyTicket = async (req, res, next) => {
  const { noOfTickets, eventId } = req.body;

  const isEvent = await Event.findById(eventId);

  if (!isEvent) {
    return res.status(404).json({
      message: "Event cant Be found",
    });
  }

  const isUser = await User.findById(req.user);

  if (!isUser) {
    return res.status(404).json({
      message: "User not Found",
    });
  }

  const ticketCodee = generateRandomString();

  function randomNumber() {
    return Math.floor(Math.random() * 100) + 1;
  }

  const seatNumber = randomNumber();

  const ticket = await Ticket.create({
    purchasedBy: req.user,
    ticketCode: ticketCodee,
    event: eventId,
    seatNumber: seatNumber,
    noOfTickets: noOfTickets,
  });

  isEvent.capacity = isEvent.capacity - noOfTickets;
  await isEvent.save();

  res.status(200).json({
    message: "Ticket Purchased Successfully",
    data: {
      ticket,
    },
  });
};
