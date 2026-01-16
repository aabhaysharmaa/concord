"use client";

import { Member, Message, Profile } from "@/generated/prisma/client";
import { useChatQuery } from "@/hooks/use-chat-query";
import { useChatSocket } from "@/hooks/use-chat-socket";
import { format } from "date-fns";
import { Loader2, ServerCrash } from "lucide-react";
import { useRef } from "react";
import { Fragment } from "react/jsx-runtime";
import { ChatItem } from "./chat-item";
import { ChatWelcome } from "./chat-welcome";
import { useChatScroll } from "@/hooks/use-chat-scroll";

const DATE_FORMAT = "d MMM yyyy, HH:mm";

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
	socketUrl,
	paramValue,
	type
}: ChatMessagesProps) => {

	const queryKey = `chat:${chatId}`
	const addKey = `chat:${chatId}:messages`
	const updateKey = `chat:${chatId}:messages:update`
	const chatRef = useRef<HTMLDivElement | null>(null)
	const bottomRef = useRef<HTMLDivElement | null>(null)
	const {
		data,
		fetchNextPage,
		isFetchingNextPage,
		hasNextPage,
		isFetching,
		isLoading,
		status
	} = useChatQuery({
		queryKey,
		apiUrl,
		paramKey,
		paramValue
	});

	useChatSocket({
		queryKey,
		addKey,
		updateKey
	});

	useChatScroll({
		chatRef,
		bottomRef,
		loadMore: fetchNextPage,
		shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
		count: data?.pages?.[0]?.items?.length ?? 0
	})

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
		<div ref={chatRef} className="flex-1 flex flex-col py-4 overflow-y-auto">
			{!hasNextPage && <div className="flex-1" />}
			{!hasNextPage && (
				<ChatWelcome type={type} name={name} />
			)}
			{hasNextPage && (
				<div className="flex justify-center">
					{isFetchingNextPage ? (
						<Loader2 className="size-6 text-zinc-500 animate-spin my-4" />
					) : (
						<button onClick={() => fetchNextPage()} className="text-zinc-500 cursor-pointer hover:text-zinc-600 dark:text-zinc-400 text-xs my-4 dark:hover:text-zinc-300 transition" >
							Load Previous Messages
						</button>
					)}
				</div>
			)}
			<div className="flex flex-col-reverse mt-auto">
				{data?.pages?.map((group, idx) => (
					<Fragment key={idx}>
						{group.items.map((message: MessageWithMemberWithProfile) => (
							<ChatItem
								key={message.id}
								currentMember={member}
								member={message.member}
								id={message.id}
								content={message.content}
								fileUrl={message.fileUrl}
								deleted={message.deleted}
								timeStamp={format(new Date(message.createdAt), DATE_FORMAT)}
								isUpdated={message.updatedAt !== message.createdAt}
								socketUrl={socketUrl}
								socketQuery={socketQuery}
							/>
						))}
					</Fragment>
				))}
			</div>
			<div ref={bottomRef} />
		</div>
	)
}