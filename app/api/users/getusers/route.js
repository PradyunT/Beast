import { connectToDB } from "@/utils/database";
import User from "@/models/user";

export const GET = async (req, res) => {
  try {
    await connectToDB();
    const foundUsers = await User.find({ initialized: true });
    return new Response(JSON.stringify(foundUsers), { status: 200 });
  } catch (err) {
    console.err(err);
    return new Response(JSON.stringify("Failed to get users"), { status: 500 });
  }
};
