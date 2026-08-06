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
import GoogleAuth from "@/components/shared/GoogleAuth"

import axios from "axios";
const formSchema = z.object({
  username: z
    .string()
    .min(2, { message: "Username must be atleast 2 characters" }),
  email: z.string().min({ message: "Invalid email address." }),
  password: z
    .string()
    .min(8, { message: "Password must be atleast 8 characters." }),
})

const SignUpForm = () => {
  useSEO({
    title: "Sign Up",
    description: "Create a News18 India account to bookmark, like, comment, and engage with top news stories.",
  })

  const { toast } = useToast()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)

  // 1. Define your form.
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(values) {
    try {
      setLoading(true)
      setErrorMessage(null)

      const res = await axios.post("/api/auth/signup", values, { validateStatus: () => true })

      const data = res.data;

      if (data.success === false) {
        setLoading(false)
        toast({ title: "Sign up failed! Please try again." })

        return setErrorMessage(data.message)
      }

      setLoading(false)

      if (res.status >= 200 && res.status < 300) {
        toast({ title: "Sign up Successful!" })
        navigate("/sign-in")
      }
    } catch (error) {
      setErrorMessage(error.message)
      setLoading(false)
      toast({ title: "Something went wrong!" })
    }
  }

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center p-4 bg-gray-50/50 my-8">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row-reverse border border-gray-100">
        
        {/* Right Side - Image Background (Reverse for variety) */}
        <div className="hidden md:block w-1/2 relative bg-[#0A2240]">
          <img 
            src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1200&auto=format&fit=crop" 
            className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay" 
            alt="News Journal" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A2240] via-[#0A2240]/40 to-transparent flex flex-col justify-end p-10 text-white">
            <h2 className="text-3xl font-black tracking-tight mb-3">Join the Conversation.</h2>
            <p className="text-white/80 text-sm leading-relaxed">Create an account to bookmark articles, engage with top stories, and personalize your news feed.</p>
          </div>
        </div>

        {/* Left Side - Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-14 flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-3xl font-black text-[#0A2240] tracking-tight mb-2">
              Create an Account
            </h2>
            <p className="text-gray-500 text-sm font-medium">
              Welcome to News18 India, please provide your details
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>

                    <FormControl>
                      <Input type="text" placeholder="Username" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

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
                className="bg-[#0A2240] hover:bg-[#E1261C] w-full transition-colors h-11 rounded-lg font-bold shadow-md"
                disabled={loading}
              >
                {loading ? (
                  <span className="animate-pulse">Creating Account...</span>
                ) : (
                  <span>Sign Up</span>
                )}
              </Button>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500 font-semibold">Or continue with</span>
                </div>
              </div>

              <GoogleAuth />
            </form>
          </Form>

          <div className="flex justify-center gap-1 text-sm mt-8 font-medium">
            <span className="text-gray-500">Have an account?</span>
            <Link to="/sign-in" className="text-[#E1261C] hover:underline font-bold transition-all">
              Sign In
            </Link>
          </div>

          {errorMessage && <p className="mt-5 text-[#E1261C] text-sm text-center bg-red-50 p-2 rounded-md font-medium border border-red-100">{errorMessage}</p>}
        </div>
      </div>
    </div>
  )
}

export default SignUpForm
