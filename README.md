# ImageComparator

Можно сравнить два изображения в JavaScript. Один из способов сравнения изображений – это сравнение их хэш-сумм. Хэш-сумма – это некоторое числовое значение, которое уникально соответствует каждому изображению. Если два изображения имеют одинаковую хэш-сумму, то с высокой вероятностью они являются одинаковыми.

Вот пример кода, который сравнивает хэш-суммы двух изображений:

```js
const image1 = document.getElementById('image1');
const image2 = document.getElementById('image2');

// Вычисление хэш-суммы изображения
function getImageHash(image) {
  // Преобразование изображения в массив байт
  const imageData = new Uint8Array(image.data.length);
  for (let i = 0; i < image.data.length; i++) {
    imageData[i] = image.data[i];
  }
  // Вычисление хэш-суммы массива байт
  return hash(imageData);
}

// Сравнение хэш-сумм двух изображений
const image1Hash = getImageHash(image1);
const image2Hash = getImageHash(image2);
if (image1Hash === image2Hash) {
  console.log('Изображения одинаковые');
} else {
 console.log('Изображения отличаются');
}
```

________

Если размеры изображений отличаются, то сравнение хэш-сумм не будет работать. В этом случае можно использовать другие методы сравнения изображений.

Один из таких методов – это сравнение изображений посредством сравнения их пикселей. Для этого можно преобразовать изображения в массивы пикселей и сравнить соответствующие пиксели в двух массивах. Если все пиксели совпадают, то изображения считаются одинаковыми.

Вот пример кода, который сравнивает два изображения посредством сравнения их пикселей:

```js
const image1 = document.getElementById('image1');
const image2 = document.getElementById('image2');

// Преобразование изображений в массивы пикселей
const image1Pixels = getImagePixels(image1);
const image2Pixels = getImagePixels(image2);
```

`getImagePixels` – это функция, которая преобразует изображение в массив пикселей. Каждый пиксель представлен в виде массива из трех элементов (красный, зеленый, синий), которые определяют цвет пикселя.

Вот пример реализации функции `getImagePixels`:

```js
function getImagePixels(image) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  context.drawImage(image, 0, 0);
  return context.getImageData(0, 0, image.width, image.height).data;
}
```

Эта функция создает новый холст, рисует на нем изображение, а затем извлекает массив пикселей с помощью метода `getImageData`.

Обратите внимание, что в этом примере мы предполагаем, что изображение уже загружено на страницу и доступно через объект `image`.


____

Для сравнения изображений по пикселям нужно сравнить соответствующие пиксели в двух массивах пикселей. Вот пример функции, которая сравнивает два изображения по пикселям:

```js
function compareImages(image1, image2) {
  const image1Pixels = getImagePixels(image1);
  const image2Pixels = getImagePixels(image2);

  // Сравнение массивов пикселей
  if (image1Pixels.length !== image2Pixels.length) {
    console.log('Изображения разных размеров');
    return false;
  }

  for (let i = 0; i < image1Pixels.length; i++) {
    if (image1Pixels[i] !== image2Pixels[i]) {
      console.log('Изображения разные');
      return false;
    }
  }

  console.log('Изображения одинаковые');
  return true;
}
```

В этой функции мы сначала преобразуем два изображения в массивы пикселей с помощью функции `getImagePixels`, а затем сравниваем соответствующие пиксели в двух массивах. Если все пиксели совпадают, то функция возвращает `true`, в противном случае – `false`.

>
> И да, этот метод не работает с разными размерами изображений
>
> Если изображения разных размеров, то сравнение пикселей не сработает, так как массивы пикселей будут разной длины.
>
> Мы приблежаемся ближе к сути
>
____

Одним из способов сравнения изображений разных размеров является создание маски изображения, которая состоит из черно-белых пикселей (белый пиксель – означает наличие информации, черный – отсутствие). Затем маску можно сравнивать с другой маской, используя те же методы, что и для сравнения массивов пикселей.

___

