"use client";

import { MemberRole } from "@/generated/prisma/enums"
import { ServerWithMembersWithProfiles } from "@/types"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { ChevronDown, LogOut, PlusCircle, Settings, Trash, UserPlus, Users } from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";
interface ServerHeaderProps {
	server: ServerWithMembersWithProfiles
	role?: MemberRole;
}

export const ServerHeader = ({ server, role }: ServerHeaderProps) => {
	const { onOpen } = useModal();

	const isAdmin = role === MemberRole.ADMIN;
	const isModerator = isAdmin || role === MemberRole.MODERATOR;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				className="focus:outline-none" asChild
			>
				<button className=" w-full cursor-pointer text-md justify-between font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50  transition">
					{server.name}
					<ChevronDown className="size-5 ml-auto" />
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56 text-xs text-black font-medium dark:text-neutral-400 space-y-2">
				{isModerator && (
					<DropdownMenuItem onClick={() => onOpen("invite", { server })} className="text-indigo-600 dark:text-indigo-300 px-3 py-2 text-sm cursor-pointer">
						Invite people
						<UserPlus className="size-4 dark:text-indigo-300 ml-auto" />
					</DropdownMenuItem>
				)}
				{isAdmin && (
					<DropdownMenuItem onClick={() => onOpen("editServer", { server })} className="px-3 py-2 text-sm cursor-pointer">
						Server Settings
						<Settings className="ml-auto size-4 " />
					</DropdownMenuItem>
				)}
				{isAdmin && (
					<DropdownMenuItem className="px-3 py-2 text-sm cursor-pointer">
						Manage Members
						<Users className="ml-auto size-4" />
					</DropdownMenuItem>
				)}
				{isModerator && (
					<DropdownMenuItem className="px-3 py-2 text-sm cursor-pointer">
						Create Channels
						<PlusCircle className="ml-auto size-4" />
					</DropdownMenuItem>
				)}
				{isModerator && (
					<DropdownMenuSeparator />
				)}
				{isAdmin && (
					<DropdownMenuItem className="px-3 text-rose-500 py-2 text-sm cursor-pointer">
						Delete Server
						<Trash className="ml-auto size-4 text-rose-500" />
					</DropdownMenuItem>
				)}
				{!isAdmin && (
					<DropdownMenuItem className="px-3 text-rose-500 py-2 text-sm cursor-pointer">
						Leave Server
						<LogOut className="ml-auto size-4 text-rose-500" />
					</DropdownMenuItem>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
