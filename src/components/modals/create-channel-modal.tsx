"use client";

import * as z from "zod";

import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from "@/components/ui/dialog";

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from "@/components/ui/form";

import {
	Select,
	SelectItem,
	SelectContent,
	SelectValue,
	SelectTrigger
} from "@/components/ui/select"

import { useModal } from "@/hooks/use-modal-store";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ChannelType } from "@/generated/prisma/enums";
import queryString from "query-string";


const formSchema = z.object({
	name: z.string().min(1, "Channel name is required.").refine(name => name !== "general", "Channel name cannot be 'general' "),
	type: z.nativeEnum(ChannelType)
})

export const CreateChannelModal = () => {
	const { isOpen, onClose, type, data } = useModal();

	const isModalOpen = isOpen && type === "createChannel";
	const { channelType } = data
	const [createIsLoading, setCreateIsLoading] = useState(false);
	const router = useRouter();
	const params = useParams();
	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			type: channelType ||  ChannelType.TEXT
		}
	})
	useEffect(() => {
		if (channelType) {
			form.setValue("type", channelType)
		} else {
			form.setValue("type","TEXT")
		}
	}, [channelType,type,form])
	const isLoading = form.formState.isSubmitting;

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		setCreateIsLoading(true)
		try {
			const url = queryString.stringifyUrl({
				url: "/api/channel",
				query: {
					serverId: params?.serverId
				}
			})
			await axios.post(url, values)
			toast.success("Channel Created")
			form.reset()
			router.refresh();
			onClose();
		} catch (error) {
			console.log(error)
			toast.error("Something went Wrong!")
		} finally {
			setCreateIsLoading(false)
		}
	}

	const handleClose = () => {
		form.reset();
		onClose();
	}
	return (
		<Dialog open={isModalOpen} onOpenChange={handleClose}>
			<DialogContent className="bg-white  text-black p-0 overflow-hidden">
				<DialogHeader className="pt-8 px-6">
					<DialogTitle className="text-center font-bold text-2xl">Create Channel</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						<div className="space-y-8 px-6">
							<FormField
								name="name"
								control={form.control}
								render={({ field }) => (
									<FormItem>
										<FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70"> Channel name</FormLabel>
										<FormControl>
											<Input disabled={isLoading} className="bg-zinc-300/50! border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0" placeholder="Enter Channel name" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="type"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Channel Type</FormLabel>
										<Select disabled={isLoading} onValueChange={field.onChange} value={field.value}>
											<FormControl>
												<SelectTrigger className="bg-zinc-300/50! w-full border-0 focus:ring-0 text-black ring-offset-0 capitalize outline-none focus-visible:ring-0">
													<SelectValue placeholder="Select a channel type" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{Object.values(ChannelType).map((type) => (
													<SelectItem key={type} value={type} className="capitalize">
														{type.toLocaleLowerCase()}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<DialogFooter className="bg-gray-100 px-6 py-4">
							<Button variant="primary" className="w-20" disabled={isLoading}>
								{createIsLoading ? <Loader2 className="size-5  text-white animate-spin" /> : "Create"}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
