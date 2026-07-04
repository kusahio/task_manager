interface SidebarOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SidebarOverlay({ isOpen, onClose }: Readonly<SidebarOverlayProps>) {
  if (!isOpen) return null;
  return (
    <div className='fixed inset-0 bg-black/60 z-30 lg:hidden backdrop-blur-sm transition-opacity'
      onClick={onClose}
    ></div>
  );
}