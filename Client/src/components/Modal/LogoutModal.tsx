import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, X } from 'lucide-react';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName?: string;
}

const LogoutModal: React.FC<LogoutModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  userName 
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-background border border-border rounded-lg shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full">
              <LogOut className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">Confirm Logout</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-foreground mb-2">
            Are you sure you want to log out?
          </p>
          {userName && (
            <p className="text-muted-foreground text-sm mb-4">
              You will be signed out of your account ({userName}) and redirected to the login page.
            </p>
          )}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <p className="text-yellow-800 dark:text-yellow-200 text-sm">
              <strong>Note:</strong> Any unsaved changes will be lost. Make sure to save your work before logging out.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-border bg-gray-50 dark:bg-gray-900/50 rounded-b-lg">
          <Button
            variant="outline"
            onClick={onClose}
            className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Yes, Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;