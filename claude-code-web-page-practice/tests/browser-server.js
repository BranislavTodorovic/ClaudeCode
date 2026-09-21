/* Dedicated disposable origin; mock providers never consume a quota. */
const {createServer}=require('../server/_static-server');
const port=Number(process.env.PORT||18974);
createServer({providerOptions:{mock:process.env.PROVIDER_MODE==='mock'},missingAsset:process.env.MISSING_ASSET||''}).listen(port,'127.0.0.1',()=>console.log('Disposable browser test server: http://localhost:'+port));
