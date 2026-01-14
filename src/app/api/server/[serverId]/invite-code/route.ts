import { currentProfile } from "@/lib/current-profile"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prismadb";
import { v4 as uuid } from "uuid";

export async function PATCH(req: Request, { params }: { params: { serverId: string } }) {
	try {
		const { serverId } = await params
		const profile = await currentProfile();
		if (!profile) {
			return new NextResponse("Unauthorized", { status: 400 })
		}
		if (!serverId) {
			return new NextResponse("Server Id is mixing", { status: 400 })
		}
		const server = await prisma.server.update({
			where: { id: serverId, profileId: profile.id },
			data: {
				inviteCode: uuid()
			}
		})
		return  NextResponse.json(server, { status: 200 })
	} catch (error) {
		console.log("Error in serverId", error)
		return new NextResponse("Internal Error", { status: 500 })
	}
}