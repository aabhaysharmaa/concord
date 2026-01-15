import { currentProfile } from "@/lib/current-profile"
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prismadb";
import { MemberRole } from "@/generated/prisma/enums";


export async function PATCH(req: NextRequest, { params }: { params: { channelId: string } }) {
	try {
		const profile = await currentProfile();
		if (!profile) {
			return new NextResponse("Unauthorized", { status: 401 })
		}
		const { searchParams } = new URL(req.url)
		const { name, type } = await  req.json();
		const serverId = searchParams.get("serverId");
		if (!serverId) {
			return new NextResponse("serverId  is missing", { status: 404 })
		}
		const { channelId } = await params
		if (!channelId) {
			return new NextResponse("channelId  is missing", { status: 404 })
		}
		if (name === "general") {
			return new NextResponse("Sorry General Channel Owner cannot change anything ", { status: 404 })

		}
		const server = await prisma.server.update({
			where: {
				id: serverId, members: {
					some: {
						profileId: profile.id,
						role: {
							in: [MemberRole.ADMIN, MemberRole.MODERATOR]
						}
					}
				}
			}, data: {
				channels: {
					update: {
						where: {
							id: channelId,
							NOT: {
								name: "general"
							}
						}, data: {
							name,
							type
						}
					}
				}
			}
		})
		return NextResponse.json(server, {status : 200})
	} catch (error) {
		console.log("Error in edit channel Route", error)
		return new NextResponse("Internal Server Error", { status: 500 })
	}
}



export async function DELETE(req: NextRequest, { params }: { params: { channelId: string } }) {
	try {
		const profile = await currentProfile();
		if (!profile) {
			return new NextResponse("Unauthorized", { status: 401 })
		}
		const { searchParams } = new URL(req.url)
		const serverId = searchParams.get("serverId");
		if (!serverId) {
			return new NextResponse("serverId  is missing", { status: 404 })
		}
		const { channelId } = await params
		if (!channelId) {
			return new NextResponse("channelId  is missing", { status: 404 })
		}
		const server = await prisma.server.update({
			where: {
				id: serverId,
				members: {
					some: {
						profileId: profile.id,
						role: {
							in: [MemberRole.ADMIN, MemberRole.MODERATOR]
						}
					}
				}
			}, data: {
				channels: {
					delete: {
						id: channelId,
						name: {
							not: "general"
						}
					}
				}
			}
		})
		return NextResponse.json(server, { status: 200 })
	} catch (error) {
		console.log("[CHANNEL_ID_DELETE]", error)
		return new NextResponse("Internal Error", { status: 500 })
	}
}