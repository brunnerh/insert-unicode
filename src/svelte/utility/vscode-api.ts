export const vscode = acquireVsCodeApi();

declare function acquireVsCodeApi(): VSCodeApi;

interface VSCodeApi
{
	postMessage(data: any): void;

	setState(data: any): void;

	getState<T>(): T;
}