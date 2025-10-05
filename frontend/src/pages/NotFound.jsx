import { Link } from "react-router-dom";
import "../CSS/NotFound.css";

export default function NotFound() {
  return (
    <div className="not-found">
      <h1 className="glitch" data-text="404">
        404
      </h1>
      <h3>
        Oops... Looks like you took a wrong turn on the Information Superhighway
        🚗💨
      </h3>
      <h3>Even Google Maps cant help you here! 🗺️</h3>
      <Link to="/" className="home-button">
        Take Me Home 🏠
      </Link>
    </div>
  );
}
