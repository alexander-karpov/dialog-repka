import { repka } from './repka';
import { DialogRequest } from './DialogBuilder/DialogRequest';
import { DialogResponse } from './DialogBuilder/DialogResponse';
import { RepkaDialogContext } from './RepkaDialogContext';

export async function handler(
    request: DialogRequest<RepkaDialogContext>
): Promise<DialogResponse<RepkaDialogContext>> {
    return repka.interact(request);
}
