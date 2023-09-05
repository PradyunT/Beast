import { connectToDB } from "@/utils/database.js";
import User from "@/models/user";

export const GET = async (req, { params }) => {
  try {
    await connectToDB();
    const foundUser = await User.findById(params.userId).populate("goals");
    return new Response(JSON.stringify(foundUser), { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response("Failed to get user's goals", { status: 500 });
  }
};
