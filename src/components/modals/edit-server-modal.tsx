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
	FormItem,
	FormLabel,
	FormMessage
} from "@/components/ui/form";

import { useModal } from "@/hooks/use-modal-store";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FileUpload } from "../file-upload";
import { Button } from "../ui/button";
import { Input } from "../ui/input";


const formSchema = z.object({
	name: z.string().min(1, "Server name is required."),
	imageUrl: z.string().min(1, "Server Image is required.")
})

export const EditServerModal = () => {
	const { isOpen, onClose, type, data } = useModal();
	const { server } = data
	const isModalOpen = isOpen && type === "editServer";
	const [createIsLoading, setCreateIsLoading] = useState(false);
	const router = useRouter();
	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			imageUrl: ""
		}
	})
	// fetching data form this server
	useEffect(() => {
		if (server) {
			form.setValue("name", server.name)
			form.setValue("imageUrl", server.imageUrl)
		}
	}, [server, form])

	const isLoading = form.formState.isSubmitting;

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		setCreateIsLoading(true)
		try {
			await axios.patch(`/api/server/${server?.id}`, values)
			toast.success("Setting Updated")
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
					<DialogTitle className="text-center font-bold text-2xl">Customize your server</DialogTitle>
					<DialogDescription className="text-center text-zinc-500">Give your server a personality with a name and an image. you can always change it later</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						<div className="space-y-8 px-6">
							<div className="flex items-center justify-center text-center">
								<FormField
									control={form.control}
									name="imageUrl"
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<FileUpload
													endpoint="serverImage"
													value={field.value}
													onChange={field.onChange}
												/>
											</FormControl>
										</FormItem>
									)}
								/>
							</div>
							<FormField
								name="name"
								control={form.control}
								render={({ field }) => (
									<FormItem>
										<FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70"> Server name</FormLabel>
										<FormControl>
											<Input disabled={isLoading} className="bg-zinc-300/50! border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0" placeholder="Enter server name" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<DialogFooter className="bg-gray-100 px-6 py-4">
							<Button variant="primary" className="w-20" disabled={isLoading}>
								{createIsLoading ? <Loader2 className="size-5  text-white animate-spin" /> : "Save"}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
