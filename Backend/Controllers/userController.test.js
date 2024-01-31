const { registerUser } = require('./userController');

describe('registerUser', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      body: {
        universityId: '123456',
        universityPassword: 'password123',
        username: 'testuser',
        password: 'password123',
        fullName: 'Test User',
        fieldOfStudy: 'Computer Science',
        profilePicture: 'https://example.com/profile.jpg'
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

  it('should return 400 status with error message if user input is invalid', async () => {
    req.body.username = ''; // Invalid username

    await registerUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid user input' });
  });

  it('should return 400 status with error message if user credentials are invalid', async () => {
    // Mock AAUDB data
    const AAUDB = [
      { studentId: '123456', password: 'password123' },
      { studentId: '789012', password: 'password456' }
    ];

    req.body.universityId = '789012'; // Invalid university ID

    await registerUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
  });

  it('should return 400 status with error message if user already exists (by username)', async () => {
    // Mock User.findOne to return a user
    User.findOne = jest.fn().mockResolvedValue({ username: 'testuser' });

    await registerUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'User already exists' });
  });

  it('should return 400 status with error message if user already exists (by university ID)', async () => {
    // Mock User.findOne to return a user
    User.findOne = jest.fn().mockResolvedValue({ universityId: '123456' });

    await registerUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'User already exists' });
  });

  it('should save the new user and return user data with token', async () => {
    // Mock User.findOne to return null (user does not exist)
    User.findOne = jest.fn().mockResolvedValue(null);

    // Mock bcrypt functions
    bcrypt.genSalt = jest.fn().mockResolvedValue('salt');
    bcrypt.hash = jest.fn().mockResolvedValue('hashedPassword');

    // Mock jwt.sign to return a token
    jwt.sign = jest.fn().mockReturnValue('token');

    // Mock newUser.save to return the saved user
    const savedUser = {
      _id: 'user123',
      universityId: '123456',
      fullName: 'Test User',
      fieldOfStudy: 'Computer Science',
      username: 'testuser',
      password: 'hashedPassword',
      profilePicture: 'https://example.com/profile.jpg'
    };
    newUser.save = jest.fn().mockResolvedValue(savedUser);

    await registerUser(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      _id: 'user123',
      token: 'token',
      isAdmin: false,
      fullName: 'Test User',
      username: 'testuser',
      fieldOfStudy: 'Computer Science',
      universityId: '123456',
      profilePicture: 'https://example.com/profile.jpg'
    });
  });

  it('should return 500 status with error message if an error occurs during user save', async () => {
    // Mock User.findOne to return null (user does not exist)
    User.findOne = jest.fn().mockResolvedValue(null);

    // Mock bcrypt functions
    bcrypt.genSalt = jest.fn().mockResolvedValue('salt');
    bcrypt.hash = jest.fn().mockResolvedValue('hashedPassword');

    // Mock newUser.save to throw an error
    newUser.save = jest.fn().mockRejectedValue(new Error('Database error'));

    await registerUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
  });
});