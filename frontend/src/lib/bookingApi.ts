import { BACKEND_CONFIG } from "@/config/backend";

const API_BASE_URL = BACKEND_CONFIG.API_BASE_URL || "http://localhost:5000";

export interface BookingData {
  companionId: string;
  companionName: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
  type: string;
  date: Date | string;
  timeSlot: string;
  price: string;
  status?: string;
  createdAt?: Date;
}

export const createBooking = async (bookingData: BookingData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create booking');
    }

    return await response.json();
  } catch (error: any) {
    console.error('Booking creation error:', error);
    throw error;
  }
};

export const getBookings = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/bookings`);
    if (!response.ok) throw new Error('Failed to fetch bookings');
    return await response.json();
  } catch (error) {
    console.error('Fetch bookings error:', error);
    throw error;
  }
};
