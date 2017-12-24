import { existsSync } from 'fs';
import { struct } from 'superstruct';
import Immutable from 'immutable';
import { File } from './adapters/File';
import { LocalStorage } from './adapters/LocalStorage';

export const JAYSN_PATH = '.jaysn';

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

const IMMUTABLE_READ = ['get', 'getIn'];

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

export class DB {
  constructor(schema, options = {}) {
    const defaultOpts = {
      use: 'File',
      source: JAYSN_PATH,
    };

    const defaultData = Immutable.Map(
      Object.keys(schema).reduce((V, K) => {
        const result = V;
        result[K] = {};
        return result;
      }, {})
    ).toJS();

    // Merge options with defaultOptions
    const opts = Immutable.fromJS(defaultOpts)
      .merge(Immutable.fromJS(options))
      .toJS();
    let adapter;

    // Let's pick the specific adapter
    switch (opts.use) {
      case 'LocalStorage':
        if (typeof localStorage === 'undefined' || localStorage === null) {
          throw new TypeError(
            'LocalStorage adapter only available on browser!'
          );
        }
        adapter = new LocalStorage(opts.source);
        if (!localStorage.getItem(opts.source)) {
          adapter.write(defaultData);
        }
        break;

      default:
        adapter = new File(opts.source);
        if (!existsSync(opts.source)) {
          adapter.write(defaultData);
        }
        break;
    }

    // Restructured the schema to use optional
    this.schema = Object.keys(schema).reduce((V, K) => {
      const result = V;
      const childrens = Object.keys(schema[K]).reduce((NV, NK) => {
        const Nresult = NV;
        Nresult[NK] = struct.optional(schema[K][NK]);
        return Nresult;
      }, {});
      result[K] = childrens;
      return result;
    }, {});

    // Add write prototype to Available Type
    Object.keys(Immutable).reduce((V, K) => {
      if (IMMUTABLE_TYPE.includes(K)) {
        Immutable[K].prototype.write = () => {
          const data = this.getState().toJS();

          this._state.push(Immutable.fromJS(adapter.write(data)));
          this._stateId += 1;
          return this.getState();
        };
      }
      return V;
    }, {});

    // Init state from the db
    const initState = Immutable.fromJS(adapter.read());

    this._state = [initState];
    this._stateId = 0;

    // Return Latest State when using an Immutable Read Functions
    IMMUTABLE_READ.forEach(method => {
      this[method] = (...args) => {
        const state = this.getState();
        this._state.push(Immutable.fromJS(adapter.read()));
        this._stateId += 1;

        return state[method](...args);
      };
    });

    // Return and push newState, then increase stateId when using an Immutable Write Functions
    IMMUTABLE_WRITE.forEach(method => {
      this[method] = (...args) => {
        const state = this.getState();
        const newState = state[method](...args);
        this._state.push(Immutable.fromJS(newState.toJS()));
        this._stateId += 1;
        const data = this.getState().toJS();

        // Validate each data with superstruct
        try {
          Object.keys(data).forEach(O => {
            const V = data[O];
            const L = V.length;
            if (
              typeof V === 'object' &&
              V !== null &&
              typeof V !== 'function' &&
              typeof L === 'number' &&
              L > -1 &&
              L % 1 === 0 &&
              L <= 9007199254740991
            ) {
              V.forEach(NV => {
                struct(this.schema[O])(NV);
              });
            } else {
              struct(this.schema[O])(V);
            }
          });
        } catch ({ message }) {
          this._state.pop();
          this._stateId -= 1;
          throw new TypeError(message);
        }

        return this.getState();
      };
    });
  }

  getState() {
    return this._state[this._stateId];
  }
}

export default DB;
