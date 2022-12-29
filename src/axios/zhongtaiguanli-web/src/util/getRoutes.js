import { DynamicRoute } from '@/common/router/module/index'

const getRoutes = (Auth = [], GatherRoute = DynamicRoute()) => {
	if (!Auth.length || !GatherRoute.length) {
		return []
	}

	const routerMap = []

	for (let i in GatherRoute) {
		const current = GatherRoute[ i ]
		const { authority, children } = GatherRoute[ i ]

		if (Auth.indexOf(authority) > -1) {
			if (children instanceof Array && children.length > 0) {
				const flatten = getRoutes(Auth, children);

				if (flatten.length) {
					current.children = flatten
					current.redirect = flatten[ 0 ].path
				}
			}

			routerMap.push(current)
		}
	}

	return routerMap
}

const getRouteInfo = (path = '', GatherRoute = DynamicRoute()) => {
	if (!GatherRoute.length) {
		return {}
	}

	let info = {}

	const flattenRoute = (routeData) => {
		for (let i in routeData) {
			const current = routeData[ i ]
			const { children } = current

			if (current.path === path) {

				info = current
			} else {
				if (children instanceof Array && children.length > 0) {
					flattenRoute(children)
				}
			}
		}
	}

	flattenRoute(GatherRoute)

	return info
}

export default getRoutes
export {
	getRouteInfo
}