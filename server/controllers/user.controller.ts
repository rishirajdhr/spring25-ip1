import express, { Response, Router } from 'express';
import { UserRequest, User, UserCredentials, UserByUsernameRequest } from '../types/types';
import {
  deleteUserByUsername,
  getUserByUsername,
  loginUser,
  saveUser,
  updateUser,
} from '../services/user.service';

const userController = () => {
  const router: Router = express.Router();

  /**
   * Validates that the request body contains all required fields for a user.
   * @param req The incoming request containing user data.
   * @returns `true` if the body contains valid user fields; otherwise, `false`.
   */
  const isUserBodyValid = (req: UserRequest): boolean => !!req.body.username && !!req.body.password;

  /**
   * Handles the creation of a new user account.
   * @param req The request containing username and password in the body.
   * @param res The response, either returning the created user or an error.
   * @returns A promise resolving to void.
   */
  const createUser = async (req: UserRequest, res: Response): Promise<void> => {
    if (!isUserBodyValid(req)) {
      res.status(400).send('Invalid user body');
      return;
    }
    const userCredentials: UserCredentials = req.body;
    const newUser: User = { ...userCredentials, dateJoined: new Date() };
    try {
      const result = await saveUser(newUser);
      if ('error' in result) {
        throw new Error(result.error);
      }
      res.json(result);
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error when saving user: ${err.message}`);
      } else {
        res.status(500).send(`Error when saving user`);
      }
    }
  };

  /**
   * Handles user login by validating credentials.
   * @param req The request containing username and password in the body.
   * @param res The response, either returning the user or an error.
   * @returns A promise resolving to void.
   */
  const userLogin = async (req: UserRequest, res: Response): Promise<void> => {
    if (!isUserBodyValid(req)) {
      res.status(400).send('Invalid user body');
      return;
    }
    const userCredentials: UserCredentials = req.body;
    try {
      const result = await loginUser(userCredentials);
      if ('error' in result) {
        throw new Error(result.error);
      }
      res.json(result);
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error when logging in user: ${err.message}`);
      } else {
        res.status(500).send(`Error when logging in user`);
      }
    }
  };

  /**
   * Retrieves a user by their username.
   * @param req The request containing the username as a route parameter.
   * @param res The response, either returning the user or an error.
   * @returns A promise resolving to void.
   */
  const getUser = async (req: UserByUsernameRequest, res: Response): Promise<void> => {
    try {
      const result = await getUserByUsername(req.params.username);
      if ('error' in result) {
        throw new Error(result.error);
      }
      res.json(result);
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error when retrieving user: ${err.message}`);
      } else {
        res.status(500).send(`Error when retrieving user`);
      }
    }
  };

  /**
   * Deletes a user by their username.
   * @param req The request containing the username as a route parameter.
   * @param res The response, either the successfully deleted user object or returning an error.
   * @returns A promise resolving to void.
   */
  const deleteUser = async (req: UserByUsernameRequest, res: Response): Promise<void> => {
    try {
      const result = await deleteUserByUsername(req.params.username);
      if ('error' in result) {
        throw new Error(result.error);
      }
      res.json(result);
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error when deleting user: ${err.message}`);
      } else {
        res.status(500).send(`Error when deleting user`);
      }
    }
  };

  /**
   * Resets a user's password.
   * @param req The request containing the username and new password in the body.
   * @param res The response, either the successfully updated user object or returning an error.
   * @returns A promise resolving to void.
   */
  const resetPassword = async (req: UserRequest, res: Response): Promise<void> => {
    if (!isUserBodyValid(req)) {
      res.status(400).send('Invalid user body');
      return;
    }
    const { username, password }: UserCredentials = req.body;
    const updates = { password };
    try {
      const result = await updateUser(username, updates);
      if ('error' in result) {
        throw new Error(result.error);
      }
      res.json(result);
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error when resetting password: ${err.message}`);
      } else {
        res.status(500).send(`Error when resetting password`);
      }
    }
  };

  // Add appropriate HTTP verbs and endpoints to the router
  router.post('/signup', createUser);
  router.get('/getUser/:username', getUser);
  router.post('/login', userLogin);
  router.patch('/resetPassword', resetPassword);
  router.delete('/deleteUser/:username', deleteUser);

  return router;
};

export default userController;
