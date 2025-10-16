import { isBefore, isAfter, isEqual } from 'date-fns';

export class TimeSlot {
  constructor(public start: Date, public end: Date) {}

  /**
   * Check if this time slot overlaps with another time slot
   */
  overlaps(other: TimeSlot): boolean {
    // Check if one slot starts during the other slot
    return (
      (isEqual(this.start, other.start) || isEqual(this.end, other.end)) ||
      (isAfter(this.start, other.start) && isBefore(this.start, other.end)) ||
      (isAfter(other.start, this.start) && isBefore(other.start, this.end))
    );
  }

  /**
   * Check if a date falls within this time slot
   */
  contains(date: Date): boolean {
    return (
      (isEqual(date, this.start) || isAfter(date, this.start)) && 
      (isEqual(date, this.end) || isBefore(date, this.end))
    );
  }
}