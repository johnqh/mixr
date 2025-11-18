import { useQuery } from '@tanstack/react-query';
import { mixrClient } from '../config/mixrClient';
import { EquipmentSubcategory } from '@sudobility/mixr_client';

export const queryKeys = {
  equipment: ['equipment'] as const,
  equipmentBySubcategory: (subcategory?: EquipmentSubcategory) =>
    ['equipment', subcategory] as const,
  equipmentSubcategories: ['equipment', 'subcategories'] as const,
};

export function useEquipment(subcategory?: EquipmentSubcategory) {
  return useQuery({
    queryKey: queryKeys.equipmentBySubcategory(subcategory),
    queryFn: () => mixrClient.getEquipment(subcategory),
  });
}

export function useEquipmentSubcategories() {
  return useQuery({
    queryKey: queryKeys.equipmentSubcategories,
    queryFn: () => mixrClient.getEquipmentSubcategories(),
  });
}
