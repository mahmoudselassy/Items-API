import { NextFunction, Request, Response } from 'express';

interface photo {
  size: string;
  url: string;
}

interface Item {
  name: string;
  count: number;
}

interface InputItem extends Item {
  logos: photo[];
}

interface OutputItem extends Item {
  thumbnail: string;
}

const validURL = (str: string) => {
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

const validateLogoForThumbnail = (logo: photo) => {
  if (typeof logo.size !== 'string') return false;
  const height = Number(logo.size.split('x')[0]);
  const width = Number(logo.size.split('x')[1]);
  const hasSuitableSize = height <= 128 && height >= 64 && width <= 128 && width >= 64;
  const hasSuitableURL = validURL(logo.url);
  const isThumbnail = !isNaN(height) && !isNaN(width) && hasSuitableSize && hasSuitableURL;
  return isThumbnail;
};

const getThumbnail = (logos: photo[]) => {
  let thumbnail: string = '';
  for (const logo of logos) {
    if (validateLogoForThumbnail(logo)) {
      thumbnail = logo.url;
      break;
    }
  }
  return thumbnail;
};

const validateRequestBody = (req: Request, res: Response, next: NextFunction) => {
  const inputItems: InputItem[] = req.body.payload;
  if (!inputItems || inputItems.length === 0 || !Array.isArray(inputItems)) return res.status(400).send({ err: 'Request must have payload!' });
  let isInputItem = true;
  for (const { name, count, logos } of inputItems) {
    isInputItem = typeof name === 'string' && !isNaN(count) && Array.isArray(logos) && logos.length > 0;
    if (!isInputItem) {
      return res.status(400).send({ err: 'Every item must have name,count and logos!' });
    }
  }
  next();
};

const filterItemsByCount = (req: Request, res: Response, next: NextFunction) => {
  const items: InputItem[] = req.body.payload;
  req.body.payload = items.filter((el: InputItem) => el.count > 1);
  next();
};

const setThumbnail = (req: Request, res: Response) => {
  const inputItems: InputItem[] = req.body.payload;
  const outputItems: OutputItem[] = [];
  for (const { name, count, logos } of inputItems) {
    const thumbnail = getThumbnail(logos);
    outputItems.push({ name, count, thumbnail });
  }
  res.send({ response: outputItems });
};

export { filterItemsByCount, setThumbnail, validateRequestBody, validURL, validateLogoForThumbnail, getThumbnail, photo };
