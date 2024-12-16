const Ticket = require("../models/Ticket");
const Event = require("../models/events");
const User = require("../models/user");
const { initializePayment } = require("../utils/payment");

const generateRandomString = require("../utils/uniqueId");

exports.buyTicket = async (req, res, next) => {
  const { noOfTickets, eventId, price } = req.body;

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

  const paymentLink = await initializePayment(req.user.email, price);

  const ticketCodee = generateRandomString();

  const ticket = await Ticket.create({
    purchasedBy: req.user,
    ticketCode: ticketCodee,
    event: eventId,
    isPaid: false,
    noOfTickets: noOfTickets,
    reference: paymentLink.data.reference,
  });

  isEvent.capacity = isEvent.capacity - noOfTickets;
  await isEvent.save();

  res.status(200).json({
    message: "Ticket Booked Successfully Please Navigate to Payment",
    data: {
      ticket,
      paymentLink,
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


exports.deleteTicket = async (req, res, next) => {
  try{
    
    const ticket = await Ticket.findByIdAndDelete(req.params.id);


 

 

    res.status(200).json({
      success: true,
      message: "Ticket successfully deleted ",
    });
  }catch(e){
    res.status(500).json({
      message:e.message
    })
  }
  
};
