import { useSocket } from "@/components/providers/socket-provider";
import { useInfiniteQuery } from "@tanstack/react-query";
import queryString from "query-string";

interface ChatQueryProps {
	queryKey: string;
	apiUrl: string;
	paramKey: "channelId" | "conversationId";
	paramValue: string
}

export const useChatQuery = ({
	queryKey,
	apiUrl,
	paramKey,
	paramValue
}: ChatQueryProps) => {

	const { isConnected } = useSocket();

	const fetchMessages = async ({ pageParam = undefined }) => {
		const url = queryString.stringifyUrl({
			url: apiUrl,
			query: {
				cursor: pageParam,
				[paramKey]: paramValue,

			}
		}, { skipEmptyString: true, skipNull: true })
		const res = await fetch(url);
		return res.json();
	}

	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		status,
		isLoading,
		isFetching,
	} = useInfiniteQuery({
		queryKey: [queryKey],
		queryFn: fetchMessages,
		getNextPageParam: (lastPage) => lastPage?.nextCursor,
		refetchInterval: isConnected ? false : 1000,
		initialPageParam: null,
	});

	return {
		data,
		fetchNextPage,
		isLoading,
		hasNextPage,
		isFetchingNextPage,
		status,
		isFetching,
	}
}