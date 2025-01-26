import React from 'react';
import { Button } from '@mui/material';
import { Addon } from '../types/plan';

interface AddonCardProps {
  addon: Addon;
  isAllowed: boolean;
  isIncluded: boolean;
  isSelected: boolean;
  onSelect: () => void;
  buttonAction: () => void;
}

const AddonCard: React.FC<AddonCardProps> = ({
  addon,
  isAllowed,
  isIncluded,
  isSelected,
  buttonAction,
}) => {
  return (
    <div
      className={`rounded-xl p-6 transition-all ${
        isSelected
          ? 'bg-emerald-900/20 border-2 border-emerald-500'
          : isIncluded
          ? 'bg-gray-800/50 border border-emerald-500/50'
          : 'bg-gray-900/50 border border-gray-800 hover:border-gray-700'
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-medium text-white">{addon.name}</h3>
            {isIncluded && (
              <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2 py-1 rounded">
                Included
              </span>
            )}
          </div>
          <p className="text-sm text-gray-400 mt-1">{addon.description}</p>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-white">
            ${addon.price}
            <span className="text-sm font-normal text-gray-400">
              /{addon.billing_period === 'monthly' ? 'mo' : 'yr'}
            </span>
          </div>
        </div>
      </div>

      <Button
        fullWidth
        variant={isSelected ? "outlined" : "contained"}
        color={isSelected ? "inherit" : "primary"}
        disabled={!isAllowed || isIncluded}
        onClick={buttonAction}
        sx={{
          textTransform: 'none',
          borderRadius: '8px',
          py: 1.5
        }}
      >
        {isIncluded
          ? 'Included with Plan'
          : !isAllowed
          ? 'Not Available'
          : isSelected
          ? 'Remove'
          : 'Add to Plan'}
      </Button>
    </div>
  );
};

export default AddonCard; 