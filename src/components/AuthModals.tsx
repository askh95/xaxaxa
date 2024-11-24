// src/components/AuthModals.tsx
import {
	Modal,
	TextInput,
	PasswordInput,
	Button,
	Stack,
	Text,
	Group,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useDispatch } from "react-redux";
import {
	useLoginMutation,
	useRegisterMutation,
} from "../features/auth/authApi";
import { setCredentials } from "../features/auth/authSlice";
import { LoginRequest } from "../features/auth/types";

interface AuthModalProps {
	opened: boolean;
	close: () => void;
}

interface LoginFormValues {
	email: string;
	password: string;
}

interface RegisterFormValues {
	email: string;
	password: string;
	confirmPassword: string;
	firstName: string;
	lastName: string;
}

export const LoginModal = ({ opened, close }: AuthModalProps) => {
	const [login, { isLoading }] = useLoginMutation();

	const form = useForm<LoginFormValues>({
		initialValues: {
			email: "",
			password: "",
		},
		validate: {
			email: (value) => (/^\S+@\S+$/.test(value) ? null : "Некорректный email"),
			password: (value) =>
				value.length < 6 ? "Пароль должен содержать минимум 6 символов" : null,
		},
	});

	const handleSubmit = async (values: LoginRequest) => {
		try {
			console.log("Login request payload:", values);
			const response = await login(values).unwrap();
			console.log("Login response:", response);

			if (response.token) {
				console.log("Got token:", response.token.slice(0, 20) + "...");
			} else {
				console.error("No token in response!");
			}

			close();
		} catch (error) {
			console.error("Login error:", error);
		}
	};

	return (
		<Modal opened={opened} onClose={close} title="Войти" centered>
			<form onSubmit={form.onSubmit(handleSubmit)}>
				<Stack>
					<TextInput
						required
						label="Email"
						placeholder="your@email.com"
						{...form.getInputProps("email")}
					/>

					<PasswordInput
						required
						label="Пароль"
						placeholder="Ваш пароль"
						{...form.getInputProps("password")}
					/>

					<Group justify="space-between" mt="md">
						<Text size="sm" style={{ cursor: "pointer" }} c="blue">
							Забыли пароль?
						</Text>
					</Group>

					<Button type="submit" fullWidth loading={isLoading}>
						Войти
					</Button>
				</Stack>
			</form>
		</Modal>
	);
};

export const RegisterModal = ({ opened, close }: AuthModalProps) => {
	const dispatch = useDispatch();
	const [register, { isLoading }] = useRegisterMutation();

	const form = useForm<RegisterFormValues>({
		initialValues: {
			email: "",
			password: "",
			confirmPassword: "",
			firstName: "",
			lastName: "",
		},
		validate: {
			email: (value) => (/^\S+@\S+$/.test(value) ? null : "Некорректный email"),
			password: (value) =>
				value.length < 6 ? "Пароль должен содержать минимум 6 символов" : null,
			confirmPassword: (value, values) =>
				value !== values.password ? "Пароли не совпадают" : null,
			firstName: (value) =>
				value.length < 2 ? "Имя должно содержать минимум 2 символа" : null,
			lastName: (value) =>
				value.length < 2 ? "Фамилия должна содержать минимум 2 символа" : null,
		},
	});

	const handleSubmit = async (values: RegisterFormValues) => {
		try {
			const { confirmPassword, ...registerData } = values;

			const response = await register({
				email: registerData.email,
				password: registerData.password,
				firstName: registerData.firstName,
				lastName: registerData.lastName,
			}).unwrap();

			dispatch(setCredentials(response));
			notifications.show({
				title: "Успешно",
				message: "Регистрация завершена",
				color: "green",
			});
			close();
			form.reset();
		} catch (error: any) {
			console.error("Ошибка регистрации:", error);

			notifications.show({
				title: "Ошибка",
				message:
					error.data?.message ||
					"Произошла ошибка при регистрации. Попробуйте позже.",
				color: "red",
			});
		}
	};

	return (
		<Modal opened={opened} onClose={close} title="Регистрация" centered>
			<form onSubmit={form.onSubmit(handleSubmit)}>
				<Stack>
					<TextInput
						required
						label="Имя"
						placeholder="Ваше имя"
						{...form.getInputProps("firstName")}
					/>

					<TextInput
						required
						label="Фамилия"
						placeholder="Ваша фамилия"
						{...form.getInputProps("lastName")}
					/>

					<TextInput
						required
						label="Email"
						placeholder="your@email.com"
						{...form.getInputProps("email")}
					/>

					<PasswordInput
						required
						label="Пароль"
						placeholder="Ваш пароль"
						{...form.getInputProps("password")}
					/>

					<PasswordInput
						required
						label="Подтвердите пароль"
						placeholder="Повторите пароль"
						{...form.getInputProps("confirmPassword")}
					/>

					<Button type="submit" fullWidth loading={isLoading}>
						Зарегистрироваться
					</Button>
				</Stack>
			</form>
		</Modal>
	);
};
