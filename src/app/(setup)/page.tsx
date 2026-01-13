import { InitialProfile } from "@/lib/initial-profile"
import { UserButton } from "@clerk/nextjs"
import { prisma } from "@/lib/prismadb";
import { redirect } from "next/navigation";

const SetUpPage = async () => {
	const profile = await InitialProfile();
	const server = await prisma.server.findFirst({
		where: {
			members: {
				some: {
					profileId: profile.id
				}
			}
		}
	});

	if (server) {
		return redirect(`/servers/${server.id}`)
	}
	return (
		<div>
			Create a server
			<UserButton />
		</div>
	)
}

export default SetUpPage
