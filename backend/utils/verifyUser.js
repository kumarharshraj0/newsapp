import { errorHandler } from "./error.js"
import jwt from "jsonwebtoken"

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token

  if (!token) {
    return next(errorHandler(401, "Unauthorized"))
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (!err) {
      req.user = user
      return next()
    }

    // If access token is expired or invalid, attempt silent refresh using refresh_token
    const refreshToken = req.cookies.refresh_token
    if (!refreshToken) {
      return next(errorHandler(401, "Session expired, please login again"))
    }

    jwt.verify(refreshToken, process.env.JWT_SECRET, (refreshErr, refreshUser) => {
      if (refreshErr) {
        return next(errorHandler(401, "Session expired, please login again"))
      }

      // Generate fresh access token and attach to cookie
      const newAccessToken = jwt.sign(
        { id: refreshUser.id, isAdmin: refreshUser.isAdmin },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      )

      res.cookie("access_token", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      })

      req.user = refreshUser
      next()
    })
  })
}

export const isAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return next(errorHandler(403, "Forbidden: Admin access required"))
  }
  next()
}
