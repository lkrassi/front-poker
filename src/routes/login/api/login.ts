import { sendConfirmationCode } from '../../register/api/sendCode';

export const loginUser = async (email: string, password: string) => {
	try {
		const BASE_URL = import.meta.env.VITE_BASE_URL;
		const res = await fetch(`${BASE_URL}/auth/sign_in`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, password })
		});

		const data = await res.json();

		if (res.status === 201) {
			document.cookie = `access_token=${data.access_token}; path=/; Secure`;
			document.cookie = `refresh_token=${data.refresh_token}; path=/; Secure`;

			return {
				success: true,
				message: 'Вход успешен!',
				accessToken: data.access_token,
				refreshToken: data.refresh_token
			};
		}

		if (res.status === 400)
			return { success: false, message: 'Некорректные данные, проверьте ввод' };
		if (res.status === 401) return { success: false, message: 'Неверный пароль' };
		if (res.status === 403) {
			await sendConfirmationCode(email, password);
			return { success: false, message: 'Email не подтвержден' };
		}
		if (res.status === 404) return { success: false, message: 'Email не зарегистрирован' };

		return { success: false, message: 'Ошибка авторизации, попробуйте позже' };
	} catch (error) {
		console.error('Ошибка входа:', error);
		return { success: false, message: 'Ошибка сети, проверьте подключение' };
	}
};
