const { exec } = require('child_process');
const handleArgs = require('./handle-args');

const ENV = {
	DB: '/media/veracrypt7/Passwortdatenbank.kdbx',
	CACHE: '~/.cache/rofi-keepassxc',
	pw: '6wpmtr3fft',
	path: '',
};

handleArgs({
	'-pw': (value) => {
		ENV.pw = value;
	},
	'-path': (value) => {
		ENV.path = value;
	},
});

exec(
	`echo "${ENV.pw}" | keepassxc-cli show ${ENV.DB} ${ENV.path.trim()}`,
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
