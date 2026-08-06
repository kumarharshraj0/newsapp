import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import useSEO from "@/hooks/useSEO"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { useDispatch, useSelector } from "react-redux"
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "@/redux/user/userSlice"
import GoogleAuth from "@/components/shared/GoogleAuth"

import axios from "axios";
const formSchema = z.object({
  email: z.string().min({ message: "Invalid email address." }),
  password: z
    .string()
    .min(8, { message: "Password must be atleast 8 characters." }),
})

const SignInForm = () => {
  useSEO({
    title: "Sign In",
    description: "Sign in to your News18 India account to read articles, like, comment, and engage with the latest updates.",
  })

  const { toast } = useToast()
  const navigate = useNavigate()

  const dispatch = useDispatch()

  const { loading, error: errorMessage } = useSelector((state) => state.user)

  // 1. Define your form.
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(values) {
    try {
      dispatch(signInStart())

      const res = await axios.post("/api/auth/signin", values, { validateStatus: () => true })

      const data = res.data;

      if (data.success === false) {
        toast({ title: "Sign in failed! Please try again." })

        dispatch(signInFailure(data.message))
      }

      if (res.status >= 200 && res.status < 300) {
        dispatch(signInSuccess(data))

        toast({ title: "Sign in Successful!" })
        navigate("/")
      }
    } catch (error) {
      toast({ title: "Something went wrong!" })
      dispatch(signInFailure(error.message))
    }
  }

  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl sm:max-w-5xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* left */}
        <div className="flex-1">
          <Link
            to={"/"}
            className="flex items-center font-extrabold tracking-tighter text-3xl select-none"
          >
            <span className="bg-[#E1261C] text-white px-2.5 py-0.5 rounded-l font-black">NEWS</span>
            <span className="bg-[#0A2240] text-white px-2.5 py-0.5 rounded-r border-l border-gray-200 font-black">18</span>
            <span className="text-[#0A2240] ml-2 font-black italic tracking-tight">INDIA</span>
          </Link>

          <h2 className="text-[24px] md:text-[30px] font-bold leading-[140%] tracking-tighter pt-5 sm:pt-12">
            Sign in to your account.
          </h2>

          <p className="text-slate-500 text-[14px] font-medium leading-[140%] md:text-[16px] md:font-normal mt-2">
            Welcome back, Please provide your details
          </p>
        </div>

        {/* right */}
        <div className="flex-1">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>

                    <FormControl>
                      <Input
                        type="email"
                        placeholder="xyz@email.com"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>

                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Password"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="bg-blue-500 w-full"
                disabled={loading}
              >
                {loading ? (
                  <span className="animate-pulse">Loading...</span>
                ) : (
                  <span>Sign In</span>
                )}
              </Button>

              <GoogleAuth />
            </form>
          </Form>

          <div className="flex gap-2 text-sm mt-5">
            <span>Don't have an account?</span>

            <Link to="/sign-up" className="text-blue-500">
              Sign Up
            </Link>
          </div>

          {errorMessage && <p className="mt-5 text-red-500">{errorMessage}</p>}
        </div>
      </div>
    </div>
  )
}

export default SignInForm
