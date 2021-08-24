const { exec } = require('child_process');
const handleArgs = require('./handle-args');

const ENV = {
	DB: '/media/veracrypt7/Passwortdatenbank.kdbx',
	CACHE: '~/.cache/rofi-keepassxc',
	pw: '6wpmtr3fft',
	term: '',
};

handleArgs({
	'-pw': (value) => {
		ENV.pw = value;
	},
	'-term': (value) => {
		ENV.term = value;
	},
});

exec(
	`echo "${ENV.pw}" | keepassxc-cli locate '${
		ENV.DB
	}' '${ENV.term.trim()}' | awk '!/Insert/' `,
	(error, stdout, stderr) => {
		if (error) {
			console.log(`error: ${error.message}`);
			return;
		}
		if (stderr) {
			console.log(`stderr: ${stderr}`);
			return;
		}
		console.log(stdout);
	}
);
