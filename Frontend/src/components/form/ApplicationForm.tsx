import { Dispatch, SetStateAction } from "react";
import Button from "../ui/button/Button";
import { X, Check } from "lucide-react";

interface FormData {
  companyName: string;
  tenderTitle: string;
  offeredBudget_MAD: number;
  proposed_duration_days: number;
  technical_score: number;
  financial_score: number;
  status: "pending" | "approved" | "rejected";
}

interface Props {
  form: FormData;
  setForm: Dispatch<SetStateAction<FormData>>;
  onSubmit: () => void;
  onCancel: () => void;
}

export default function ApplicationForm({ form, setForm, onSubmit, onCancel }: Props) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="space-y-4"
    >
      {[
        { name: "companyName", label: "Entreprise" },
        { name: "tenderTitle", label: "Marché" },
      ].map(({ name, label }) => (
        <div key={name}>
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white">{label}</label>
          <input
            type="text"
            required
            value={(form as any)[name]}
            onChange={(e) => setForm({ ...form, [name]: e.target.value })}
            className="w-full px-4 py-2 border rounded-md bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
          />
        </div>
      ))}

      {[
        { name: "offeredBudget_MAD", label: "Budget proposé (MAD)" },
        { name: "proposed_duration_days", label: "Durée proposée (jours)" },
        { name: "technical_score", label: "Score technique" },
        { name: "financial_score", label: "Score financier" },
      ].map(({ name, label }) => (
        <div key={name}>
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white">{label}</label>
          <input
            type="number"
            required
            value={(form as any)[name]}
            onChange={(e) => setForm({ ...form, [name]: Number(e.target.value) })}
            className="w-full px-4 py-2 border rounded-md bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
          />
        </div>
      ))}

      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white">Statut</label>
        <select
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value as FormData["status"] })}
          className="w-full px-4 py-2 border rounded-md bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
        >
          <option value="pending">En attente</option>
          <option value="approved">Approuvée</option>
          <option value="rejected">Rejetée</option>
        </select>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onCancel} startIcon={<X size={16} />}>
          Annuler
        </Button>
        <Button type="submit" startIcon={<Check size={16} />}>
          Enregistrer
        </Button>
      </div>
    </form>
  );
}
