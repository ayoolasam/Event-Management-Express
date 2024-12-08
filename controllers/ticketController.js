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

  if (isEvent.availableTickets < noOfTickets) {
    return res.status(400).json({ message: "Not enough tickets available." });
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

  const isSeatTaken = await Ticket.findOne({
    event: eventId,
    seatNumber: seatNumber,
  });

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

exports.getTickets = async (req, res, next) => {
  const tickets = await Ticket.find();

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
