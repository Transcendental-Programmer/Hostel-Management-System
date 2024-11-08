import express from 'express';
// import { getChat, getChatById, createChat, updateChat, deleteChat } from '../controller/chatController.js';
import {getMessages,createChatroom} from '../controller/chatController.js';

const chatRoutes = express.Router();

chatRoutes.post("/createChatroom", createChatroom);
chatRoutes.get("/:id/messages", getMessages);


export default chatRoutes;
