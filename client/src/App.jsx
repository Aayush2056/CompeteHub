import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
 import Login from "./pages/Login.jsx";
 import Register from "./pages/Register";
import Competitions from "./pages/Competetitions.jsx";
 import CompetitionDetails from "./pages/CompetitionDetails.jsx";
 import Registration from "./pages/Registration.jsx";
 import ProtectedRoute from "./components/ProtectedRoute.jsx";
  import MyRegistrations from "./pages/MyRegistrations.jsx";
import Submission from "./pages/Submission.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import CreateCompetition from "./pages/CreateCompetition.jsx";
import AdminParticipants from "./pages/AdminParticipants.jsx";
import EditCompetition from "./pages/EditCompetition.jsx";
function App() {
  return (
   <BrowserRouter>
      <Navbar />

      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />

        <Route path="/competitions" element={<Competitions />} />

        <Route
          path="/competitions/:id"
          element={<CompetitionDetails />}
        />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        {/* Protected */}
        <Route element={<ProtectedRoute />}>
          <Route path="/competitions/:competitionId/register"element={<Registration />}/>

          <Route path="/my-registrations" element={<MyRegistrations />} />

          <Route path="/competitions/:competitionId/submission"element={<Submission />} />
        </Route>
     <Route element={<AdminRoute />}>
  <Route path="/admin"element={<AdminDashboard />}/>
   <Route  path="/admin/competitions/create" element={<CreateCompetition />}/>
   <Route  path="/admin/competitions/:competitionId/participants"  element={<AdminParticipants />}/>
     <Route path="/admin/competitions/:id/edit" element={<EditCompetition />}/>
</Route>
    
      </Routes>
    </BrowserRouter>
  );
}

export default App;