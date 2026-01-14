import { currentProfile } from "@/lib/current-profile"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prismadb";

interface InviteCodepageProps {
	params: {
		inviteCode: string
	}
}

const InviteCodepage = async ({ params }: InviteCodepageProps) => {
	const { inviteCode } = await params
	const profile = await currentProfile();
	if (!profile) {
		return redirect("/sign-in")
	}
	if (!inviteCode) {
		return redirect("/")
	}

	// Checking is this user already have an existing server if yes then redirect this users to that  server
	const existingServer = await prisma.server.findFirst({
		where: {
			inviteCode,
			members: {
				some: {
					profileId: profile.id
				}
			}
		}
	})

	if (existingServer) {
		redirect(`/servers/${existingServer.id}`)
	}

	// if user donsen't have an existing member then updating the server with unique code and then create a member
	const server = await prisma.server.update({
		where: {
			inviteCode
		}, data: {
			members: {
				create: [
					{ profileId: profile.id  }
				]
			}
		}
	})

	if (server) {
		return redirect(`/servers/${server.id}`)
	}

	return null;
}

export default InviteCodepage
