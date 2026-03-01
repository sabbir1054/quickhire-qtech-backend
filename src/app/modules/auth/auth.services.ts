/* eslint-disable no-unused-vars */
import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';

import { validateEmail } from '../../../helpers/checkEmailFormateValidity';
import {
  encryptPassword,
  isPasswordMatched,
} from '../../../helpers/encryption';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import prisma from '../../../shared/prisma';
import {
  IPasswordChange,
  IRefreshTokenResponse,
  IUser,
  IUserLogin,
} from './auth.interface';

const userRegistration = async (payload: IUser) => {
  const { password, ...othersData } = payload;

  // validate email format
  if (!validateEmail(payload.email)) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Please provide a valid email address',
    );
  }

  // check if admin already exists with this email
  const isUserExist = await prisma.user.findUnique({
    where: { email: payload.email },
  });
  if (isUserExist) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Admin already exists with this email',
    );
  }

  // encrypt password
  const encryptedPassword = await encryptPassword(password);

  // create admin user
  const result = await prisma.user.create({
    data: {
      ...othersData,
      password: encryptedPassword,
      role: 'ADMIN',
    },
    select: {
      id: true,
      role: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return result;
};

const userLogin = async (payload: IUserLogin) => {
  const { email, password } = payload;

  // check user exist
  const isUserExist = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      role: true,
      name: true,
      email: true,
      password: true,
    },
  });
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Admin not found');
  }

  // only ADMIN can login
  if (isUserExist.role !== 'ADMIN') {
    throw new ApiError(httpStatus.FORBIDDEN, 'Only admin can login');
  }

  const checkPassword = await isPasswordMatched(password, isUserExist.password);
  if (!checkPassword) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect');
  }

  const { id, role } = isUserExist;
  const accessToken = jwtHelpers.createToken(
    { id, role, email },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string,
  );

  const refreshToken = jwtHelpers.createToken(
    { id, role, email },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string,
  );

  return { accessToken, refreshToken };
};

const refreshToken = async (token: string): Promise<IRefreshTokenResponse> => {
  let verifiedToken = null;

  try {
    verifiedToken = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_secret as Secret,
    );
  } catch (error) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid Refresh Token');
  }

  const { id } = verifiedToken;
  const isUserExist = await prisma.user.findUnique({
    where: { id },
  });

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  const newAccessToken = jwtHelpers.createToken(
    { id: isUserExist.id, role: isUserExist.role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string,
  );

  return { accessToken: newAccessToken };
};

const changeUserPassword = async (userId: string, payload: IPasswordChange) => {
  const isUserExist = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      password: true,
    },
  });

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const checkPassword = await isPasswordMatched(
    payload.oldPassword,
    isUserExist.password,
  );
  if (!checkPassword) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Old password is incorrect');
  }

  const encryptedNewPassword = await encryptPassword(payload.newPassword);

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { password: encryptedNewPassword },
    select: {
      id: true,
      role: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return updatedUser;
};

export const AuthServices = {
  userRegistration,
  userLogin,
  refreshToken,
  changeUserPassword,
};
