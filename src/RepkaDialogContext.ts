import { RepkaScreen } from './RepkaScreen';
import { DialogContext } from './DialogBuilder/DialogContext';
import { RepkaState } from './RepkaState';

/**
 * Добавляет к данным пользователя
 * информацию о его положении в диалоге
 */
export type RepkaDialogContext = DialogContext<RepkaState, RepkaScreen>;
