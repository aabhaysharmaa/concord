
interface ServerIdPageProps {
	params: {
		serverId: string
	}
}

const ServerIdPage = async ({ params }: ServerIdPageProps) => {
	const { serverId } = await params
	return (
		<div>
			Server Id : {serverId}
			hello
		</div>
	)
}

export default ServerIdPage
