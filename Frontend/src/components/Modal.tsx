import { ReactNode } from "react";
import Button from "./ui/button/Button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export default function Modal({ isOpen, onClose, title, children, footer }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-lg mx-4 animate-fade-in-up transition-transform duration-300 transform scale-100">
        <div className="p-6">
          {title && (
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              {title}
            </h2>
          )}
          <div>{children}</div>
        </div>
        <div className="px-6 pb-6">
          {footer ? (
            <div className="flex justify-end gap-3">{footer}</div>
          ) : (
            <div className="flex justify-end">
              <Button
                onClick={onClose}
                size="md"
                variant="outline"
              >
                Annuler
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
