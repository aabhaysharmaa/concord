"use client";

import { Member, Profile } from "@/generated/prisma/client";
import { UserAvatar } from "../user-avatar";
import { ActionTooltip } from "../action-tooltip";
import { Edit, FileIcon, ShieldAlert, ShieldCheck, Trash } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Form, FormItem, FormControl, FormField } from "../ui/form";
import * as z from "zod";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import axios from "axios";
import queryString from "query-string";
interface ChatItemProps {
	id: string;
	content: string;
	member: Member & {
		profile: Profile
	},
	timeStamp: string;
	fileUrl: string | null;
	deleted: boolean;
	currentMember: Member
	isUpdated: boolean;
	socketUrl: string;
	socketQuery: Record<string, string>
}

const roleIconMap = {
	"GUEST": null,
	"MODERATOR": <ShieldCheck className="size-4 ml-2 text-indigo-500" />,
	"ADMIN": <ShieldAlert className="size-4 ml-2 text-rose-500" />
}

const formSchema = z.object({
	content: z.string().min(1)
})

export const ChatItem = ({
	id,
	content,
	timeStamp,
	member,
	fileUrl,
	deleted,
	currentMember,
	isUpdated,
	socketQuery,
	socketUrl
}: ChatItemProps) => {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			content: content
		}
	})

	useEffect(() => {
		form.reset({
			content: content,
		})
	}, [content, form])

	const [isEditing, setIsEditing] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	const filetype = fileUrl?.split("?")[0].split(".").pop()?.toLowerCase();

	const isAdmin = currentMember.role === "ADMIN"
	const isModerator = currentMember.role === "MODERATOR"
	const isOwner = currentMember.id === member.id
	const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner)
	const canEditMessage = !deleted && isOwner && !fileUrl
	const isPdf = filetype === "pdf" && fileUrl;
	const isImage = !isPdf && fileUrl;
	const isLoading = form.formState.isSubmitting;
	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			const url = queryString.stringifyUrl({
				url: `${socketUrl}/${id}`,
				query : socketQuery
			})
			await axios.patch(url, values)
		} catch (error) {
			console.log("Error in OnSubmit", error);
		}
	}
	const onDelete = async() =>{
		try {
			const url = queryString.stringifyUrl({
				url: `${socketUrl}/${id}`,
				query : socketQuery
			})
			await axios.delete(url)
		} catch (error) {
			console.log("Error in OnSubmit", error);
		}
	}
	useEffect(() => {
		const handleKeyDown = (event: any) => {
			if (event.key === "Escape" || event.keyCode === 27) {
				setIsEditing(false)
			}
		}
		window.addEventListener("keydown", handleKeyDown)

		return () => window.removeEventListener("keydown", handleKeyDown)
	}, [])
	return (
		<div className="relative group  flex items-center hover:bg-black/5 p-4 transition w-full">
			<div className="group flex gap-x-2 items-start w-full">
				<div className="cursor-pointer hover:drop-shadow-md transition">
					<UserAvatar src={member.profile.imageUrl} />
				</div>
				<div className="flex flex-col w-full">
					<div className="flex items-center gap-x-2">
						<div className="flex items-center">
							<p className="font-semibold text-sm hover:underline cursor-pointer">{member.profile.name}</p>
							<ActionTooltip label={member.role}>
								{roleIconMap[member.role]}
							</ActionTooltip>
						</div>
						<span className="text-xs text-zinc-500 dark:text-zinc-400">
							{timeStamp}
						</span>
					</div>
					{isImage && (
						<a href={fileUrl} target="_blank" rel="noopener noreferrer" className="relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary size-48">
							<Image src={fileUrl} alt="content" fill className="object-cover" />
						</a>
					)}
					{isPdf && (
						<div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
							<FileIcon className="size-10 fill-indigo-200 stroke-indigo-400" />
							<a href={fileUrl} target="_blank" rel="noopener noreferrer" className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline">PDF File</a>
						</div>
					)}
					{!fileUrl && !isEditing && (
						<p className={cn("text-sm text-zinc-600 dark:text-zinc-300",
							deleted && "italic text-zinc-500 dark:text-zinc-400 text-sx mt-1"
						)}>
							{content}
							{isUpdated && !deleted && (
								<span className="text-1.2 mx-2 text-zinc-500  dark:text-zinc-400">(edited)</span>
							)}
						</p>
					)}
					{!fileUrl && isEditing && (
						<Form {...form}>
							<form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center w-full gap-x-2 pt-2">
								<FormField control={form.control} name="content" render={({ field }) => (
									<FormItem>
										<FormControl>
											<div className="relative w-full">
												<Input disabled={isLoading} className="pt-2 w-80 md:w-150 dark:bg-zinc-700/75 border-none focus-visible:ring-0 bg-zinc-200/90 text-zinc-600 dark:text-zinc-200" placeholder="Edited message" {...field} />
											</div>
										</FormControl>
									</FormItem>
								)} />
								<Button size="sm" disabled={isLoading} variant="primary"  >Save</Button>
							</form>
							<span className="text-1.2 text-xs text-zinc-500 mt-3 dark:text-zinc-400">Press escape to cancel, enter to save  </span>
						</Form>
					)}
				</div>
			</div>
			{canDeleteMessage && (
				<div className="hidden group-hover:flex items-center gap-x-2 absolute p-1 -top-2 right-5 bg-white dark:bg-zinc-800 border  rounded-sm">
					{canEditMessage && (
						<ActionTooltip label="Edit">
							<Edit onClick={() => setIsEditing(true)} className="cursor-pointer ml-auto size-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition" />
						</ActionTooltip>
					)}
					<ActionTooltip label="Delete">
						<Trash onClick={onDelete} className="cursor-pointer ml-auto size-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition" />
					</ActionTooltip>
				</div>
			)}
		</div>
	)
}
