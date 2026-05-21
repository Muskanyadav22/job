import React, { useState, useEffect } from "react";
import { useGlobalContext } from "@/context/globalContext";
import { Card } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { useNavigate } from "react-router-dom";
import Header from "@/Components/Header";
import Footer from "@/Components/Footer";
import toast from "react-hot-toast";
import {
  FileText,
  Upload,
  CheckCircle,
  ExternalLink,
  User,
  Briefcase,
  Mail,
  Pencil,
} from "lucide-react";

function ProfilePage() {
  const { userProfile, uploadResume, updateUserProfile } = useGlobalContext();
  const navigate = useNavigate();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: "",
    bio: "",
    profession: "",
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    if (userProfile?.name) {
      setProfileForm({
        name: userProfile.name || "",
        bio: userProfile.bio || "",
        profession: userProfile.profession || "",
      });
    }
  }, [userProfile]);

  if (!userProfile?.email) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="mb-4 text-gray-600">Please log in to view your profile</p>
          <Button onClick={() => navigate("/login")}>Go to Login</Button>
        </Card>
      </div>
    );
  }

  const { name, email, profession, profilePicture, bio, role, resume } = userProfile;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== "application/pdf") {
        toast.error("Only PDF files are allowed");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      setResumeFile(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      if (file.type !== "application/pdf") {
        toast.error("Only PDF files are allowed");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      setResumeFile(file);
    }
  };

  const handleResumeUpload = async () => {
    if (!resumeFile) {
      toast.error("Please select a PDF file first");
      return;
    }
    setIsUploadingResume(true);
    try {
      await uploadResume(resumeFile);
      toast.success("Resume uploaded successfully!");
      setResumeFile(null);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to upload resume");
    } finally {
      setIsUploadingResume(false);
    }
  };

  const handleProfileSave = async () => {
    setIsSavingProfile(true);
    try {
      await updateUserProfile(profileForm);
      toast.success("Profile updated successfully!");
      setIsEditingProfile(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSavingProfile(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Profile Header */}
        <Card className="p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <img
              src={profilePicture || "/user.png"}
              alt={name || "User"}
              className="w-24 h-24 rounded-full object-cover border-4 border-[#7263f3]/20"
            />
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
                <span
                  className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold self-center
                    ${role === "admin" ? "bg-red-100 text-red-700" : role === "recruiter" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`}
                >
                  {role?.charAt(0).toUpperCase() + role?.slice(1)}
                </span>
              </div>
              <p className="text-gray-600 mb-1 flex items-center justify-center sm:justify-start gap-1">
                <Briefcase className="w-4 h-4" /> {profession}
              </p>
              <p className="text-gray-500 text-sm flex items-center justify-center sm:justify-start gap-1">
                <Mail className="w-4 h-4" /> {email}
              </p>
              {bio && bio !== "No bio provided" && (
                <p className="text-gray-600 text-sm mt-2 italic">"{bio}"</p>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditingProfile(true)}
              className="flex items-center gap-2"
            >
              <Pencil className="w-4 h-4" /> Edit Profile
            </Button>
          </div>
        </Card>

        {/* Edit Profile Form */}
        {isEditingProfile && (
          <Card className="p-6 mb-6 border-2 border-[#7263f3]/30">
            <h2 className="text-lg font-bold mb-4 text-[#7263f3]">Edit Profile</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="Your full name"
                />
              </div>
              <div>
                <Label htmlFor="profession">Profession</Label>
                <Input
                  id="profession"
                  value={profileForm.profession}
                  onChange={(e) => setProfileForm((p) => ({ ...p, profession: e.target.value }))}
                  placeholder="e.g. Frontend Developer"
                />
              </div>
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Input
                  id="bio"
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm((p) => ({ ...p, bio: e.target.value }))}
                  placeholder="A short bio about yourself"
                />
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handleProfileSave}
                  disabled={isSavingProfile}
                  className="bg-[#7263f3] text-white"
                >
                  {isSavingProfile ? "Saving..." : "Save Changes"}
                </Button>
                <Button variant="outline" onClick={() => setIsEditingProfile(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Resume Section — only for jobseekers */}
        {role === "jobseeker" && (
          <Card className="p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-[#7263f3]" />
              <h2 className="text-lg font-bold">Resume</h2>
            </div>

            {/* Current Resume */}
            {resume ? (
              <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg mb-4">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-green-800">Resume uploaded</p>
                  <p className="text-xs text-green-600 truncate">{resume}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <a
                    href={`https://docs.google.com/viewer?url=${encodeURIComponent(resume)}&embedded=true`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[#7263f3] hover:underline"
                  >
                    View
                  </a>
                  <a
                    href={resume}
                    download
                    className="text-xs text-gray-500 hover:underline"
                  >
                    Download
                  </a>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
                <p className="text-sm text-yellow-800 font-medium">⚠️ No resume uploaded</p>
                <p className="text-xs text-yellow-700 mt-1">
                  You need to upload a resume before you can apply to any job.
                </p>
              </div>
            )}

            {/* Upload New Resume */}
            <div
              className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer
                ${dragOver ? "border-[#7263f3] bg-[#7263f3]/5" : "border-gray-300 hover:border-[#7263f3]/50"}`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => document.getElementById("resume-input").click()}
            >
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              {resumeFile ? (
                <div>
                  <p className="text-sm font-medium text-[#7263f3]">{resumeFile.name}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {(resumeFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Drag & drop your resume here, or click to browse
                  </p>
                  <p className="text-xs text-gray-500 mt-1">PDF only • Max 5MB</p>
                </div>
              )}
            </div>

            <input
              id="resume-input"
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />

            <Button
              onClick={handleResumeUpload}
              disabled={!resumeFile || isUploadingResume}
              className="mt-4 w-full bg-[#7263f3] text-white"
            >
              {isUploadingResume ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  Uploading...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  {resume ? "Replace Resume" : "Upload Resume"}
                </span>
              )}
            </Button>
          </Card>
        )}

        <Button variant="outline" onClick={() => navigate(-1)} className="w-full">
          ← Go Back
        </Button>
      </div>

      <Footer />
    </main>
  );
}

export default ProfilePage;
