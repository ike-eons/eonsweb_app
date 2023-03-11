module.exports = {
	pluginOptions: {
		electronBuilder: {
			preload: 'public/preload.js',
			// preload: () => {
			// 	const path = require('path')
			// 	return path.join(app.getAppPath(), './backend/preload.js')
			//   },
			
			builderOptions:{
				extraResources: [
					{
					  from: 'public/splash.html',
					  to: 'splash.html',
					  
					}
				  ]
			  }
		},
		externals: ['sqlite3'],
	},
	transpileDependencies: ['vuetify'],
};
