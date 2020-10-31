import { messageBus } from './message-bus';

export const asyncData = (async () =>
{
	const response = messageBus.call<'unicode-data'>({ type: 'get-unicode-data' });

	return (await response).data;
})();