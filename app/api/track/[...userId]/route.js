import { connectToDB } from "@/utils/database";
import User from "@/models/user"
export const POST = async (req, {params}) => {
    try {
        await connectToDB();
        
        const currentDate = new Date().toISOString();
        const foundUser = await User.findById(params.userId);
        foundUser.workouts.push({date: currentDate});
        await foundUser.save();
        return new Response("Successfully tracked workout", {status: 200});
    } catch (err) {
        console.log(err);
        return new Response("Failed to track workout", {status: 500});
    }
}