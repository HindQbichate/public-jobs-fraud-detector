import { useEffect, useState } from "react";
import axios from "../utils/axiosConfig";
import UsersTable from "../components/tables/UsersTables";
import Modal from "../components/Modal";

interface User {
  id: number;
  fullName: string;
  email: string;
  role: string;
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ fullName: "", email: "", role: "contractor" });

  const fetchUsers = () => {
    axios
      .get<User[]>("/api/users")
      .then((res) => {
        setUsers(res.data.map(({ id, fullName, email, role }) => ({ id, fullName, email, role })));
      })
      .catch(() => setError("Erreur lors de la récupération des utilisateurs."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async () => {
    try {
      await axios.post("/api/users", { ...form, password: "Default123" });
      fetchUsers();
      setIsModalOpen(false);
      setForm({ fullName: "", email: "", role: "contractor" });
    } catch {
      alert("Erreur lors de l’ajout.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-0">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Utilisateurs</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          ➕ Ajouter
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <UsersTable users={users} loading={loading} error={error} />
      </div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Ajouter un utilisateur">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddUser();
          }}
          className="space-y-5"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
              Nom complet
            </label>
            <input
              type="text"
              required
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              placeholder="Jean Dupont"
              className="w-full px-4 py-2 text-sm border rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="jean@example.com"
              className="w-full px-4 py-2 text-sm border rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
              Rôle
            </label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full px-4 py-2 text-sm border rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="contractor">Contractor</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="bg-green-600 text-white text-sm px-5 py-2 rounded-md hover:bg-green-700 transition"
            >
              ✅ Ajouter l’utilisateur
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
