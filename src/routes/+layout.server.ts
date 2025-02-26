import { redirect } from '@sveltejs/kit';

export const load = async ({ cookies, url }) => {
	const accessToken = cookies.get('access_token');

	// защищенные пути
	const protectedPaths = ['/main', '/profile', '/rules'];

	if (!accessToken && protectedPaths.includes(url.pathname)) {
		throw redirect(302, '/');
	}
};
