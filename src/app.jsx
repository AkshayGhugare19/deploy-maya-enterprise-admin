import * as React from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import AuthRequired from './contexts/auth/authRequired';
import AuthProvider from './contexts/auth/authProvide';
import { authProtectedRoutes, publicRoutes } from './routes';
import ErrorPage from './utils/error-page';
import { ProSidebarProvider } from 'react-pro-sidebar';
import { lazy, Suspense } from "react";
import { Loader } from 'semantic-ui-react';
import SidebarLayout from './layouts/sidebar';
import "./index.css"

export default function App() {
	const location = useLocation();
	const navigate = useNavigate();

	return (
		<AuthProvider>
			<div className="app-body">
				<Suspense
					fallback={
						<div style={{ display: "flex", height: "100vh", flexDirection: "column", justifyContent: "center", alignItems: "center", alignContent: "center" }}>
							<Loader />
						</div>
					}
				>

					<Routes>
						<Route>
							{publicRoutes.map((route, idx) => (
								<Route
									errorElement={<ErrorPage />}
									path={route.path}
									element={route.component}
									key={idx}
								/>
							))}
							<Route
								path="/dashboard"
								errorElement={<ErrorPage />}
								element={
									<AuthRequired>
										<ProSidebarProvider>
											<SidebarLayout />
											{/* <ResponsiveSidebar/> */}
										</ProSidebarProvider>
									</AuthRequired>
								}>
								{authProtectedRoutes.map((route, idx) => (
									<Route
										path={route.path}
										element={route.component}
										errorElement={<ErrorPage />}
										key={idx}
									/>
								))}
							</Route>
						</Route>
					</Routes>
				</Suspense>
			</div>
		</AuthProvider>
	);
}
