"use client";
import React, { useEffect, useState } from "react";
import { useGlobalContext } from "@/context/globalContext";
import { Card } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { userProfile } = useGlobalContext();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (userProfile?.email) {
      setIsLoading(false);
    }
  }, [userProfile]);

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!userProfile?.email) {
    return (
      <div className="p-8">
        <p>Please log in to view your profile</p>
        <Button onClick={() => router.push("/")}>Go Home</Button>
      </div>
    );
  }

  const { name, email, profession, profilePicture } = userProfile;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <Card className="p-8">
          <div className="flex flex-col items-center text-center mb-8">
            <Image
              src={profilePicture || "/user.png"}
              alt={name || "User"}
              width={128}
              height={128}
              className="rounded-full mb-4"
            />
            <h1 className="text-3xl font-bold mb-2">{name}</h1>
            <p className="text-gray-600 mb-2">{profession}</p>
            <p className="text-gray-600">{email}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-gray-100 p-4 rounded">
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-semibold">{email}</p>
            </div>
            <div className="bg-gray-100 p-4 rounded">
              <p className="text-sm text-gray-600">Profession</p>
              <p className="font-semibold">{profession}</p>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              onClick={() => router.push("/")}
              variant="outline"
              className="flex-1"
            >
              Back to Home
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
