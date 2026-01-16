import { currentProfile } from "@/lib/current-profile";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prismadb";
import { ChatHeader } from "@/components/chat/chat-header";
interface ChannelIdPageProps {
	params: {
		serverId: string;
		channelId: string
	}
}

const ChannelIdPage = async ({ params }: ChannelIdPageProps) => {
	const { serverId, channelId } = await params
	const profile = await currentProfile();
	if (!profile) {
		return redirect("/sign-in")
	}
	const channel = await prisma.channel.findUnique({
		where: {
			id: channelId
		}
	})
	const member = await prisma.member.findFirst({
		where: {
			serverId: serverId,
			profileId: profile.id
		}
	})
	if (!channel || !member) {
		return redirect("/")
	}
	return (
		<div className="bg-white h-screen dark:bg-[#313338] flex flex-col">
			<ChatHeader
			 name={channel.name}
			 serverId={channel.serverId}
			 type="Channel"
			/>
		</div>
	)
}

export default ChannelIdPage
