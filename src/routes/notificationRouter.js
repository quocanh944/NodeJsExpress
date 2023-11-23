import express from 'express';
import { markAsRead, deleteNotification, deleteAllNotifications } from '../controller/notificationController.js';

const notificationRouter = express.Router();

notificationRouter.post('/mark-as-read/:notificationId', markAsRead);

notificationRouter.delete('/delete/:notificationId', deleteNotification);

notificationRouter.delete('/delete-all', deleteAllNotifications);

export default notificationRouter;
