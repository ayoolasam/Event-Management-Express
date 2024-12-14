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

  if (isEvent.capacity < noOfTickets) {
    return res.status(400).json({ message: "Not enough tickets available." });
  }

  const isUser = await User.findById(req.user);

  if (!isUser) {
    return res.status(404).json({
      message: "User not Found",
    });
  }

  const ticketCodee = generateRandomString();

  const ticket = await Ticket.create({
    purchasedBy: req.user,
    ticketCode: ticketCodee,
    event: eventId,

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

exports.getTickets = async (req, res, next) => {
  const tickets = await Ticket.find().populate("event").populate("purchasedBy");

  res.status(200).json({
    message: "Tickets Fetched Successfully",
    length: tickets.length,
    
    data: {
      tickets,
    },
  });
};

exports.getTicket = async (req, res, next) => {
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    return res.status(404).json({
      message: "Ticket not found",
    });
  }

  res.status(200).json({
    message: "Ticket Fetched Successfully",
    data: {
      ticket,
    },
  });
};

exports.toggleTicket = async (req, res, next) => {
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    return res.status(404).json({
      success: false,
      message: "Ticket Not found",
    });
  }

  if (ticket.isUsed) {
    return res.status(400).json({
      success: false,
      message: "Ticket Used Already",
    });
  }

  ticket.isUsed = true;
  await ticket.save();

  res.status(200).json({
    success: true,
    message: "Ticket successfully toggled ",
  });
};
