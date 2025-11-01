export default () => ({
  port: process.env.PORT || 1616,
  database: {
    URL: process.env.DATABASE_URL,
  },
  jwtSecret: process.env.JWT_SECRET
});