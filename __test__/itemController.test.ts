import { isURL, isThumbnail, getThumbnail, isPayload, isInputItem, isSize, getSize, isLogo } from '../controllers/itemController';
import { describe, expect, it } from '@jest/globals';
const app = require('../app');
import supertest from 'supertest';

//isPayload
describe('isPayload() checks if payload in body has array', () => {
  it('returns false if you do not pass array', () => {
    expect(isPayload('' as any)).toBeFalsy();
  });
  it('returns false if pass empty array', () => {
    expect(isPayload([])).toBeFalsy();
  });

  it('returns true if you pass array with any element', () => {
    expect(isPayload([{} as any])).toBeTruthy();
  });
});
//isSize
describe(`isSize() checks if string has 'NumberxNumber' formula`, () => {
  it(`returns true if string has 'NumberxNumber' formula`, () => {
    expect(isSize('64x64')).toBeTruthy();
  });
  it(`returns false if string does not have 'NumberxNumber' formula`, () => {
    expect(isSize('hello')).toBeFalsy();
  });
  it(`returns false if passed value is not string`, () => {
    expect(isSize({} as string)).toBeFalsy();
  });
});

//getSize
describe(`getSize() returns height and width from 'heightxwidth' formula`, () => {
  it(`returns height and width if string has 'NumberxNumber' formula`, () => {
    expect(getSize('64x64')).toEqual({ height: 64, width: 64 });
  });
  it(`returns { height: 0, width: 0 } if passed value is not string`, () => {
    expect(getSize({} as string)).toEqual({ height: NaN, width: NaN });
  });
  it(`returns { height: NaN, width: NaN } if string does not have 'NumberxNumber' formula`, () => {
    expect(getSize('hello')).toEqual({ height: NaN, width: NaN });
    expect(getSize('64x')).toEqual({ height: NaN, width: NaN });
    expect(getSize('64x64x64')).toEqual({ height: NaN, width: NaN });
    expect(getSize('0*0')).toEqual({ height: NaN, width: NaN });
    expect(getSize('-1*-1')).toEqual({ height: NaN, width: NaN });
  });
});
//isLogo
describe('isLogo() checks if object have two properties url and size', () => {
  it(`returns true if object has 'url' property and 'size' property and follow standards `, () => {
    expect(
      isLogo({
        size: '128x128',
        url: 'https://example.com/128x128.png',
      })
    ).toBeTruthy();
  });
  it(`returns false if object does not has 'url' property or 'size' property`, () => {
    expect(
      isLogo({
        url: 'https://example.com/128x128.png',
      } as any)
    ).toBeFalsy();
  });
  it(`returns false if any property does not follow standards`, () => {
    expect(
      isLogo({
        size: 'hello',
        url: 'https://example.com/128x128.png',
      })
    ).toBeFalsy();
  });
  it(`returns false if passed value is not object`, () => {
    expect(isLogo('' as any)).toBeFalsy();
  });
});

//isInputItem
describe('isInputItem() checks if object has name as string,count as number and logos as array', () => {
  it('returns false if object does not have any inputItem property', () => {
    expect(isInputItem({ name: 'a', count: 1 } as any)).toBeFalsy();
  });
  it('returns false if given value is diffrent from property type ', () => {
    expect(isInputItem({ name: 1, count: 1, logos: 'a' } as any)).toBeFalsy();
  });
  it('returns true if object has name as string,count as number and logos as array ', () => {
    const item = {
      name: 'molly',
      count: 1,
      logos: [
        {
          size: '16x16',
          url: 'https://example.com/16x16.png',
        },
        {
          size: '64x64',
          url: 'https://example.com/64x64.png',
        },
      ],
    };
    expect(isInputItem(item)).toBeTruthy();
  });
});

//isThumbnail
describe('isThumbnail() checks if this logo is suitable to be thumbnail', () => {
  it('return false if logo`s attributes not follow standards', () => {
    const unsuitableLogo = {
      size: '16x16',
      url: 'https://example.com/16x16.png',
    };
    expect(isThumbnail(unsuitableLogo)).toBeFalsy();
  });

  it('return true if logo`s attributes follow standards', () => {
    const suitableLogo = {
      size: '64x64',
      url: 'https://example.com/64x64.png',
    };
    expect(isThumbnail(suitableLogo)).toBeTruthy();
  });

  it('return false if logo`s size not follow number x number', () => {
    const unsuitableLogo = {
      size: '1',
      url: 'https://example.com/16x16.png',
    };
    expect(isThumbnail(unsuitableLogo)).toBeFalsy();
  });

  it('return false if logo`s url not follow url`s standards', () => {
    const unsuitableLogo = {
      size: '64x64',
      url: 'anything',
    };
    expect(isThumbnail(unsuitableLogo)).toBeFalsy();
  });
});

