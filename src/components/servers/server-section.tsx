"use client";


import { ChannelType, MemberRole } from '@/generated/prisma/enums';
import { ServerWithMembersWithProfiles } from '@/types';
import { ActionTooltip } from '../action-tooltip';
import { Plus, Settings } from 'lucide-react';
import { useModal } from '@/hooks/use-modal-store';

interface ServerSectionProps {
	label: string;
	role?: MemberRole;
	sectionType: "channels" | "members";
	channelType?: ChannelType;
	server?: ServerWithMembersWithProfiles
}

const ServerSection = ({
	label,
	role,
	sectionType,
	server,
	channelType
}: ServerSectionProps) => {
	const { onOpen } = useModal();
	return (
		<div className='flex items-center justify-between py-2'>
			<p className='text-xs uppercase font-semibold text-zinc-400 dark:text-zinc-400'>{label}</p>
			{role !== MemberRole.GUEST && sectionType === "channels" && (
				<ActionTooltip label={label} side='top'>
					<button onClick={() => onOpen("createChannel" ,{channelType})} className='text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300'>
						<Plus className='size-4 cursor-pointer ' />
					</button>
				</ActionTooltip>
			)}
			{role === MemberRole.ADMIN && sectionType === "members" && (
				<ActionTooltip label="Manage members" side='top'>
					<button onClick={() => onOpen("members" ,{server})} className='text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300'>
						<Settings className='size-4 cursor-pointer ' />
					</button>
				</ActionTooltip>
			)}
		</div>
	)
}

export default ServerSection
