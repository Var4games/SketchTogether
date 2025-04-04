import { useEffect, useRef } from "react";
import gsap from "gsap";

const UsersList = ({ users }) => {
  const listRef = useRef(null);

  useEffect(() => {
    if (users.length > 0) {
      gsap.fromTo(
        listRef.current.children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power3.out" }
      );
    }
  }, [users]);

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-lg font-semibold text-gray-700 mb-2">
        🟢 Online Users
      </h2>
      <ul ref={listRef} className="space-y-1 max-h-40 overflow-y-auto">
        {users.map((user, index) => (
          <li
            key={index}
            className="px-3 py-1 rounded-md bg-green-100 text-green-700 font-medium"
          >
            {user}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsersList;