//isURL
describe('isURL() checks if input is url or not', () => {
  it('return false if input is not url', () => {
    expect(isURL('a')).toBeFalsy();
  });
  it('return true if input is  url', () => {
    expect(isURL('https://example.com/64x64.png')).toBeTruthy();
  });
});

//getThumbnail
describe('getThumbnail() returns suitable thumbnail from array of logos based on standards(size,url)', () => {
  it('return empty string if there is not any suitable logo to be thumbnail', () => {
    const unsuitableLogos = [
      {
        size: '16x16',
        url: 'https://example.com/16x16.png',
      },
      {
        size: '20x20',
        url: 'https://example.com/64x64.png',
      },
      {
        size: '20x20',
        url: 'zzzz',
      },
    ];
    expect(getThumbnail(unsuitableLogos)).toBe('');
  });

  it('return empty string if array is empty', () => {
    expect(getThumbnail([] as any)).toBe('');
  });

  it('return url of first suitable logo(follow standards) that found in array', () => {
    const suitableLogos = [
      {
        size: '126x126',
        url: 'https://example.com/126x126.png',
      },
      {
        size: '64x64',
        url: 'https://example.com/64x64.png',
      },
      {
        size: '100x100',
        url: 'https://example.com/100x100.png',
      },
    ];
    expect(getThumbnail(suitableLogos)).toBe('https://example.com/126x126.png');
  });
});

describe('POST /items', () => {
  it('return response 200 after filtering and setting thumbnail if all input items follow standards', async () => {
    const inputItems = {
      payload: [
        {
          name: 'Molly',
          count: 12,
          logos: [
            {
              size: '16x16',
              url: 'https://example.com/16x16.png',
            },
            {
              size: '64x64',
              url: 'https://example.com/64x64.png',
            },
          ],
        },
        {
          name: 'Dolly',
          count: 0,
          logos: [
            {
              size: '128x128',
              url: 'https://example.com/128x128.png',
            },
            {
              size: '64x64',
              url: 'https://example.com/64x64.png',
            },
          ],
        },
        {
          name: 'Polly',
          count: 4,
          logos: [
            {
              size: '16x16',
              url: 'https://example.com/16x16.png',
            },
            {
              size: '64x64',
              url: 'https://example.com/64x64.png',
            },
          ],
        },
      ],
    };
    const outputItems = {
      response: [
        {
          name: 'Molly',
          count: 12,
          thumbnail: 'https://example.com/64x64.png',
        },
        {
          name: 'Polly',
          count: 4,
          thumbnail: 'https://example.com/64x64.png',
        },
      ],
    };
    const res = await supertest(app).post('/items').send(inputItems);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(outputItems);
  });

  it('return response with 400 bad request if any input item does no follow standards', async () => {
    const inputItems = {
      payload: [
        {
          // name: 'Molly',
          count: 12,
          logos: [
            {
              size: '16x16',
              url: 'https://example.com/16x16.png',
            },
            {
              size: '64x64',
              url: 'https://example.com/64x64.png',
            },
          ],
        },
        {
          name: 'Dolly',
          count: 0,
          logos: [
            {
              size: '128x128',
              url: 'https://example.com/128x128.png',
            },
            {
              size: '64x64',
              url: 'https://example.com/64x64.png',
            },
          ],
        },
        {
          name: 'Polly',
          count: 4,
          logos: [
            {
              size: '16x16',
              url: 'https://example.com/16x16.png',
            },
            {
              size: '64x64',
              url: 'https://example.com/64x64.png',
            },
          ],
        },
      ],
    };
    const err = { err: 'Every item must have name,count and logos!' };
    const res = await supertest(app).post('/items').send(inputItems);
    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(err);
  });

  it('return response with 400 (bad request) if request does not have payload', async () => {
    const inputItems = {};
    const err = { err: 'Request must have payload!' };
    const res = await supertest(app).post('/items').send(inputItems);
    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(err);
  });
});
