import { createRepka } from './createRepka';

const repka = createRepka();
export const handler = repka.handleRequest.bind(repka);
