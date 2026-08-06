import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { FaTrash, FaPlus } from "react-icons/fa";

const DashboardTags = () => {
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const res = await axios.get("/api/settings/trending_tags");
      if (res.data.success && res.data.setting) {
        setTags(res.data.setting.value || []);
      }
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to fetch tags", variant: "destructive" });
    }
  };

  const saveTags = async (updatedTags) => {
    setLoading(true);
    try {
      const res = await axios.post(
        "/api/settings/trending_tags",
        { value: updatedTags },
        { withCredentials: true }
      );
      if (res.data.success) {
        setTags(updatedTags);
        toast({ title: "Success", description: "Tags updated successfully" });
      }
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: error.response?.data?.message || "Failed to update tags", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleAddTag = () => {
    if (!newTag.trim()) return;
    const tag = newTag.trim();
    if (tags.includes(tag)) {
      toast({ title: "Error", description: "Tag already exists", variant: "destructive" });
      return;
    }
    const updatedTags = [...tags, tag];
    saveTags(updatedTags);
    setNewTag("");
  };

  const handleRemoveTag = (tagToRemove) => {
    const updatedTags = tags.filter((tag) => tag !== tagToRemove);
    saveTags(updatedTags);
  };

  return (
    <div className="p-6 w-full h-[calc(100vh-64px)] overflow-y-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Manage Trending Tags</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl">
        <div className="flex gap-4 mb-6">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="e.g. Cricket"
            className="flex-1"
            onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
          />
          <Button onClick={handleAddTag} disabled={loading || !newTag.trim()}>
            <FaPlus className="mr-2" /> Add Tag
          </Button>
        </div>

        {tags.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No trending tags added yet.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {tags.map((tag, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 border rounded hover:bg-gray-100 transition-colors">
                <span className="font-semibold text-gray-700">#{tag}</span>
                <Button variant="destructive" size="sm" onClick={() => handleRemoveTag(tag)} disabled={loading}>
                  <FaTrash />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardTags;
