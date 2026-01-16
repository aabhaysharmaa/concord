import { prisma } from "@/lib/prismadb";
import { getAuth } from "@clerk/nextjs/server";
import { NextApiRequest } from "next";

export const currentProfilePages = async (req: NextApiRequest) => {
	try {
		const { userId } = getAuth(req);
		if (!userId) {
			return null;
		}
		const profile = await prisma.profile.findUnique({
			where: {
				userId: userId
			}
		})
		return profile

	} catch (error) {
		console.log("Error in getCurrentProfile : ", error)
		return null;
	}
}