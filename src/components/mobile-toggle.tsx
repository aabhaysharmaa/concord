
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'
import { Button } from './ui/button'
import { Menu } from 'lucide-react'
import NavigationSidebar from './navigation/navigation-sidebar'
import { ServerSidebar } from './servers/server-sidebar'
import { DialogTitle } from './ui/dialog'




export const MobileToggle = ({ serverId }: { serverId: string }) => {
	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button variant="ghost" size="icon" className='md:hidden'>
					<Menu className='' />
				</Button>
			</SheetTrigger>
			<SheetContent className='p-0 flex flex-row gap-0' side='left'>
				<DialogTitle></DialogTitle>
					<NavigationSidebar />
					<div className="w-450">
					<ServerSidebar serverId={serverId} />
					</div>
			</SheetContent>
		</Sheet>
	)
}
