import { connectToDB } from "@/utils/database.js";
import User from "@/models/user";

export const POST = async (req, res) => {
  const { userId, displayName } = await req.json();
  try {
    await connectToDB();
    const user = await User.findByIdAndUpdate(
      userId,
      {
        displayName,
        initialized: true,
      },
      { new: true } // To get the updated document
    );
    if (!user) {
      return new Response("User not found", { status: 404 });
    }
    return new Response("Successfully updated profile of user", {
      status: 200,
    });
  } catch (err) {
    return new Response("Failed to update profile", { status: 500 });
  }
};
