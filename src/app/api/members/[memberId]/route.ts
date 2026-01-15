import { currentProfile } from "@/lib/current-profile";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";

export async function DELETE(req: NextRequest, { params }: { params: { memberId: string } }) {
	try {
		const { memberId } = await params;
		const profile = await currentProfile();
		if (!profile) {
			return new NextResponse("Unauthorized", { status: 404 })
		}

		const { searchParams } = new URL(req.url);
		const serverId = searchParams.get("serverId")
		if (!serverId) {
			return new NextResponse("serverId id missing", { status: 404 })
		}

		if (!memberId) {
			return new NextResponse("memberId is missing", { status: 404 })
		}

		const server = await prisma.server.update({
			where: { id: serverId, profileId: profile.id },
			data: {
				members: {
					deleteMany: {
						id: memberId,
						profileId: {
							not: profile.id
						}
					}
				}
			}, include: {
				members: {
					include: {
						profile: true
					}, orderBy : {
						role : "asc"
					}
				}
			}
		})
		return NextResponse.json(server, { status: 200 })

	} catch (error) {
		console.log("Error in DELETE Route : ", error)
		return new NextResponse("Internal Server Error", { status: 500 })
	}
}



export async function PATCH(req: NextRequest, { params }: { params: { memberId: string } }) {
	try {
		const profile = await currentProfile();
		const { memberId } = await params
		const { searchParams } = new URL(req.url);
		const serverId = await searchParams.get("serverId");
		const { role } = await req.json();
		if (!profile) {
			return new NextResponse("Unauthorized", { status: 401 })
		}

		if (!serverId) {
			return new NextResponse("Server ID is missing", { status: 400 });
		}

		if (!memberId) {
			return new NextResponse("Member ID is missing", { status: 400 });
		}

		const server = await prisma.server.update({
			where: { id: serverId, profileId: profile.id },
			data: {
				members: {
					update: {
						where: {
							id: memberId,
							profileId: {
								not: profile.id
							}
						},
						data: {
							role
						}
					}
				}
			}, include: {
				members: {
					include: {
						profile: true
					}, orderBy: {
						role: "asc"
					}
				}
			}
		})
		return NextResponse.json(server);
	} catch (error) {
		console.log("Error in create member route :", error)
		return new NextResponse("Internal Server Error", { status: 500 })
	}
}