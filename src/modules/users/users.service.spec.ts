import { Test, TestingModule } from '@nestjs/testing';
import { User, UserSchema } from '../../schemas/user.schema';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';

const mockUser: any = {
  firstName: 'firstName #1',
  lastName: 'lastName #1',
  email: 'test@example.it',
  phone: '1234567890',
  address: 'address #1',
  description: 'description #1',
  organizations: 'organization #1',
};

const mockUserUpdate: any = {
  _id: 'anyid',
  firstName: 'firstName update',
  lastName: 'lastName update',
  email: 'test@example.it',
  phone: '1234567890',
  address: 'address update',
  description: 'description update',
  organizations: 'organization update',
};

const usersArray = [
  {
    _id: 'anyid',
    firstName: 'firstName #1',
    lastName: 'lastName #1',
    email: 'test@example.it',
    phone: '1234567890',
    address: 'address #1',
    description: 'description #1',
    organizations: 'organization #1',
  },
  {
    _id: 'anyid',
    firstName: 'firstName #2',
    lastName: 'lastName #2',
    email: 'test@example.it',
    phone: '1234567890',
    address: 'address #2',
    description: 'description #2',
    organizations: 'organization #2',
  },
];

const createUserDto: CreateUserDto = {
  firstName: 'firstName #1',
  lastName: 'lastName #1',
  email: 'test@example.it',
  phone: '1234567890',
  address: 'address #1',
  description: 'description #1',
  organizations: 'organization #1',
};

const updateUserDto: UpdateUserDto = {
  firstName: 'firstName update',
  lastName: 'lastName update',
  email: 'test@example.it',
  phone: '1234567890',
  address: 'address update',
  description: 'description update',
  organizations: 'organization update',
};

describe('UsersService', () => {
  let service: UsersService;
  let model: Model<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken('User'),
          useValue: {
            find: jest.fn().mockReturnValue(usersArray),
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findByIdAndRemove: jest.fn(),
            new: jest.fn().mockResolvedValue(mockUser),
            constructor: jest.fn().mockResolvedValue(mockUser),
            create: jest.fn().mockResolvedValue(createUserDto),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            exec: jest.fn(),
            populate: jest.fn(),
            skip: jest.fn(),
            offset: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll()', () => {
    it('should return all customers', async () => {
      jest.spyOn(model, 'find').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(customersArray),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
      } as any);
      const customers = await service.findAll(paginationQueryDto);
      expect(customers).toEqual(customersArray);
    });
  });
});
