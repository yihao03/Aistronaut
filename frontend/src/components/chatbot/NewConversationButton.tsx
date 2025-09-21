// src/components/chatbot/NewConversationButton.tsx

import { Plus, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';

interface NewConversationButtonProps {
  onCreateNew: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
}

export default function NewConversationButton({ 
  onCreateNew, 
  isLoading = false, 
  disabled = false,
  className = ""
}: NewConversationButtonProps) {
  return (
    <Button
      onClick={onCreateNew}
      disabled={disabled || isLoading}
      variant="outline"
      size="sm"
      className={`
        bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30 
        backdrop-blur-sm transition-all duration-200 
        hover:scale-105 active:scale-95
        ${className}
      `}
      title="Start a new conversation"
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="hidden sm:inline">Creating...</span>
        </>
      ) : (
        <>
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">New Chat</span>
        </>
      )}
    </Button>
  );
}