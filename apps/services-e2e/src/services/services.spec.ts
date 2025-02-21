import axios from 'axios';

describe('GET /api/healcheck', () => {
  it('should return a message', async () => {
    const res = await axios.get(`/api/healcheck`);
    expect(res.status).toBe(200);    
    expect(res.data).toEqual({ status: 'UP' });    
  });
})
