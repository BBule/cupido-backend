var env=process.env.NODE_ENV||'development';
if(env==='test'||env==='development'){
	var config=require('./config.json');
	var envConfig=config[env];

	Object.keys(envConfig).forEach(function(key) {
		process.env[key]=envConfig[key];
	});
}