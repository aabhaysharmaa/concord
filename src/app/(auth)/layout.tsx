import React, { ReactNode } from 'react'

interface AuthLayoutProps {
	children: ReactNode
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
	return (
		<main className='min-h-screen flex items-center justify-center'>
			{children}
		</main>
	)
}

export default AuthLayout
