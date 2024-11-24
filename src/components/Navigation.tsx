// src/components/Navigation.tsx
import {
	Group,
	Button,
	Box,
	rem,
	Burger,
	Drawer,
	Stack,
	Menu,
	Text,
} from "@mantine/core";
import { Link, useLocation } from "react-router-dom";
import { IconBallFootball, IconLogout, IconUser } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { LoginModal, RegisterModal } from "./AuthModals";
import { MouseEvent } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../app/store";
import { logout } from "../features/auth/authSlice";

interface NavigationLinkProps {
	to: string;
	children: React.ReactNode;
	onClick?: () => void;
	isMobile?: boolean;
}

const NavigationLink = ({
	to,
	children,
	onClick,
	isMobile = false,
}: NavigationLinkProps) => {
	const location = useLocation();
	const isActive = location.pathname === to;

	const linkStyle: React.CSSProperties = {
		textDecoration: "none",
		color: isMobile ? "#228BE6" : "white",
		fontSize: rem(16),
		fontWeight: 500,
		transition: "opacity 0.2s ease",
		width: isMobile ? "100%" : "auto",
		padding: isMobile ? "10px" : undefined,
		borderRadius: isMobile ? "4px" : undefined,
		backgroundColor: isMobile ? "transparent" : undefined,
		opacity: isActive ? 1 : 0.8,
		position: "relative",
	};

	const activeIndicatorStyle: React.CSSProperties = {
		content: '""',
		position: "absolute",
		bottom: "-3px",
		left: 0,
		width: "100%",
		height: "2px",
		backgroundColor: isMobile ? "#228BE6" : "white",
		display: isActive ? "block" : "none",
	};

	return (
		<Link
			to={to}
			style={linkStyle}
			onClick={onClick}
			onMouseEnter={(e: MouseEvent<HTMLAnchorElement>) =>
				!isActive && (e.currentTarget.style.opacity = "1")
			}
			onMouseLeave={(e: MouseEvent<HTMLAnchorElement>) =>
				!isActive && (e.currentTarget.style.opacity = "0.8")
			}
		>
			{children}
			<div style={activeIndicatorStyle} />
		</Link>
	);
};

const MobileNavLink = ({ to, children, onClick }: NavigationLinkProps) => {
	const location = useLocation();
	const isActive = location.pathname === to;

	const boxStyle: React.CSSProperties = {
		padding: "10px",
		borderRadius: "4px",
		color: "#228BE6",
		cursor: "pointer",
		backgroundColor: isActive ? "#E7F5FF" : "transparent",
	};

	return (
		<Box
			style={boxStyle}
			onMouseEnter={(e: MouseEvent<HTMLDivElement>) =>
				!isActive && (e.currentTarget.style.backgroundColor = "#f8f9fa")
			}
			onMouseLeave={(e: MouseEvent<HTMLDivElement>) =>
				!isActive && (e.currentTarget.style.backgroundColor = "transparent")
			}
		>
			<NavigationLink to={to} onClick={onClick} isMobile>
				{children}
			</NavigationLink>
		</Box>
	);
};

interface AuthButtonsProps {
	isMobile?: boolean;
}

const AuthButtons = ({ isMobile = false }: AuthButtonsProps) => {
	const dispatch = useDispatch();
	const { isAuthenticated, user } = useSelector(
		(state: RootState) => state.auth
	);

	console.log("AuthButtons state:", { isAuthenticated, user });
	const [loginOpened, { open: openLogin, close: closeLogin }] =
		useDisclosure(false);
	const [registerOpened, { open: openRegister, close: closeRegister }] =
		useDisclosure(false);

	const handleLogout = () => {
		dispatch(logout());
	};

	if (isAuthenticated) {
		if (isMobile) {
			return (
				<Stack gap="md" style={{ width: "100%" }}>
					<Text size="sm" fw={500} c="dimmed">
						{user?.firstName} {user?.lastName}
					</Text>
					<Button
						variant="outline"
						color="red"
						size="md"
						onClick={handleLogout}
						leftSection={<IconLogout size={16} />}
						fullWidth
					>
						Выйти
					</Button>
				</Stack>
			);
		}

		return (
			<Menu shadow="md" width={200}>
				<Menu.Target>
					<Button
						variant="white"
						size="md"
						leftSection={<IconUser size={16} />}
						style={{
							color: "#228BE6",
							fontWeight: 500,
							transition: "transform 0.2s ease",
						}}
					>
						{user?.firstName}
					</Button>
				</Menu.Target>

				<Menu.Dropdown>
					<Menu.Label>Аккаунт</Menu.Label>
					<Menu.Item
						color="red"
						leftSection={<IconLogout size={16} />}
						onClick={handleLogout}
					>
						Выйти
					</Menu.Item>
				</Menu.Dropdown>
			</Menu>
		);
	}

	return (
		<>
			<Group gap="md" style={isMobile ? { width: "100%" } : {}}>
				<Button
					variant={isMobile ? "outline" : "white"}
					size="md"
					onClick={openLogin}
					style={{
						color: "#228BE6",
						fontWeight: 500,
						transition: "transform 0.2s ease",
						...(isMobile && { width: "100%" }),
					}}
					onMouseEnter={(e: MouseEvent<HTMLButtonElement>) =>
						(e.currentTarget.style.transform = "scale(1.05)")
					}
					onMouseLeave={(e: MouseEvent<HTMLButtonElement>) =>
						(e.currentTarget.style.transform = "scale(1)")
					}
				>
					Войти
				</Button>
				<Button
					size="md"
					variant={isMobile ? "filled" : "gradient"}
					gradient={!isMobile ? { from: "blue", to: "cyan" } : undefined}
					color={isMobile ? "blue" : undefined}
					onClick={openRegister}
					style={{
						fontWeight: 500,
						transition: "transform 0.2s ease",
						...(isMobile && { width: "100%" }),
					}}
					onMouseEnter={(e: MouseEvent<HTMLButtonElement>) =>
						(e.currentTarget.style.transform = "scale(1.05)")
					}
					onMouseLeave={(e: MouseEvent<HTMLButtonElement>) =>
						(e.currentTarget.style.transform = "scale(1)")
					}
				>
					Регистрация
				</Button>
			</Group>

			<LoginModal opened={loginOpened} close={closeLogin} />
			<RegisterModal opened={registerOpened} close={closeRegister} />
		</>
	);
};

