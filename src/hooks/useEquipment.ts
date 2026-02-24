import { useQuery } from '@tanstack/react-query';
import { mixrClient } from '../config/mixrClient';
import { EquipmentSubcategory } from '@sudobility/mixr_client';

/** Centralized query key factory for equipment-related queries. */
export const queryKeys = {
  equipment: ['equipment'] as const,
  equipmentBySubcategory: (subcategory?: EquipmentSubcategory) =>
    ['equipment', subcategory] as const,
  equipmentSubcategories: ['equipment', 'subcategories'] as const,
};

/**
 * Fetches equipment items, optionally filtered by subcategory.
 * @param subcategory - Optional subcategory to filter equipment by.
 * @returns TanStack Query result containing the equipment list.
 */
export function useEquipment(subcategory?: EquipmentSubcategory) {
  return useQuery({
    queryKey: queryKeys.equipmentBySubcategory(subcategory),
    queryFn: () => mixrClient.getEquipment(subcategory),
  });
}

/**
 * Fetches the list of equipment subcategories.
 * @returns TanStack Query result containing the subcategory list.
 */
export function useEquipmentSubcategories() {
  return useQuery({
    queryKey: queryKeys.equipmentSubcategories,
    queryFn: () => mixrClient.getEquipmentSubcategories(),
  });
}
