import { Button } from '@/components/ui/button';
import { X, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LoginPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginPromptModal: React.FC<LoginPromptModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleLoginClick = () => {
    onClose();
    navigate('/login');
  };

  const handleRegisterClick = () => {
    onClose();
    navigate('/register');
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
            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
              <LogIn className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">Please Log In</h2>
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
          <p className="text-foreground mb-4">
            You need to be logged in to shorten URLs.
          </p>
          <p className="text-muted-foreground text-sm mb-6">
            Please log in to your account or register for a new account to continue.
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-border bg-gray-50 dark:bg-gray-900/50 rounded-b-lg">
          <Button
            variant="outline"
            onClick={handleRegisterClick}
            className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Register
          </Button>
          <Button
            onClick={handleLoginClick}
            className="bg-gradient-green hover:bg-gradient-green-hover text-white shadow-md hover:shadow-lg transition-all duration-200"
          >
            <LogIn className="h-4 w-4 mr-2" />
            Log In
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginPromptModal;