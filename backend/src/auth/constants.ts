export const jwtConstants = {
  secret: process.env.JWT_SECRET_KEY,
  expireTokenTime: process.env.TOKEN_EXPIRE_TIME,
  refreshSecret: process.env.JWT_SECRET_REFRESH_KEY,
  expireRefreshTokenTime: process.env.TOKEN_REFRESH_EXPIRE_TIME,
};
