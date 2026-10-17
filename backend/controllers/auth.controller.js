import bcryptjs from "bcryptjs"
import User from "../models/user.model.js"
import { errorHandler } from "../utils/error.js"
import jwt from "jsonwebtoken"

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body

  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  ) {
    return next(errorHandler(400, "All fields are required"))
  }

  const hashedPassword = bcryptjs.hashSync(password, 10)

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  })

  try {
    await newUser.save()

    res.json("Signup successful")
  } catch (error) {
    next(error)
  }
}

export const signin = async (req, res, next) => {
  const { email, password } = req.body

  if (!email || !password || email === "" || password === "") {
    return next(errorHandler(400, "All fields are required"))
  }

  try {
    const validUser = await User.findOne({ email })

    if (!validUser) {
      return next(errorHandler(404, "User not found"))
    }

    const validPassword = bcryptjs.compareSync(password, validUser.password)

    if (!validPassword) {
      return next(errorHandler(400, "Wrong Credentials"))
    }

    const token = jwt.sign(
      { id: validUser._id, isAdmin: validUser.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    )
    const refreshToken = jwt.sign(
      { id: validUser._id, isAdmin: validUser.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    )

    const { password: pass, ...rest } = validUser._doc

    const isProd = process.env.NODE_ENV === "production"
    const cookieOptions = {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      ...(isProd && { domain: ".newpulse.in" }),
    }

    res
      .status(200)
      .cookie("access_token", token, cookieOptions)
      .cookie("refresh_token", refreshToken, cookieOptions)
      .json(rest)
  } catch (error) {
    next(error)
  }
}

export const google = async (req, res, next) => {
  const { email, name, profilePhotoUrl } = req.body

  try {
    const isProd = process.env.NODE_ENV === "production"
    const cookieOptions = {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      ...(isProd && { domain: ".newpulse.in" }),
    }

    const user = await User.findOne({ email })

    if (user) {
      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      )
      const refreshToken = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
      )

      const { password: pass, ...rest } = user._doc

      return res
        .status(200)
        .cookie("access_token", token, cookieOptions)
        .cookie("refresh_token", refreshToken, cookieOptions)
        .json(rest)
    }

    const generatedPassword =
      Math.random().toString(36).slice(-8) +
      Math.random().toString(36).slice(-8)

    const hashedPassword = bcryptjs.hashSync(generatedPassword, 10)

    // sucide_machine
    const newUser = new User({
      username:
        name.toLowerCase().split(" ").join("") +
        Math.random().toString(9).slice(-4),
      email,
      password: hashedPassword,
      profilePicture: profilePhotoUrl,
    })

    await newUser.save()

    const token = jwt.sign(
      { id: newUser._id, isAdmin: newUser.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    )
    const refreshToken = jwt.sign(
      { id: newUser._id, isAdmin: newUser.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    )

    const { password: pass, ...rest } = newUser._doc

    return res
      .status(200)
      .cookie("access_token", token, cookieOptions)
      .cookie("refresh_token", refreshToken, cookieOptions)
      .json(rest)
  } catch (error) {
    next(error)
  }
}

export const refreshToken = async (req, res, next) => {
  const incomingRefreshToken = req.cookies.refresh_token

  if (!incomingRefreshToken) {
    return next(errorHandler(401, "Refresh token not found"))
  }

  try {
    const decoded = jwt.verify(incomingRefreshToken, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id)

    if (!user) {
      return next(errorHandler(404, "User not found"))
    }

    const newAccessToken = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    )

    const newRefreshToken = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    )

    const isProd = process.env.NODE_ENV === "production"
    const cookieOptions = {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      ...(isProd && { domain: ".newpulse.in" }),
    }

    res
      .status(200)
      .cookie("access_token", newAccessToken, cookieOptions)
      .cookie("refresh_token", newRefreshToken, cookieOptions)
      .json({ success: true })
  } catch (error) {
    const isProd = process.env.NODE_ENV === "production"
    const clearOpts = {
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      ...(isProd && { domain: ".newpulse.in" }),
    }
    res.clearCookie("access_token", clearOpts)
    res.clearCookie("refresh_token", clearOpts)
    return next(errorHandler(401, "Invalid or expired refresh token"))
  }
}
