"use client";
import { CreateServerModal } from "@/components/modals/create-server-model";
import { EditServerModal } from "@/components/modals/edit-server-modal";
import { InviteModal } from "@/components/modals/invite-modal";
import { MemberModal } from "@/components/modals/member-modal";
import { useEffect, useState } from "react";



export const ModalProvider = () => {
	// we use isMounted method for protecting our components from SSR errors because it may cause hydration errors
	const [isMounted, setIsMounted] = useState(false)

	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setIsMounted(true)
	}, [])
	if (!isMounted) return
	return (
		<>
			<CreateServerModal />
			<InviteModal />
			<EditServerModal />
			<MemberModal/>
		</>
	)
}

