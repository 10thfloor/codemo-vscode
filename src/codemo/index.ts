import { login }  from './auth';
import { logout } from './auth';
import clone from './stream/clone-edit';

import startFromFile from './stream/start-from-file';
import control from './stream/control';
import takeover from './stream/takeover';

export default {
	login,
	logout,
	clone,
	startFromFile,
	control,
	takeover
}