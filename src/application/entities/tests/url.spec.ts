import { Url } from '../Url';

describe('Url entity', () => {
  it('Should create a url entity', () => {
    const url = new Url({
      destinyUrl: 'densityUrl.com',
      shortenedUrl: 'shortendUrl.com',
    });

    expect(url).toBeTruthy();
    expect(url.id).toBeTruthy();
  });

  it('Should create a url entity with a random shortened url if none was passed', () => {
    const url = new Url({
      destinyUrl: 'densityUrl.com',
    });

    expect(url).toBeTruthy();
    expect(url.shortenedUrl).toBeTruthy();
  });

  it('Should add the click number of a url', () => {
    const url = new Url({
      destinyUrl: 'densityUrl.com',
    });

    url.click();

    expect(url).toBeTruthy();
    expect(url.clickNumber).toBe(1);
  });

  it('Should mark the field deletedAt', () => {
    const url = new Url({
      destinyUrl: 'densityUrl.com',
    });

    url.delete();

    expect(url.deletedAt).toBeTruthy();
  });
});
