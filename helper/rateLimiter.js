import { rateLimit } from "express-rate-limit";
export const LimitRequest = (limit) => {
  return rateLimit({
    windowMs: 15 * 60 * 1000,
    limit,
    standardHeaders: true,
    legacyHeaders: false,
    ipv6Subnet: 56,
    handler: (req, res) => {
      res.status(429).json({
        status: 429,
        success: false,
        message: "Too many attempts. Retry after 15 minutes",
      });
    },
  });
};
