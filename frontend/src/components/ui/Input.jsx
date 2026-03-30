export default function Input({ ...props }) {
  return (
    <input
      className="w-full border p-2 rounded-lg focus:outline-primary"
      {...props}
    />
  );
}