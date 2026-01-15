import { currentProfile } from "@/lib/current-profile"
import { redirect } from "next/navigation";
import { NavigationAction } from "./navigation-action";
import { ScrollArea } from "../ui/scroll-area";
import { NavigationItem } from "./navigation-item";
import { ModeToggle } from "../mode-toggle";
import { UserButton } from "@clerk/nextjs";

const NavigationSidebar = async () => {
	const profile = await currentProfile();

	if (!profile) {
		redirect("/")
	}
	const servers = await prisma?.server.findMany({
		where: {
			members: {
				some: {
					profileId: profile.id
				}
			}
		}
	});
	return (
		<div className="space-y-4 flex flex-col items-center h-screen text-primary w-full dark:bg-[#1E1f22] bg-[#E3E5E8] py-3">
			<NavigationAction />
			<hr className="h-0.5 rounded-md dark:bg-zinc-700  bg-zinc-300 w-8 mx-auto" />
			<ScrollArea className="flex-1 w-full">
				{servers?.map((server) => (
					<div className="mb-4" key={server.id}>
						<NavigationItem
							name={server.name}
							imageUrl={server.imageUrl}
							id={server.id}
						/>
					</div>
				))}
			</ScrollArea>
			<div className="pb-3 pt-auto flex items-center  flex-col gap-y-4 ">
				<ModeToggle />
				<UserButton afterSignOutUrl="/" appearance={{
					elements: {
						avatarBox: { width: "40px", height: "40px" }
					}
				}} />
			</div>
		</div>

	)
}

export default NavigationSidebar
