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
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import axios from "axios";
import queryString from "query-string";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const LeaveServerModal = () => {
	const { isOpen, onClose, type, data } = useModal();
	const isModalOpen = isOpen && type === "leaveServer";
	const router = useRouter();
	const { server } = data
	const [isLoading, setIsLoading] = useState(false)

	const onClick = async () => {
		setIsLoading(true);
		try {
			const url = queryString.stringifyUrl({
				url: "/api/leaveServer",
				query: {
					serverId: server?.id
				}
			})
			 await axios.patch(url);
			router.refresh();
			onClose();
		} catch (error) {
			console.log("Error in on lever modal : ", error)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<Dialog open={isModalOpen} onOpenChange={onClose}>
			<DialogContent className="bg-white  text-black p-0 overflow-hidden">
				<DialogHeader className="pt-8 px-6 ">
					<DialogTitle className="text-center font-bold text-2xl">Leave Server</DialogTitle>
					<DialogDescription className="text-center text-zinc-600">
						Are you sure you want to leave ? <span className="font-semibold text-indigo-500">{server?.name}</span>
					</DialogDescription>
				</DialogHeader>
				<DialogFooter className="bg-gray-100 px-6 py-4">
					<div className="flex items-center justify-between w-full">
						<Button className="" onClick={onClose} disabled={isLoading}>
							Cancel
						</Button>
						<Button variant="primary" onClick={onClick} disabled={isLoading}>
							{isLoading ? <Loader2 className="size-5 animate-spin" /> : "Confirm"}
						</Button>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
