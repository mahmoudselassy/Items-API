"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const itemController_1 = require("../controllers/itemController");
const globals_1 = require("@jest/globals");
const app_1 = require("../app");
const supertest_1 = __importDefault(require("supertest"));
//validateLogoForThumbnail
(0, globals_1.describe)('validateLogoForThumbnail() checks if this logo is suitable to be thumbnail', () => {
    (0, globals_1.it)('return false if logo`s attributes not follow standards', () => {
        const unsuitableLogo = {
            size: '16x16',
            url: 'https://example.com/16x16.png',
        };
        (0, globals_1.expect)((0, itemController_1.validateLogoForThumbnail)(unsuitableLogo)).toBeFalsy();
    });
    (0, globals_1.it)('return true if logo`s attributes follow standards', () => {
        const suitableLogo = {
            size: '64x64',
            url: 'https://example.com/64x64.png',
        };
        (0, globals_1.expect)((0, itemController_1.validateLogoForThumbnail)(suitableLogo)).toBeTruthy();
    });
    (0, globals_1.it)('return false if logo`s size not follow number x number', () => {
        const unsuitableLogo = {
            size: '1',
            url: 'https://example.com/16x16.png',
        };
        (0, globals_1.expect)((0, itemController_1.validateLogoForThumbnail)(unsuitableLogo)).toBeFalsy();
    });
    (0, globals_1.it)('return false if logo`s url not follow url`s standards', () => {
        const unsuitableLogo = {
            size: '64x64',
            url: 'anything',
        };
        (0, globals_1.expect)((0, itemController_1.validateLogoForThumbnail)(unsuitableLogo)).toBeFalsy();
    });
});
//validURL
(0, globals_1.describe)('validURL() checks if input is url or not', () => {
    (0, globals_1.it)('return false if input is not url', () => {
        (0, globals_1.expect)((0, itemController_1.validURL)('a')).toBeFalsy();
    });
    (0, globals_1.it)('return true if input is  url', () => {
        (0, globals_1.expect)((0, itemController_1.validURL)('https://example.com/64x64.png')).toBeTruthy();
    });
});
//getThumbnail
(0, globals_1.describe)('getThumbnail() returns suitable thumbnail from array of logos based on standards(size,url)', () => {
    (0, globals_1.it)('return empty string if there is not any suitable logo to be thumbnail', () => {
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
        (0, globals_1.expect)((0, itemController_1.getThumbnail)(unsuitableLogos)).toBe('');
    });
    (0, globals_1.it)('return empty string if array is empty', () => {
        const emptyArray = [];
        (0, globals_1.expect)((0, itemController_1.getThumbnail)(emptyArray)).toBe('');
    });
    (0, globals_1.it)('return url of first suitable logo(follow standards) that found in array', () => {
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
        (0, globals_1.expect)((0, itemController_1.getThumbnail)(suitableLogos)).toBe('https://example.com/126x126.png');
    });
});
(0, globals_1.describe)('POST /items', () => {
    (0, globals_1.it)('return response 200 after filtering and setting thumbnail if all input items follow standards', async () => {
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
        const res = await (0, supertest_1.default)(app_1.app).post('/items').send(inputItems);
        (0, globals_1.expect)(res.statusCode).toEqual(200);
        (0, globals_1.expect)(res.body).toEqual(outputItems);
    });
    (0, globals_1.it)('return response with 400 bad request if any input item does no follow standards', async () => {
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
        const res = await (0, supertest_1.default)(app_1.app).post('/items').send(inputItems);
        (0, globals_1.expect)(res.statusCode).toEqual(400);
        (0, globals_1.expect)(res.body).toEqual(err);
    });
    (0, globals_1.it)('return response with 400 (bad request) if request does not have payload', async () => {
        const inputItems = {};
        const err = { err: 'Request must have payload!' };
        const res = await (0, supertest_1.default)(app_1.app).post('/items').send(inputItems);
        (0, globals_1.expect)(res.statusCode).toEqual(400);
        (0, globals_1.expect)(res.body).toEqual(err);
    });
});
