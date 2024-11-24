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

    addV(vec) {
        this.x += vec.x;
        this.y += vec.y;
        return this;
    }

    addN(num) {
        this.x += num;
        this.y += num;
        return this;
    }

    add(a) {
        if(typeof a === "object") {
            this.x += a.x;
            this.y += a.y;
        } else {
            this.x += a;
            this.y += a;
        }
        return this;
    }

    subV(vec) {
        this.x -= vec.x;
        this.y -= vec.y;
        return this;
    }

    subN(num) {
        this.x -= num;
        this.y -= num;
        return this;
    }
    
    sub(a) {
        if(typeof a === "object") {
            this.x -= a.x;
            this.y -= a.y;
        } else {
            this.x -= a;
            this.y -= a;
        }
        return this;
    }

    multV(vec) {
        this.x *= vec.x;
        this.y *= vec.y;
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

    divV(vec) {
        this.x /= vec.x;
        this.y /= vec.y;
        return this;
    }

    divN(num) {
        this.x /= num;
        this.y /= num;
        return this;
    }

    div(a) {
        if(typeof a === "object") {
            this.x /= a.x;
            this.y /= a.y;
        } else {
            this.x /= a;
            this.y /= a;
        }
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
        let x = this.x;
        let y = this.y;
        var len = x*x + y*y;
        if (len > 0) {
            len = 1 / Math.sqrt(len);
            this.x = x*len;
            this.y = y*len;
        }
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
     * Rotate a 2D vector
     * @param {Vek2} o The origin of the rotation. If omitted, the vector will be rotated around 0,0
     * @param {Number} rad The angle of rotation in radians
     * @returns {Vek2} this
     */
    rotate(o, rad) {
        if(typeof o === "object") {
            //Translate point to the origin
            let p0 = this.x - o.x,
                p1 = this.y - o.y,
                sinC = Math.sin(rad),
                cosC = Math.cos(rad);
        
            //perform rotation and translate to correct position
            this.x = p0 * cosC - p1 * sinC + o.x;
            this.y = p0 * sinC + p1 * cosC + o.y;
        } else {
            let p0 = this.x,
                p1 = this.y,
                sinC = Math.sin(o),
                cosC = Math.cos(o);
        
            //perform rotation
            this.x = p0 * cosC - p1 * sinC;
            this.y = p0 * sinC + p1 * cosC;
        }
        return this;
    }

    static addV(vec1, vek2) {
        return new Vek2(vec1.x + vek2.x, vec1.y + vek2.y);
    }

    static addN(vec, num) {
        return new Vek2(vec.x + num, vec.y + num);
    }

    static add(vec, a) {
        if(typeof a === "object") {
            return new Vek2(vec.x + a.x, vec.y + a.y);
        } else {
            return new Vek2(vec.x + a, vec.y + a);
        }
    }

    static subV(vec1, vek2) {
        return new Vek2(vec1.x - vek2.x, vec1.y - vek2.y);
    }

    static subN(vec, num) {
        return new Vek2(vec.x - num, vec.y - num);
    }

    static sub(vec, a) {
        if(typeof a === "object") {
            return new Vek2(vec.x - a.x, vec.y - a.y);
        } else {
            return new Vek2(vec.x - a, vec.y - a);
        }
    }

    static multV(vec1, vek2) {
        return new Vek2(vec1.x * vek2.x, vec1.y * vek2.y);
    }

    static multN(vec, num) {
        return new Vek2(vec.x * num, vec.y * num);
    }

    static mult(vec, a) {
        if(typeof a === "object") {
            return new Vek2(vec.x * a.x, vec.y * a.y);
        } else {
            return new Vek2(vec.x * a, vec.y * a);
        }
    }

    static divV(vec1, vek2) {
        return new Vek2(vec1.x / vek2.x, vec1.y / vek2.y);
    }

    static divN(vec, num) {
        return new Vek2(vec.x / num, vec.y / num);
    }

    static div(vec, a) {
        if(typeof a === "object") {
            return new Vek2(vec.x / a.x, vec.y / a.y);
        } else {
            return new Vek2(vec.x / a, vec.y / a);
        }
    }

    static negated(vec) {
        return new Vek2(-vec.x, -vec.y);
    }

    static dist(vec1, vek2) {
        const dx = vek2.x - vec1.x;
        const dy = vek2.y - vec1.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    static distSq(vec1, vek2) {
        const dx = vek2.x - vec1.x;
        const dy = vek2.y - vec1.y;
        return dx * dx + dy * dy;
    }

    static normalized(vec) {
        var x = vec.x,
            y = vec.y;
        var len = x*x + y*y;
        var out = new Vek2();
        if (len > 0) {
            len = 1 / Math.sqrt(len);
            out.x = x*len;
            out.y = y*len;
        }
        return out;
    }

    static dot(vec1, vek2) {
        return vec1.x * vek2.x + vec1.y * vek2.y;
    }

    static cross(vec1, vek2) {
        return vec1.x * vek2.y - vec1.y * vek2.x;
    }

    
    static lerp(vec1, vek2, t) {
        const x = vec1.x + t * (vek2.x - vec1.x);
        const y = vec1.y + t * (vek2.y - vec1.y);
        return new Vek2(x, y);
    }

    static random(scale) {
        scale = scale || 1.0;
        const r = Math.random() * 2 * Math.PI;
        return new Vek2(Math.cos(r) * scale, Math.sin(r) * scale);
    }

    /**
     * The angle between the vectors a and b
     * @returns the angle in radians
     */
    static angle(a, b) {
        let x1 = a[0],
            y1 = a[1],
            x2 = b[0],
            y2 = b[1],
            // mag is the product of the magnitudes of a and b
            mag = Math.sqrt((x1 * x1 + y1 * y1) * (x2 * x2 + y2 * y2)),
            // mag &&.. short circuits if mag == 0
            cosine = mag && (x1 * x2 + y1 * y2) / mag;
        // Math.min(Math.max(cosine, -1), 1) clamps the cosine between -1 and 1
        return Math.acos(Math.min(Math.max(cosine, -1), 1));
    }

    /**
     * Rotate a 2D vector
     * @param {Vek2} a The Vek2 point to rotate
     * @param {Vec3} b The origin of the rotation. If omitted, the vector will be rotated around 0,0
     * @param {Number} rad The angle of rotation in radians
     * @returns {Vek2} the rotated vector
     */
    static rotate(a, b, rad) {
        if(typeof b === "object") {
            let out = new Vek2();
            //Translate point to the origin
            let p0 = a.x - b.x,
                p1 = a.y - b.y,
                sinC = Math.sin(rad),
                cosC = Math.cos(rad);
        
            //perform rotation and translate to correct position
            out.x = p0 * cosC - p1 * sinC + b.x;
            out.y = p0 * sinC + p1 * cosC + b.y;
        
            return out;
        } else {
            let out = new Vek2();

            let sinC = Math.sin(b),
                cosC = Math.cos(b);
        
            //perform rotation
            out.x = a.x * cosC - a.y * sinC;
            out.y = a.x * sinC + a.y * cosC;
        
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
