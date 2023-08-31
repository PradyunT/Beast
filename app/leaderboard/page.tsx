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

const Leaderboard = () => {
  const [users, setUsers] = useState<ProfileProps[] | null>(null);
  const getUsers = async () => {
    const data = await fetch("/api/users/getusers", {
      method: "GET",
    });
    const users = await data.json();
    console.log(users);
    // Sort users by the number of workouts (in descending order)
    const sortedUsers = users.sort(
      (a: ProfileProps, b: ProfileProps) =>
        b.workouts.length - a.workouts.length
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
        <div>
          <Table>
            <TableCaption>The leaderboard for going to the gym</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Avatar</TableHead>
                <TableHead className="">Name</TableHead>
                <TableHead>Tags</TableHead>
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
                    {user.workouts ? user.workouts.length : 0}
                  </TableCell>
                  <TableCell>#{i + 1}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
};
export default Leaderboard;
