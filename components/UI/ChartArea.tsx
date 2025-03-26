import React from 'react'

const ChartArea: React.FC<{
	className?: string
	children: React.ReactNode
}> = props => {
	const { className, children } = props
	const classes = `py-4 px-0 sm:p-4 bg-white rounded-xl shadow-md ${className}`

	return <div className={classes}>{children}</div>
}

export default ChartArea
