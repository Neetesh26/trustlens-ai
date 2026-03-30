export default function Button({ children, ...props }) {
  return (
    <button
      className="bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90"
      {...props}
    >
      {children}
    </button>
  );
}