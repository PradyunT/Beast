"use client";

import { useEffect, useState } from "react";
import Loader from "@/components/Loader";
import ProfileProps from "@/types/ProfileProps";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { user } from "@/types/user";

const Leaderboard = () => {
  const [users, setUsers] = useState<ProfileProps[] | null>(null);

  const getUsers = async () => {
    const data = await fetch("/api/users/getusers", {
      method: "GET",
    });
    const users = await data.json();

    // Filter users by whether or not they have a consistency goal
    const usersWithConsistencyGoal = users.filter((user: user) =>
      user.goals.some((goal) => goal.type === "consistency")
    );

    const sortedUsers = usersWithConsistencyGoal.sort(
      (a: ProfileProps, b: ProfileProps) => {
        // Calculate progress for each user
        const progressA =
          a.goals.find((goal) => goal.type === "consistency")?.progress || 0;
        const progressB =
          b.goals.find((goal) => goal.type === "consistency")?.progress || 0;

        // Calculate frequency for each user
        const frequencyA =
          a.goals.find((goal) => goal.type === "consistency")?.consistency
            .frequency || 0;
        const frequencyB =
          b.goals.find((goal) => goal.type === "consistency")?.consistency
            .frequency || 0;

        // Sort in descending order by progress, prioritizing higher progress
        if (progressA === progressB) {
          return frequencyB - frequencyA; // Use frequency as a tiebreaker if progress is the same
        } else {
          return progressB - progressA; // Sort by progress first, then frequency
        }
      }
    );

    setUsers(sortedUsers);
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <>
      {!users ? (
        <Loader />
      ) : (
        <section id="leaderboard">
          <h1 className="heading mb-4">Leaderboard</h1>
          <Table>
            <TableCaption>The consistency leaderboard</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Avatar</TableHead>
                <TableHead className="">Name</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Consistency</TableHead>
                <TableHead># of Workouts</TableHead>
                <TableHead>Rank</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user: ProfileProps, i) => (
                <TableRow key={user._id}>
                  <TableCell>
                    <Avatar>
                      <AvatarImage src={user.image} />
                      <AvatarFallback>
                        {user.displayName.slice(0, 1)}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell>{user.displayName}</TableCell>
                  <TableCell>
                    {user.tags.map((tag, i) => (
                      <Badge key={tag._id}>{tag.tag}</Badge>
                    ))}
                  </TableCell>

                  <TableCell>
                    {(
                      (user.goals.find((goal) => goal.type === "consistency")
                        ?.progress || 0) * 100
                    ).toFixed(0)}
                    %
                  </TableCell>
                  <TableCell>
                    {user.workouts ? user.workouts.length : 0}
                  </TableCell>
                  <TableCell>#{i + 1}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>
      )}
    </>
  );
};

export default Leaderboard;
