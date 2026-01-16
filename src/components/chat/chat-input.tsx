"use client";

import { useModal } from "@/hooks/use-modal-store";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Plus } from "lucide-react";
import queryString from "query-string";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Input } from "../ui/input";
import EmojiPicker from "./emoji-picker";

interface ChatInputProps {
	apiUrl: string;
	query: Record<string, any>,
	name: string;
	type: "conversation" | "channel"
}

const fromSchema = z.object({
	content: z.string().min(1)
})

const ChatInput = ({
	apiUrl,
	query,
	name,
	type
}: ChatInputProps) => {
	const form = useForm<z.infer<typeof fromSchema>>({
		resolver: zodResolver(fromSchema),
		defaultValues: {
			content: ""
		}
	})
	const { onOpen } = useModal();

	const isLoading = form.formState.isSubmitting
	const onSubmit = async (values: z.infer<typeof fromSchema>) => {
		try {
			console.log({ values })
			const url = queryString.stringifyUrl({
				url: apiUrl,
				query
			})
			await axios.post(url, values)
			form.reset();
		} catch (error) {
			console.log(error)
		}
	}
	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<FormField control={form.control} name="content" render={({ field }) => (
					<FormItem>
						<FormControl>
							<div className="relative p-4 pb-6">
								<button type="button" className="absolute cursor-pointer top-8 left-8 size-4 bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 transition rounded-full p-1 flex items-center justify-center" onClick={() => onOpen("messageFile", { apiUrl, query })}>
									<Plus className="text-white dark:text-[#313338]" />
								</button>
								<Input {...field} disabled={isLoading} className="px-14 py-6  dark:text-white  bg-zinc-200/90 dark:bg-zinc-700/75 border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark-text-zinc-200" placeholder={`Message ${type === "conversation" ? name : "#" + name}`} />
								<div className="absolute top-7 cursor-pointer right-8">
									<EmojiPicker onChange={(emoji: string) => field.onChange(`${field.value} ${emoji}`)} />
								</div>
							</div>
						</FormControl>
					</FormItem>
				)} />
			</form>
		</Form>
	)
}

export default ChatInput
