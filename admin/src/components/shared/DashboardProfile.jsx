import React from "react"
import { FaFacebook, FaTwitter, FaInstagram, FaWhatsapp } from "react-icons/fa"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "../ui/alert-dialog"
import { useDashboardProfile } from "@/hooks/useDashboardProfile"

const DashboardProfile = () => {
  const {
    currentUser,
    error,
    loading,
    profilePicRef,
    imageFileUrl,
    handleImageChange,
    handleChange,
    handleSubmit,
    handleDeleteUser,
    handleSignout,
  } = useDashboardProfile()

  const socialIcons = {
    facebook: <FaFacebook className="text-blue-600 text-2xl" />,
    twitter: <FaTwitter className="text-blue-400 text-2xl" />,
    instagram: <FaInstagram className="text-pink-600 text-2xl" />,
    whatsapp: <FaWhatsapp className="text-green-500 text-2xl" />
  }

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Update Your Profile</h1>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input type="file" accept="image/*" hidden ref={profilePicRef} onChange={handleImageChange} />
        <div className="w-32 h-32 self-center cursor-pointer overflow-hidden">
          <img src={imageFileUrl || currentUser.profilePicture} alt="" className="rounded-full w-full h-full object-cover border-8 border-gray-300" onClick={() => profilePicRef.current.click()} />
        </div>

        <Input type="text" id="username" placeholder="username" defaultValue={currentUser.username} className="h-12 border border-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0" onChange={handleChange} />
        <Input type="email" id="email" placeholder="email" defaultValue={currentUser.email} className="h-12 border border-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0" onChange={handleChange} />
        <Input type="password" id="password" placeholder="password" className="h-12 border border-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0" onChange={handleChange} />

        <div className="mt-4 border-t pt-6 border-gray-300">
          <h3 className="text-lg font-semibold mb-5 text-gray-800">Social Media Links</h3>
          {['facebook', 'twitter', 'instagram', 'whatsapp'].map(platform => (
            <div key={platform} className="flex items-center gap-3 md:gap-4 mb-4">
              <div className="w-8 flex justify-center shrink-0">
                {socialIcons[platform]}
              </div>
              <Input
                type="text"
                id={`social_${platform}_url`}
                placeholder={`${platform.charAt(0).toUpperCase() + platform.slice(1)} URL/Number`}
                defaultValue={currentUser?.socialLinks?.[platform]?.url || ""}
                className="flex-1 h-12 border border-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0"
                onChange={handleChange}
              />
              <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-gray-700 whitespace-nowrap shrink-0">
                <input
                  type="checkbox"
                  id={`social_${platform}_visible`}
                  defaultChecked={currentUser?.socialLinks?.[platform]?.visible ?? true}
                  onChange={handleChange}
                  className="w-5 h-5 cursor-pointer accent-[#E1261C] rounded"
                />
                Visible
              </label>
            </div>
          ))}
        </div>

        <Button type="submit" className="h-12 bg-green-600" disabled={loading}>{loading ? "Loading..." : "Update Profile"}</Button>
      </form>

      <div className="text-red-500 flex justify-between mt-5">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" className="cursor-pointer">Delete Account</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>This action cannot be undone. This will permanently delete your account and remove your data from our servers.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction className="bg-red-600" onClick={handleDeleteUser}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Button variant="ghost" className="cursor-pointer" onClick={handleSignout}>Sign Out</Button>
      </div>

      {error && <p className="text-red-600 text-center mt-3">{error}</p>}
    </div>
  )
}

export default DashboardProfile
