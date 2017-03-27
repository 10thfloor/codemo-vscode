import { login }  from './auth';
import { logout } from './auth';
import join from './stream/join';

import startFromFile from './stream/start-from-file';
import control from './stream/control';
import takeover from './stream/takeover';

export default {
	login,
	logout,
	join,
	startFromFile,
	control,
	takeover
}