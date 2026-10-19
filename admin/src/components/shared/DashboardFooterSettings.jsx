import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaYoutube } from "react-icons/fa";

const DashboardFooterSettings = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    about_text: "",
    contact_address: "",
    contact_email: "",
    contact_phone: "",
    social_facebook: "",
    social_twitter: "",
    social_linkedin: "",
    social_instagram: "",
    social_youtube: "",
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await axios.get("/api/settings/all");
      if (res.data.success && res.data.settings) {
        const settingsMap = {};
        res.data.settings.forEach(s => {
          settingsMap[s.key] = s.value;
        });
        setFormData((prev) => ({
          ...prev,
          ...settingsMap,
        }));
      }
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to fetch settings", variant: "destructive" });
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Save all keys one by one
      const keys = Object.keys(formData);
      for (const key of keys) {
        await axios.post(`/api/settings/${key}`, { value: formData[key] }, { withCredentials: true });
      }
      toast({ title: "Success", description: "Footer settings updated successfully" });
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to update settings", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 w-full h-[calc(100vh-64px)] overflow-y-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Footer Content Settings</h1>
      
      <form onSubmit={handleSave} className="bg-white p-6 rounded-lg shadow-md max-w-4xl space-y-8">
        
        {/* About Section */}
        <div>
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">About Section</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-700">About Text</label>
              <Textarea
                id="about_text"
                placeholder="Brief description about the website..."
                value={formData.about_text || ""}
                onChange={handleChange}
                rows={4}
              />
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div>
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">Contact Info</h2>
          <div className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2 mt-4">
              <label className="block text-sm font-semibold mb-1 text-gray-700">Address</label>
              <Input
                id="contact_address"
                placeholder="e.g. Express Towers, Nariman Point, Mumbai, India"
                value={formData.contact_address || ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-700">Email</label>
              <Input
                id="contact_email"
                type="email"
                placeholder="e.g. contact@newpulse.in"
                value={formData.contact_email || ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-700">Phone</label>
              <Input
                id="contact_phone"
                placeholder="e.g. +91 22 4001 9000"
                value={formData.contact_phone || ""}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div>
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">Social Links</h2>
          <div className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mt-4">
              <label className="flex items-center text-sm font-semibold mb-1 text-gray-700"><FaFacebook className="mr-2 text-blue-600"/> Facebook URL</label>
              <Input
                id="social_facebook"
                placeholder="https://facebook.com/..."
                value={formData.social_facebook || ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="flex items-center text-sm font-semibold mb-1 text-gray-700"><FaTwitter className="mr-2 text-blue-400"/> Twitter URL</label>
              <Input
                id="social_twitter"
                placeholder="https://twitter.com/..."
                value={formData.social_twitter || ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="flex items-center text-sm font-semibold mb-1 text-gray-700"><FaLinkedin className="mr-2 text-blue-700"/> LinkedIn URL</label>
              <Input
                id="social_linkedin"
                placeholder="https://linkedin.com/..."
                value={formData.social_linkedin || ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="flex items-center text-sm font-semibold mb-1 text-gray-700"><FaInstagram className="mr-2 text-pink-600"/> Instagram URL</label>
              <Input
                id="social_instagram"
                placeholder="https://instagram.com/..."
                value={formData.social_instagram || ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="flex items-center text-sm font-semibold mb-1 text-gray-700"><FaYoutube className="mr-2 text-red-600"/> YouTube URL</label>
              <Input
                id="social_youtube"
                placeholder="https://youtube.com/..."
                value={formData.social_youtube || ""}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <Button type="submit" disabled={loading} className="w-full md:w-auto">
          {loading ? "Saving..." : "Save Footer Settings"}
        </Button>

      </form>
    </div>
  );
};

export default DashboardFooterSettings;
