import { MemberRole } from "@/generated/prisma/enums";
import { currentProfile } from "@/lib/current-profile";
import { prisma } from "@/lib/prismadb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	try {
		const profile = await currentProfile();
		if (!profile) {
			return new NextResponse("Unauthorized", { status: 401 })
		}
		const { name, type } = await req.json();
		const { searchParams } = new URL(req.url);

		const serverId = searchParams.get("serverId")
		if (!serverId) {
			return new NextResponse("Server ID missing", { status: 400 });
		}
		if (name === "general") {
			return new NextResponse("Name cannot be 'general'", { status: 400 });
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
					create: {
						profileId: profile.id, name, type
					}
				}
			}
		})

		return NextResponse.json(server,{status : 200})
	} catch (error) {
		console.log("Error in Create Channel :", error)
		return new NextResponse("Internal Server ID", { status: 500 })
	}
}