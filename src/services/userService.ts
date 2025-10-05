import type { CreateUserRequest, CreateUserResponse, User } from '@/types/auth.types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

const getAuthToken = (): string | null => {
  return localStorage.getItem('accessToken');
};

export const userService = {
  async createUser(userData: CreateUserRequest): Promise<CreateUserResponse> {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required. Please log in again.');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/user/adminCreatesTheUser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Access denied. Admin privileges required.');
        }
        if (response.status === 400) {
          throw new Error(data.message || 'Invalid user data. Please check the form and try again.');
        }
        throw new Error(data.message || 'Failed to create user');
      }

      if (!data.success) {
        throw new Error(data.message || 'Failed to create user');
      }

      return {
        user: data.data.user,
        message: data.message || 'User created successfully'
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error. Please check your connection and try again.');
    }
  },

  async getUsers(): Promise<User[]> {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required. Please log in again.');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/user/getAllUser`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Access denied. Admin privileges required.');
        }
        throw new Error(data.message || 'Failed to fetch users');
      }

      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch users');
      }

      return data.data.users || [];
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error. Please check your connection and try again.');
    }
  },

  async deleteUser(uid: string): Promise<{ message: string }> {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required. Please log in again.');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/user/deleteUser/${uid}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Access denied. Admin privileges required.');
        }
        if (response.status === 404) {
          throw new Error('User not found. They may have already been deleted.');
        }
        throw new Error(data.message || 'Failed to delete user');
      }

      if (!data.success) {
        throw new Error(data.message || 'Failed to delete user');
      }

      return {
        message: data.message || 'User deleted successfully'
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error. Please check your connection and try again.');
    }
  }
};
