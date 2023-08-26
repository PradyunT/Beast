"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import Loader from "@/components/Loader";
import AuthenticationMessage from "@/components/AuthenticationMessage";

const gymLat = 33.212060808618546;
const gymLong = -97.15406761440391;
const radius = 1;

const track = () => {
  const { data: session } = useSession();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [trackMode, setTrackMode] = useState(false);
  const {toast} = useToast();

  const handleTrackWorkout = async () => {
    setSubmitting(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async function (position) {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        console.log("Coordinates: " + userLat + userLng)
        const radianConversion = (degrees: number) => degrees * (Math.PI / 180);
        const earthRadiusKm = 6371;

        const lat1 = radianConversion(userLat);
        const lon1 = radianConversion(userLng);
        const lat2 = radianConversion(gymLat);
        const lon2 = radianConversion(gymLong);

        const dLat = lat2 - lat1;
        const dLon = lon2 - lon1;

        const a =
          Math.sin(dLat / 2) ** 2 +
          Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        // Calculate the distance in kilometers
        const distanceKm = earthRadiusKm * c;
        console.log("Your distance to Pohl Rec center in kilometers is: " + distanceKm)
        if (distanceKm < radius) {
          console.log("You are in range of Pohl Rec center");
          console.log(session?.user?.id);
          const res = await fetch(`/api/track/${session?.user?.id}`, {
            method: "POST"
          })
          if (res.status === 200) {
            toast({
              title: "Workout submitted",
              description: "Your workout has been tracked",
            });
          }
          setSubmitting(false);
        }
      });
    } else {
      setError("Unable to get location. Check location permissions.")
    }
  };
    
  useEffect(() => {
    if (session) {
      setLoading(false);
    }
  }, [session]);

  return (
    <>
      {!session ? (
        <AuthenticationMessage to="track your workout" />
      ) : loading ? (
        <>
          <Loader/>
        </>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Track Workout</CardTitle>
            <CardDescription>
              Track your workouts when you're at Pohl Rec Center
            </CardDescription>
          </CardHeader>
          <CardContent>
            {trackMode ? <><h1>Start tracking your workout now (requires location permission).</h1>
            <h1 className="text-red-600">{error}</h1>
            <Button className="mt-4" onClick={() => setTrackMode(true)} disabled={submitting}>
              {submitting ? <>Submitting</> : <>Track Now</>}
            </Button></> : <>Add workout link or Workout tracking features here</>}
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default track;
