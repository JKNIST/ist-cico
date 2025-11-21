import { mockGroups } from "@/data/groups/mockGroups";

/**
 * Filter items by departments and groups
 * @param items Array of items with department property
 * @param selectedDepartments Array of selected department names
 * @param selectedGroups Array of selected group fullNames (e.g., "Blåbär-Blå")
 * @param getItemDepartment Function to extract department from item
 * @param getItemGroups Optional function to extract groups from item
 * @returns Filtered items
 */
export function filterByDepartmentsAndGroups<T>(
  items: T[],
  selectedDepartments: string[],
  selectedGroups: string[],
  getItemDepartment: (item: T) => string | undefined,
  getItemGroups?: (item: T) => string[] | undefined
): T[] {
  // If no filters, show all
  if (selectedDepartments.length === 0 && selectedGroups.length === 0) {
    return items;
  }

  return items.filter(item => {
    const itemDepartment = getItemDepartment(item);
    if (!itemDepartment) return false;

    // If groups are selected, check if item belongs to any selected group
    if (selectedGroups.length > 0) {
      if (getItemGroups) {
        const itemGroups = getItemGroups(item);
        if (itemGroups && itemGroups.length > 0) {
          return itemGroups.some(group => selectedGroups.includes(group));
        }
      }
      
      // For items with child IDs (like in mockChildren)
      // Check if the item's department + the item itself is in a selected group
      const departmentGroups = mockGroups.filter(g => 
        selectedGroups.includes(g.fullName) && g.department === itemDepartment
      );
      
      if (departmentGroups.length > 0) {
        // Check if item has an id that's in any of the selected groups
        const itemId = (item as any).id;
        if (itemId) {
          return departmentGroups.some(group => group.children.includes(itemId));
        }
      }
      
      // If no groups match, fall through to department check
    }

    // If only departments are selected (no groups), check department
    if (selectedDepartments.length > 0) {
      return selectedDepartments.includes(itemDepartment);
    }

    return false;
  });
}
