import { connect } from 'react-redux';
import ActiveKeyboardBindings from '../components/active-keyboard-bindings';

const DEFAULT_KEYBORAD_BINDINGS = [
  { key: 'C-c', description: 'Quit' },
  { key: 'M-left/backspace', description: 'Back' }
];

const mapStateToProps = ({ keyboardBindings }) => ({
  keyboardBindings: DEFAULT_KEYBORAD_BINDINGS.concat(keyboardBindings)
});

export default connect(mapStateToProps)(ActiveKeyboardBindings);