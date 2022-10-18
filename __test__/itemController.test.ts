import { validURL, validateLogoForThumbnail, getThumbnail, photo } from '../controllers/itemController';
import { describe, expect, it } from '@jest/globals';
import { app } from '../app';
import supertest from 'supertest';

//validateLogoForThumbnail
describe('validateLogoForThumbnail() checks if this logo is suitable to be thumbnail', () => {
  it('return false if logo`s attributes not follow standards', () => {
    const unsuitableLogo = {
      size: '16x16',
      url: 'https://example.com/16x16.png',
    };
    expect(validateLogoForThumbnail(unsuitableLogo)).toBeFalsy();
  });

  it('return true if logo`s attributes follow standards', () => {
    const suitableLogo = {
      size: '64x64',
      url: 'https://example.com/64x64.png',
    };
    expect(validateLogoForThumbnail(suitableLogo)).toBeTruthy();
  });

  it('return false if logo`s size not follow number x number', () => {
    const unsuitableLogo = {
      size: '1',
      url: 'https://example.com/16x16.png',
    };
    expect(validateLogoForThumbnail(unsuitableLogo)).toBeFalsy();
  });

  it('return false if logo`s url not follow url`s standards', () => {
    const unsuitableLogo = {
      size: '64x64',
      url: 'anything',
    };
    expect(validateLogoForThumbnail(unsuitableLogo)).toBeFalsy();
  });
});

//validURL
describe('validURL() checks if input is url or not', () => {
  it('return false if input is not url', () => {
    expect(validURL('a')).toBeFalsy();
  });
  it('return true if input is  url', () => {
    expect(validURL('https://example.com/64x64.png')).toBeTruthy();
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
    const emptyArray: photo[] = [];
    expect(getThumbnail(emptyArray)).toBe('');
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
