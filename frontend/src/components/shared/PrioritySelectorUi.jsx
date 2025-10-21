export default function PrioritySelectorUI({ selected, onChange }) {
  return (
    <>
      <label>Priority</label>
      <select
        value={selected}
        onChange={(e) => onChange(e.target.value)}
        style={{
          padding: "8px",
          borderRadius: "4px",
          border: "1px solid #ccc",
          marginBottom: "10px",
        }}
      >
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>
    </>
  );
}
