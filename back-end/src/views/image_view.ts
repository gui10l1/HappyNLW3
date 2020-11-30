import Image from "../models/Image";

export default {
    render(image: Image) {
        return {
            id: image.id,
            url: `http://192.168.0.117:3333/uploads/${image.path}`,
            orphanage: image.orphanage
        }
    },

    renderMany(images: Image[]) {
        return images.map(image => this.render(image));
    }
}