import { TextEditor } from 'vscode';
import { UnicodeEntry } from '../data';
import { RecentlyUsed } from './recently-used-list';

/**
 * Insert a Unicode entry into an editor.
 * @param editor The editor to insert into.
 * @param entry The entry that is being inserted (meta data).
 * @param value The textual value to insert.
 */
export async function insert(editor: TextEditor, entry: UnicodeEntry, value: string)
{
	RecentlyUsed.addEntry(entry.name);

	await editor.edit(builder =>
		editor.selections.forEach(selection =>
			selection.isEmpty ?
				builder.insert(selection.active, value) :
				builder.replace(selection, value)
		)
	);
}
