import bcrypt from "bcryptjs";
import httpStatus from "http-status";

import { prisma } from "../../lib/prisma.js";
import config from "../../config/index.js";
import AppError from "../../errors/AppError.js";
import { IChangePassword, IGoogleLoginPayload, ILoginUser, IUpdateProfile, IUser, TJwtPayload } from "./auth.interface.js";
import { jwtUtils } from "../../utils/jwt.js";
import { TokenPayload } from "google-auth-library";
import { googleClient } from "../../lib/googleAuth.js";
import { AuthProvider, UserRole, UserStatus } from "@prisma/client";

const registerUserIntoDB = async (payload: IUser) => {

  //admin role is not eligible during registration
  if (payload.role === "ADMIN") {
  throw new AppError(
    httpStatus.FORBIDDEN,
    "You are not allowed to register as an admin."
  );
}
  // Check if user already exists
  const isUserExists = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
    select: {
      id: true,
    },
  });

  if (isUserExists) {
    throw new AppError(
      httpStatus.CONFLICT,
      "User already exists with this email"
    );
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(
    payload.password,
    Number(config.bcrypt_salt_rounds)
  );

  // Create user
  const user = await prisma.user.create({
    data: {
      ...payload,
      password: hashedPassword,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      avatar: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
};


const loginUser = async (payload: ILoginUser) => {
  const email = payload.email.trim().toLowerCase();
  const { password } = payload;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (user.status === UserStatus.SUSPENDED) {
    throw new AppError(httpStatus.FORBIDDEN, "Your account has been blocked.");
  }

  // Google-only account
  if (!user.password && user.googleId) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "This account was registered with Google. Please login with Google.",
    );
  }

  // No password
  if (!user.password) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Password login is not available for this account.",
    );
  }

  // Compare password
  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid email or password");
  }

  // Update last login time
  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      lastLoginAt: new Date(),
    },
  });

  // JWT payload
  const jwtPayload: TJwtPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in as any,
  );

  const refreshToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_refresh_secret,
    config.jwt_refresh_expires_in as any,
  );

  return {
    accessToken,
    refreshToken,
  };
};


const googleLogin = async (payload: IGoogleLoginPayload) => {
  // 1. Verify Google ID Token
  let googleIdTokenPayload: TokenPayload | undefined;

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: payload.idToken,
      audience: config.google_client_id,
    });

    googleIdTokenPayload = ticket.getPayload();
  } catch (error) {
    console.error("Google ID Token Verification Failed:", error);

    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "Invalid or expired Google ID token.",
    );
  }

  if (!googleIdTokenPayload) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "Invalid or expired Google ID token.",
    );
  }

  const {
    sub: googleId,
    email,
    name,
    picture,
    email_verified,
  } = googleIdTokenPayload;

  // 2. Basic Google payload validation
  if (!googleId) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Google ID not found.");
  }

  if (!email) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Google account email not found.",
    );
  }

  if (!name) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Google account name not found.",
    );
  }

  if (!email_verified) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "Google email is not verified.",
    );
  }

  // 3. Find user by Google ID
  let user = await prisma.user.findUnique({
    where: {
      googleId,
    },
  });

  // 4. If Google account is not linked yet
  if (!user) {
    // Find existing credential user by email
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    // 5. Existing account found
    if (existingUser) {
      // Check account status
      if (existingUser.status === UserStatus.SUSPENDED) {
        throw new AppError(
          httpStatus.FORBIDDEN,
          "Your account has been blocked.",
        );
      }

      // Link Google account with existing user
      user = await prisma.user.update({
        where: {
          id: existingUser.id,
        },
        data: {
          googleId,
          avatar: existingUser.avatar ?? picture ?? null,
          // Keep CREDENTIAL if this account already has password
          // because this user can use both credential and Google login.
        },
      });
    } else {
      // 6. Create new Google user
      user = await prisma.user.create({
        data: {
          name,
          email,
          password: null,
          googleId,
          authProvider: AuthProvider.GOOGLE,
          role: UserRole.CUSTOMER,
          status: UserStatus.ACTIVE,
          avatar: picture ?? null,
        },
      });
    }
  }

  // 7. Check user status
  if (user.status === UserStatus.SUSPENDED) {
    throw new AppError(httpStatus.FORBIDDEN, "Your account has been blocked.");
  }

  // 8. Update last login
  user = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      lastLoginAt: new Date(),
    },
  });

  // 9. Create JWT payload
  const jwtPayload: TJwtPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  // 10. Create access token
  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in as any,
  );

  // 11. Create refresh token
  const refreshToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_refresh_secret,
    config.jwt_refresh_expires_in as any,
  );

  return {
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (token: string) => {
  const decoded = jwtUtils.verifyToken(
    token,
    config.jwt_refresh_secret
  ) as TJwtPayload;

  const user = await prisma.user.findUnique({
    where: {
      id: decoded.userId,
    },
  });

  if (!user) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "User not found"
    );
  }

  if (user.status === "SUSPENDED") {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Your account has been blocked."
    );
  }

  const jwtPayload:TJwtPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in as any
  );

  return accessToken;
  ;
};

const getMe = async (userId:string)=>{

    return prisma.user.findUniqueOrThrow({
        where:{
            id:userId
        },
        select:{
            id:true,
            name:true,
            email:true,
            phone:true,
            avatar:true,
            role:true,
            status:true,
            createdAt:true,
            lastLoginAt:true
        }
    })

}

const updateProfile = async (
  userId: string,
  payload: IUpdateProfile
) => {
 

  const updatedUser = await prisma.user.update({
  where: {
    id: userId,
  },
  data: payload,
  select: {
    id: true,
    name: true,
    email: true,
    phone: true,
    avatar: true,
    address: true,
    city: true,
    role: true,
    status: true,
    lastLoginAt: true,
    createdAt: true,
    updatedAt: true,
  },
});

return updatedUser;
};


const changePassword = async (
  userId: string,
  payload: IChangePassword
) => {
  const { oldPassword, newPassword } = payload;

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
  });

  if (!user.password){
    throw new AppError(httpStatus.BAD_REQUEST,"User Previous Password is required");
  }
    const isMatched = await bcrypt.compare(oldPassword, user.password);

  if (!isMatched) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Old password is incorrect."
    );
  }

  const hashedPassword = await bcrypt.hash(
    newPassword,
    Number(config.bcrypt_salt_rounds)
  );

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      password: hashedPassword,
      passwordChangedAt:new Date()
    },
  });

  return null;
};

export const authService = {
  registerUserIntoDB,
  loginUser,
  refreshToken,
  getMe,
  updateProfile,
  changePassword,
  googleLogin
};