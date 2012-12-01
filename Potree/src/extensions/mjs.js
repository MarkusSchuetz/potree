/**
 * potree.js 
 * http://potree.org
 *
 * Copyright 2012, Markus Sch�tz
 * Licensed under the GPL Version 2 or later.
 * - http://potree.org/wp/?page_id=7
 * - http://www.gnu.org/licenses/gpl-3.0.html
 *
 */

/**
 * extensions for the mjs.js library
 * 
 * @author Markus Sch�tz
 *
 * @class extends the mjs V3 class
 */
V3 = V3;

/**
 * @class extends the mjs M4x4 class
 */
M4x4 = M4x4;


/**
 * Function: V3.transform
 *
 *
 * Parameters:
 *
 *   a - the first vector operand
 *   b - the transformation matrix
 *
 * Returns:
 *
 *   transformed vector
 */
V3.transform = function V3_transform(a, b){
	var r = new MJS_FLOAT_ARRAY_TYPE(3);
	
	r[0] = a[0] * b[0] + a[1] * b[4] + a[2] * b[8] + b[12];
	r[1] = a[0] * b[1] + a[1] * b[5] + a[2] * b[9] + b[13];
	r[2] = a[0] * b[2] + a[1] * b[6] + a[2] * b[10] + b[14];
	var h = a[0] * b[3] + a[1] * b[7] + a[2] * b[11] + b[15];
	r[0] = r[0] / h;
	r[1] = r[1] / h;
	r[2] = r[2] / h;
	
	return r;
};



/**
 * The original inverseOrthonormal function does not work because it uses Vec3 instead of V3.
 */
M4x4.inverseOrthonormal = function M4x4_inverseOrthonormal(m, r) {

    if (r == undefined)
        r = new MJS_FLOAT_ARRAY_TYPE(16);
    M4x4.transpose(m, r);
    var t = [m[12], m[13], m[14]];
    r[3] = r[7] = r[11] = 0;
    r[12] = -V3.dot([r[0], r[4], r[8]], t);
    r[13] = -V3.dot([r[1], r[5], r[9]], t);
    r[14] = -V3.dot([r[2], r[6], r[10]], t);
    return r;
};

/**
 * the original direction function returned the direction from b to a, instead of a to b as stated in the comment.
 * 
 * Function: V3.direction
 *
 * Perform
 * r = (a - b) / |a - b|.  The result is the normalized
 * direction from a to b.
 *
 * Parameters:
 *
 *   a - the first vector operand
 *   b - the second vector operand
 *   r - optional vector to store the result in
 *
 * Returns:
 *
 *   If r is specified, returns r after performing the operation.
 *   Otherwise, returns a new 3-element vector with the result.
 */
V3.direction = function V3_direction(a, b, r) {
    if (r == undefined)
        r = new MJS_FLOAT_ARRAY_TYPE(3);
    return V3.normalize(V3.sub(b, a, r), r);
};


