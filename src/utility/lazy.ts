/**
 * Creates a lazy value.
 * @param factory Value factory.
 * @returns Lazy value.
 */
export function lazy<T>(factory: () => T): () => T
{
	let resolved = false;
	let value: T | undefined;

	return () => {
		if (resolved === false)
		{
			value = factory();
			resolved = true;
		}

		return value!;
	};
}
