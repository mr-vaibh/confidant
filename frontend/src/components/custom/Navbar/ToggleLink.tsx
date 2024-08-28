import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ToggleLinkProps {
  isOpen: boolean;
  handleToggle: () => void;
}

const ToggleLink: React.FC<ToggleLinkProps> = ({ isOpen, handleToggle }) => {
  return (
    <Button className="nav:hidden ml-auto" variant="link" onClick={handleToggle}>
      {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      <span className="sr-only">Toggle menu</span>
    </Button>
  );
};

export default ToggleLink;
