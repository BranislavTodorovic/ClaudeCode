const storage=require('../shared/storage-utils');
storage.registerValidator('orbit-trip-board',require('../explore/trip-board').valid);
module.exports=storage;
