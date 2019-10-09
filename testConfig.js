import 'regenerator-runtime/runtime';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

console.error = (err) => { throw new Error(err); };
console.warn = (warning) => { throw new Error(warning); };

export default configure({ adapter: new Adapter() });
