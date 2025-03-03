import { redirect } from '@sveltejs/kit';

export const load = async ({ cookies, url }) => {
	const accessToken = cookies.get('access_token');

	// защищенные пути
	const protectedPaths = ['/main', '/profile', '/rules'];

	if (!accessToken && protectedPaths.includes(url.pathname)) {
		throw redirect(302, '/');
	}
};

// переписать, так что бы проверка была не через чек кук на клиенте,
// а через запрос на /checkAuth на сервере, если токен есть и жив, то пускать,
// если токен есть но не жив, перевыпустить и пустить
