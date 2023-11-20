import notification from "../models/notification";

const fetchNotifications = async (req, res, next) => {
  try {
    const notifications = await notification.find({}).sort({ createdAt: -1 });

    res.locals.notifications = notifications;
    next();
  } catch (error) {
    console.error('Error fetching notifications:', error);
    next(error);
  }
};


export { fetchNotifications };
