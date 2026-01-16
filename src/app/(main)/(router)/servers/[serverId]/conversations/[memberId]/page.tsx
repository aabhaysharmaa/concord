import { currentProfile } from "@/lib/current-profile";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prismadb";
import { getOrCreateConversation } from "@/lib/conversation";
import { ChatHeader } from "@/components/chat/chat-header";


interface memberIdPageProps {
	params: {
		memberId: string;
		severId: string
	}
}

const memberIdPage = async ({ params }: memberIdPageProps) => {
	const { memberId, severId } = await  params
	const profile = await currentProfile();
	if (!profile) {
		return redirect("/sign-in")
	}
	const currentMember = await prisma.member.findFirst({
		where: {
			serverId: params.severId,
			profileId: profile.id
		},
		include: {
			profile: true
		}
	})

	if (!currentMember) {
		return redirect("/")
	}

	const conversation = await getOrCreateConversation(currentMember.id, memberId);
	if (!conversation) {
		return redirect(`/servers/${severId}`)
	}
	const { memberOne, memberTwo } = conversation
	const otherMember = memberOne.profileId === profile.id ? memberTwo : memberOne
	return (
		<div className="bg-white dark:bg-[#313338] flex flex-col h-screen">
			<ChatHeader
			imageUrl={otherMember.profile.imageUrl}
			name={otherMember.profile.name}
			serverId={params.severId}
			 type="Conversation"
			/>
			member
		</div>
	)
}

export default memberIdPage
