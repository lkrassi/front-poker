import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	let theme = event.cookies.get('theme') || 'light';

	return resolve(event, {
		transformPageChunk: ({ html }) => {
			return html.replace('<body', `<body class="${theme === 'dark' ? 'dark-theme' : ''}"`);
		}
	});
};
