import MessageModel from '../models/messages.model';
import UserModel from '../models/users.model';
import { Message, MessageResponse } from '../types/types';

/**
 * Saves a new message to the database.
 *
 * @param {Message} message - The message to save
 *
 * @returns {Promise<MessageResponse>} - The saved message or an error message
 */
export const saveMessage = async (message: Message): Promise<MessageResponse> => {
  try {
    const user = await UserModel.findOne({ username: message.msgFrom });
    if (user === null) {
      return { error: 'Username does not exist' };
    }
    const result = await MessageModel.create(message);
    return result;
  } catch (error) {
    return { error: 'Error when saving message' };
  }
};

/**
 * Retrieves all messages from the database, sorted by date in ascending order.
 *
 * @returns {Promise<Message[]>} - An array of messages. If an error occurs, an empty array is returned.
 */
export const getMessages = async (): Promise<Message[]> => [];
// TODO: Task 2 - Implement the getMessages function
