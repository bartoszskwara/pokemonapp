import { PokeAppPage } from './app.po';

describe('poke-app App', () => {
  let page: PokeAppPage;

  beforeEach(() => {
    page = new PokeAppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
