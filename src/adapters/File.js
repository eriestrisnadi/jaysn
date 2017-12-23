import { writeFileSync, readFileSync } from 'fs';
import { Base } from './Base';

export class File extends Base {
  read() {
    return JSON.parse(readFileSync(this.source, 'utf8'));
  }

  write(data) {
    writeFileSync(this.source, JSON.stringify(data, null, 4), {
      encoding: 'utf8',
    });

    return this.read();
  }
}

export default File;
