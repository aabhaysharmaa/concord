import { prisma } from "@/lib/prismadb";
import { currentUser } from "@clerk/nextjs/server";

export const currentProfile = async () => {
	const user = await currentUser();
	if (!user?.id) {
		return null
	}

	const profile = await prisma.profile.findUnique({
		where: {
			userId: user.id
		}
	})
	return profile
}