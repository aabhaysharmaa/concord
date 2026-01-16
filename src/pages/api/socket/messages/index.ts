
import { currentProfilePages } from "@/lib/current-profile-pages";
import { NextApiResponseServerIo } from "@/types";
import { NextApiRequest } from "next";
import { prisma } from "@/lib/prismadb";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponseServerIo,
) {
	if (req.method !== "POST") {
		return res.status(405).json("Method not allowed")
	}
	try {
		const profile = await currentProfilePages(req);
		const { fileUrl, content } = req.body
		const { serverId, channelId } = req.query

		if (!profile) {
			return res.status(401).json({ error: "Unauthorized" })
		}
		if (!serverId) {
			return res.status(400).json({ error: "Server ID missing" })
		}
		if (!channelId) {
			return res.status(400).json({ error: "channel ID missing" })
		}
		if (!content) {
			return res.status(400).json({ error: "content missing" })
		}

		const server = await prisma.server.findFirst({
			where: {
				id: serverId as string,
				members: {
					some: {
						profileId: profile.id
					}
				}
			}, include: {
				members: true
			}
		})
		if (!server) {
			return res.status(404).json({ message: "Server Not Found" })
		}
		const channel = await prisma.channel.findFirst({
			where: {
				id: channelId as string,
				serverId: serverId as string
			}
		})
		if (!channel) {
			return res.status(404).json({ message: "Chanel Not Found" })
		}
		const member = server.members.find((member) => member.profileId === profile.id);
		if (!member) {
			return res.status(404).json({ message: "member Not Found" })
		}
		const message = await prisma.message.create({
			data: {
				content,
				fileUrl,
				channelId: channelId as string,
				memberId: member.id
			}, include: {
				member: {
					include: {
						profile: true
					}
				}
			}
		})
		const channelKey = `chat:${channelId}:messages`
		res?.socket?.server?.io?.to(channelKey).emit(channelKey, message);
		res?.socket?.server?.io?.emit(channelKey, message)

		return res.status(200).json(message)
	} catch (error) {
		console.log("[MESSAGES_POST", error)
		return res.status(500).json({ message: "Internal Error" })
	}
}