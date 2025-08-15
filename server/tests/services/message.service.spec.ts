import { Query } from 'mongoose';
import MessageModel from '../../models/messages.model';
import UserModel from '../../models/users.model';
import { getMessages, saveMessage } from '../../services/message.service';
import { Message, MessageResponse } from '../../types/message';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const mockingoose = require('mockingoose');

const message1 = {
  msg: 'Hello',
  msgFrom: 'User1',
  msgDateTime: new Date('2024-06-04'),
};

const message2 = {
  msg: 'Hi',
  msgFrom: 'User2',
  msgDateTime: new Date('2024-06-05'),
};

describe('Message model', () => {
  beforeEach(() => {
    mockingoose.resetAll();
  });

  describe('saveMessage', () => {
    beforeEach(() => {
      mockingoose.resetAll();
    });

    it('should return the saved message', async () => {
      mockingoose(MessageModel).toReturn(message1, 'create');

      const savedMessage = await saveMessage(message1);

      expect(savedMessage).toMatchObject(message1);
    });

    it('should return an error if the message user does not exist', async () => {
      mockingoose(UserModel).toReturn(null, 'findOne');

      const result = (await saveMessage(message1)) as Exclude<MessageResponse, Message>;
      expect(result).toHaveProperty('error');
      expect(typeof result.error).toBe('string');
    });

    it('should return an error if creating the message fails', async () => {
      const createSpy = jest
        .spyOn(MessageModel, 'create')
        .mockRejectedValue(new Error('Create Error'));

      const result = (await saveMessage(message1)) as Exclude<MessageResponse, Message>;
      expect(result).toHaveProperty('error');
      expect(typeof result.error).toBe('string');

      createSpy.mockRestore();
    });
  });

  describe('getMessages', () => {
    it('should return all messages, sorted by date', async () => {
      mockingoose(MessageModel).toReturn([message2, message1], 'find');

      const messages = await getMessages();

      expect(messages).toMatchObject([message1, message2]);
    });

    it('should return an empty array if retrieval fails', async () => {
      const sortSpy = jest
        .spyOn(Query.prototype, 'sort')
        .mockRejectedValue(new Error('Find Error'));

      const messages = await getMessages();
      expect(messages).toEqual([]);

      sortSpy.mockRestore();
    });
  });
});
