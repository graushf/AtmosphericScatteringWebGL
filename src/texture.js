function isPowerOf2(value) {
    return (value & (value - 1)) == 0;
}

function loadTexture(url) {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Because images have to be downloaded over the internet
    // they might take a moment until they are ready.
    // Until then put a single pixel in the texture so we can
    // use it immediately. When the image has finished downloading
    // we'll update the texture with the contents of the image.
    const level = 0;
    const internalFormal = gl.RGBA;
    const width = 1;
    const height = 1;
    const border = 0;
    const srcFormat = gl.RGBA;
    const srcType = gl.UNSIGNED_BYTE;
    const pixel = new Uint8Array([0, 0, 255, 255]); // opaque blue
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormal, width, height, border, srcFormat, srcType, pixel);

    const image = new Image();
    image.onload = function() {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormal, srcFormat, srcType, image);

        // WebGL1 has different requirements for power of 2 images
        // vs non power of 2 images so check if the image is a
        // power of 2 in both dimensions
        if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
            // Yes, it's a power of 2. Generate mips.
            gl.generateMipmap(gl.TEXTURE_2D);
        } else {
            // No, it's not a power of 2. Turn of mips and set
            // wrapping to clamp to edge
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        }
    };
    image.src = url;

    return texture;
}

Texture = function()
{
    this._id;
    this._type;
}

Texture.prototype = new Texture()

Texture.prototype.createTexture = function(url) {
    const buffer = new Uint8Array([0, 0, 255, 255]); //opaque blue
    this.constructTexture(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, buffer, gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE, gl.LINEAR, gl.LINEAR);
    
    const id = this._id;
    const image = new Image();
    image.onload = function() {
        gl.bindTexture(gl.TEXTURE_2D, id);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    }
    image.src = url;
    if (this._type == undefined)
        this._type = gl.TEXTURE_2D;
}

Texture.prototype.constructTexture = function(type, level, internalFormat, width, height, border, srcFormat, srcType, buffer, clampS, clampT, minFilter, magFilter, mipmap) {
    if (this._id == undefined) {
        this._id = gl.createTexture(type);
    }
    this._type = type;
    gl.bindTexture(type, this._id);

    if (internalFormat == gl.RGBA32F) {
        var ext = gl.getExtension('EXT_color_buffer_float');
    }

    gl.texImage2D(type, level, internalFormat, width, height, border, srcFormat, srcType, buffer);

    if (mipmap) {
        gl.generateMipmap(type);
    }
    gl.texParameteri(type, gl.TEXTURE_WRAP_S, clampS);
    gl.texParameteri(type, gl.TEXTURE_WRAP_T, clampT);
    gl.texParameteri(type, gl.TEXTURE_MIN_FILTER, minFilter);
    gl.texParameteri(type, gl.TEXTURE_MAG_FILTER, magFilter);
    
    gl.bindTexture(this._type, null);
}

Texture.prototype.constructTextureImage = function(type, level, internalFormat, srcFormat, srcType, buffer, clampS, clampT, minFilter, magFilter) {
    if (this._id == undefined) 
        this._id = gl.createTexture(type);
    this._type = type;
    gl.bindTexture(type, this._id);

    gl.texImage2D(type, level, internalFormat, srcFormat, srcType, buffer);

    if (mipmap) 
        gl.generateMipmap(type);
    
    gl.texParameteri(type, gl.TEXTURE_WRAP_S, clampS);
    gl.texParameteri(type, gl.TEXTURE_WRAP_T, clampT);
    gl.texParameteri(type, gl.TEXTURE_MIN_FILTER, minFilter);
    gl.texParameteri(type, gl.TEXTURE_MAG_FILTER, magFilter);

    gl.bindTexture(this._type, null);
}

Texture.prototype.activateTexture = function(textureUnit) {
    gl.activeTexture(gl.TEXTURE0 + textureUnit);
    gl.bindTexture(this._type, this._id);
}

Texture.prototype.deactivateTexture = function() {
    gl.bindTexture(this._type, null);
}

Texture.prototype.getId = function() {
    if (this._id != undefined)
        return this._id;

    return null;
}