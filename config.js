import path from 'path'
import nconf from 'nconf'

let config = nconf.env(['CLOUD_VISION_API_KEY'])
config = config.file({file: path.join(__dirname, 'config.json')})
config = config.defaults({CLOUD_VISION_API_KEY: 'default_key'})

checkConfig('GOOGLE_APPLICATION_CREDENTIALS')
checkConfig('CLOUD_VISION_API_KEY')

function checkConfig(setting) {
    if(!nconf.get(setting))
        throw new Error("You must set ${setting} in config.json")
}

export default config