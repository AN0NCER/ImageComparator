class ImageComparator {
    constructor() {
        this.image1 = new Image();
        this.image2 = new Image();
    }

    compare(image1Src, image2Src) {
        this.image1.src = image1Src;
        this.image2.src = image2Src;

        return Promise.all([this.image1, this.image2].map(img => new Promise((resolve, reject) => {
            img.onload = () => resolve(img);
            img.onerror = reject;
        }))).then(images => {
            const mask1 = this.createImageMask(images[0]);
            const mask2 = this.createImageMask(images[1]);
            let resizedMask, originalMask;
            if (images[0].width > images[1].width || images[0].height > images[1].height) {
                resizedMask = this.resizeMask(mask2, images[0].width, images[0].height);
                originalMask = mask1;
            } else {
                resizedMask = this.resizeMask(mask1, images[1].width, images[1].height);
                originalMask = mask2;
            }
            return this.compareMasks(resizedMask, originalMask);
        });
    }

    createImageMask(image) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0);
        const imageData = ctx.getImageData(0, 0, image.width, image.height);
        const mask = [];
        for (let i = 0; i < image.width; i++) {
            mask[i] = [];
            for (let j = 0; j < image.height; j++) {
                const index = (i + j * image.width) * 4;
                mask[i][j] = imageData.data[index] === 0 ? 1 : 0;
            }
        }
        return mask;
    }

    resizeMask(mask, newWidth, newHeight) {
        const resizedMask = [];
        for (let i = 0; i < newWidth; i++) {
            resizedMask[i] = [];
            for (let j = 0; j < newHeight; j++) {
                resizedMask[i][j] = mask[Math.floor(i * mask.length / newWidth)][Math.floor(j * mask[0].length / newHeight)];
            }
        }
        return resizedMask;
    }

    compareMasks(mask1, mask2) {
        const width = Math.max(mask1.length, mask2.length);
        const height = Math.max(mask1[0].length, mask2[0].length);
        let count = 0;
        for (let i = 0; i < width; i++) {
            for (let j = 0; j < height; j++) {
                if (mask1[i] && mask2[i] && mask1[i][j] === mask2[i][j]) {
                    count++;
                }
            }
        }
        return count / (width * height);
    }
}
