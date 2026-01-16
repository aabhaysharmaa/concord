"use client";

import { Member, Message, Profile } from "@/generated/prisma/client";
import { ChatWelcome } from "./chat-welcome";
import { useChatQuery } from "@/hooks/use-chat-query";
import { Loader2, ServerCrash } from "lucide-react";
import { error } from "console";
import { Fragment } from "react/jsx-runtime";


type MessageWithMemberWithProfile = Message & {
	member: Member & {
		profile: Profile
	}
}

interface ChatMessagesProps {
	name: string;
	member: Member;
	chatId: string;
	apiUrl: string;
	socketUrl: string;
	socketQuery: Record<string, string>;
	paramKey: "channelId" | "conversationId";
	paramValue: string;
	type: "channel" | "conversation"
}

export const ChatMessages = ({
	name,
	member,
	chatId,
	apiUrl,
	socketQuery,
	paramKey,
	paramValue,
	type
}: ChatMessagesProps) => {
	const queryKey = `chat:${chatId}`
	const {
		data,
		fetchNextPage,
		isFetchingNextPage,
		isFetching,
		isLoading,
		status
	} = useChatQuery({
		queryKey,
		apiUrl,
		paramKey,
		paramValue

	});

	if (isLoading) {
		return (
			<div className="flex flex-col flex-1  justify-center items-center">
				<Loader2 className="size-7 text-zinc-500 animate-spin my-4" />
				<p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Loading Messages...</p>
			</div>
		)
	}
	if (status === "error") {
		return (
			<div className="flex flex-col  flex-1 justify-center items-center">
				<ServerCrash className="size-7 text-zinc-500 my-4" />
				<p className="text-xs size-7  w-80 text-center font-semibold text-zinc-500 dark:text-zinc-400">
					Something went Wrong!
				</p>
			</div>
		)
	}

	return (
		<div className="flex-1 flex flex-col py-4 overflow-y-auto">
			<div className="flex-1" />
			<ChatWelcome type={type} name={name} />
			<div className="flex flex-col-reverse mt-auto">
				{data?.pages?.map((group, idx) => (
					<Fragment key={idx}>
						{group.items.map((message: MessageWithMemberWithProfile) => (
							<div className="" key={message.id}>
								{message.content}
							</div>
						))}
					</Fragment>
				))}
			</div>
		</div>
	)
}
