const parser = require('xml2json');
const { exec } = require('child_process');
const handleArgs = require('./handle-args');

const ENV = {
	DB: '/media/veracrypt7/Passwortdatenbank.kdbx',
	CACHE: '~/.cache/rofi-keepassxc',
	pw: '',
};

handleArgs({
	'-pw': (value) => {
		ENV.pw = value;
	},
});

class Entry {
	constructor(entry) {
		this.entry = entry;
	}

	getArgs() {
		if (!this.entry) return null;
		return this.entry.String.reduce((acc, item) => {
			acc[item.Key] = item.Value;
			return acc;
		}, {});
	}
}

class Group {
	constructor(group) {
		this.group = group;
	}

	getEntries() {
		const entries = this.group.Entry
			? this.group.Entry instanceof Array
				? this.group.Entry
				: [this.group.Entry]
			: [];

		return entries.map((entry) => new Entry(entry));
	}

	getGroups() {
		const groups = this.group.Group
			? this.group.Group instanceof Array
				? this.group.Group
				: [this.group.Group]
			: [];
		return groups.map((group) => new Group(group));
	}
}

exec(
	`echo "${ENV.pw}" | keepassxc-cli extract ${ENV.DB}`,
	(error, stdout, stderr) => {
		if (error) {
			console.log(`error: ${error.message}`);
			return;
		}
		if (stderr) {
			console.log(`stderr: ${stderr}`);
			return;
		}

		const data = stdout.split('\n').slice(1).join('\n');

		const KeePassFileJSON = parser.toJson(data, {
			object: true,
		});

		delete KeePassFileJSON.KeePassFile.Meta;
		const groups = KeePassFileJSON.KeePassFile.Root.Group.Group;

		function getEntriesFromGroups(groups) {
			return groups.map((data) => {
				const group = new Group(data);
				getEntriesFromGroups(group.getGroups());
				return group.getEntries().map((entry) => entry.getArgs());
			});
		}

		const entries = getEntriesFromGroups(groups).flat();
		function compare(a, b) {
			if (a.Title < b.Title) {
				return -1;
			}
			if (a.Title > b.Title) {
				return 1;
			}
			return 0;
		}
		const output = entries
			.sort(compare)
			.map((entry) => entry.Title)
			.join('\r\n');

		console.log(output);
	}
);
