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

  it('Should create a url entity with a random shortened url if none was passed with 6 caracters length', () => {
    const url = new Url({
      destinyUrl: 'densityUrl.com',
    });

    expect(url.shortenedUrl).toBeTruthy();
    expect(url.shortenedUrl.split('/')[1]).toHaveLength(6);
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
