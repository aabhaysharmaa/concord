import { currentProfile } from "@/lib/current-profile";
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prismadb";




export async function DELETE(req: NextRequest) {
	try {
		const profile = await currentProfile();
		if (!profile) {
			return new NextResponse("Unauthorized", { status: 401 })
		}
		const { searchParams } = new URL(req.url)
		const serverId = searchParams.get("serverId");
		if (!serverId) {
			return new NextResponse("Server ID is missing", { status: 401 })
		}

		const server = await prisma.server.delete({
			where: {
				id: serverId,
				profileId: profile.id
			}
		})

		return NextResponse.json(server, { status: 200 })
	} catch (error) {
		console.log("Error in DELETE server Route", error)
		return new NextResponse("Internal Server Error", { status: 500 });
	}
}

export async function PATCH(req: NextRequest) {
	try {
		const profile = await currentProfile();
		if (!profile) {
			return new NextResponse("Unauthorized", { status: 401 })
		}
		const { searchParams } = new URL(req.url)
		const serverId = searchParams.get("serverId");
		if (!serverId) {
			return new NextResponse("Server ID is missing", { status: 401 })
		}

		const server = await prisma.server.update({
			where: {
				id: serverId,
				profileId: {
					not: profile.id
				},
				members: {
					some: {
						profileId: profile.id
					}
				}
			}, data: {
				members: {
					deleteMany: {
						profileId: profile.id
					}
				}
			}
		})

		return NextResponse.json(server, { status: 200 })
	} catch (error) {
		console.log("Error in  server Route", error)
		return new NextResponse("Internal Server Error", { status: 500 });
	}
}