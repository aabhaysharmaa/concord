
import { currentProfile } from "@/lib/current-profile"
import { redirect } from "next/navigation";
import { ServerHeader } from "./server-header";
import { ScrollArea } from "../ui/scroll-area";
import { ServerSearch } from "./server-search";

import { ChannelType, MemberRole } from "@/generated/prisma/enums";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";
interface ServerSidebarProps {
	serverId: string
}

export const ServerSidebar = async ({ serverId }: ServerSidebarProps) => {
	const profile = await currentProfile();
	if (!profile) {
		return redirect("/")
	}

	const server = await prisma?.server.findUnique({
		where: {
			id: serverId
		}, include: {
			channels: {
				orderBy: {
					createdAt: "asc"
				}
			}, members: {
				include: {
					profile: true
				}, orderBy: {
					role: "asc"
				}
			}
		}
	})

	console.log("Server :", server)
	const textChannels = server?.channels.filter((channel) => channel.type === ChannelType.TEXT)
	const audioChannels = server?.channels.filter((channel) => channel.type === ChannelType.AUDIO)
	const videoChannels = server?.channels.filter((channel) => channel.type === ChannelType.VIDEO)
	const members = server?.members.filter((member) => member.profileId !== profile.id)

	if (!server) {
		return redirect("/");
	}

	const role = server.members.find((member) => member.profileId === profile?.id)?.role

	const iconMap = {
		[ChannelType.TEXT]: <Hash className="size-4 ml-2 " />,
		[ChannelType.AUDIO]: <Mic className="size-4 ml-2 " />,
		[ChannelType.VIDEO]: <Video className="size-4 ml-2 " />
	}
	const roleIconMap = {
		[MemberRole.GUEST]: null,
		[MemberRole.MODERATOR]: <ShieldCheck className="size-4  text-indigo-500" />,
		[MemberRole.ADMIN]: <ShieldAlert className="size-4  text-rose-500" />,
	}

	return (
		<div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
			<ServerHeader server={server} role={role} />
			<ScrollArea className="flex flex-1 mx-3">
				<div className="mt-2">
					<ServerSearch data={[
						{
							label: "Text Channels",
							type: "channel",
							data: textChannels?.map((channel) => ({
								id: channel.id,
								name: channel.name,
								icon: iconMap[channel.type]
							}))
						}, {
							label: "Audio Channels",
							type: "channel",
							data: audioChannels?.map((channel) => ({
								id: channel.id,
								name: channel.name,
								icon: iconMap[channel.type]
							}))
						}, {
							label: "Video Channels",
							type: "channel",
							data: videoChannels?.map((channel) => ({
								id: channel.id,
								name: channel.name,
								icon: iconMap[channel.type]
							}))
						}, {
							label: "Members",
							type: "member",
							data: members?.map((member) => ({
								id: member.id,
								name: member.profile.name,
								icon: roleIconMap[member.role]
							}
							)
							)
						}
					]} />
				</div>
			</ScrollArea>
		</div>
	)
}
