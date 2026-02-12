
import rateLimit from "express-rate-limit";
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // max 100 requests per IP
  message: `<h1>Too many requests, please try again later.<h1>`,
});

export default limiter;
