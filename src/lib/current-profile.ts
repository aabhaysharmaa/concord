import { prisma } from "@/lib/prismadb";
import { currentUser } from "@clerk/nextjs/server";

export const currentProfile = async () => {
	try {
		const user = await currentUser();
		if (!user?.id || !user) {
			return null ;
		}
		const profile = await prisma.profile.findUnique({
			where: {
				userId: user.id
			}
		})
		return profile

	} catch (error) {
		console.log("Error in getCurrentProfile : ", error)
		return null;
	}
}