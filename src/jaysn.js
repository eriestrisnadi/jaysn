import { existsSync, writeFileSync } from 'fs';
import { struct } from 'superstruct';
import Immutable from 'immutable';
import { cwd } from 'process';
import { join } from 'path';
import { read } from './methods/read';
import { write } from './methods/write';

export const JAYSN_PATH = join(cwd(), '.jaysn');

const IMMUTABLE_TYPE = [
  'List',
  'Map',
  'OrderedMap',
  'Set',
  'OrderedSet',
  'Stack',
  'Range',
  'Repeat',
  'Record',
  'Seq',
  'Collection',
];

const IMMUTABLE_READ = [
  'get',
  'getIn',
];

const IMMUTABLE_WRITE = [
  'delete',
  'deleteIn',
  'merge',
  'mergeDeep',
  'mergeDeepIn',
  'mergeIn',
  'remove',
  'removeIn',
  'set',
  'setIn',
  'update',
  'updateIn',
];

export class Jaysn {
  constructor(schema) {
    if (!existsSync(JAYSN_PATH)) {
        write(Immutable.Map(
          Object.keys(schema).reduce((V, K) => {
            const result = V;
            result[K] = {};
            return result;
          }, {})
        ).toJS());
    }

    // Restructured the schema to use optional
    this.schema = Object.keys(schema).reduce((V, K) => {
      const result = V;
      const childrens = Object.keys(schema[K]).reduce((NV, NK) => {
        const result = NV;
        result[NK] = struct.optional(schema[K][NK]);
        return result;
      }, {});
      result[K] = childrens;
      return result;
    }, {});

    // Add write prototype to Available Type
    Object.keys(Immutable).reduce((V, K) => {
      if (IMMUTABLE_TYPE.includes(K)) {
        Immutable[K].prototype.write = () => {
          const data = this.getState().toJS();
          
          write(data);
          return this.getState();
        }
      }
    });

    // Init state from the db
    const initState = Immutable.fromJS(read());

    this._state = [initState];
    this._stateId = 0;

    // Return Latest State when using an Immutable Read Functions
    IMMUTABLE_READ.forEach((method) => {
      this[method] = (...args) => {
        const state = this.getState();

        return state[method](...args);
      }
    });

    // Return and push newState, then increase stateId when using an Immutable Write Functions
    IMMUTABLE_WRITE.forEach((method) => {
      this[method] = (...args) => {
        const state = this.getState();
        const newState = state[method](...args);
        this._state.push(Immutable.fromJS(newState.toJS()));
        this._stateId++;
        const data = this.getState().toJS();

        // Validate each data with superstruct
        try {
          Object.keys(data).forEach(O => {
            const V = data[O];
            const L = V.length;
            if (
              typeof V == 'object'
              && V !== null
              && typeof V != 'function'
              && typeof L == 'number'
              && L > -1 && L % 1 == 0 && L <= 9007199254740991
            ) {
              V.forEach(NV => {
                struct(this.schema[O])(NV);
              });
            } else {
              struct(this.schema[O])(V);
            }
          });
        }
        catch ({message}) {
          this._state.pop();
          this._stateId--;
          console.error(message);
        }

        return this.getState();
      }
    });
  }


  getState () {
    return this._state[this._stateId];
  }
}