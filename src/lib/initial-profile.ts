"use server";

import { currentUser } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prismadb";
import { redirect } from "next/navigation";


export const InitialProfile = async () => {
	const user = await currentUser();

	if (!user) {
		return redirect("/sign-in")
	}
	const profile = await prisma.profile.findUnique({
		where: { userId: user.id }
	})

	if (profile) {
		return profile
	}

	const newProfile = await prisma.profile.create({
		data: {
			userId: user.id,
			name: `${user.firstName} ${user.lastName ? user.lastName : ""}`,
			imageUrl: user.imageUrl,
			email: user.emailAddresses[0].emailAddress,

		}
	})
	return newProfile
}
