// UsersTables.tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

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
}

export default function UsersTable({ users, loading, error }: UsersTableProps) {
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
              <TableCell isHeader className="px-5 py-3">ID</TableCell>
              <TableCell isHeader className="px-5 py-3">Nom complet</TableCell>
              <TableCell isHeader className="px-5 py-3">Email</TableCell>
              <TableCell isHeader className="px-5 py-3">Rôle</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="px-5 py-4">{user.id}</TableCell>
                <TableCell className="px-5 py-4">{user.fullName}</TableCell>
                <TableCell className="px-5 py-4">{user.email}</TableCell>
                <TableCell className="px-5 py-4">{user.role}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
