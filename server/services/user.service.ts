import UserModel from '../models/users.model';
import { SafeUser, User, UserCredentials, UserResponse } from '../types/types';

/**
 * Saves a new user to the database.
 *
 * @param {User} user - The user object to be saved, containing user details like username, password, etc.
 * @returns {Promise<UserResponse>} - Resolves with the saved user object (without the password) or an error message.
 */
export const saveUser = async (user: User): Promise<UserResponse> => {
  try {
    const existingUser = await UserModel.findOne({ username: user.username });
    if (existingUser != null) {
      return { error: `Username ${user.username} already exists` };
    }
    const result = await UserModel.create(user);
    const newUser: SafeUser = {
      _id: result._id,
      username: result.username,
      dateJoined: result.dateJoined,
    };
    return newUser;
  } catch (error) {
    return { error: 'Error when saving a user' };
  }
};

/**
 * Retrieves a user from the database by their username.
 *
 * @param {string} username - The username of the user to find.
 * @returns {Promise<UserResponse>} - Resolves with the found user object (without the password) or an error message.
 */
export const getUserByUsername = async (username: string): Promise<UserResponse> => {
  try {
    const result = await UserModel.findOne({ username });
    if (result === null) {
      return { error: `No user found with username: ${username}` };
    }
    const user: SafeUser = {
      _id: result._id,
      username: result.username,
      dateJoined: result.dateJoined,
    };
    return user;
  } catch (error) {
    return { error: 'Error when retrieving user' };
  }
};

/**
 * Authenticates a user by verifying their username and password.
 *
 * @param {UserCredentials} loginCredentials - An object containing the username and password.
 * @returns {Promise<UserResponse>} - Resolves with the authenticated user object (without the password) or an error message.
 */
export const loginUser = async (loginCredentials: UserCredentials): Promise<UserResponse> => {
  const { username, password } = loginCredentials;
  try {
    const result = await UserModel.findOne({ username });
    if (result === null) {
      return { error: `No user found with username: ${username}` };
    }
    if (result.password !== password) {
      return { error: 'Incorrect password' };
    }
    const user: SafeUser = {
      _id: result._id,
      username: result.username,
      dateJoined: result.dateJoined,
    };
    return user;
  } catch (error) {
    return { error: 'Error when logging in user' };
  }
};

/**
 * Deletes a user from the database by their username.
 *
 * @param {string} username - The username of the user to delete.
 * @returns {Promise<UserResponse>} - Resolves with the deleted user object (without the password) or an error message.
 */
export const deleteUserByUsername = async (username: string): Promise<UserResponse> =>
  // TODO: Task 1 - Implement the deleteUserByUsername function. Refer to other service files for guidance.
  ({ error: 'Not implemented' });

/**
 * Updates user information in the database.
 *
 * @param {string} username - The username of the user to update.
 * @param {Partial<User>} updates - An object containing the fields to update and their new values.
 * @returns {Promise<UserResponse>} - Resolves with the updated user object (without the password) or an error message.
 */
export const updateUser = async (
  username: string,
  updates: Partial<User>,
): Promise<UserResponse> => {
  try {
    const result = await UserModel.findOneAndUpdate({ username }, updates, { new: true });
    if (result === null) {
      return { error: `No user found with username: ${username}` };
    }
    const user: SafeUser = {
      _id: result._id,
      username: result.username,
      dateJoined: result.dateJoined,
    };
    return user;
  } catch (error) {
    return { error: 'Error when updating user' };
  }
};
