import ConflictException from '../errors/conflictHandler';
import NotFoundHandler from '../errors/NotFoundHandler';
import { User } from '../models/user.model';
// import { AppError } from '../middleware/errorHandler.middleware';
import { signAccessToken, signRefreshToken } from '../utils/jwt.utils';

interface RegisterDTO {
  name: string;
  email: string;
  password: string;
}

interface LoginDTO {
  email: string;
  password: string;
}

export const registerUser = async (dto: RegisterDTO) => {
  const existing = await User.findOne({ email: dto.email });
  if (existing) throw new ConflictException('Email already registered', 409);

  const user = await User.create(dto);

  const payload = { id: user._id.toString(), email: user.email, role: user.role };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  // Store hashed refresh token
  user.refreshToken = refreshToken;
  await user.save();

  return { user, accessToken, refreshToken };
};

export const loginUser = async (dto: LoginDTO) => {
  const user = await User.findOne({ email: dto.email }).select('+password');
  if (!user) throw new NotFoundHandler('Invalid email or password', 401);

  const isMatch = await user.comparePassword(dto.password);
  if (!isMatch) throw new NotFoundHandler('Invalid email or password', 401);

  const payload = { id: user._id.toString(), email: user.email, role: user.role };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  user.refreshToken = refreshToken;
  await user.save();

  return { user, accessToken, refreshToken };
};