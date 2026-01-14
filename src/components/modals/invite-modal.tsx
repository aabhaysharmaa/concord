"use client";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle
} from "@/components/ui/dialog";

import { useModal } from "@/hooks/use-modal-store";
import { CheckCheck, Copy, RefreshCcw } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useOrigin } from "@/hooks/use-origin";
import { useState } from "react";
import axios from "axios";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const InviteModal = () => {
	const { isOpen, onClose, type, data, onOpen } = useModal();
	const isModalOpen = isOpen && type === "invite";
	const origin = useOrigin();
	const { server } = data
	const inviteUrl = `${origin}/invite/${server?.inviteCode}`;
	const [isLoading, setIsLoading] = useState(false)
	const [isCopied, setIsCopied] = useState(false);


	const onCopy = () => {
		if (!server?.inviteCode) return
		navigator.clipboard.writeText(inviteUrl || "")
		setIsCopied(true)
		setTimeout(() => {
			setIsCopied(false)
		}, 1000)
	}

	const CopyLabel = isCopied ? CheckCheck : Copy

	const onNew = async () => {
		setIsLoading(true)
		try {
			const res = await axios.patch(`/api/server/${server?.id}/invite-code`)
			onOpen("invite", { server: res.data });
			toast.success("Server Invite Link Generated")
		} catch (error) {
			console.log("Error in onNew", error)
			toast.error("Something went Wrong")
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<Dialog open={isModalOpen} onOpenChange={onClose}>
			<DialogContent className="bg-white  text-black p-0 overflow-hidden">
				<DialogHeader className="pt-8 px-6">
					<DialogTitle className="text-center font-bold text-2xl">Invite Friends</DialogTitle>
				</DialogHeader>
				<div className="p-6">
					<Label className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">Server Invite Link</Label>
					<div className="flex items-center mt-2 gap-x-2">
						<Input disabled={isLoading} className="bg-zinc-300/50! focus-visible:ring-0 border-0 focus-visible:ring-offset-0"
							value={inviteUrl}
							onChange={() => { }}
						/>
						<Button disabled={isLoading} onClick={onCopy} size="icon">
							<CopyLabel className="size-4" />
						</Button>
					</div>
					<Button disabled={isLoading} onClick={onNew} variant="link" size="sm" className="text-xs text-zinc-500 mt-4">
						Generate a new link
						<RefreshCcw className={cn("size-4 ml-1", isLoading && "animate-spin")} />
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	)
}
