// src/components/PrivateRoute.tsx
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { RootState } from "../app/store";

interface PrivateRouteProps {
	children: JSX.Element;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
	const location = useLocation();
	const { isAuthenticated } = useSelector((state: RootState) => state.auth);

	if (!isAuthenticated) {
		// Сохраняем текущий URL в state, чтобы после логина вернуться на эту страницу
		return <Navigate to="/" state={{ from: location }} replace />;
	}

	return children;
};

export default PrivateRoute;
