import { Link } from "react-router-dom";
import "../../CSS/userInput.css";
import Input from "../shared/Input";
import Button from "../shared/Button";
import { useUserInput } from "../../hooks/useUserInput";
import PrioritySelectorUI from "../shared/PrioritySelectorUi";

function UserInput() {
  const {
    state,
    selectedPriority,
    setSelectedPriority,
    handleUserInput,
    handleSubmit,
  } = useUserInput();

  return (
    <div className="input-container">
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <label>Title</label>
          <Input
            type="text"
            value={state.userInput.title}
            onChange={handleUserInput}
            id="title"
            maxLength={30}
            required
          />
          <label>Description</label>
          <textarea
            required
            placeholder="Description"
            value={state.userInput.description}
            onChange={handleUserInput}
            id="description"
            rows="5"
            maxLength={500}
          />
          <label>Due Date</label>
          <Input
            type="date"
            value={state.userInput.dueDate}
            onChange={handleUserInput}
            id="dueDate"
            min={new Date().toISOString().split("T")[0]}
            required
          />

          <PrioritySelectorUI
            selected={selectedPriority}
            onChange={setSelectedPriority}
          />

          <Button type="submit">Add Todo</Button>

          {state.isGuest && (
            <p
              style={{
                fontSize: "12px",
                color: "#6c757d",
                textAlign: "center",
                marginTop: "8px",
              }}
            >
              📝 Guest Mode - Todos stored locally
            </p>
          )}

          <Link
            to="/dashboard"
            style={{
              color: "#ff5252",
              textDecoration: "none",
              fontWeight: "bold",
              textAlign: "center",
              display: "block",
              marginTop: "10px",
            }}
          >
            Go to Dashboard
          </Link>
        </form>
      </div>
    </div>
  );
}

export default UserInput;
