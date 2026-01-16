"use client";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from "@/components/ui/dialog";

import { useModal } from "@/hooks/use-modal-store";
import axios from "axios";
import { Loader2 } from "lucide-react";
import queryString from "query-string";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";

export const DeleteMessageModal = () => {
	const { isOpen, onClose, type, data } = useModal();
	const isModalOpen = isOpen && type === "deleteMessage";
	const { apiUrl, query } = data
	const [isLoading, setIsLoading] = useState(false)


	const onDelete = async () => {
		setIsLoading(true)
		try {
			const url = queryString.stringifyUrl({
				url: apiUrl || "",
				query: query
			})
			await axios.delete(url);
			onClose();
		} catch (error) {
			console.log("Error in ServerHeader :", error)
			toast.error("Something went wrong")
		} finally {
			setIsLoading(false);
		}
	}


	return (
		<Dialog open={isModalOpen} onOpenChange={onClose}>
			<DialogContent className="bg-white  text-black dark:bg-black dark:text-white p-0 overflow-hidden">
				<DialogHeader className="pt-8 px-6 ">
					<DialogTitle className="text-center font-bold text-2xl">Delete Message</DialogTitle>
					<DialogDescription className="text-center dark:text-white/70 text-zinc-600">
						Are you sure you want to Delete this?  <br />
						The message will be permanently delete
					</DialogDescription>
				</DialogHeader>
				<DialogFooter className="bg-gray-100 dark:bg-neutral-950 dark:text-white  px-6 py-4">
					<div className="flex items-center justify-between w-full">
						<Button className="" onClick={onClose} disabled={isLoading}>
							Cancel
						</Button>
						<Button variant="primary" className=" text-center" onClick={onDelete} disabled={isLoading}>
							{isLoading ? <Loader2 className="size-5 animate-spin" /> : "Confirm"}
						</Button>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
