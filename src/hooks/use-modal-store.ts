import { Server } from "@/generated/prisma/client";
import { create } from "zustand";


export type ModalType = "createServer" | "invite" |"editServer" | "members" | "createChannel";


interface ModalData {
	server?: Server
}

interface ModalStoreType {
	type: ModalType | null;
	data: ModalData
	isOpen: boolean;
	onOpen: (type: ModalType, data?: ModalData) => void;
	onClose: () => void
}


export const useModal = create<ModalStoreType>((set) => ({
	type: null,
	isOpen: false,
	data: {},
	onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
	onClose: () => set({ type: null, isOpen: false })
}))