export interface TimeInterval {
  start: string; // "06:00"
  end: string;   // "08:00"
  label: string; // "06:00-08:00"
}

export const defaultTimeIntervals: TimeInterval[] = [
  { start: "00:00", end: "06:00", label: "00:00-06:00" },
  { start: "06:00", end: "08:00", label: "06:00-08:00" },
  { start: "08:00", end: "12:00", label: "08:00-12:00" },
  { start: "12:00", end: "15:00", label: "12:00-15:00" },
  { start: "15:00", end: "18:00", label: "15:00-18:00" },
  { start: "18:00", end: "00:00", label: "18:00-00:00" },
];

export const hourlyIntervals: TimeInterval[] = Array.from({ length: 24 }, (_, i) => {
  const start = `${String(i).padStart(2, '0')}:00`;
  const end = `${String((i + 1) % 24).padStart(2, '0')}:00`;
  return { start, end, label: `${start}-${end}` };
});

const STORAGE_KEY_INTERVALS = "scheduleTimeIntervals";
const STORAGE_KEY_RESOLUTION = "scheduleTimeResolution";

export type IntervalResolution = 'default' | 'hourly' | 'custom';

export const getTimeIntervals = (): TimeInterval[] => {
  try {
    const resolution = getIntervalResolution();
    
    if (resolution === 'hourly') {
      return hourlyIntervals;
    }
    
    if (resolution === 'custom') {
      const saved = localStorage.getItem(STORAGE_KEY_INTERVALS);
      if (saved) {
        return JSON.parse(saved);
      }
    }
  } catch (error) {
    console.error("Error loading time intervals:", error);
  }
  return defaultTimeIntervals;
};

export const updateTimeIntervals = (intervals: TimeInterval[]): void => {
  localStorage.setItem(STORAGE_KEY_INTERVALS, JSON.stringify(intervals));
};

export const getIntervalResolution = (): IntervalResolution => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_RESOLUTION);
    if (saved && ['default', 'hourly', 'custom'].includes(saved)) {
      return saved as IntervalResolution;
    }
  } catch (error) {
    console.error("Error loading interval resolution:", error);
  }
  return 'default';
};

export const setIntervalResolution = (resolution: IntervalResolution): void => {
  localStorage.setItem(STORAGE_KEY_RESOLUTION, resolution);
};
