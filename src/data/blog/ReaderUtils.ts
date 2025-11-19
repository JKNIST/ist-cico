import { Reader } from "@/types/blog";
import { mockGuardians, mockStaff } from "./MockReaders";

/**
 * Genererar en slumpmässig lista av läsare för ett blogginlägg
 * @param internalOnly - Om inlägget endast är för personal
 * @param readPercentage - Procent av potentiella läsare som har läst (0-100)
 * @returns Array av läsare med tidsstämplar
 */
export function generateReaders(
  internalOnly: boolean,
  readPercentage: number = 60
): Reader[] {
  const readers: Reader[] = [];
  
  // Om internt, använd endast personal
  if (internalOnly) {
    const numReaders = Math.floor(mockStaff.length * (readPercentage / 100));
    const selectedStaff = mockStaff
      .sort(() => Math.random() - 0.5)
      .slice(0, numReaders);
    
    selectedStaff.forEach((staff, index) => {
      readers.push({
        ...staff,
        id: `staff-${index}`,
        readAt: generateRandomReadTime(),
      });
    });
  } else {
    // Om externt, använd både vårdnadshavare och personal
    const numGuardians = Math.floor(mockGuardians.length * (readPercentage / 100));
    const numStaff = Math.floor(mockStaff.length * (readPercentage / 100));
    
    const selectedGuardians = mockGuardians
      .sort(() => Math.random() - 0.5)
      .slice(0, numGuardians);
    
    const selectedStaff = mockStaff
      .sort(() => Math.random() - 0.5)
      .slice(0, numStaff);
    
    selectedGuardians.forEach((guardian, index) => {
      readers.push({
        ...guardian,
        id: `guardian-${index}`,
        readAt: generateRandomReadTime(),
      });
    });
    
    selectedStaff.forEach((staff, index) => {
      readers.push({
        ...staff,
        id: `staff-${index}`,
        readAt: generateRandomReadTime(),
      });
    });
  }
  
  // Sortera efter läsdatum (senaste först)
  return readers.sort((a, b) => 
    new Date(b.readAt).getTime() - new Date(a.readAt).getTime()
  );
}

/**
 * Genererar en slumpmässig tidpunkt inom de senaste 7 dagarna
 */
function generateRandomReadTime(): string {
  const now = new Date();
  const daysAgo = Math.floor(Math.random() * 7);
  const hoursAgo = Math.floor(Math.random() * 24);
  const minutesAgo = Math.floor(Math.random() * 60);
  
  const readTime = new Date(now);
  readTime.setDate(readTime.getDate() - daysAgo);
  readTime.setHours(readTime.getHours() - hoursAgo);
  readTime.setMinutes(readTime.getMinutes() - minutesAgo);
  
  return readTime.toISOString();
}
