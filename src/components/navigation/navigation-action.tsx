"use client";

import { Plus } from "lucide-react";
import { ActionTooltip } from "../action-tooltip";
import { useModal } from "@/hooks/use-modal-store";
import { useEffect, useState } from "react";

export const NavigationAction = () => {
	const { onOpen } = useModal();
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setIsMounted(true)
	}, [])
	if(!isMounted) return
	return (
		<div>
			<ActionTooltip side="right" align="center"  label="Add a server">
				<button
					onClick={() => onOpen("createServer")}
					className="group flex items-center justify-center"
				>
					<div className="flex mx-3 h-12 w-12 rounded-full    cursor-pointer group-hover:rounded-xl transition-all  overflow-hidden items-center justify-center   bg-neutral-300   dark:bg-neutral-700  group-hover:bg-emerald-500">
						<Plus className="group-hover:text-white transition-all text-emerald-400  dark:text-emerald-500" size={25} />
					</div>
				</button>
			</ActionTooltip>
		</div>
	)
}
