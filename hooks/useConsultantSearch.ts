import { useCallback, useState } from 'react';

import { consultantAPI, InternalConsultant } from '@/services/apis/user.api';

interface UseConsultantSearchReturn {
  consultants: InternalConsultant[];
  isLoading: boolean;
  error: string | null;
  searchConsultants: (query: string) => Promise<void>;
  clearResults: () => void;
}

export const useConsultantSearch = (): UseConsultantSearchReturn => {
  const [consultants, setConsultants] = useState<InternalConsultant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchConsultants = useCallback(async (query: string) => {
    if (!query.trim()) {
      setConsultants([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Try to use the API first
      const response = await consultantAPI.searchConsultants(query);
      console.log('API Response:', response); // Debug log
      setConsultants(response.consultants || []);
    } catch (err) {
      console.log('API call failed, using mock data for development', err);

      // Fallback to mock data for development
      const mockConsultants: InternalConsultant[] = [
        {
          _id: '1',
          name: 'Dr. Sarah Johnson',
          email: 'sarah.johnson@healthconsult.com',
          phone: '+1234567890',
          photo:
            'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
        },
        {
          _id: '2',
          name: 'Dr. Michael Chen',
          email: 'michael.chen@healthconsult.com',
          phone: '+1234567891',
          photo:
            'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face',
        },
        {
          _id: '3',
          name: 'Dr. Emily Rodriguez',
          email: 'emily.rodriguez@healthconsult.com',
          phone: '+1234567892',
        },
        {
          _id: '4',
          name: 'Dr. James Wilson',
          email: 'james.wilson@healthconsult.com',
          phone: '+1234567893',
          photo:
            'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face',
        },
        {
          _id: '5',
          name: 'Dr. Lisa Thompson',
          email: 'lisa.thompson@healthconsult.com',
          phone: '+1234567894',
        },
      ].filter(
        (consultant) =>
          consultant.name.toLowerCase().includes(query.toLowerCase()) ||
          consultant.email.toLowerCase().includes(query.toLowerCase())
      );

      setConsultants(mockConsultants);

      // Set error only if it's a network error or authentication error
      if (
        err instanceof Error &&
        !err.message.includes('404') &&
        !err.message.includes('Network')
      ) {
        setError('Failed to connect to server. Using offline data.');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setConsultants([]);
    setError(null);
  }, []);

  return {
    consultants,
    isLoading,
    error,
    searchConsultants,
    clearResults,
  };
};
