"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { ActionTooltip } from "../action-tooltip";
import { useEffect, useState } from "react";

interface NavigationActionProps {
	id: string
	name: string
	imageUrl: string
}

export const NavigationItem = ({ id, name, imageUrl }: NavigationActionProps) => {
	const params = useParams();
	const router = useRouter();

	const onClick = () => {
		router.push(`/servers/${id}`)
	}
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setIsMounted(true)
	}, [])
	if (!isMounted) return
	return (
		<ActionTooltip label={name} side="right" align="center" >
			{/* corner slider */}
			<button onClick={onClick} className="group cursor-pointer relative flex items-center">
				<div className={cn("absolute  bg-primary rounded-full left-0 transition-all w-1", params?.serverId !== id && "group-hover:h-5", params.serverId === id ? "h-9" : "h-2")} />
				{/* server image */}
				<div className={cn("relative group flex mx-3 w-10 h-10  rounded-3xl group-hover:rounded-3xl",
					params?.serverId === id && "bg-primary/10 text-primary rounded-3xl"
				)}>
					<Image src={imageUrl || "/icon/concord-icon.svg"} fill alt="Channel" className="rounded-full  object-cover" />
				</div>
			</button>
		</ActionTooltip>
	)
}

