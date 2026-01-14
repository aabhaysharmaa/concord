import { currentProfile } from "@/lib/current-profile";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";


export async function PATCH(req: NextRequest, { params }: { params: { serverId: string } }) {
	try {
		const { serverId } = await params
		if (!serverId) {
			return new NextResponse("Missing Server Id", { status: 401 })

		}
		const { imageUrl, name } = await req.json();
		const profile = await currentProfile();
		if (!profile) {
			return new NextResponse("Unauthorized", { status: 401 })
		}
		const existingServer = await prisma.server.findUnique({
			where: {
				id: serverId
			}
		})

		if (!existingServer) {
			return new NextResponse("Invalid server Id ", { status: 404 })
		}

		const updaterServer = await prisma.server.update({
			where: { id: existingServer.id },
			data: {
				name,
				imageUrl
			}
		})
		return NextResponse.json(updaterServer, { status: 200 })
	} catch (error) {
		console.log("Error in Edit Router :", error)
		return new NextResponse("Interval Server Error")
	}
}