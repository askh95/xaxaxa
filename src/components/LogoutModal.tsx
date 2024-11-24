// src/components/LogoutModal.tsx
import { Modal, Button, Group, Text } from "@mantine/core";
import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { useLogoutMutation } from "../features/auth/authApi";
import { notifications } from "@mantine/notifications";
import { ApiError } from "../features/auth/types";

interface LogoutModalProps {
	opened: boolean;
	onClose: () => void;
}

export const LogoutModal = ({ opened, onClose }: LogoutModalProps) => {
	const dispatch = useDispatch();
	const [logoutRequest] = useLogoutMutation();

	const handleLogout = async () => {
		try {
			const response = await logoutRequest().unwrap();
			dispatch(logout());
			onClose();
			notifications.show({
				title: "Успешно",
				message: response.message || "Вы успешно вышли из системы",
				color: "green",
			});
		} catch (error) {
			const apiError = error as ApiError;
			console.error("Logout failed:", apiError);
			notifications.show({
				title: "Ошибка",
				message: apiError.data?.message || "Произошла ошибка при выходе",
				color: "red",
			});
			dispatch(logout());
			onClose();
		}
	};

	return (
		<Modal opened={opened} onClose={onClose} title="Подтверждение" centered>
			<Text size="sm" mb="lg">
				Вы уверены, что хотите выйти?
			</Text>
			<Group justify="flex-end" gap="sm">
				<Button variant="light" onClick={onClose}>
					Отмена
				</Button>
				<Button color="red" onClick={handleLogout}>
					Выйти
				</Button>
			</Group>
		</Modal>
	);
};
