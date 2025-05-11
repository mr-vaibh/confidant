import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ToggleLinkProps {
  isOpen: boolean;
  handleToggle: () => void;
}

const ToggleLink: React.FC<ToggleLinkProps> = ({ isOpen, handleToggle }) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="md:hidden"
      onClick={handleToggle}
    >
      {isOpen ? (
        <X className="h-5 w-5" />
      ) : (
        <Menu className="h-5 w-5" />
      )}
      <span className="sr-only">Toggle menu</span>
    </Button>
  );
};

export default ToggleLink;
