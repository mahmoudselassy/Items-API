"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getThumbnail = exports.validateLogoForThumbnail = exports.validURL = exports.validateRequestBody = exports.setThumbnail = exports.filterItemsByCount = void 0;
const validURL = (str) => {
    var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(str) /*&& typeof str === 'string'*/;
};
exports.validURL = validURL;
const validateLogoForThumbnail = (logo) => {
    if (typeof logo.size !== 'string')
        return false;
    const height = Number(logo.size.split('x')[0]);
    const width = Number(logo.size.split('x')[1]);
    const hasSuitableSize = height <= 128 && height >= 64 && width <= 128 && width >= 64;
    const hasSuitableURL = validURL(logo.url);
    const isThumbnail = !isNaN(height) && !isNaN(width) && hasSuitableSize && hasSuitableURL;
    return isThumbnail;
};
exports.validateLogoForThumbnail = validateLogoForThumbnail;
const getThumbnail = (logos) => {
    let thumbnail = '';
    for (const logo of logos) {
        if (validateLogoForThumbnail(logo)) {
            thumbnail = logo.url;
            break;
        }
    }
    return thumbnail;
};
exports.getThumbnail = getThumbnail;
const validateRequestBody = (req, res, next) => {
    const inputItems = req.body.payload;
    if (!inputItems || inputItems.length === 0 || !Array.isArray(inputItems))
        return res.status(400).send({ err: 'Request must have payload!' });
    let isInputItem = true;
    for (const { name, count, logos } of inputItems) {
        isInputItem = typeof name === 'string' && !isNaN(count) && Array.isArray(logos) && logos.length > 0;
        if (!isInputItem) {
            return res.status(400).send({ err: 'Every item must have name,count and logos!' });
        }
    }
    next();
};
exports.validateRequestBody = validateRequestBody;
const filterItemsByCount = (req, res, next) => {
    const items = req.body.payload;
    req.body.payload = items.filter((el) => el.count > 1);
    next();
};
exports.filterItemsByCount = filterItemsByCount;
const setThumbnail = (req, res) => {
    const inputItems = req.body.payload;
    const outputItems = [];
    for (const { name, count, logos } of inputItems) {
        const thumbnail = getThumbnail(logos);
        outputItems.push({ name, count, thumbnail });
    }
    res.send({ response: outputItems });
};
exports.setThumbnail = setThumbnail;
