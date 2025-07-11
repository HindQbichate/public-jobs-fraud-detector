import { useEffect, useState } from "react";
import axios from "../utils/axiosConfig";
import UsersTable from "../components/tables/UsersTables";
import Modal from "../components/Modal";
import Button from "../components/ui/button/Button";
import { Check, Plus, X, Pencil } from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface User {
  id: number;
  fullName: string;
  email: string;
  role: string;
}

export default function Users() {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);

  const [addForm, setAddForm] = useState({ fullName: "", email: "", role: "contractor" });
  const [editForm, setEditForm] = useState({ id: 0, fullName: "", email: "", role: "contractor" });

  const fetchUsers = () => {
    axios
      .get<User[]>("/api/users")
      .then((res) => setUsers(res.data))
      .catch(() => setError("Erreur lors de la récupération des utilisateurs."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ✅ Add User Logic
  const handleAddUser = async () => {
    try {
      await axios.post("/api/users", { ...addForm, password: "Default123" });
      fetchUsers();
      setIsAddModalOpen(false);
      setAddForm({ fullName: "", email: "", role: "contractor" });
    } catch {
      alert("Erreur lors de l’ajout.");
    }
  };

  // ✅ Edit User Logic
  const handleUpdateUser = async () => {
    try {
      await axios.put(`/api/users/${editForm.id}`, editForm);
      fetchUsers();
      setIsEditModalOpen(false);
    } catch {
      alert("Erreur lors de la modification.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-4 sm:px-0">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Utilisateurs</h1>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          size="md"
          variant="primary"
          startIcon={<Plus size={16} />}
        >
          Ajouter
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <UsersTable
          users={users}
          loading={loading}
          error={error}
          currentUserId={user?.id}

          onEdit={(user) => {
            setEditForm(user);
            setIsEditModalOpen(true);
          }}
          onDelete={async (id) => {
            if (confirm("Supprimer cet utilisateur ?")) {
              try {
                await axios.delete(`/api/users/${id}`);
                fetchUsers();
              } catch {
                alert("Erreur lors de la suppression.");
              }
            }
          }}
        />
      </div>

      {/* ➕ Add Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Ajouter un utilisateur">
        <form onSubmit={(e) => { e.preventDefault(); handleAddUser(); }} className="space-y-5">
          <UserFormFields form={addForm} setForm={setAddForm} />
          <div className="flex justify-end gap-2">
            <Button onClick={() => setIsAddModalOpen(false)} variant="outline" startIcon={<X size={16} />}>Annuler</Button>
            <Button type="submit" variant="primary" startIcon={<Check size={16} />}>Ajouter</Button>
          </div>
        </form>
      </Modal>

      {/* ✏️ Edit Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Modifier un utilisateur">
        <form onSubmit={(e) => { e.preventDefault(); handleUpdateUser(); }} className="space-y-5">
          <UserFormFields form={editForm} setForm={setEditForm} />
          <div className="flex justify-end gap-2">
            <Button onClick={() => setIsEditModalOpen(false)} variant="outline" startIcon={<X size={16} />}>Annuler</Button>
            <Button type="submit" variant="primary" startIcon={<Pencil size={16} />}>Mettre à jour</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

// ✅ Reusable input fields
function UserFormFields({
  form,
  setForm,
}: {
  form: { fullName: string; email: string; role: string };
  setForm: (form: any) => void;
}) {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">Nom complet</label>
        <input
          type="text"
          required
          value={form.fullName}
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          className="w-full px-4 py-2 text-sm border rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">Email</label>
        <input
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full px-4 py-2 text-sm border rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">Rôle</label>
        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          className="w-full px-4 py-2 text-sm border rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="admin">Admin</option>
          <option value="consultant">Consultant</option>
          <option value="analyste">Analyst</option>
        </select>
      </div>
    </>
  );
}