Если изображения разного размера, но содержат одинаковое изображение, то можно использовать следующий подход:

1.  Создать маску для каждого изображения. Маска – это черно-белое изображение, где белый пиксель означает наличие информации, а черный – отсутствие.

2.  Изменить размер маски с меньшим размером до размера маски с большим размером. Это можно сделать, например, с помощью библиотеки для работы с изображениями, такой как `lodash`, `imagemagick` или `sharp`.

3.  Сравнить полученные маски с помощью тех же методов, что и для сравнения обычных изображений.

___

Функция `createImageMask` преобразует изображение в черно-белую маску, где белый пиксель означает наличие информации, а черный – отсутствие.

Один из способов реализации функции `createImageMask` – преобразовать изображение в монохромное с помощью фильтра Яркость. Для этого можно использовать следующий код:

```js
function createImageMask(image) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  context.drawImage(image, 0, 0);
  const imageData = context.getImageData(0, 0, image.width, image.height);
  const data = imageData.data;

  // Преобразование изображения в монохромное
  for (let i = 0; i < data.length; i += 4) {
    const brightness = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
    data[i] = brightness;
    data[i + 1] = brightness;
    data[i + 2] = brightness;
  }

  context.putImageData(imageData, 0, 0);

  // Создание маски изображения
  const mask = [];
  for (let y = 0; y < image.height; y++) {
    for (let x = 0; x < image.width; x++) {
      const index = (y * image.width + x) * 4;
      mask.push(data[index] > 0 ? 1 : 0);
    }
  }

  return mask;
}
```

___

Для изменения размера маски с меньшим размером до размера маски с большим размером на JavaScript можно использовать следующий код:

```js
function resizeMask(mask, width, height) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  const imageData = context.createImageData(width, height);
  const data = imageData.data;

  // Заполнение массива данных маски
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = (y * width + x) * 4;
      data[index] = mask[y * width + x] ? 255 : 0;
      data[index + 1] = mask[y * width + x] ? 255 : 0;
      data[index + 2] = mask[y * width + x] ? 255 : 0;
      data[index + 3] = 255;
    }
  }

  context.putImageData(imageData, 0, 0);

  // Создание новой маски с новым размером
  const newMask = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = (y * width + x) * 4;
      newMask.push(data[index] > 0 ? 1 : 0);
    }
  }

  return newMask;
}
```

Эта функция принимает маску изображения и размеры новой маски в виде аргументов `mask`, `width` и `height` соответственно.

___

В качестве аргументов `width` и `height` функции `resizeMask` нужно передать размеры маски с большим размером, до которого нужно изменить размер маски с меньшим размером.

Например, если маска с меньшим размером имеет размеры 100x100, а маска с большим размером – 200x200, то нужно передать `width` равным 200 и `height` равным 200:

```js
const smallMask = [...]; // маска с меньшим размером
const largeMask = resizeMask(smallMask, 200, 200); // маска с большим размером
```

Обратите внимание, что маска с меньшим размером должна быть представлена в виде массива булевых значений (1 – белый пиксель, 0 – черный).

___

Чтобы достать размеры изображения и использовать их в функции `resizeMask`, можно воспользоваться свойствами `width` и `height` объекта `Image`. Например, так:

```js

const image = new Image();
image.src = 'image.png';

image.onload = () => {
  const mask = createImageMask(image);
  const resizedMask = resizeMask(mask, image.width, image.height);
  // Дальнейшая работа с ресайзнутой маской
};

```

Этот код создает новый экземпляр объекта `Image`, загружает изображение и создает маску с помощью функции `createImageMask`. Когда изображение загружено, оно используется для создания ресайзнутой маски с помощью функции `resizeMask`.

Обратите внимание, что функция `createImageMask` должна быть реализована ранее.

___

Вот пример кода, который сравнивает два изображения и выводит результат сравнения в консоль:

