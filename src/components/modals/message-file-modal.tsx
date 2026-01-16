"use client";
import * as z from "zod";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from "@/components/ui/dialog";

import {
	Form,
	FormControl,
	FormField,
	FormItem
} from "@/components/ui/form";

import { useModal } from "@/hooks/use-modal-store";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FileUpload } from "../file-upload";
import { Button } from "../ui/button";
import queryString from "query-string";


const formSchema = z.object({
	fileUrl: z.string().min(1, "Attachment is required.")
})

export const MessageFileModal = () => {
	const { isOpen, type, onClose, data } = useModal();
	const { apiUrl, query } = data
	const isModalOpen = isOpen && type === "messageFile"
	const router = useRouter();
	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			fileUrl: ""
		}
	})

	const [isCreating, setIsCreating] = useState(false);
	const isLoading = form.formState.isSubmitting;
	const handleClose = () => {
		form.reset()
		onClose()
	}
	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		setIsCreating(true)
		try {
			const url = queryString.stringifyUrl({
				url: apiUrl || "",
				query
			})
			await axios.post(url, {
				...values,
				content: values.fileUrl
			})
			toast.success("Attachment sent")
			form.reset()
			router.refresh();
			handleClose() ;
		} catch (error) {
			console.log(error)
			toast.error("Something went Wrong!")
		} finally {
			setIsCreating(false)
		}
	}

	return (
		<Dialog open={isModalOpen} onOpenChange={handleClose} >
			<DialogContent className="bg-white   text-black p-0 overflow-hidden">
				<DialogHeader className="pt-8 px-6">
					<DialogTitle className="text-center font-bold text-2xl">Add an attachment</DialogTitle>
					<DialogDescription className="text-center  text-zinc-500">Send a file as a message</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						<div className="space-y-8 px-6">
							<div className="flex items-center justify-center text-center">
								<FormField
									control={form.control}
									name="fileUrl"
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<FileUpload
													endpoint="messageFile"
													value={field.value}
													onChange={field.onChange}
												/>
											</FormControl>
										</FormItem>
									)}
								/>
							</div>
						</div>
						<DialogFooter className="bg-gray-100 px-6 py-4">
							<Button variant="primary" disabled={isLoading} className="w-full cursor-pointer">
								{isCreating ? <Loader2 className="size-5 animate-spin" /> : "Submit"}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
