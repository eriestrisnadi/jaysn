import { Base } from './Base';

export class LocalStorage extends Base {
  read() {
    return JSON.parse(localStorage.getItem(this.source));
  }

  write(data) {
    localStorage.setItem(this.source, JSON.stringify(data, null, 4));

    return this.read();
  }
}

export default LocalStorage;
