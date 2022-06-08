import { DialogSessionState } from './DialogSessionState';

export interface DialogsResponse {
    response: {
        text: string; // 'Здравствуйте! Это мы, хороводоведы.';
        tts?: string; // 'Здравствуйте! Это мы, хоров+одо в+еды.';
        buttons?: {
            title: string;
            url?: string;
            hide?: boolean; // Признак того, что кнопку нужно убрать после следующей реплики пользователя.
        }[];
        card?:
            | {
                  type: string;
                  image_id: string;
                  title?: string;
                  description?: string;
              }
            | {
                  type: string;
                  items: {
                      image_id: string;
                      title?: string;
                      button?: {
                          text: string;
                          url: string;
                          payload: {};
                      };
                  }[];
              };
        end_session: boolean;
    };
    version: string; // '1.0';
    session_state?: DialogSessionState;
}
