// Check if app is migrated and it's public
module.exports = function meetsRequirements(){
  if(process.env.FH_USE_LOCAL_DB){
    return true
  }
  // Check if mongodb url exist
  if(!process.env.FH_MONGODB_CONN_URL){
    return false
  }
  
  // Check if is hosted as service and it's public
  if(process.env.FH_SERVICE_APP === 'true' && process.env.FH_SERVICE_APP_PUBLIC !== 'true'){
    return false
  }

  return true;
}