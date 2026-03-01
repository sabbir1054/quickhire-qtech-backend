import { User } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import config from '../../../config';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { IRefreshTokenResponse } from './auth.interface';
import { AuthServices } from './auth.services';

const userRegistration = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.userRegistration(req.body);
  sendResponse<Partial<User>>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin registered successfully',
    data: result,
  });
});

const userLogin = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.userLogin(req.body);
  const { refreshToken, ...others } = result;

  const cookieOption = {
    secure: config.env === 'production',
    httpOnly: true,
  };

  res.cookie('refreshToken', refreshToken, cookieOption);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Login successfully',
    data: others,
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  const result = await AuthServices.refreshToken(refreshToken);

  const cookieOptions = {
    secure: config.env === 'production',
    httpOnly: true,
  };

  res.cookie('refreshToken', refreshToken, cookieOptions);

  sendResponse<IRefreshTokenResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Token refreshed successfully',
    data: result,
  });
});

const changeUserPassword = catchAsync(async (req: any, res: Response) => {
  const userId = req.user.id;
  const result = await AuthServices.changeUserPassword(userId, req.body);
  sendResponse<Partial<User>>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password changed successfully',
    data: result,
  });
});

export const AuthController = {
  userRegistration,
  userLogin,
  refreshToken,
  changeUserPassword,
};
