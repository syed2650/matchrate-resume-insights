
import { useNavigate } from "react-router-dom";

export default function NavBar() {
  const navigate = useNavigate();

  // This component is no longer used in the main layout
  // Navigation is now consolidated in the Header component
  return null;
}
