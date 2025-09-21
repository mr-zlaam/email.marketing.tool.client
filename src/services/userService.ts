import type { CreateUserRequest, CreateUserResponse, User } from '@/types/auth.types';

// Generate a random UUID for new users
const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Mock user creation storage
const mockCreatedUsers: User[] = [];

export const userService = {
  async createUser(userData: CreateUserRequest): Promise<CreateUserResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if user already exists
    const existingUser = mockCreatedUsers.find(user => user.email === userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Create new user
    const newUser: User = {
      uid: generateUUID(),
      email: userData.email,
      role: userData.role,
      isVerified: true
    };

    // Store in mock database
    mockCreatedUsers.push(newUser);

    return {
      user: newUser,
      message: `User ${userData.email} created successfully with role ${userData.role}`
    };
  },

  async getUsers(): Promise<User[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockCreatedUsers;
  },

  async deleteUser(uid: string): Promise<{ message: string }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const userIndex = mockCreatedUsers.findIndex(user => user.uid === uid);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    const deletedUser = mockCreatedUsers.splice(userIndex, 1)[0];
    return {
      message: `User ${deletedUser.email} deleted successfully`
    };
  }
};