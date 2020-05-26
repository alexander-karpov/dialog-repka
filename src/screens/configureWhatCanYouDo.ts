import { RepkaScreen } from '../RepkaScreen';
import { RepkaState } from '../RepkaState';
import { DialogBuilder } from '../DialogBuilder/DialogBuilder';

export function configureWhatCanYouDo(dialog: DialogBuilder<RepkaState, RepkaScreen>) {
    dialog.withWhatCanYouDo((reply) => {
        reply.withText(
            'В этой игре мы вместе сочиним сказку про репку.',
            'Называйте персонажей и слушайте получившуюся историю.'
        );
    });
}
