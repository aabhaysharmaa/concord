"use client";

import { ModalType, useModal } from "@/hooks/use-modal-store";
import { cn } from "@/lib/utils";
import { Edit, Hash, Lock, Mic, Trash, Video } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { ActionTooltip } from "../action-tooltip";

const ChannelType = {
	TEXT: "TEXT",
	AUDIO: "AUDIO",
	VIDEO: "VIDEO",
} as const;

type ChannelType = typeof ChannelType[keyof typeof ChannelType];
type MemberRole = "ADMIN" | "MODERATOR" | "GUEST"
type Server = {
	name: string;
	id: string;
	imageUrl: string;
	inviteCode: string;
	profileId: string;
	createdAt: Date;
	updatedAt: Date;
}

type Channel = {
	id: string;
	name: string;
	type: ChannelType;
	serverId: string;
	createdAt: Date;
	updatedAt: Date;
	profileId: string;
}
interface ServerChannelProps {
	channel: Channel;
	server: Server;
	role?: MemberRole
}

const iconMap = {
	[ChannelType.TEXT]: Hash,
	[ChannelType.AUDIO]: Mic,
	[ChannelType.VIDEO]: Video,
}

export const ServerChannel = ({
	channel,
	server,
	role
}: ServerChannelProps) => {
	const params = useParams();
	const router = useRouter();
	const { onOpen } = useModal();
	const Icon = iconMap[channel.type];
	const [isMounted, setIsMounted] = useState(false);

	const onClick = (e: FormEvent) => {
		e.preventDefault();
		e.stopPropagation()
		router.push(`/servers/${params?.serverId}/channels/${channel.id}`)
	}

	const onAction = (e: MouseEvent, action: ModalType) => {
		e.stopPropagation()
		onOpen(action,{channel,server})
	}

	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setIsMounted(true)
	}, [])
	if (!isMounted) return
	return (
		<button onClick={onClick} className={cn("cursor-pointer group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1", params.channelId === channel.id && "bg-zinc-700/20 dark:bg-zinc-700 ")}>
			<Icon className="shrink-0 flex size-5 text-zinc-500 dark:text-zinc-400" />
			<p className={cn("line-clamp-1 font-semibold text-sm text-zinc-400 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300  transition", params.channelId === channel.id && "text-primary dark:text-zinc-200 dark:group-hover:text-white")}>{channel.name}
			</p>
			{channel.name !== "general" && role !== "GUEST" && (
				<div className="ml-auto flex items-center gap-x-2">
					<ActionTooltip label="Edit">
						<Edit onClick={(e) => onAction(e,"editChannel")} className="hidden group-hover:block size-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition " />
					</ActionTooltip>
					<ActionTooltip label="delete">
						<Trash onClick={(e) => onAction(e,"deleteServer")} className="hidden  group-hover:block size-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition " />
					</ActionTooltip>
				</div>
			)}
			{channel.name === "general" && (
				<Lock className="size-4  text-zinc-400 ml-auto dark:text-zinc-500" />

			)}
		</button>
	)
}
