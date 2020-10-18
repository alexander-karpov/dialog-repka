import { Dialog } from './Dialog';
import { DialogParams } from './DialogParams';

/**
 * Диалог с предопределённым состоянием типа unknown
 */
export class StatelessDialog<TSceneName extends string> extends Dialog<TSceneName, unknown> {
    constructor(params: DialogParams<TSceneName, unknown>) {
        super(class StatelessModel {}, params);
    }
}