```js
const image1 = new Image();
image1.src = 'image1.png';

const image2 = new Image();
image2.src = 'image2.png';

Promise.all([image1, image2].map(img => new Promise((resolve, reject) => {
  img.onload = () => resolve(img);
  img.onerror = reject;
}))).then(images => {
  const mask1 = createImageMask(images[0]);
  const mask2 = createImageMask(images[1]);
  const resizedMask1 = resizeMask(mask1, images[1].width, images[1].height);
  console.log(resizedMask1 === mask2);
});
```

Этот код загружает два изображения, создает маски для них с помощью функции `createImageMask` и ресайзит маску первого изображения до размера второго изображения с помощью функции `resizeMask`. Затем он сравнивает ресайзнутую маску и маску второго изображения и выводит результат сравнения в консоль.

Обратите внимание, что функции `createImageMask` и `resizeMask` являются псевдокодом и должны быть реализованы ранее.

_____

Если вы не знаете, какое изображение является большим, а какое – меньшим, то можно сравнить размеры изображений и выбрать то, которое больше. Например, так:

```js
const image1 = new Image();
image1.src = 'image1.png';

const image2 = new Image();
image2.src = 'image2.png';

Promise.all([image1, image2].map(img => new Promise((resolve, reject) => {
  img.onload = () => resolve(img);
  img.onerror = reject;
}))).then(images => {
  const mask1 = createImageMask(images[0]);
  const mask2 = createImageMask(images[1]);
  let resizedMask, originalMask;
  if (images[0].width > images[1].width || images[0].height > images[1].height) {
    resizedMask = resizeMask(mask2, images[0].width, images[0].height);
    originalMask = mask1;
  } else {
    resizedMask = resizeMask(mask1, images[1].width, images[1].height);
    originalMask = mask2;
  }
  console.log(resizedMask === originalMask);
});
```

В этом коде сначала сравниваются размеры изображений, а затем выбирается то, которое больше. Ресайзнутая маска и оригинальная маска соответственно выбираются в зависимости от того, какое изображение является большим. Затем они сравниваются и результат сравнения выводится в консоль.

____

Чтобы сравнить маски в процентном соотношении, можно использовать следующий код:

```js
function compareMasks(mask1, mask2) {
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

const image1 = new Image();
image1.src = 'image1.png';

const image2 = new Image();
image2.src = 'image2.png';

Promise.all([image1, image2].map(img => new Promise((resolve, reject) => {
  img.onload = () => resolve(img);
  img.onerror = reject;
}))).then(images => {
  const mask1 = createImageMask(images[0]);
  const mask2 = createImageMask(images[1]);
  const resizedMask1 = resizeMask(mask1, images[1].width, images[1].height);
  const similarity = compareMasks(resizedMask1, mask2);
  console.log(similarity);
});
```

___

Вот как можно реализовать функцию сравнения масок с процентным соотношением внутри класса:

```js
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
        
const comparator = new ImageComparator();
comparator.compare('image1.png', 'image2.png').then(similarity => {
  console.log(similarity);
});
 ```
 
 Теперь вы можете использовать этот класс для сравнения двух изображений, независимо от их размера. Функция `compare` возвращает промис, который выполнится с процентным соотношением совпадающих пикселей.
 
 ___
 
 Вот несколько примеров сравнение двух изображений:
 
 ![First](https://github.com/AN0NCER/ImageComparator/blob/main/example1.png?raw=true)
 
 
 >100% совпадение
 
 ![Second](https://github.com/AN0NCER/ImageComparator/blob/main/example2.png?raw=true)
 
 
 >70% совпадение
 
 ![Last](https://github.com/AN0NCER/ImageComparator/blob/main/example3.png?raw=true)
 
 
 >38% совпадение
 
 ___
 
 Это решение предоставляет примерное сравнение изображений, но оно может не быть совсем точным. Оно сравнивает изображения по пикселям, но не учитывает цвета и интенсивность цвета. Например, если два изображения совпадают по размеру и форме, но отличаются цветом, то это решение может неправильно определить их как несовпадающие.

Для более точного сравнения изображений следует использовать более сложные алгоритмы, которые учитывают также цвета и интенсивность цвета. 
