import { sendMessage } from './messageController';
const Message = require('../Models/message');

describe('sendMessage', () => {
  it('should return 400 if content or clubId is missing', async () => {
    const req = {
      body: {}
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await sendMessage(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith('Missing data');
  });

  it('should return 200 with populated message if data is valid', async () => {
    const req = {
      body: {
        content: 'Test message',
        clubId: 'clubId123'
      },
      user: {
        _id: 'userId123'
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const savedMessage = {
      _id: 'messageId123',
      content: 'Test message',
      sender: {
        _id: 'userId123',
        name: 'John Doe'
      },
      clubId: 'clubId123'
    };
    const populatedMessage = {
      _id: 'messageId123',
      content: 'Test message',
      sender: {
        _id: 'userId123',
        name: 'John Doe'
      },
      clubId: 'clubId123'
    };
    Message.prototype.save = jest.fn().mockResolvedValue(savedMessage);
    Message.prototype.populate = jest.fn().mockResolvedValue(populatedMessage);

    await sendMessage(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(populatedMessage);
  });

  it('should return 500 if an error occurs during saving', async () => {
    const req = {
      body: {
        content: 'Test message',
        clubId: 'clubId123'
      },
      user: {
        _id: 'userId123'
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const errorMessage = 'Error saving message';
    Message.prototype.save = jest.fn().mockRejectedValue(new Error(errorMessage));

    await sendMessage(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(errorMessage);
  });
});