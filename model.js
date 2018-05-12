export default class VisionData { 
    constructor(imageData) {
        this.requests = []
        let wrapper = {}
        let features = []
        let image = {}
        image.content = imageData
        let label_type = {}
        label_type.type = "LABEL_DETECTION"
        features.push(label_type)
        wrapper.image = image
        wrapper.features = features
        this.requests.push(wrapper)
    }
}

