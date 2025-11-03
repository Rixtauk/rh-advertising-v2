import { ReactNode } from 'react';

interface BenefitCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export function BenefitCard({ icon, title, description }: BenefitCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: '#55A2C3' }}>
        <div className="text-white">
          {icon}
        </div>
      </div>
      <h3 className="text-xl font-semibold mb-3 text-foreground">
        {title}
      </h3>
      <p className="text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
}
