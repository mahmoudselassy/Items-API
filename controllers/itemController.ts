import { NextFunction, Request, Response } from 'express';

interface Logo {
  size: string;
  url: string;
}

interface Item {
  name: string;
  count: number;
}

interface InputItem extends Item {
  logos: Logo[];
}

interface OutputItem extends Item {
  thumbnail: string;
}
//tested
export const isURL = (str: string) => {
  if (typeof str !== 'string') return false;
  var pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i'
  ); // fragment locator
  return !!pattern.test(str) /*&& typeof str === 'string'*/;
};
//tested
export const isSize = (str: string) => {
  if (typeof str !== 'string') return false;
  const { height, width } = getSize(str);
  if (isNaN(height) && isNaN(width)) return false;
  return true;
};
//tested
export const isLogo = (logo: Logo) => isURL(logo.url) && isSize(logo.size);
//tested
export const isThumbnail = (logo: Logo) => {
  if (!isLogo(logo)) return false;
  const { height, width } = getSize(logo.size);
  return height <= 128 && height >= 64 && width <= 128 && width >= 64;
};
//tested
export const isInputItem = ({ name, count, logos }: InputItem) => {
  const isLogos = Array.isArray(logos) && logos.length > 0 && logos.every((logo: Logo) => isLogo(logo));
  return typeof name === 'string' && !isNaN(count) && isLogos;
};
//tested
export const isPayload = (inputItems: InputItem[]) => Array.isArray(inputItems) && inputItems.length > 0;
//tested
export const getThumbnail = (logos: Logo[]) => {
  let thumbnail = '';
  for (const logo of logos) {
    if (isThumbnail(logo)) {
      thumbnail = logo.url;
      break;
    }
  }
  return thumbnail;
};
//tested
export const getSize = (str: string) => {
  if (typeof str !== 'string') return { height: NaN, width: NaN };
  let [heightStr, widthStr, ...rest] = str.split('x');
  const height = Number(heightStr);
  const width = Number(widthStr);
  if (isNaN(height) || isNaN(width) || height <= 0 || width <= 0 || rest.length > 0) return { height: NaN, width: NaN };
  return { height, width };
};
//tested
export const validatePayload = (req: Request, res: Response, next: NextFunction) => {
  const items: InputItem[] = req.body.payload;

  if (!isPayload(items)) return res.status(400).send({ err: 'Request must have payload!' });

  for (const item of items) {
    if (!isInputItem(item)) return res.status(400).send({ err: 'Every item must have name,count and logos!' });
  }

  next();
};
//tested
export const filterByCount = (req: Request, res: Response, next: NextFunction) => {
  const inputItems: InputItem[] = req.body.payload;
  req.body.payload = inputItems.filter((item: InputItem) => item.count > 1);
  next();
};
//tested
export const setThumbnail = (req: Request, res: Response) => {
  const inputItems: InputItem[] = req.body.payload;
  const outputItems: OutputItem[] = [];
  for (const { name, count, logos } of inputItems) {
    const thumbnail = getThumbnail(logos);
    outputItems.push({ name, count, thumbnail });
  }
  res.send({ response: outputItems });
};
