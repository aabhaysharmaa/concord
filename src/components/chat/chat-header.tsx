import { Hash } from "lucide-react";
import { MobileToggle } from "../mobile-toggle";
import { UserAvatar } from "../user-avatar";



interface ChatHeaderProps {
	serverId: string;
	name: string;
	type: "Channel" | "Conversation"
	imageUrl?: string
}

export const ChatHeader = ({
	type,
	name,
	imageUrl,
	serverId
}: ChatHeaderProps) => {
	return (
		<div className="text-md font-semibold px-3 flex items-center h-12 border-neutral-200 border-b-2 dark:border-neutral-800">
			<MobileToggle serverId={serverId} />
			{type === "Channel" && (
				<Hash className="size-5 text-zinc-500 dark:text-zinc-400 mr-2" />
			)}
			{type === "Conversation" && (
				<UserAvatar src={imageUrl} className="mr-2 size-8 md:size-8 " />
			)}
			<p className="font-semibold text-md text-black dark:text-white">{name}</p>
		</div>
	)
}
