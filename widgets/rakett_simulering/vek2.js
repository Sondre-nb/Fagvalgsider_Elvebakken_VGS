class Vek2 {
    constructor(x, y) {
        if(typeof x === "object") {
            this.x == x.x || 0;
            this.y == x.y || 0;
        } else {
            this.x = x || 0;
            this.y = y || 0;
        }
    }

    clone() {
        return new Vek2(this.x, this.y);
    }

    set(x, y) {
        if(typeof x === "object") {
            // x er Vek2
            this.x = x.x || 0;
            this.y = x.y || 0;
        } else {
            this.x = x;
            this.y = y;
        }
        return this;
    }

    add(a) {
        this.x += a.x;
        this.y += a.y;
        return this;
    }

    sub(a) {
        this.x -= a.x;
        this.y -= a.y;
        return this;
    }

    multV(vek) {
        this.x *= vek.x;
        this.y *= vek.y;
        return this;
    }

    multN(num) {
        this.x *= num;
        this.y *= num;
        return this;
    }

    mult(a) {
        if(typeof a === "object") {
            this.x *= a.x;
            this.y *= a.y;
        } else {
            this.x *= a;
            this.y *= a;
        }
        return this;
    }

    div(num) {
        this.x /= num;
        this.y /= num;
        return this;
    }

    negate() {
        this.x = -this.x;
        this.y = -this.y;
        return this;
    }

    lenSq() {
        return this.x*this.x + this.y*this.y;
    }

    len() {
        let x = this.x;
        let y = this.y;
        return Math.sqrt(x*x + y*y);
    }

    normalize() {
        let lenSq = this.lenSq();
        if (lenSq > 0) {
            this.div(Math.sqrt(lenSq));
        }
        return this;
    }

    // Set the magnitude
    setMag(mag) {
        this.normalize().multN(mag);
        return this;
    }

    dot(v) {
        return this.x * v.x + this.y * v.y;
    }

    random(scale) {
        scale = scale || 1.0;
        let theta = Math.random() * 2 * Math.PI;
        this.x = Math.cos(theta) * scale;
        this.y = Math.sin(theta) * scale;
        return this;
    }
    /**
     * @returns the rotation in radians 
    */
    rotation() {
        return Math.atan2(this.y, this.x);
    }

    fromAngle(angle) {
        this.x = Math.cos(angle);
        this.y = Math.sin(angle);
        return this;
    }

    floor() {
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
        return this;
    }

    ceil() {
        this.x = Math.ceil(this.x);
        this.y = Math.ceil(this.y);
        return this;
    }

    round() {
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
        return this;
    }
    
    /**
     * Rotate a 2D vektor
     * @param {Vek2} o The origin of the rotation. If omitted, the vektor will be rotated around 0,0
     * @param {Number} rad The angle of rotation in radians
     * @returns {Vek2} this
     */
    rotate(o, rad) {
        if(typeof o === "object") {
            //Translate point to the origin
            let p = Vek2.sub(this, o);
            let sin = Math.sin(rad);
            let cos = Math.cos(rad);
        
            //perform rotation and translate to correct position
            this.x = p.x * cos - p.y * sin + o.x;
            this.y = p.x * sin + p.y * cos + o.y;
        } else {
            let p = this.clone();
            let sin = Math.sin(o);
            let cos = Math.cos(o);
        
            //perform rotation
            this.x = p.x * cos - p.y * sin;
            this.y = p.x * sin + p.y * cos;
        }
        return this;
    }

    static add(vek, a) {
        return new Vek2(vek.x + a.x, vek.y + a.y);
    }

    static sub(vek, a) {
        return new Vek2(vek.x - a.x, vek.y - a.y);
    }

    static multV(vek1, vek2) {
        return new Vek2(vek1.x * vek2.x, vek1.y * vek2.y);
    }

    static multN(vek, num) {
        return new Vek2(vek.x * num, vek.y * num);
    }

    static mult(vek, a) {
        if(typeof a === "object") {
            return new Vek2(vek.x * a.x, vek.y * a.y);
        } else {
            return new Vek2(vek.x * a, vek.y * a);
        }
    }

    static div(vek, num) {
        return new Vek2(vek.x / num, vek.y / num);
    }

    static negated(vek) {
        return new Vek2(-vek.x, -vek.y);
    }

    static normalized(vek) {
        let lenSq = vek.lenSq();
        let out = new Vek2();
        if (lenSq > 0) {
            out.set(vek);
            out.div(out.len());
        }
        return out;
    }

    static dot(vek1, vek2) {
        return vek1.x * vek2.x + vek1.y * vek2.y;
    }

    static cross(vek1, vek2) {
        return vek1.x * vek2.y - vek1.y * vek2.x;
    }

    
    static lerp(vek1, vek2, t) {
        const x = vek1.x + t * (vek2.x - vek1.x);
        const y = vek1.y + t * (vek2.y - vek1.y);
        return new Vek2(x, y);
    }

    static random(scale) {
        scale = scale || 1.0;
        const r = Math.random() * 2 * Math.PI;
        return new Vek2(Math.cos(r) * scale, Math.sin(r) * scale);
    }

    /**
     * The angle between the vektors a and b
     * @returns the angle in radians
     */
    static angle(a, b) {
        let x1 = a[0];
        let y1 = a[1];
        let x2 = b[0];
        let y2 = b[1];
        let mag = Math.sqrt((x1 * x1 + y1 * y1) * (x2 * x2 + y2 * y2));
        let cosine;
        if(mag == 0) {
            cosine = mag;
        } else {
            cosine = (x1 * x2 + y1 * y2) / mag;
        }
        return Math.acos(Math.min(Math.max(cosine, -1), 1));
    }

    /**
     * Rotate a 2D vektor
     * @param {Vek2} a The Vek2 point to rotate
     * @param {Vek2} b The origin of the rotation. If omitted, the vektor will be rotated around 0,0
     * @param {Number} rad The angle of rotation in radians
     * @returns {Vek2} the rotated vektor
     */
    static rotate(a, b, rad) {
        if(typeof b === "object") {
            let out = new Vek2();
            //Translate point to the origin
            let p = Vek2.sub(a, b);
            let sin = Math.sin(rad);
            let cos = Math.cos(rad);
        
            //perform rotation and translate to correct position
            out.x = p.x * cos - p.y * sin + b.x;
            out.y = p.x * sin + p.y * cos + b.y;
        
            return out;
        } else {
            let out = new Vek2();

            let sin = Math.sin(b);
            let cos = Math.cos(b);
        
            //perform rotation
            out.x = a.x * cos - a.y * sin;
            out.y = a.x * sin + a.y * cos;
        
            return out;
        }
    }

    static fromAngle(angle) {
        let out = new Vek2();
        out.x = Math.cos(angle);
        out.y = Math.sin(angle);
        return out;
    }

    
    static floor(v) {
        let out = new Vek2();
        out.x = Math.floor(v.x);
        out.y = Math.floor(v.y);
        return this;
    }
    
    static ceil(v) {
        let out = new Vek2();
        out.x = Math.ceil(v.x);
        out.y = Math.ceil(v.y);
        return this;
    }
    
    static round(v) {
        let out = new Vek2();
        out.x = Math.round(v.x);
        out.y = Math.round(v.y);
        return this;
    }
}
