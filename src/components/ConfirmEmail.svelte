<script lang="ts">
	import { emailStore } from '../stores/emailStore';
	import { confirmEmail } from '../routes/register/api/confirmEmail';
	import Message from './Message.svelte';
	import { goto } from '$app/navigation';
	import { tick } from 'svelte';
	import { onMount, onDestroy } from 'svelte';
	import { createFocusTrap } from 'focus-trap';

	let codes = Array(6).fill('');
	let inputs: HTMLInputElement[] = [];
	let message = '';
	let messageType: 'success' | 'error' = 'success';
	let email: string;
	let modalRef: HTMLDivElement | null = null;
	let trap: any;

	emailStore.subscribe((value) => (email = value));

	const handleInput = (index: number, event: Event) => {
		const target = event.target as HTMLInputElement;
		const value = target.value.replace(/\D/g, '');

		if (value) {
			codes = [...codes.slice(0, index), value[value.length - 1], ...codes.slice(index + 1)];
			if (index < 5) inputs[index + 1]?.focus();
		} else {
			codes = [...codes.slice(0, index), '', ...codes.slice(index + 1)];
		}
	};

	const handleKeyDown = (index: number, event: KeyboardEvent) => {
		if (event.key === 'Backspace' && !codes[index] && index > 0) {
			inputs[index - 1]?.focus();
		}
	};

	const handlePaste = (event: ClipboardEvent) => {
		event.preventDefault();
		const pasteData = event.clipboardData?.getData('text').trim() || '';
		const pasteDigits = pasteData.replace(/\D/g, '').split('').slice(0, 6);

		codes = [...pasteDigits, ...Array(6 - pasteDigits.length).fill('')];
		const lastFilledIndex = pasteDigits.length - 1;
		tick().then(() => inputs[lastFilledIndex]?.focus());
	};
	const handleConfirm = async () => {
		message = '';
		await tick();

		const code = codes.join('');

		if (code.length < 6) {
			messageType = 'error';
			message = 'Пожалуйста, введите полный код';
			return;
		}

		const result = await confirmEmail(email, code);

		if (result.success) {
			messageType = 'success';
			message = 'Email подтвержден успешно!';
			goto('/login');
		} else {
			messageType = 'error';
			message = result.message || 'Ошибка подтверждения';
		}
	};

	onMount(() => {
		if (modalRef) {
			trap = createFocusTrap(modalRef, {
				allowOutsideClick: false,
				escapeDeactivates: false
			});
			trap.activate();
		}
	});

	onDestroy(() => {
		if (trap) {
			trap.deactivate();
		}
	});
</script>

<Message type={messageType} {message} />

<div class="modal-overlay">
	<div class="modal-container" bind:this={modalRef}>
		<div class="modal-container__header">
			<h2>КОД С ПОЧТЫ</h2>
		</div>
		<form class="modal-container__body" on:submit|preventDefault={handleConfirm}>
			<div class="code-inputs">
				{#each codes as _, index}
					<input
						type="text"
						class="code-input"
						name="code-{index}"
						maxlength="1"
						bind:value={codes[index]}
						on:input={(e) => handleInput(index, e)}
						on:keydown={(e) => handleKeyDown(index, e)}
						on:paste={handlePaste}
						bind:this={inputs[index]}
					/>
				{/each}
			</div>
			<button type="submit" class="modal-container__body__submit-btn">Подтвердить</button>
		</form>
	</div>
</div>

<style lang="scss">
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 2;
		padding: 10px;

		.modal-container {
			background: var(--bg-color, #fff);
			padding: 20px;
			border-radius: 8px;
			box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
			position: relative;
			width: 90vw;
			max-width: 400px;
			min-width: 280px;
			height: auto;
			max-height: 90vh;
			overflow: auto;

			.modal-container__header {
				text-align: center;
				color: var(--text-color, #333);
				margin-bottom: 20px;
			}

			.modal-container__body {
				display: flex;
				flex-direction: column;
				align-items: center;
			}

			.code-inputs {
				display: flex;
				justify-content: center;
				flex-wrap: wrap;
				gap: 10px;
				margin-bottom: 20px;

				.code-input {
					width: 40px;
					height: 40px;
					text-align: center;
					font-size: 18px;
					border: 1px solid var(--border-color, #ccc);
					border-radius: 4px;
					background-color: var(--input-bg-color, #f9f9f9);

					&:focus {
						border-color: #007bff;
						outline: none;
					}
				}
			}

			.modal-container__body__submit-btn {
				width: 100%;
				padding: 10px;
				background-color: #007bff;
				color: #fff;
				border: none;
				border-radius: 4px;
				cursor: pointer;
				transition:
					background-color 0.3s ease,
					transform 0.1s ease;

				&:hover,
				&:focus {
					background-color: #0056b3;
				}

				&:active {
					transform: scale(0.98);
				}
			}
		}
	}
</style>
