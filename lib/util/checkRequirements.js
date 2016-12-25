// Check if app is migrated and it's public
module.exports = function meetsRequirements() {
    if (process.env.FH_USE_LOCAL_DB) {
        return true
    }
    if (!process.env.FH_MONGODB_CONN_URL || process.env.FH_SERVICE_APP_PUBLIC !== 'true') {
        console.log('FH_MONGODB_CONN_URL:', process.env.FH_MONGODB_CONN_URL, 'FH_LOCAL:', process.env.FH_LOCAL, 'FH_SERVICE_APP_PUBLIC', process.env.FH_SERVICE_APP_PUBLIC);
        return false
    }
    return true;
}