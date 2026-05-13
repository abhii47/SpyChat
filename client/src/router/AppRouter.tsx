import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom"
import LoginPage from "../pages/LoginPage"
import RegisterPage from "../pages/RegisterPage"
import ChatPage from "../pages/ChatPage"
import { useAuthStore } from "../store/authStore"

const ProtectedRoute = ({children}:{ children: React.ReactNode }) => {
    const { isAuthenticated, isLoading } = useAuthStore()

    if(isLoading){
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="w-8 h-8 border-2 border-blue-500
                        border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }
    return isAuthenticated ? children : <Navigate to="/login" replace />
}

const PublicRoute = ({children}:{ children: React.ReactNode }) => {
    const { isAuthenticated, isLoading } = useAuthStore()
    
    if(isLoading){
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="w-8 h-8 border-2 border-blue-500
                        border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    return isAuthenticated 
            ? <Navigate to="/" replace />
            : <>{children}</> 
}

const AppRouter = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
            <Route path="/" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    </BrowserRouter>
)

export default AppRouter;