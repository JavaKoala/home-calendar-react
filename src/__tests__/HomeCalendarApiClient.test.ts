import { HomeCalendarApiClient } from '../HomeCalendarApiClient';

describe('HomeCalendarApiClient', () => {
  let client: HomeCalendarApiClient;
  const mockBaseUrl = 'http://localhost:3000/api/v1';
  let originalFetch: typeof global.fetch;

  beforeEach(() => {
    originalFetch = global.fetch;
    client = new HomeCalendarApiClient(mockBaseUrl);
    global.fetch = jest.fn() as unknown as typeof fetch;
  });

  afterEach(() => {
    global.fetch = originalFetch;
    jest.clearAllMocks();
  });

  describe('listEvents', () => {
    it('should fetch events successfully', async () => {
      const mockEvents = [
        { 
          id: '1', 
          title: 'Test Event', 
          start: '2023-01-01T00:00:00Z', 
          end: '2023-01-01T01:00:00Z' 
        }
      ];
      
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockEvents),
      });

      const result = await client.listEvents('2023-01-01', '2023-01-08');
      
      expect(result).toEqual(mockEvents);
      expect(global.fetch).toHaveBeenCalledWith(
        `${mockBaseUrl}/events?start=2023-01-01&end=2023-01-08`, {"headers": {"Accept": "application/json"}, "method": "GET"}
      );
    });

    it('should throw error on failed request', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: () => Promise.resolve('Server Error'),
      });

      await expect(client.listEvents('2023-01-01', '2023-01-08')).rejects.toThrow('Error 500: Server Error');
    });
  });
});
