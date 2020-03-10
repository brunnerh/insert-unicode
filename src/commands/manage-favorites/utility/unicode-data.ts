import { SendUnicodeData } from '../favorites-back-end-message';
import { messageBus } from './message-bus';

export const asyncData = (async () =>
{
	const response = messageBus.call<SendUnicodeData>('unicode-data', { type: 'get-unicode-data' });

	return (await response).data;
})();