import React from "react"
import usePageSEO from "@/hooks/usePageSEO"

const About = () => {
  usePageSEO("about", {
    title: "About Us | News18 India",
    description: "Learn more about the team behind News18 India, our mission to deliver fast and reliable news reporting, and our core editorial values.",
    keywords: "about news18, news team, news18 india mission, journalism values"
  })

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      {/* Content Section */}
      <div className="w-full max-w-6xl px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left */}
          <div>
            <h1 className="text-3xl font-extrabold text-[#0A2240] mb-4">
              Who We Are
            </h1>

            <p className="text-gray-600 leading-relaxed">
              We are a passionate team committed to driving change through
              innovation and collaboration. Our platform is designed to empower
              individuals and organizations to unlock their true potential.
            </p>
          </div>

          {/* Right (image) */}
          <div className="relative">
            <img
              src="https://images.pexels.com/photos/723072/pexels-photo-723072.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt=""
              className="rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
      </div>


    </div>
  )
}

export default About
