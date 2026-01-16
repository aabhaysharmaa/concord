import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prismadb";
import { currentProfile } from "@/lib/current-profile";
import { Message } from "@/generated/prisma/client";

const MESSAGES_BATCH = 10;

export async function GET(req: NextRequest) {
	try {
		const profile = await currentProfile();
		if (!profile) {
			return new NextResponse("Unauthorized", { status: 404 })
		}
		const { searchParams } = new URL(req.url)

		const cursor = searchParams.get("cursor");
		const channelId = searchParams.get("channelId");

		if (!channelId) {
			return new NextResponse("Unauthorized", { status: 404 })
		}
		let messages: Message[] = []
		if (cursor) {
			messages = await prisma.message.findMany({
				take: MESSAGES_BATCH,
				skip: 1,
				cursor: {
					id: cursor,
				}, where: {
					channelId
				},
				include: {
					member: {
						include: {
							profile: true
						}
					}
				}, orderBy: {
					createdAt: "desc"
				}
			})
		} else {
			messages = await prisma.message.findMany({
				take: MESSAGES_BATCH,
				where: {
					channelId
				}, include: {
					member: {
						include: {
							profile: true
						}
					}
				}, orderBy: {
					createdAt: "desc"
				}
			})
		}

		let nextCursor = null;
		if (messages.length === MESSAGES_BATCH) {
			nextCursor = messages[MESSAGES_BATCH - 1].id
		}
		return NextResponse.json({
			items: messages,
			nextCursor
		}, { status: 200 })
	} catch (error) {
		console.log("[MESSAGES_GET]", error)
		return new NextResponse("Internal Error", { status: 500 })
	}
}