import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Pencil, Trash } from "lucide-react";

interface User {
  id: number;
  fullName: string;
  email: string;
  role: string;
}

interface UsersTableProps {
  users: User[];
  loading: boolean;
  error: string | null;
  onEdit: (user: User) => void;
  onDelete: (userId: number) => void;
  currentUserId: number;
}

export default function UsersTable({
  users,
  loading,
  error,
  onEdit,
  onDelete,
  currentUserId,
}: UsersTableProps) {
  return (
    <div className="max-w-full overflow-x-auto">
      {loading ? (
        <div className="p-4">Chargement...</div>
      ) : error ? (
        <div className="p-4 text-red-600">{error}</div>
      ) : (
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell isHeader className="px-5 py-3 text-left">ID</TableCell>
              <TableCell isHeader className="px-5 py-3 text-left">Nom complet</TableCell>
              <TableCell isHeader className="px-5 py-3 text-left">Email</TableCell>
              <TableCell isHeader className="px-5 py-3 text-left">Rôle</TableCell>
              <TableCell isHeader className="px-5 py-3 text-left">Actions</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {users.map((user) => {
              const isCurrentUser = user.id === currentUserId;
              return (
                <TableRow key={user.id}>
                  <TableCell className="px-5 py-3 text-left">{user.id}</TableCell>
                  <TableCell className="px-5 py-3 text-left">{user.fullName}</TableCell>
                  <TableCell className="px-5 py-3 text-left">{user.email}</TableCell>
                  <TableCell className="px-5 py-3 text-left">{user.role}</TableCell>
                  <TableCell className="px-5 py-3 text-left">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onEdit(user)}
                        title="Modifier"
                        disabled={isCurrentUser}
                        className={`text-blue-600 hover:text-blue-800 ${
                          isCurrentUser ? "opacity-50 cursor-not-allowed pointer-events-none" : ""
                        }`}
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => onDelete(user.id)}
                        title="Supprimer"
                        disabled={isCurrentUser}
                        className={`text-red-600 hover:text-red-800 ${
                          isCurrentUser ? "opacity-50 cursor-not-allowed pointer-events-none" : ""
                        }`}
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
