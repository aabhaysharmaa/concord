"use client";
import { CreateChannelModal } from "@/components/modals/create-channel-modal";
import { CreateServerModal } from "@/components/modals/create-server-model";
import { DeleteChannelModal } from "@/components/modals/delete-channel-modal";
import { DeleteServerModal } from "@/components/modals/delete-server-modal";
import { EditChannelModal } from "@/components/modals/edit-channel-modal";
import { EditServerModal } from "@/components/modals/edit-server-modal";
import { InviteModal } from "@/components/modals/invite-modal";
import { LeaveServerModal } from "@/components/modals/leave-server-modal";
import { MemberModal } from "@/components/modals/member-modal";
import { useEffect, useState } from "react";

export const ModalProvider = () => {
	// we use isMounted method for protecting our components from SSR errors because it may cause hydration errors
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setIsMounted(true)
	}, [])
	if(!isMounted) return
	return (
		<>
			<CreateServerModal />
			<InviteModal />
			<EditServerModal />
			<MemberModal />
			<CreateChannelModal />
			<LeaveServerModal />
			<DeleteServerModal />
			<DeleteChannelModal />
			<EditChannelModal/>
		</>
	)
}

