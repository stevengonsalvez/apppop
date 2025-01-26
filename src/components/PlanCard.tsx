import React from 'react';
import { Button } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { Plan, Addon } from '../types/plan';

interface PlanCardProps {
  plan: Plan;
  isPopular?: boolean;
  includedAddons: Addon[];
  isSelected: boolean;
  onSelect: () => void;
}

const PlanCard: React.FC<PlanCardProps> = ({
  plan,
  isPopular = false,
  includedAddons,
  isSelected,
  onSelect,
}) => {
  return (
    <div
      className={`relative rounded-xl p-6 transition-all ${
        isSelected
          ? 'bg-emerald-900/20 border-2 border-emerald-500'
          : 'bg-gray-900/50 border border-gray-800 hover:border-gray-700'
      }`}
    >
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-emerald-500 text-white text-xs font-medium px-3 py-1 rounded-full">
            Most Popular
          </span>
        </div>
      )}

      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-medium text-white">{plan.name}</h3>
          <p className="text-sm text-gray-400">{plan.description}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-white">
            ${plan.price}
            <span className="text-sm font-normal text-gray-400">
              /{plan.billing_period === 'monthly' ? 'mo' : 'yr'}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <h4 className="text-sm font-medium text-white mb-2">Features</h4>
          <ul className="space-y-2">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-start text-sm text-gray-300">
                <CheckIcon className="h-5 w-5 text-emerald-500 mr-2 flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {includedAddons.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-white mb-2">Included Add-ons</h4>
            <ul className="space-y-2">
              {includedAddons.map((addon) => (
                <li key={addon.id} className="flex items-start text-sm text-gray-300">
                  <CheckIcon className="h-5 w-5 text-emerald-500 mr-2 flex-shrink-0" />
                  {addon.name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <Button
        fullWidth
        variant={isSelected ? "outlined" : "contained"}
        color={isSelected ? "inherit" : "primary"}
        onClick={onSelect}
        sx={{
          textTransform: 'none',
          borderRadius: '8px',
          py: 1.5
        }}
      >
        {isSelected ? 'Selected' : 'Select Plan'}
      </Button>
    </div>
  );
};

export default PlanCard; 