const Navigation = () => {
	const { isAuthenticated } = useSelector((state: RootState) => state.auth);
	const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
		useDisclosure(false);

	return (
		<Box
			style={{
				background: "#228BE6",
			}}
		>
			<Group
				h={rem(60)}
				px={{ base: "md", sm: rem(50) }}
				justify="space-between"
				style={{ maxWidth: "1200px", margin: "0 auto" }}
			>
				<Group>
					<Link to="/" style={{ textDecoration: "none" }}>
						<Group gap={rem(12)} align="center" wrap="nowrap">
							<IconBallFootball
								size={35}
								style={{
									color: "white",
									transform: "rotate(-15deg)",
								}}
							/>
							<Box
								display={{ base: "none", xs: "block" }}
								style={{
									fontSize: rem(26),
									fontWeight: 800,
									letterSpacing: "-0.5px",
									color: "white",
								}}
							>
								СПОРТИК
							</Box>
							<Box
								display={{ base: "block", xs: "none" }}
								style={{
									fontSize: rem(20),
									fontWeight: 800,
									letterSpacing: "-0.5px",
									color: "white",
								}}
							>
								СПОРТИК
							</Box>
						</Group>
					</Link>
				</Group>

				<Group
					gap={rem(40)}
					display={{ base: "none", md: "flex" }}
					style={{
						position: "absolute",
						left: "50%",
						transform: "translateX(-50%)",
					}}
				>
					<NavigationLink to="/">Главное</NavigationLink>
					<NavigationLink to="/events">Мероприятия</NavigationLink>
					<NavigationLink to="/news">Новости</NavigationLink>
					{isAuthenticated && (
						<>
							<NavigationLink to="/forum">Форум</NavigationLink>
							<NavigationLink to="/team">Команды</NavigationLink>
						</>
					)}
				</Group>

				<Group ml="auto" display={{ base: "none", md: "flex" }}>
					<AuthButtons />
				</Group>

				<Box display={{ base: "block", md: "none" }}>
					<Burger
						opened={drawerOpened}
						onClick={toggleDrawer}
						color="white"
						size="sm"
					/>
				</Box>
			</Group>

			<Drawer
				opened={drawerOpened}
				onClose={closeDrawer}
				size="100%"
				padding="md"
				title={
					<Group gap={rem(12)} align="center">
						<IconBallFootball size={35} style={{ color: "#228BE6" }} />
						<Box
							style={{
								fontSize: rem(26),
								fontWeight: 800,
								letterSpacing: "-0.5px",
								color: "#228BE6",
							}}
						>
							SPORTS
						</Box>
					</Group>
				}
				withCloseButton
			>
				<Stack gap="xl" style={{ height: "100%" }}>
					<Stack gap="md" style={{ flex: 1 }}>
						<MobileNavLink to="/" onClick={closeDrawer}>
							Главное
						</MobileNavLink>
						<MobileNavLink to="/events" onClick={closeDrawer}>
							Спорт
						</MobileNavLink>
						<MobileNavLink to="/news" onClick={closeDrawer}>
							Новости
						</MobileNavLink>
						{isAuthenticated && (
							<>
								<MobileNavLink to="/forum" onClick={closeDrawer}>
									Форум
								</MobileNavLink>
								<MobileNavLink to="/team" onClick={closeDrawer}>
									Команды
								</MobileNavLink>
							</>
						)}
					</Stack>

					<AuthButtons isMobile />
				</Stack>
			</Drawer>
		</Box>
	);
};

export default Navigation;
