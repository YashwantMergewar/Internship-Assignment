import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ListViewPage from "./pages/ListViewPage";
import { Toaster } from "@/components/ui/sonner";
import AddUsers from "./pages/AddUsers";
import ViewUserDetails from "./pages/ViewUserDetails";
import EditUserPage from "./pages/editUserPage";

function App() {

  return (
    <>
      <Router>
        <div>
          <Routes>
            <Route path="/" element={<ListViewPage />} />
            <Route path="/add-users" element={<AddUsers />} />
            <Route path="/view-user/:id" element={<ViewUserDetails />} />
            <Route path="/edit-user/:id" element={<EditUserPage />} />
          </Routes>
        </div>
      </Router>
      <Toaster />
    </>
  )
}

export default App
