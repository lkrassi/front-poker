<script lang="ts">
	import { goto } from '$app/navigation';
	import Header from '../../components/Header.svelte';

	const clearCookies = () => {
		const cookiesToClear = ['access_token', 'refresh_token'];

		cookiesToClear.forEach((name) => {
			document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
		});
	};

	const logout = () => {
		clearCookies();
		goto('/');
	};
</script>

<Header />

<main class="profile">
	<h1>тут инфа о пользователе (имя, почта и тп.)</h1>
	<div class="profile__logout">
		<button class="logout-btn" on:click={logout}>Выйти</button>
	</div>
</main>

<style lang="scss">
	.profile {
		.profile__logout {
			display: flex;
			justify-content: center;
			margin-top: 20px;

			.logout-btn {
				background-color: var(--primary-color);
				color: #fff;
			}
		}
	}
</style>
