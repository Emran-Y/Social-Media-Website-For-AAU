const postLostAndFound = require('./lostAndFoundController');

describe('postLostAndFound', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      user: {
        isAdmin: true
      },
      body: {
        title: 'Test Title',
        description: 'Test Description',
        picture: 'Test Picture'
      }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 403 status and error message if user is not admin', async () => {
    req.user.isAdmin = false;

    await postLostAndFound(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'You are not allowed to post lost and found' });
  });

  it('should return 400 status and error message if title or description is missing', async () => {
    req.body.title = '';

    await postLostAndFound(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'fill all fields' });
  });

  it('should create a new LostAndFound object and return it with 200 status', async () => {
    const savedLostAndFound = {
      _id: 'lostAndFoundId',
      title: 'Test Title',
      description: 'Test Description',
      picture: 'Test Picture'
    };
    const createdLostAndFound = {
      save: jest.fn().mockResolvedValue(savedLostAndFound)
    };
    jest.spyOn(global, 'LostAndFound').mockImplementation(() => createdLostAndFound);

    await postLostAndFound(req, res);

    expect(createdLostAndFound.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(savedLostAndFound);
  });

  it('should return 500 status and error message if an error occurs during saving', async () => {
    const error = new Error('Error saving lost and found');
    const createdLostAndFound = {
      save: jest.fn().mockRejectedValue(error)
    };
    jest.spyOn(global, 'LostAndFound').mockImplementation(() => createdLostAndFound);

    await postLostAndFound(req, res);

    expect(createdLostAndFound.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
  });
});