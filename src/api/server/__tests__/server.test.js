import * as serverAPI from '../server';

describe('server API', () => {

  beforeEach(() => {
    fetch.resetMocks();
  });

  it("returns proper data", async () => {

    const testTokenData = {
      tokenData: "tokenData",
      ssTokenData: "ssTokenData"
    };
  
    fetch.mockResponseOnce(JSON.stringify(testTokenData));
  
    const testAuthCode = {
      params: {
        code: "test code"
      }
    };
  
    const tokenData = await serverAPI.getSpotifyTokenData(testAuthCode);
  
    expect(tokenData.tokenData).toBe(testTokenData.tokenData);
    expect(tokenData.ssTokenData).toBe(testTokenData.ssTokenData);
  });

  it("throws exception if fetch throws exception", async () => {

    fetch.mockReject(() => Promise.reject(new Error("api is down")));

    const testAuthCode = {
      params: {
        code: "test code"
      }
    };

    const f = async () => {
      const data = await serverAPI.getSpotifyTokenData(testAuthCode);
    };

    await expect(f())
      .rejects
      .toThrow('api is down');
  });

  it("handle null", async () => {

    fetch.mockResponseOnce(null);

    const testAuthCode = {
      params: {
        code: "test code"
      }
    };

    const f = async () => {
      const data = await serverAPI.getSpotifyTokenData(testAuthCode);
    };

    await expect(f())
    .rejects
    .toThrow();
  });
});
