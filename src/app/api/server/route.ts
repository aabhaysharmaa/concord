import { currentProfile } from "@/lib/current-profile";
import { v4 as uuid } from "uuid";

import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { MemberRole } from "@/generated/prisma/enums";

export async function POST(req: Request) {
	try {
		const { name, imageUrl } = await req.json()
		const profile = await currentProfile();

		if (!profile) {
			return new NextResponse("Unauthorized", { status: 401 })
		}

		const server = await prisma.server.create({
			data: {
				profileId: profile.id,
				name,
				imageUrl,
				inviteCode: uuid(),
				channels: {
					create: [
						{ name: "general", profileId: profile.id }
					]
				}, members: {
					create: [
						{ profileId: profile.id, role: MemberRole.ADMIN }
					]
				}
			}
		})
		return NextResponse.json(server, { status: 200 })
	} catch (error) {
		console.log("[SERVERS_POST] : ", error)
		return new NextResponse("Internal Error", { status: 500 })
	}
}