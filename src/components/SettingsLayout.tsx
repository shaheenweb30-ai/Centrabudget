import { ReactNode } from "react";

interface SettingsLayoutProps {
  children: ReactNode;
}

export const SettingsLayout = ({ children }: SettingsLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
};
