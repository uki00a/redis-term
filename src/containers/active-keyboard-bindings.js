import { connect } from 'react-redux';
import ActiveKeyboardBindings from '../components/active-keyboard-bindings';

const mapStateToProps = ({ keyboardBindings }) => ({ keyboardBindings });

export default connect(mapStateToProps)(ActiveKeyboardBindings);