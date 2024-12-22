const Event = require("../models/events");
const APIFilters = require("../utils/apiFilters");

exports.getEvents = async (req, res, next) => {
  const apiFilters = new APIFilters(Event.find(), req.query)
    .filter()
    .sort()
    .searchByQuery()
    .limitFields()
    .pagination();
  const events = await apiFilters.query;

  res.status(200).json({
    message: "Events Fetched Successfully",
    length: events.length,
    data: {
      events,
    },
  });
};

exports.createEvent = async (req, res, next) => {
  const {
    name,
    description,
    date,
    location,
    status,
    price,
    capacity,
    imageUrl,
    category,
  } = req.body;

  if (
    !name ||
    !description ||
    !date ||
    !location ||
    !price ||
    !capacity ||
    !category
  ) {
    return res.status(400).json({
      message: "Please Fill in All Details For this event please",
    });
  }

  const newEvent = {
    name,
    description,
    date,
    location,
    status,
    price,
    capacity,
    imageUrl,
    category,
  };

  const event = await Event.create(newEvent);

  res.status(201).json({
    message: "Event Created Successsfully",
    data: {
      event,
    },
  });
};

exports.fetchEvent = async (req, res, next) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    return res.status(404).json({
      message: "Event Not Found",
    });
  }

  res.status(200).json({
    message: "Event Fetched Successfully",
    data: {
      event,
    },
  });
};

exports.updateEvents = async (req, res, next) => {};

exports.deleteEvents = async (req, res, next) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    return res.status(404).json({
      message: "Event not found",
    });
  }

  await Event.deleteOne(event);

  res.status(200).json({
    message: "Event Deleted Successfully",
  });
};
