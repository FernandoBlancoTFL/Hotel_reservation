import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@presentation/context/AuthContext';
import { Navbar } from '@presentation/components/Navbar/Navbar';
import { ProtectedRoute } from '@presentation/components/ProtectedRoute/ProtectedRoute';
import { Home } from '@presentation/pages/Home/Home';
import { Login } from '@presentation/pages/Login/Login';
import { Register } from '@presentation/pages/Register/Register';
import { SearchRooms } from '@presentation/pages/SearchRooms/SearchRooms';
import { MyReservations } from '@presentation/pages/MyReservations/MyReservations';
import { RoomsList } from '@presentation/pages/RoomsList/RoomsList';
import { CreateRoom } from '@presentation/pages/CreateRoom/CreateRoom';
import { AllReservations } from '@presentation/pages/AllReservations/AllReservations';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="app">
          <Navbar />
          <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Rutas protegidas para todos los usuarios autenticados */}
            <Route
              path="/search"
              element={
                <ProtectedRoute>
                  <SearchRooms />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-reservations"
              element={
                <ProtectedRoute>
                  <MyReservations />
                </ProtectedRoute>
              }
            />

            {/* Rutas protegidas para Recepcionistas y Admins */}
            <Route
              path="/rooms"
              element={
                <ProtectedRoute allowedRoles={['RECEPTIONIST', 'ADMIN']}>
                  <RoomsList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/rooms/create"
              element={
                <ProtectedRoute allowedRoles={['RECEPTIONIST', 'ADMIN']}>
                  <CreateRoom />
                </ProtectedRoute>
              }
            />
            <Route
              path="/all-reservations"
              element={
                <ProtectedRoute allowedRoles={['RECEPTIONIST', 'ADMIN']}>
                  <AllReservations />
                </ProtectedRoute>
              }
            />

            {/* Ruta por defecto */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;